import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  invoices,
  invoiceItems,
  clients,
  projects,
  billingMilestones,
} from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { generateInvoiceToken } from "@/lib/billing";
import { decrypt } from "@/lib/encryption";
import { buildInvoiceEmailHtml } from "@/lib/invoice-email";
import { sendEmail } from "@/lib/email";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    // 1. Fetch invoice with items, client, project
    const [invoice] = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        clientId: invoices.clientId,
        projectId: invoices.projectId,
        status: invoices.status,
        dueDate: invoices.dueDate,
        totalCents: invoices.totalCents,
        token: invoices.token,
        milestoneId: invoices.milestoneId,
        clientName: clients.name,
        clientEmail: clients.email,
        projectName: projects.name,
      })
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .leftJoin(projects, eq(invoices.projectId, projects.id))
      .where(eq(invoices.id, id))
      .limit(1);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    // 2. Get invoice items
    const items = await db
      .select()
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, id))
      .orderBy(invoiceItems.sortOrder);

    // 3. Generate (or rotate) the token.
    // Raw tokens cannot be recovered from stored hashes, so we always issue a
    // fresh token on send/resend so the URL remains valid.
    const { rawToken, hashedToken } = generateInvoiceToken();
    await db
      .update(invoices)
      .set({ token: hashedToken, updatedAt: new Date() })
      .where(eq(invoices.id, id));
    const tokenForUrl = rawToken;

    // 4. Resolve client name and email
    const clientName = invoice.clientName
      ? decrypt(invoice.clientName)
      : "Client";
    const clientEmail = invoice.clientEmail
      ? decrypt(invoice.clientEmail)
      : null;

    if (!clientEmail) {
      return NextResponse.json(
        { success: false, error: "Client email not found" },
        { status: 400 }
      );
    }

    // 5. Determine milestone type label
    let milestoneType = "Invoice";
    if (invoice.milestoneId) {
      const [milestone] = await db
        .select({ type: billingMilestones.type })
        .from(billingMilestones)
        .where(eq(billingMilestones.id, invoice.milestoneId))
        .limit(1);
      if (milestone) {
        if (milestone.type === "deposit") {
          milestoneType = "Deposit";
        } else if (milestone.type === "midpoint") {
          milestoneType = "Midpoint";
        } else {
          milestoneType = "Final";
        }
      }
    }

    // 6. Build and send email
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://builtbybas.com";
    const invoiceUrl = `${siteUrl}/invoice/${tokenForUrl}`;

    const emailHtml = buildInvoiceEmailHtml({
      invoiceNumber: invoice.invoiceNumber,
      clientName,
      projectName: invoice.projectName ?? "Your Project",
      milestoneType,
      amountCents: invoice.totalCents,
      dueDate: invoice.dueDate,
      lineItems: items.map((item) => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPriceCents: item.unitPriceCents,
        totalCents: item.totalCents,
      })),
      invoiceUrl,
    });

    await sendEmail({
      to: clientEmail,
      subject: `Invoice ${invoice.invoiceNumber} - BuiltByBas`,
      html: emailHtml,
    });

    // 7. Update invoice status to "sent" if currently "draft"
    const now = new Date();
    if (invoice.status === "draft") {
      await db
        .update(invoices)
        .set({ status: "sent", updatedAt: now })
        .where(eq(invoices.id, id));
    }

    // 8. Update linked milestone status if applicable
    if (invoice.milestoneId) {
      await db
        .update(billingMilestones)
        .set({ status: "sent", updatedAt: now })
        .where(eq(billingMilestones.id, invoice.milestoneId));
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to send invoice" },
      { status: 500 }
    );
  }
}
