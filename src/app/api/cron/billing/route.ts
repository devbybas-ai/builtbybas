import { NextResponse, type NextRequest } from "next/server";
import { eq, and, lte, gte, isNull, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  billingMilestones,
  invoices,
  invoiceItems,
  clients,
  projects,
} from "@/lib/schema";
import { requireCronAuth } from "@/lib/cron-auth";
import { generateInvoiceToken } from "@/lib/billing";
import { generateInvoiceNumber } from "@/lib/invoice-utils";
import { decrypt } from "@/lib/encryption";
import { sendEmail } from "@/lib/email";
import {
  buildPaymentReminderHtml,
  buildMilestoneAlertHtml,
} from "@/lib/invoice-email";

export async function POST(request: NextRequest) {
  const auth = await requireCronAuth(request);
  if ("error" in auth) return auth.error;

  const results = {
    draftsCreated: 0,
    overdueMarked: 0,
    remindersSent: 0,
    alertsSent: 0,
  };

  const now = new Date();

  // Sweep 1 & 2: Generate draft invoices for due midpoint/final milestones
  try {
    const dueMilestones = await db
      .select({
        id: billingMilestones.id,
        projectId: billingMilestones.projectId,
        type: billingMilestones.type,
        amountCents: billingMilestones.amountCents,
        projectName: projects.name,
        clientId: projects.clientId,
        projectStatus: projects.status,
      })
      .from(billingMilestones)
      .innerJoin(projects, eq(billingMilestones.projectId, projects.id))
      .where(
        and(
          inArray(billingMilestones.type, ["midpoint", "final"]),
          eq(billingMilestones.status, "pending"),
          lte(billingMilestones.scheduledDate, now)
        )
      );

    for (const milestone of dueMilestones) {
      if (milestone.projectStatus === "cancelled") continue;
      if (milestone.amountCents <= 0) continue;

      await db.transaction(async (tx) => {
        const { hashedToken } = generateInvoiceToken();
        const invoiceNumber = await generateInvoiceNumber(tx);
        const typeLabel =
          milestone.type === "midpoint" ? "Midpoint (25%)" : "Final (25%)";

        const [invoice] = await tx
          .insert(invoices)
          .values({
            invoiceNumber,
            clientId: milestone.clientId,
            projectId: milestone.projectId,
            status: "draft",
            issuedDate: now,
            dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
            token: hashedToken,
            milestoneId: milestone.id,
            subtotalCents: milestone.amountCents,
            taxCents: 0,
            totalCents: milestone.amountCents,
            taxRate: "0",
          })
          .returning();

        await tx.insert(invoiceItems).values({
          invoiceId: invoice.id,
          description: `${typeLabel} - ${milestone.projectName ?? "Project"}`,
          quantity: "1",
          unitPriceCents: milestone.amountCents,
          totalCents: milestone.amountCents,
          sortOrder: 0,
        });

        await tx
          .update(billingMilestones)
          .set({
            status: "draft_created",
            invoiceId: invoice.id,
            updatedAt: now,
          })
          .where(eq(billingMilestones.id, milestone.id));
      });

      results.draftsCreated++;

      // Email admin about draft created
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        try {
          const [client] = await db
            .select({ name: clients.name })
            .from(clients)
            .where(eq(clients.id, milestone.clientId))
            .limit(1);
          const clientName = client?.name ? decrypt(client.name) : "Client";
          const html = buildMilestoneAlertHtml({
            alertType: "draft_created",
            projectName: milestone.projectName ?? "Project",
            clientName,
            milestoneType:
              milestone.type === "midpoint" ? "Midpoint" : "Final",
            amountCents: milestone.amountCents,
            date: now,
          });
          await sendEmail({
            to: adminEmail,
            subject: `Invoice draft created - ${milestone.projectName}`,
            html,
          });
        } catch {
          // email failure should not block cron
        }
      }
    }
  } catch {
    // sweep failure should not block other sweeps
  }

  // Sweep 3: Overdue detection
  try {
    const overdueResult = await db
      .update(invoices)
      .set({ status: "overdue", updatedAt: now })
      .where(and(eq(invoices.status, "sent"), lte(invoices.dueDate, now)))
      .returning({ id: invoices.id });
    results.overdueMarked = overdueResult.length;
  } catch {
    // sweep failure should not block
  }

  // Sweep 4: Payment reminders (3 days before due)
  try {
    const threeDaysFromNow = new Date(
      now.getTime() + 3 * 24 * 60 * 60 * 1000
    );
    const reminderInvoices = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        totalCents: invoices.totalCents,
        dueDate: invoices.dueDate,
        token: invoices.token,
        clientId: invoices.clientId,
        projectName: projects.name,
        clientName: clients.name,
        clientEmail: clients.email,
      })
      .from(invoices)
      .leftJoin(projects, eq(invoices.projectId, projects.id))
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .where(
        and(
          eq(invoices.status, "sent"),
          lte(invoices.dueDate, threeDaysFromNow),
          gte(invoices.dueDate, now),
          isNull(invoices.reminderSentAt)
        )
      );

    for (const inv of reminderInvoices) {
      if (!inv.clientEmail) continue;
      try {
        const clientName = inv.clientName ? decrypt(inv.clientName) : "Client";
        const clientEmail = decrypt(inv.clientEmail);
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL ?? "https://builtbybas.com";
        // Generate a fresh token so the reminder link works
        const { rawToken, hashedToken } = generateInvoiceToken();
        await db
          .update(invoices)
          .set({ token: hashedToken, reminderSentAt: now, updatedAt: now })
          .where(eq(invoices.id, inv.id));

        const daysUntilDue = Math.ceil(
          (inv.dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
        );
        const html = buildPaymentReminderHtml({
          invoiceNumber: inv.invoiceNumber,
          clientName,
          projectName: inv.projectName ?? "Your Project",
          amountCents: inv.totalCents,
          dueDate: inv.dueDate,
          daysUntilDue,
          invoiceUrl: `${siteUrl}/invoice/${rawToken}`,
        });
        await sendEmail({
          to: clientEmail,
          subject: `Payment Reminder - Invoice ${inv.invoiceNumber}`,
          html,
        });
        results.remindersSent++;
      } catch {
        // email failure should not block
      }
    }
  } catch {
    // sweep failure should not block
  }

  // Sweep 5: Upcoming milestone alerts (5 days ahead)
  try {
    const fiveDaysFromNow = new Date(
      now.getTime() + 5 * 24 * 60 * 60 * 1000
    );
    const upcomingMilestones = await db
      .select({
        id: billingMilestones.id,
        type: billingMilestones.type,
        amountCents: billingMilestones.amountCents,
        scheduledDate: billingMilestones.scheduledDate,
        projectName: projects.name,
        clientId: projects.clientId,
      })
      .from(billingMilestones)
      .innerJoin(projects, eq(billingMilestones.projectId, projects.id))
      .where(
        and(
          eq(billingMilestones.status, "pending"),
          lte(billingMilestones.scheduledDate, fiveDaysFromNow),
          gte(billingMilestones.scheduledDate, now)
        )
      );

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      for (const ms of upcomingMilestones) {
        try {
          const [client] = await db
            .select({ name: clients.name })
            .from(clients)
            .where(eq(clients.id, ms.clientId))
            .limit(1);
          const clientName = client?.name ? decrypt(client.name) : "Client";
          const daysAway = Math.ceil(
            ((ms.scheduledDate?.getTime() ?? now.getTime()) - now.getTime()) /
              (24 * 60 * 60 * 1000)
          );
          const typeLabel =
            ms.type === "deposit"
              ? "Deposit"
              : ms.type === "midpoint"
                ? "Midpoint"
                : "Final";
          const html = buildMilestoneAlertHtml({
            alertType: "upcoming",
            projectName: ms.projectName ?? "Project",
            clientName,
            milestoneType: typeLabel,
            amountCents: ms.amountCents,
            date: ms.scheduledDate ?? now,
            daysAway,
          });
          await sendEmail({
            to: adminEmail,
            subject: `Milestone approaching - ${ms.projectName}`,
            html,
          });
          results.alertsSent++;
        } catch {
          // email failure should not block
        }
      }
    }
  } catch {
    // sweep failure should not block
  }

  return NextResponse.json({ success: true, results });
}
