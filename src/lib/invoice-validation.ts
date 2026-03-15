import { z } from "zod/v4";

const invoiceItemSchema = z.object({
  description: z.string().min(1).max(500),
  quantity: z.number().min(0.01),
  unitPriceCents: z.number().int().min(0),
});

export const createInvoiceSchema = z.object({
  clientId: z.uuid(),
  projectId: z.uuid().optional(),
  dueDate: z.iso.datetime(),
  taxRate: z.number().min(0).max(1).optional(),
  notes: z.string().max(5000).optional(),
  items: z.array(invoiceItemSchema).min(1),
});

export const updateInvoiceSchema = z.object({
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
  dueDate: z.iso.datetime().optional(),
  taxRate: z.number().min(0).max(1).optional(),
  notes: z.string().max(5000).nullable().optional(),
  items: z.array(invoiceItemSchema).min(1).optional(),
  paymentMethod: z
    .enum(["zelle", "check", "bank_transfer", "other"])
    .optional(),
});
