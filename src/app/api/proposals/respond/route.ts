import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { proposals, clients, pipelineHistory, projects, billingMilestones, invoices, invoiceItems } from "@/lib/schema";
import { hmacHash, decrypt } from "@/lib/encryption";
import { sanitizeString } from "@/lib/sanitize";
import { calculateMilestoneAmounts, calculateMilestoneDates, mapTimelineToWeeks, generateInvoiceToken, buildDepositLineItems } from "@/lib/billing";
import { generateInvoiceNumber } from "@/lib/invoice-utils";
import { buildInvoiceEmailHtml } from "@/lib/invoice-email";
import { sendEmail, SITE_URL } from "@/lib/email";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const respondSchema = z.object({
    token: z.string().regex(/^[a-f0-9]{64}$/),
    action: z.enum(["accept", "decline"]),
    reason: z.string().max(1000).optional(),
  });

  const parsed = respondSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const { token, action, reason } = parsed.data;

  const hashedToken = hmacHash(token);

  const [proposal] = await db
    .select({
      id: proposals.id,
      clientId: proposals.clientId,
      status: proposals.status,
      title: proposals.title,
      estimatedBudgetCents: proposals.estimatedBudgetCents,
      timeline: proposals.timeline,
      services: proposals.services,
    })
    .from(proposals)
    .where(eq(proposals.responseToken, hashedToken))
    .limit(1);

  if (!proposal) {
    return NextResponse.json(
      { success: false, error: "Proposal not found" },
      { status: 404 }
    );
  }

  if (proposal.status === "accepted" || proposal.status === "rejected") {
    return NextResponse.json(
      { success: false, error: "This proposal has already been responded to" },
      { status: 400 }
    );
  }

  if (proposal.status !== "sent") {
    return NextResponse.json(
      { success: false, error: "This proposal is not available for response" },
      { status: 400 }
    );
  }

  const now = new Date();
  const newStatus = action === "accept" ? "accepted" : "rejected";

  // Captured inside transaction for post-transaction email send
  let depositEmailData: {
    rawToken: string;
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    projectName: string;
    dueDate: Date;
    totalCents: number;
    lineItems: { description: string; quantity: number; unitPriceCents: number; totalCents: number }[];
  } | null = null;

  await db.transaction(async (tx) => {
    await tx
      .update(proposals)
      .set({
        status: newStatus,
        respondedAt: now,
        acceptedAt: action === "accept" ? now : undefined,
        rejectionReason: action === "decline" && reason ? sanitizeString(reason.slice(0, 1000)) : undefined,
        updatedAt: now,
      })
      .where(eq(proposals.id, proposal.id));

    // Advance pipeline stage
    if (proposal.clientId) {
      const [client] = await tx
        .select({ pipelineStage: clients.pipelineStage, name: clients.name, email: clients.email })
        .from(clients)
        .where(eq(clients.id, proposal.clientId))
        .limit(1);

      if (client) {
        if (action === "accept") {
          await tx
            .update(clients)
            .set({
              pipelineStage: "proposal_accepted",
              stageChangedAt: now,
              updatedAt: now,
            })
            .where(eq(clients.id, proposal.clientId));

          await tx.insert(pipelineHistory).values({
            clientId: proposal.clientId,
            fromStage: client.pipelineStage,
            toStage: "proposal_accepted",
            note: "Client accepted the proposal",
          });

          // --- Auto-create project, milestones, and deposit invoice ---
          const [existingProject] = await tx
            .select({ id: projects.id })
            .from(projects)
            .where(eq(projects.proposalId, proposal.id))
            .limit(1);

          if (!existingProject) {
            const startDate = now;
            const weeks = mapTimelineToWeeks(proposal.timeline ?? "flexible");
            const targetDate = new Date(now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);

            const projectRows = await tx.insert(projects).values({
              name: proposal.title,
              clientId: proposal.clientId,
              proposalId: proposal.id,
              budgetCents: proposal.estimatedBudgetCents ?? 0,
              services: (proposal.services ?? []) as unknown as string[],
              status: "planning",
              startDate,
              targetDate,
            }).returning() as { id: string; name: string }[];
            const project = projectRows[0];

            const amounts = calculateMilestoneAmounts(proposal.estimatedBudgetCents ?? 0);
            const dates = calculateMilestoneDates(startDate, targetDate);

            const milestoneRows = [
              { projectId: project.id, type: "deposit" as const, percentage: 50, amountCents: amounts.deposit, scheduledDate: dates.deposit, status: "pending" as const },
              { projectId: project.id, type: "midpoint" as const, percentage: 25, amountCents: amounts.midpoint, scheduledDate: dates.midpoint, status: "pending" as const },
              { projectId: project.id, type: "final" as const, percentage: 25, amountCents: amounts.final, scheduledDate: dates.final, status: "pending" as const },
            ];
            const insertedMilestones = await tx.insert(billingMilestones).values(milestoneRows).returning() as { id: string; type: string }[];

            if ((proposal.estimatedBudgetCents ?? 0) > 0) {
              const depositMilestone = insertedMilestones.find(m => m.type === "deposit")!;
              const { rawToken, hashedToken: invoiceToken } = generateInvoiceToken();
              const invoiceNumber = await generateInvoiceNumber(tx);
              const proposalServices = (proposal.services as Array<{ serviceName: string; estimatedPriceCents: number }>) ?? [];
              const lineItems = buildDepositLineItems(proposalServices, 50);
              const subtotalCents = lineItems.reduce((s, li) => s + li.totalCents, 0);
              const invoiceDueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

              const invoiceRows = await tx.insert(invoices).values({
                invoiceNumber,
                clientId: proposal.clientId!,
                projectId: project.id,
                status: "sent",
                issuedDate: now,
                dueDate: invoiceDueDate,
                token: invoiceToken,
                milestoneId: depositMilestone.id,
                subtotalCents,
                taxCents: 0,
                totalCents: subtotalCents,
                taxRate: "0",
              }).returning() as { id: string }[];
              const invoice = invoiceRows[0];

              await tx.insert(invoiceItems).values(
                lineItems.map((li, i) => ({
                  invoiceId: invoice.id,
                  description: li.description,
                  quantity: "1",
                  unitPriceCents: li.unitPriceCents,
                  totalCents: li.totalCents,
                  sortOrder: i,
                }))
              );

              await tx.update(billingMilestones)
                .set({ status: "sent", invoiceId: invoice.id, updatedAt: now })
                .where(eq(billingMilestones.id, depositMilestone.id));

              // Capture data for post-transaction email (decrypt PII outside tx)
              depositEmailData = {
                rawToken,
                invoiceNumber,
                clientName: decrypt(client.name),
                clientEmail: decrypt(client.email),
                projectName: project.name,
                dueDate: invoiceDueDate,
                totalCents: subtotalCents,
                lineItems: lineItems.map((li) => ({
                  description: li.description,
                  quantity: 1,
                  unitPriceCents: li.unitPriceCents,
                  totalCents: li.totalCents,
                })),
              };
            }
          }
        } else {
          await tx
            .update(clients)
            .set({
              status: "lost",
              updatedAt: now,
            })
            .where(eq(clients.id, proposal.clientId));

          await tx.insert(pipelineHistory).values({
            clientId: proposal.clientId,
            fromStage: client.pipelineStage,
            toStage: client.pipelineStage,
            note: `Client declined the proposal${reason ? `: ${sanitizeString(reason.slice(0, 500))}` : ""}`,
          });
        }
      }
    }
  });

  // Send deposit invoice email after the transaction commits
  if (depositEmailData) {
    const {
      rawToken,
      invoiceNumber,
      clientName,
      clientEmail,
      projectName,
      dueDate,
      totalCents,
      lineItems,
    } = depositEmailData;

    try {
      const invoiceUrl = `${SITE_URL}/invoice/${rawToken}`;
      const html = buildInvoiceEmailHtml({
        invoiceNumber,
        clientName,
        projectName,
        milestoneType: "deposit",
        amountCents: totalCents,
        dueDate,
        lineItems,
        invoiceUrl,
      });
      await sendEmail({
        to: clientEmail,
        subject: `Invoice ${invoiceNumber} - BuiltByBas`,
        html,
      });
    } catch {
      // Email failure is non-fatal -- invoice is already created in the database
    }
  }

  return NextResponse.json({ success: true, status: newStatus });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json(
      { success: false, error: "Invalid token" },
      { status: 400 }
    );
  }

  const hashedToken = hmacHash(token);

  const [proposal] = await db
    .select({
      title: proposals.title,
      summary: proposals.summary,
      content: proposals.content,
      estimatedBudgetCents: proposals.estimatedBudgetCents,
      timeline: proposals.timeline,
      status: proposals.status,
      sentAt: proposals.sentAt,
      respondedAt: proposals.respondedAt,
      validUntil: proposals.validUntil,
      services: proposals.services,
    })
    .from(proposals)
    .where(eq(proposals.responseToken, hashedToken))
    .limit(1);

  if (!proposal) {
    return NextResponse.json(
      { success: false, error: "Proposal not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, proposal });
}
