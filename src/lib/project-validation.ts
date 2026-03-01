import { z } from "zod/v4";

export const createProjectSchema = z.object({
  clientId: z.uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  status: z.enum(["planning", "in_progress", "on_hold", "completed", "cancelled"]).optional(),
  startDate: z.iso.datetime().optional(),
  targetDate: z.iso.datetime().optional(),
  budgetCents: z.number().int().min(0).optional(),
  services: z.array(z.string()).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(["planning", "in_progress", "on_hold", "completed", "cancelled"]).optional(),
  startDate: z.iso.datetime().nullable().optional(),
  targetDate: z.iso.datetime().nullable().optional(),
  completedDate: z.iso.datetime().nullable().optional(),
  budgetCents: z.number().int().min(0).nullable().optional(),
  services: z.array(z.string()).optional(),
  assignedTo: z.uuid().nullable().optional(),
});
