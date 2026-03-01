export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled";

export const PROJECT_STATUSES: {
  value: ProjectStatus;
  label: string;
  color: string;
}[] = [
  { value: "planning", label: "Planning", color: "bg-blue-500/20 text-blue-400" },
  { value: "in_progress", label: "In Progress", color: "bg-cyan-500/20 text-cyan-400" },
  { value: "on_hold", label: "On Hold", color: "bg-amber-500/20 text-amber-400" },
  { value: "completed", label: "Completed", color: "bg-emerald-500/20 text-emerald-400" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500/20 text-red-400" },
];

export function getProjectStatusMeta(status: ProjectStatus) {
  return PROJECT_STATUSES.find((s) => s.value === status) ?? PROJECT_STATUSES[0];
}
