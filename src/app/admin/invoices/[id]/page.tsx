import type { Metadata } from "next";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { invoices, invoiceItems, clients, projects } from "@/lib/schema";
import { decrypt } from "@/lib/encryption";
import { InvoiceDetailView } from "@/components/admin/InvoiceDetailView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invoice Detail - BuiltByBas Admin",
  robots: { index: false, follow: false },
};

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [invoice] = await db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      clientId: invoices.clientId,
      projectId: invoices.projectId,
      status: invoices.status,
      issuedDate: invoices.issuedDate,
      dueDate: invoices.dueDate,
      paidDate: invoices.paidDate,
      subtotalCents: invoices.subtotalCents,
      taxRate: invoices.taxRate,
      taxCents: invoices.taxCents,
      totalCents: invoices.totalCents,
      notes: invoices.notes,
      createdAt: invoices.createdAt,
      clientName: clients.name,
      clientCompany: clients.company,
      clientEmail: clients.email,
      projectName: projects.name,
    })
    .from(invoices)
    .leftJoin(clients, eq(invoices.clientId, clients.id))
    .leftJoin(projects, eq(invoices.projectId, projects.id))
    .where(eq(invoices.id, id))
    .limit(1);

  if (!invoice) notFound();

  const items = await db
    .select()
    .from(invoiceItems)
    .where(eq(invoiceItems.invoiceId, id))
    .orderBy(asc(invoiceItems.sortOrder));

  const data = {
    ...invoice,
    clientName: invoice.clientName ? decrypt(invoice.clientName) : null,
    clientEmail: invoice.clientEmail ? decrypt(invoice.clientEmail) : null,
    items,
  };

  return <InvoiceDetailView invoice={data} />;
}
