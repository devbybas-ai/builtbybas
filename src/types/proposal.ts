export type ProposalStatus =
  | "draft"
  | "reviewed"
  | "sent"
  | "accepted"
  | "rejected";

export interface ProposalService {
  serviceId: string;
  serviceName: string;
  description: string;
  estimatedPriceCents: number;
  estimatedTimeline: string;
}

export const PROPOSAL_STATUSES: {
  value: ProposalStatus;
  label: string;
  color: string;
}[] = [
  { value: "draft", label: "Draft", color: "bg-amber-500/20 text-amber-400" },
  { value: "reviewed", label: "Reviewed", color: "bg-blue-500/20 text-blue-400" },
  { value: "sent", label: "Sent", color: "bg-cyan-500/20 text-cyan-400" },
  { value: "accepted", label: "Accepted", color: "bg-emerald-500/20 text-emerald-400" },
  { value: "rejected", label: "Rejected", color: "bg-red-500/20 text-red-400" },
];

export function getProposalStatusMeta(status: ProposalStatus) {
  return PROPOSAL_STATUSES.find((s) => s.value === status) ?? PROPOSAL_STATUSES[0];
}
