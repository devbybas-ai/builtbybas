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

interface EditableItem {
  description: string;
  quantity: number;
  unitPriceCents: number;
}

const PAYMENT_METHODS: { value: string; label: string }[] = [
  { value: "zelle", label: "Zelle" },
  { value: "check", label: "Check" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "other", label: "Other" },
];

const MILESTONE_TYPE_LABELS: Record<string, string> = {
  deposit: "Deposit",
  midpoint: "Midpoint",
  final: "Final",
};

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
  milestoneId: string | null;
  milestoneType: "deposit" | "midpoint" | "final" | null;
  clientName: string | null;
  clientCompany: string | null;
  clientEmail: string | null;
  projectName: string | null;
  items: InvoiceItem[];
}

function toDateInputValue(d: Date | null): string {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toISOString().split("T")[0];
}

export function InvoiceDetailView({ invoice }: { invoice: InvoiceData }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const statusMeta = getInvoiceStatusMeta(invoice.status);
  const isOverdue =
    invoice.status === "sent" && new Date(invoice.dueDate) < new Date();

  // Send/resend state
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  // Mark as paid state
  const [paymentMethod, setPaymentMethod] = useState("zelle");
  const [markingPaid, setMarkingPaid] = useState(false);
  const [markPaidError, setMarkPaidError] = useState("");

  const canSend = ["draft", "sent", "overdue"].includes(invoice.status);
  const canMarkPaid = ["sent", "overdue"].includes(invoice.status);

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [editItems, setEditItems] = useState<EditableItem[]>([]);
  const [editDueDate, setEditDueDate] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editTaxRate, setEditTaxRate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const canEdit = ["draft", "sent"].includes(invoice.status);

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

  async function handleSend() {
    setSending(true);
    setSendError("");
    try {
      const res = await fetch(`/api/invoices/${invoice.id}/send`, {
        method: "POST",
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (data.success) {
        router.refresh();
      } else {
        setSendError(data.error ?? "Failed to send invoice");
      }
    } catch {
      setSendError("Network error");
    } finally {
      setSending(false);
    }
  }

  async function handleMarkPaid() {
    setMarkingPaid(true);
    setMarkPaidError("");
    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid", paymentMethod }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (data.success) {
        router.refresh();
      } else {
        setMarkPaidError(data.error ?? "Failed to mark as paid");
      }
    } catch {
      setMarkPaidError("Network error");
    } finally {
      setMarkingPaid(false);
    }
  }

  function startEditing() {
    setEditItems(
      invoice.items.map((item) => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        unitPriceCents: item.unitPriceCents,
      }))
    );
    setEditDueDate(toDateInputValue(invoice.dueDate));
    setEditNotes(invoice.notes ?? "");
    setEditTaxRate(
      invoice.taxRate ? (parseFloat(invoice.taxRate) * 100).toString() : "0"
    );
    setSaveError("");
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setSaveError("");
  }

  function updateItem(index: number, field: keyof EditableItem, value: string) {
    setEditItems((prev) => {
      const next = [...prev];
      if (field === "description") {
        next[index] = { ...next[index], description: value };
      } else if (field === "quantity") {
        next[index] = { ...next[index], quantity: parseFloat(value) || 0 };
      } else {
        next[index] = {
          ...next[index],
          unitPriceCents: Math.round((parseFloat(value) || 0) * 100),
        };
      }
      return next;
    });
  }

  function addItem() {
    setEditItems((prev) => [
      ...prev,
      { description: "", quantity: 1, unitPriceCents: 0 },
    ]);
  }

  function removeItem(index: number) {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSaveRevision() {
    setSaving(true);
    setSaveError("");
    try {
      const taxRate = parseFloat(editTaxRate) / 100 || 0;
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dueDate: editDueDate
            ? new Date(editDueDate + "T00:00:00Z").toISOString()
            : undefined,
          notes: editNotes || null,
          taxRate,
          items: editItems,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditing(false);
        router.refresh();
      } else {
        setSaveError(data.error || "Failed to save changes");
      }
    } catch {
      setSaveError("Network error");
    } finally {
      setSaving(false);
    }
  }

  const editSubtotal = editItems.reduce(
    (sum, item) => sum + Math.round(item.quantity * item.unitPriceCents),
    0
  );
  const editTaxCents = Math.round(
    editSubtotal * (parseFloat(editTaxRate) / 100 || 0)
  );
  const editTotal = editSubtotal + editTaxCents;

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
          <div className="mt-2 flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight font-mono">
              {invoice.invoiceNumber}
            </h1>
            {invoice.milestoneId && invoice.milestoneType && (
              <span className="inline-flex items-center rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-semibold text-violet-300">
                {MILESTONE_TYPE_LABELS[invoice.milestoneType] ?? "Milestone"}
              </span>
            )}
          </div>
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
        <div className="flex items-center gap-3">
          {canEdit && !editing && (
            <button
              onClick={startEditing}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/10"
            >
              Edit Invoice
            </button>
          )}
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
              isOverdue ? "bg-red-500/20 text-red-400" : statusMeta.color
            )}
          >
            {isOverdue ? "Overdue" : statusMeta.label}
          </span>
        </div>
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

      {/* Send / Resend */}
      {canSend && (
        <GlassCard className="mt-6 border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">
                {invoice.status === "draft" ? "Send Invoice" : "Resend Invoice"}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {invoice.status === "draft"
                  ? "Send this invoice to the client by email. Status will update to Sent."
                  : "Send a fresh copy to the client. A new secure link will be generated."}
              </p>
            </div>
            <button
              onClick={handleSend}
              disabled={sending}
              className="rounded-lg bg-cyan-500 px-4 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-cyan-400 disabled:opacity-50"
            >
              {sending
                ? "Sending..."
                : invoice.status === "draft"
                ? "Send Invoice"
                : "Resend Invoice"}
            </button>
          </div>
          {sendError && (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {sendError}
            </p>
          )}
        </GlassCard>
      )}

      {/* Mark as Paid */}
      {canMarkPaid && (
        <GlassCard className="mt-4 border-emerald-500/20">
          <h2 className="text-sm font-semibold">Mark as Paid</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Record payment and close this invoice.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label htmlFor="paymentMethod" className="sr-only">
              Payment method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={markingPaid}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleMarkPaid}
              disabled={markingPaid}
              className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
            >
              {markingPaid ? "Saving..." : "Mark as Paid"}
            </button>
          </div>
          {markPaidError && (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {markPaidError}
            </p>
          )}
        </GlassCard>
      )}

      {/* Edit Controls */}
      {editing && (
        <GlassCard className="mt-6 border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Editing Invoice</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Edit line items, due date, tax rate, and notes.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={cancelEditing}
                disabled={saving}
                className="rounded-lg border border-white/10 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRevision}
                disabled={saving || editItems.length === 0}
                className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Revisions"}
              </button>
            </div>
          </div>
          {saveError && (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {saveError}
            </p>
          )}
        </GlassCard>
      )}

      {/* Editable Due Date + Tax Rate */}
      {editing && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <GlassCard>
            <label htmlFor="editDueDate" className="text-sm font-semibold">
              Due Date
            </label>
            <input
              id="editDueDate"
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </GlassCard>
          <GlassCard>
            <label htmlFor="editTaxRate" className="text-sm font-semibold">
              Tax Rate (%)
            </label>
            <input
              id="editTaxRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={editTaxRate}
              onChange={(e) => setEditTaxRate(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </GlassCard>
        </div>
      )}

      {/* Line Items */}
      <GlassCard className="mt-6">
        <h2 className="text-sm font-semibold">Line Items</h2>
        <div className="mt-4 overflow-x-auto">
          {editing ? (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs text-muted-foreground">
                    <th scope="col" className="pb-2 pr-2">Description</th>
                    <th scope="col" className="pb-2 pr-2 w-20 text-right">Qty</th>
                    <th scope="col" className="pb-2 pr-2 w-28 text-right">Unit Price ($)</th>
                    <th scope="col" className="pb-2 w-24 text-right">Total</th>
                    <th scope="col" className="pb-2 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {editItems.map((item, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 pr-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(i, "description", e.target.value)
                          }
                          className="w-full rounded border border-white/10 bg-white/5 px-2 py-1 text-sm focus:border-primary focus:outline-none"
                          aria-label={`Item ${i + 1} description`}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(i, "quantity", e.target.value)
                          }
                          className="w-full rounded border border-white/10 bg-white/5 px-2 py-1 text-right text-sm focus:border-primary focus:outline-none"
                          aria-label={`Item ${i + 1} quantity`}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={(item.unitPriceCents / 100).toFixed(2)}
                          onChange={(e) =>
                            updateItem(i, "unitPriceCents", e.target.value)
                          }
                          className="w-full rounded border border-white/10 bg-white/5 px-2 py-1 text-right text-sm focus:border-primary focus:outline-none"
                          aria-label={`Item ${i + 1} unit price`}
                        />
                      </td>
                      <td className="py-2 text-right font-medium">
                        {formatCents(
                          Math.round(item.quantity * item.unitPriceCents)
                        )}
                      </td>
                      <td className="py-2 pl-2">
                        <button
                          onClick={() => removeItem(i)}
                          className="text-red-400 hover:text-red-300"
                          aria-label={`Remove item ${i + 1}`}
                        >
                          &times;
                        </button>
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
                      {formatCents(editSubtotal)}
                    </td>
                    <td />
                  </tr>
                  {editTaxCents > 0 && (
                    <tr>
                      <td colSpan={3} className="pt-1 text-right text-muted-foreground">
                        Tax ({editTaxRate}%)
                      </td>
                      <td className="pt-1 text-right font-medium">
                        {formatCents(editTaxCents)}
                      </td>
                      <td />
                    </tr>
                  )}
                  <tr className="text-lg font-bold">
                    <td colSpan={3} className="pt-2 text-right">Total</td>
                    <td className="pt-2 text-right">{formatCents(editTotal)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
              <button
                onClick={addItem}
                className="mt-3 rounded-lg border border-dashed border-white/20 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-white/40 hover:text-foreground"
              >
                + Add Line Item
              </button>
            </>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs text-muted-foreground">
                  <th scope="col" className="pb-2 pr-4">Description</th>
                  <th scope="col" className="pb-2 pr-4 text-right">Qty</th>
                  <th scope="col" className="pb-2 pr-4 text-right">Unit Price</th>
                  <th scope="col" className="pb-2 text-right">Total</th>
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
          )}
        </div>
      </GlassCard>

      {/* Notes */}
      <GlassCard className="mt-4">
        <h2 className="text-sm font-semibold">Notes</h2>
        {editing ? (
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            rows={3}
            placeholder="Internal notes or payment instructions..."
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        ) : invoice.notes ? (
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
            {invoice.notes}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No notes.</p>
        )}
      </GlassCard>

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
