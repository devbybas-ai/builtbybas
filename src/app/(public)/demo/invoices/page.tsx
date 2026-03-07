"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import { demoInvoices, type DemoInvoice } from "@/data/demo-data";

const statusOptions = ["draft", "sent", "paid", "overdue"] as const;
const statusLabels: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
};
const statusColors: Record<string, string> = {
  draft: "bg-white/10 text-white/60",
  sent: "bg-amber-500/20 text-amber-400",
  paid: "bg-emerald-500/20 text-emerald-400",
  overdue: "bg-red-500/20 text-red-400",
};

function getStatusBadge(status: string) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", statusColors[status] ?? "bg-white/10 text-white/60")}>
      {statusLabels[status] ?? status}
    </span>
  );
}

export default function DemoInvoicesPage() {
  const [invoices, setInvoices] = useState<DemoInvoice[]>(() => [...demoInvoices]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function updateStatus(id: string, newStatus: DemoInvoice["status"]) {
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)),
    );
  }

  const filtered = filterStatus === "all"
    ? invoices
    : invoices.filter((i) => i.status === filterStatus);

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, "")), 0);
  const totalOutstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, "")), 0);
  const totalAll = invoices.reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, "")), 0);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <p className="mt-1 text-muted-foreground">
          {invoices.length} invoices tracked. Click to expand and update status.
        </p>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <GlassCard>
          <p className="text-sm text-muted-foreground">Total Invoiced</p>
          <p className="mt-1 text-2xl font-bold text-foreground">${totalAll.toLocaleString()}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">${totalPaid.toLocaleString()}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Outstanding</p>
          <p className="mt-1 text-2xl font-bold text-amber-400">${totalOutstanding.toLocaleString()}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Collection Rate</p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {totalAll > 0 ? Math.round((totalPaid / totalAll) * 100) : 0}%
          </p>
        </GlassCard>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterStatus("all")}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            filterStatus === "all"
              ? "bg-primary/20 text-primary"
              : "bg-white/5 text-muted-foreground hover:bg-white/10",
          )}
        >
          All ({invoices.length})
        </button>
        {statusOptions.map((s) => {
          const count = invoices.filter((i) => i.status === s).length;
          if (count === 0) return null;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filterStatus === s
                  ? "bg-primary/20 text-primary"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10",
              )}
            >
              {statusLabels[s]} ({count})
            </button>
          );
        })}
      </div>

      {/* Invoice list */}
      <div className="mt-6 space-y-2">
        {filtered.map((invoice) => (
          <div key={invoice.id} className="rounded-lg border border-white/5 bg-white/[0.02] transition-colors hover:border-primary/20">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === invoice.id ? null : invoice.id)}
              className="w-full px-4 py-3 text-left"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium text-muted-foreground">{invoice.invoiceNumber}</span>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <p className="mt-0.5 text-sm font-semibold">{invoice.clientName}</p>
                  <p className="text-xs text-muted-foreground">{invoice.company}</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <p className="text-sm font-bold tabular-nums">{invoice.amount}</p>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Due</p>
                    <p className="text-xs tabular-nums text-muted-foreground">
                      {new Date(invoice.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            </button>

            {expandedId === invoice.id && (
              <div className="border-t border-white/5 px-4 pb-4 pt-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Client</h4>
                    <p className="mt-1 text-sm">{invoice.clientName}</p>
                    <p className="text-xs text-muted-foreground">{invoice.company}</p>

                    <h4 className="mt-3 text-xs font-semibold text-muted-foreground">Issued</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(invoice.issuedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>

                    <h4 className="mt-3 text-xs font-semibold text-muted-foreground">Due Date</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(invoice.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Update Status</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {statusOptions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateStatus(invoice.id, s)}
                          className={cn(
                            "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                            invoice.status === s
                              ? "bg-primary/20 text-primary"
                              : "bg-white/5 text-muted-foreground hover:bg-white/10",
                          )}
                        >
                          {statusLabels[s]}
                        </button>
                      ))}
                    </div>
                    {invoice.status === "sent" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(invoice.id, "paid")}
                        className="mt-3 rounded-lg bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No invoices match this filter.
          </p>
        )}
      </div>
    </>
  );
}
