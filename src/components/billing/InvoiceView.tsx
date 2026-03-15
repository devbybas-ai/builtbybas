"use client";

import { useState, useEffect } from "react";
import {
  ProposalPolicyOverlay,
  type PolicyKey,
} from "@/components/proposal/ProposalPolicyOverlay";
import { formatCents, getInvoiceStatusMeta, type InvoiceStatus } from "@/types/invoice";

interface InvoiceItem {
  description: string;
  quantity: string;
  unitPriceCents: number;
  totalCents: number;
  sortOrder: number;
}

interface InvoiceData {
  invoiceNumber: string;
  status: InvoiceStatus;
  issuedDate: string | null;
  dueDate: string | null;
  paidDate: string | null;
  subtotalCents: number;
  taxRate: string;
  taxCents: number;
  totalCents: number;
  notes: string | null;
  clientName: string | null;
  clientCompany: string | null;
  projectName: string | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "--";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
}

export function InvoiceView({ token }: { token: string }) {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const res = await fetch(`/api/invoices/view?token=${token}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error ?? "Invoice not found");
          return;
        }
        setInvoice(data.invoice);
        setItems(data.items ?? []);
      } catch {
        setError("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    }
    fetchInvoice();
  }, [token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white/50 text-lg">Loading invoice...</div>
      </main>
    );
  }

  if (error && !invoice) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invoice Not Found</h1>
          <p className="text-white/50">{error}</p>
        </div>
      </main>
    );
  }

  if (!invoice) return null;

  const statusMeta = getInvoiceStatusMeta(invoice.status);
  const taxRate = parseFloat(invoice.taxRate ?? "0");
  const showTax = invoice.taxCents > 0 || taxRate > 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-cyan-400 text-xl font-bold tracking-wide">BuiltByBas</h1>
        </div>

        {/* Status-specific banners */}
        {invoice.status === "paid" && (
          <div className="mb-8 p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            <p className="font-semibold">This invoice has been paid. Thank you!</p>
          </div>
        )}
        {invoice.status === "overdue" && (
          <div className="mb-8 p-4 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-400">
            <p className="font-semibold">This invoice is past due. Please contact us.</p>
          </div>
        )}

        {/* Invoice card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">

          {/* Invoice header */}
          <div className="p-6 sm:p-8 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Invoice</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{invoice.invoiceNumber}</h2>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold self-start ${statusMeta.color}`}
              >
                {statusMeta.label}
              </span>
            </div>
          </div>

          {/* Bill To + Project */}
          <div className="p-6 sm:p-8 border-b border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Bill To</p>
              {invoice.clientName && (
                <p className="text-white font-semibold">{invoice.clientName}</p>
              )}
              {invoice.clientCompany && (
                <p className="text-white/60 text-sm">{invoice.clientCompany}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Project</p>
              <p className="text-white font-semibold">{invoice.projectName ?? "--"}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="p-6 sm:p-8 border-b border-white/10 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Issue Date</p>
              <p className="text-white font-medium">{formatDate(invoice.issuedDate)}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Due Date</p>
              <p className={`font-medium ${invoice.status === "overdue" ? "text-amber-400" : "text-white"}`}>
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>

          {/* Line items */}
          <div className="p-6 sm:p-8 border-b border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-4">Line Items</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/40 text-xs uppercase tracking-wider pb-3 pr-4 font-medium">
                      Description
                    </th>
                    <th className="text-center text-white/40 text-xs uppercase tracking-wider pb-3 px-4 font-medium w-16">
                      Qty
                    </th>
                    <th className="text-right text-white/40 text-xs uppercase tracking-wider pb-3 px-4 font-medium">
                      Unit Price
                    </th>
                    <th className="text-right text-white/40 text-xs uppercase tracking-wider pb-3 pl-4 font-medium">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="text-white/75 py-3 pr-4">{item.description}</td>
                      <td className="text-white/50 py-3 px-4 text-center">{item.quantity}</td>
                      <td className="text-white/50 py-3 px-4 text-right">
                        {formatCents(item.unitPriceCents)}
                      </td>
                      <td className="text-white py-3 pl-4 text-right font-medium">
                        {formatCents(item.totalCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-4 flex flex-col items-end gap-2">
              <div className="flex gap-8 text-sm">
                <span className="text-white/40 uppercase tracking-wider text-xs">Subtotal</span>
                <span className="text-white/75 w-28 text-right">{formatCents(invoice.subtotalCents)}</span>
              </div>
              {showTax && (
                <div className="flex gap-8 text-sm">
                  <span className="text-white/40 uppercase tracking-wider text-xs">
                    Tax {taxRate > 0 ? `(${taxRate}%)` : ""}
                  </span>
                  <span className="text-white/75 w-28 text-right">{formatCents(invoice.taxCents)}</span>
                </div>
              )}
              <div className="flex gap-8 border-t border-white/10 pt-3 mt-1">
                <span className="text-white/60 uppercase tracking-wider text-xs font-semibold">Total</span>
                <span className="text-cyan-400 font-bold text-lg w-28 text-right">
                  {formatCents(invoice.totalCents)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment instructions */}
          <div className="p-6 sm:p-8 bg-white/[0.02]">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Payment</p>
            <p className="text-white/60 text-sm leading-relaxed">
              For payment details, please contact us at{" "}
              <a
                href="mailto:bas@builtbybas.com"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                bas@builtbybas.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {(
              [
                ["privacy", "Privacy Policy"],
                ["terms", "Terms of Service"],
                ["cookies", "Cookie Policy"],
                ["refund", "Refund Policy"],
                ["ai-policy", "Responsible AI"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActivePolicy(key)}
                className="text-xs text-white/30 transition-colors hover:text-primary"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 text-center">
            <a
              href="https://builtbybas.com"
              className="text-primary/50 text-xs hover:text-primary transition-colors"
            >
              builtbybas.com
            </a>
          </div>
        </div>
      </div>

      {/* Policy overlay */}
      <ProposalPolicyOverlay
        activePolicy={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </main>
  );
}
