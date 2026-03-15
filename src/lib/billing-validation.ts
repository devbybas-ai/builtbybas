import { z } from "zod/v4";

export const updateMilestoneSchema = z.object({
  scheduledDate: z.iso.datetime().optional(),
  status: z.enum(["pending", "draft_created", "sent", "paid", "cancelled"]).optional(),
});
