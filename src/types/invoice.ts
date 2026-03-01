export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled";

export const INVOICE_STATUSES: {
  value: InvoiceStatus;
  label: string;
  color: string;
}[] = [
  { value: "draft", label: "Draft", color: "bg-gray-500/20 text-gray-400" },
  { value: "sent", label: "Sent", color: "bg-blue-500/20 text-blue-400" },
  { value: "paid", label: "Paid", color: "bg-emerald-500/20 text-emerald-400" },
  { value: "overdue", label: "Overdue", color: "bg-red-500/20 text-red-400" },
  { value: "cancelled", label: "Cancelled", color: "bg-gray-500/20 text-gray-400" },
];

export function getInvoiceStatusMeta(status: InvoiceStatus) {
  return INVOICE_STATUSES.find((s) => s.value === status) ?? INVOICE_STATUSES[0];
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
