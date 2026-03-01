"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";
import { INVOICE_STATUSES, getInvoiceStatusMeta, formatCents } from "@/types/invoice";
import type { InvoiceStatus } from "@/types/invoice";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: string;
  unitPriceCents: number;
  totalCents: number;
  sortOrder: number;
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId: string | null;
  status: InvoiceStatus;
  issuedDate: Date;
  dueDate: Date;
  paidDate: Date | null;
  subtotalCents: number;
  taxRate: string | null;
  taxCents: number;
  totalCents: number;
  notes: string | null;
  createdAt: Date;
  clientName: string | null;
  clientCompany: string | null;
  clientEmail: string | null;
  projectName: string | null;
  items: InvoiceItem[];
}

export function InvoiceDetailView({ invoice }: { invoice: InvoiceData }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const statusMeta = getInvoiceStatusMeta(invoice.status);
  const isOverdue =
    invoice.status === "sent" && new Date(invoice.dueDate) < new Date();

  async function updateStatus(status: string) {
    setUpdating(true);
    try {
      await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setUpdating(false);
    }
  }

  const formatDate = (d: Date | null) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/invoices"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; All Invoices
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight font-mono">
            {invoice.invoiceNumber}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {invoice.clientCompany}
            {invoice.clientName ? ` — ${invoice.clientName}` : ""}
            {invoice.clientEmail ? ` (${invoice.clientEmail})` : ""}
          </p>
          {invoice.projectName && (
            <p className="text-sm text-muted-foreground">
              Project: {invoice.projectName}
            </p>
          )}
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
            isOverdue ? "bg-red-500/20 text-red-400" : statusMeta.color
          )}
        >
          {isOverdue ? "Overdue" : statusMeta.label}
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="mt-1 text-2xl font-bold">
            {formatCents(invoice.totalCents)}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Issued</p>
          <p className="mt-1 text-xl font-bold">
            {formatDate(invoice.issuedDate)}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Due</p>
          <p className={cn("mt-1 text-xl font-bold", isOverdue && "text-red-400")}>
            {formatDate(invoice.dueDate)}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Paid</p>
          <p className="mt-1 text-xl font-bold">
            {invoice.paidDate ? formatDate(invoice.paidDate) : "—"}
          </p>
        </GlassCard>
      </div>

      {/* Line Items */}
      <GlassCard className="mt-6">
        <h2 className="text-sm font-semibold">Line Items</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-muted-foreground">
                <th className="pb-2 pr-4">Description</th>
                <th className="pb-2 pr-4 text-right">Qty</th>
                <th className="pb-2 pr-4 text-right">Unit Price</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-white/5">
                  <td className="py-3 pr-4">{item.description}</td>
                  <td className="py-3 pr-4 text-right">{item.quantity}</td>
                  <td className="py-3 pr-4 text-right">
                    {formatCents(item.unitPriceCents)}
                  </td>
                  <td className="py-3 text-right font-medium">
                    {formatCents(item.totalCents)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10">
                <td colSpan={3} className="pt-3 text-right text-muted-foreground">
                  Subtotal
                </td>
                <td className="pt-3 text-right font-medium">
                  {formatCents(invoice.subtotalCents)}
                </td>
              </tr>
              {invoice.taxCents > 0 && (
                <tr>
                  <td colSpan={3} className="pt-1 text-right text-muted-foreground">
                    Tax ({parseFloat(invoice.taxRate ?? "0") * 100}%)
                  </td>
                  <td className="pt-1 text-right font-medium">
                    {formatCents(invoice.taxCents)}
                  </td>
                </tr>
              )}
              <tr className="text-lg font-bold">
                <td colSpan={3} className="pt-2 text-right">
                  Total
                </td>
                <td className="pt-2 text-right">
                  {formatCents(invoice.totalCents)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </GlassCard>

      {invoice.notes && (
        <GlassCard className="mt-4">
          <h2 className="text-sm font-semibold">Notes</h2>
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
            {invoice.notes}
          </p>
        </GlassCard>
      )}

      <GlassCard className="mt-6">
        <h2 className="text-sm font-semibold">Update Status</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {INVOICE_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => updateStatus(s.value)}
              disabled={updating || s.value === invoice.status}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-40",
                s.value === invoice.status
                  ? s.color
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </GlassCard>
    </>
  );
}
