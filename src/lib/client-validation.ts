import { z } from "zod/v4";

const pipelineStageValues = [
  "lead",
  "intake_submitted",
  "analysis_complete",
  "fit_assessment",
  "proposal_draft",
  "proposal_sent",
  "proposal_accepted",
  "contract_signed",
  "project_planning",
  "in_progress",
  "delivered",
  "completed",
] as const;

const clientStatusValues = ["active", "archived", "lost"] as const;

const noteTypeValues = [
  "general",
  "call",
  "email",
  "meeting",
  "internal",
] as const;

export const createClientSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be under 255 characters"),
  email: z
    .email("Please enter a valid email address"),
  phone: z.string().max(50, "Phone must be under 50 characters").optional(),
  company: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company must be under 255 characters"),
  industry: z
    .string()
    .max(100, "Industry must be under 100 characters")
    .optional(),
  website: z
    .union([
      z.url("Please enter a valid URL"),
      z.literal(""),
    ])
    .optional(),
  pipelineStage: z.enum(pipelineStageValues).optional(),
  source: z.string().max(100, "Source must be under 100 characters").optional(),
  intakeSubmissionId: z
    .string()
    .max(100, "Intake ID must be under 100 characters")
    .optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  email: z.email().optional(),
  phone: z.string().max(50).nullable().optional(),
  company: z.string().min(1).max(255).optional(),
  industry: z.string().max(100).nullable().optional(),
  website: z
    .union([z.url(), z.literal("")])
    .nullable()
    .optional(),
  status: z.enum(clientStatusValues).optional(),
  assignedTo: z.uuid().nullable().optional(),
});

export type UpdateClientInput = z.infer<typeof updateClientSchema>;

export const updatePipelineStageSchema = z.object({
  stage: z.enum(pipelineStageValues),
  note: z
    .string()
    .max(500, "Note must be under 500 characters")
    .optional(),
});

export type UpdatePipelineStageInput = z.infer<
  typeof updatePipelineStageSchema
>;

export const createNoteSchema = z.object({
  type: z.enum(noteTypeValues).optional(),
  content: z
    .string()
    .min(1, "Note content is required")
    .max(5000, "Note must be under 5000 characters"),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const convertIntakeSchema = z.object({
  intakeSubmissionId: z.string().min(1, "Intake submission ID is required"),
});

export type ConvertIntakeInput = z.infer<typeof convertIntakeSchema>;
