"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/shared/GlassCard";

interface InvoiceFormProps {
  clients: { id: string; label: string }[];
  projects: { id: string; label: string; clientId: string }[];
}

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export function InvoiceForm({ clients, projects }: InvoiceFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const filteredProjects = projects.filter((p) => p.clientId === clientId);

  function addItem() {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    const updated = [...items];
    if (field === "description") {
      updated[index] = { ...updated[index], description: value as string };
    } else {
      updated[index] = { ...updated[index], [field]: Number(value) };
    }
    setItems(updated);
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const taxRateStr = form.get("taxRate") as string;
    const taxRate = taxRateStr ? parseFloat(taxRateStr) / 100 : 0;

    const body = {
      clientId,
      projectId: (form.get("projectId") as string) || undefined,
      dueDate: new Date(form.get("dueDate") as string).toISOString(),
      taxRate,
      notes: (form.get("notes") as string) || undefined,
      items: items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPriceCents: Math.round(item.unitPrice * 100),
      })),
    };

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/admin/invoices/${data.data.id}`);
      } else {
        setError(data.error || "Failed to create invoice");
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium">
              Client
            </label>
            <select
              id="clientId"
              name="clientId"
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium">
              Project (optional)
            </label>
            <select
              id="projectId"
              name="projectId"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">No project</option>
              {filteredProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium">
              Due Date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="taxRate" className="block text-sm font-medium">
              Tax Rate (%)
            </label>
            <input
              id="taxRate"
              name="taxRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              defaultValue="0"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Line Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="text-xs text-primary hover:underline"
            >
              + Add Item
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="grid gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 sm:grid-cols-[1fr_80px_120px_32px]"
              >
                <input
                  type="text"
                  placeholder="Description"
                  required
                  value={item.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  min="0.01"
                  step="0.01"
                  required
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Unit $"
                  min="0"
                  step="0.01"
                  required
                  value={item.unitPrice || ""}
                  onChange={(e) => updateItem(i, "unitPrice", e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  disabled={items.length <= 1}
                  className="rounded-lg border border-white/10 px-2 py-2 text-xs text-muted-foreground hover:text-red-400 disabled:opacity-30"
                  aria-label="Remove item"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 text-right text-sm">
            Subtotal:{" "}
            <span className="font-semibold">
              ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            placeholder="Payment terms, thank you message, etc."
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Invoice"}
        </button>
      </form>
    </GlassCard>
  );
}
