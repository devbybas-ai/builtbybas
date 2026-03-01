import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices, clients } from "@/lib/schema";
import { decrypt } from "@/lib/encryption";
import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";
import { getInvoiceStatusMeta, formatCents } from "@/types/invoice";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invoices — BuiltByBas Admin",
  robots: { index: false, follow: false },
};

export default async function InvoicesPage() {
  const rows = await db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      status: invoices.status,
      totalCents: invoices.totalCents,
      issuedDate: invoices.issuedDate,
      dueDate: invoices.dueDate,
      paidDate: invoices.paidDate,
      clientName: clients.name,
      clientCompany: clients.company,
    })
    .from(invoices)
    .leftJoin(clients, eq(invoices.clientId, clients.id))
    .orderBy(desc(invoices.createdAt));

  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="mt-1 text-muted-foreground">
            Track payments and billing.
          </p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          + New Invoice
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {rows.map((inv) => {
          const statusMeta = getInvoiceStatusMeta(inv.status);
          const isOverdue =
            inv.status === "sent" && new Date(inv.dueDate) < new Date();
          return (
            <Link key={inv.id} href={`/admin/invoices/${inv.id}`}>
              <GlassCard className="flex items-center justify-between transition-colors hover:border-primary/30">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-mono text-sm font-medium">
                      {inv.invoiceNumber}
                    </p>
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        isOverdue
                          ? "bg-red-500/20 text-red-400"
                          : statusMeta.color
                      )}
                    >
                      {isOverdue ? "Overdue" : statusMeta.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {inv.clientCompany}
                    {inv.clientName ? ` — ${decrypt(inv.clientName)}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">
                    {formatCents(inv.totalCents)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Due{" "}
                    {new Date(inv.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </GlassCard>
            </Link>
          );
        })}
        {rows.length === 0 && (
          <GlassCard className="py-12 text-center">
            <p className="text-muted-foreground">
              No invoices yet. Create one to start billing.
            </p>
          </GlassCard>
        )}
      </div>
    </>
  );
}
