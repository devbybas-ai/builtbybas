import { z } from "zod/v4";

const proposalServiceSchema = z.object({
  serviceId: z.string().min(1),
  serviceName: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
  estimatedPriceCents: z.number().int().min(0),
  estimatedTimeline: z.string().min(1).max(100),
});

export const generateProposalSchema = z.object({
  intakeSubmissionId: z.uuid(),
  clientId: z.uuid().optional(),
});

export const createProposalSchema = z.object({
  clientId: z.uuid(),
  intakeSubmissionId: z.uuid().optional(),
  title: z.string().min(1, "Title is required").max(255),
  summary: z.string().min(1, "Summary is required").max(2000),
  content: z.string().min(1, "Content is required").max(100000),
  services: z.array(proposalServiceSchema).optional(),
  estimatedBudgetCents: z.number().int().min(0).optional(),
  timeline: z.string().max(255).optional(),
  validUntil: z.iso.datetime().optional(),
});

export const updateProposalSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  summary: z.string().min(1).max(2000).optional(),
  content: z.string().min(1).max(100000).optional(),
  services: z.array(proposalServiceSchema).optional(),
  estimatedBudgetCents: z.number().int().min(0).nullable().optional(),
  timeline: z.string().max(255).nullable().optional(),
  validUntil: z.iso.datetime().nullable().optional(),
  status: z.enum(["draft", "reviewed", "sent", "accepted", "rejected"]).optional(),
  rejectionReason: z.string().max(2000).nullable().optional(),
});

export const sendProposalSchema = z.object({
  recipientEmail: z.email("Valid email is required"),
  recipientName: z.string().min(1).max(255).optional(),
  customMessage: z.string().max(2000).optional(),
});
