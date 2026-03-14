export type PipelineStage =
  | "lead"
  | "intake_submitted"
  | "analysis_complete"
  | "fit_assessment"
  | "proposal_draft"
  | "proposal_sent"
  | "proposal_accepted"
  | "contract_signed"
  | "project_planning"
  | "in_progress"
  | "delivered"
  | "completed";

export type ClientStatus = "active" | "archived" | "lost";

export type ClientNoteType =
  | "general"
  | "call"
  | "email"
  | "meeting"
  | "internal";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string;
  industry: string | null;
  website: string | null;
  pipelineStage: PipelineStage;
  stageChangedAt: Date;
  intakeSubmissionId: string | null;
  source: string | null;
  status: ClientStatus;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientWithAssignee extends Client {
  assignedUser: { id: string; name: string } | null;
}

export interface ClientNote {
  id: string;
  clientId: string;
  authorId: string;
  type: ClientNoteType;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientNoteWithAuthor extends ClientNote {
  author: { id: string; name: string };
}

export interface PipelineHistoryEntry {
  id: string;
  clientId: string;
  fromStage: PipelineStage | null;
  toStage: PipelineStage;
  changedBy: string | null;
  note: string | null;
  createdAt: Date;
}

export interface PipelineHistoryWithUser extends PipelineHistoryEntry {
  changedByUser: { id: string; name: string } | null;
}

export interface PipelineStageMeta {
  value: PipelineStage;
  label: string;
  order: number;
}

export const PIPELINE_STAGES: PipelineStageMeta[] = [
  { value: "lead", label: "Lead", order: 1 },
  { value: "intake_submitted", label: "Intake Submitted", order: 2 },
  { value: "analysis_complete", label: "Analysis Complete", order: 3 },
  { value: "fit_assessment", label: "Fit Assessment", order: 4 },
  { value: "proposal_draft", label: "Proposal Draft", order: 5 },
  { value: "proposal_sent", label: "Proposal Sent", order: 6 },
  { value: "proposal_accepted", label: "Proposal Accepted", order: 7 },
  { value: "contract_signed", label: "Contract Signed", order: 8 },
  { value: "project_planning", label: "Project Planning", order: 9 },
  { value: "in_progress", label: "In Progress", order: 10 },
  { value: "delivered", label: "Delivered", order: 11 },
  { value: "completed", label: "Completed", order: 12 },
];

export function getStageMeta(
  stage: PipelineStage
): PipelineStageMeta | undefined {
  return PIPELINE_STAGES.find((s) => s.value === stage);
}

