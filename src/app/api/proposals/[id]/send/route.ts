import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { proposals, clients, pipelineHistory } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { sendProposalSchema } from "@/lib/proposal-validation";
import { resend, EMAIL_FROM } from "@/lib/email";
import { decrypt, hmacHash } from "@/lib/encryption";
import { buildProposalEmailHtml } from "@/lib/proposal-email";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid proposal ID" },
      { status: 400 }
    );
  }

  // Verify proposal exists and is reviewed
  const [proposal] = await db
    .select({
      id: proposals.id,
      clientId: proposals.clientId,
      title: proposals.title,
      summary: proposals.summary,
      content: proposals.content,
      status: proposals.status,
      estimatedBudgetCents: proposals.estimatedBudgetCents,
      timeline: proposals.timeline,
      clientName: clients.name,
      clientCompany: clients.company,
    })
    .from(proposals)
    .leftJoin(clients, eq(proposals.clientId, clients.id))
    .where(eq(proposals.id, id))
    .limit(1);

  if (!proposal) {
    return NextResponse.json(
      { success: false, error: "Proposal not found" },
      { status: 404 }
    );
  }

  if (proposal.status !== "reviewed") {
    return NextResponse.json(
      {
        success: false,
        error: "Proposal must be reviewed before sending",
      },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = sendProposalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  if (!resend) {
    return NextResponse.json(
      {
        success: false,
        error: "Email service not configured. Set RESEND_API_KEY in .env.local.",
      },
      { status: 503 }
    );
  }

  const { recipientEmail, recipientName, customMessage } = parsed.data;
  const clientName = proposal.clientName
    ? decrypt(proposal.clientName)
    : recipientName ?? "there";

  const rawToken = randomBytes(32).toString("hex");
  const hashedToken = hmacHash(rawToken);
  const siteUrl = process.env.SITE_URL ?? "https://builtbybas.com";
  const responseUrl = `${siteUrl}/proposal/${rawToken}`;

  const html = buildProposalEmailHtml({
    title: proposal.title,
    summary: proposal.summary,
    content: proposal.content,
    estimatedBudgetCents: proposal.estimatedBudgetCents,
    timeline: proposal.timeline,
    clientName,
    clientCompany: proposal.clientCompany ?? "",
    customMessage,
    responseUrl,
  });

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: recipientEmail,
      subject: `Proposal: ${proposal.title}`,
      html,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }

    // Update proposal status to sent + store response token
    await db
      .update(proposals)
      .set({
        status: "sent",
        sentAt: new Date(),
        responseToken: hashedToken,
        updatedAt: new Date(),
      })
      .where(eq(proposals.id, id));

    // Advance pipeline stage to proposal_sent
    if (proposal.clientId) {
      const [client] = await db
        .select({ pipelineStage: clients.pipelineStage })
        .from(clients)
        .where(eq(clients.id, proposal.clientId))
        .limit(1);

      if (
        client &&
        ["proposal_draft", "analysis_complete", "fit_assessment"].includes(
          client.pipelineStage
        )
      ) {
        await db
          .update(clients)
          .set({
            pipelineStage: "proposal_sent",
            stageChangedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(clients.id, proposal.clientId));

        await db.insert(pipelineHistory).values({
          clientId: proposal.clientId,
          fromStage: client.pipelineStage,
          toStage: "proposal_sent",
          changedBy: auth.user.id,
          note: "Proposal sent to client via email",
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to send proposal" },
      { status: 500 }
    );
  }
}
