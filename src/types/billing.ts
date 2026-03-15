export type MilestoneType = "deposit" | "midpoint" | "final";
export type MilestoneStatus = "pending" | "draft_created" | "sent" | "paid" | "cancelled";

export interface BillingMilestone {
  id: string;
  projectId: string;
  type: MilestoneType;
  percentage: number;
  amountCents: number;
  scheduledDate: Date | null;
  status: MilestoneStatus;
  invoiceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const MILESTONE_STATUS_META: Record<MilestoneStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-gray-500/20 text-gray-400" },
  draft_created: { label: "Draft Created", color: "bg-yellow-500/20 text-yellow-400" },
  sent: { label: "Sent", color: "bg-blue-500/20 text-blue-400" },
  paid: { label: "Paid", color: "bg-emerald-500/20 text-emerald-400" },
  cancelled: { label: "Cancelled", color: "bg-gray-500/20 text-gray-400" },
};

export function getMilestoneStatusMeta(status: MilestoneStatus) {
  return MILESTONE_STATUS_META[status];
}

export function getMilestoneTypeLabel(type: MilestoneType): string {
  return { deposit: "Deposit (50%)", midpoint: "Midpoint (25%)", final: "Final (25%)" }[type];
}
