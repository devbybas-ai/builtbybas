import { z } from "zod";
import { SERVICE_MODULES, type ServiceModule } from "@/data/intake-questions";

// ============================================
// Common Step Schemas
// ============================================

/** Step 1: Service Selection */
export const serviceSelectionSchema = z.object({
  selectedServices: z
    .array(z.string())
    .min(1, "Please select at least one service"),
});

/** Step 2: Contact Info */
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().default(""),
  company: z.string().min(1, "Company name is required"),
});

/** Step 3: Business Profile */
export const businessSchema = z.object({
  industry: z.string().min(1, "Please select your industry"),
  businessSize: z.string().min(1, "Please select your business size"),
  website: z.string().optional().default(""),
  yearsInBusiness: z.string().min(1, "Please select how long you've been in business"),
});

/** Timeline & Budget */
export const timelineBudgetSchema = z.object({
  timeline: z.string().min(1, "Please select a timeline"),
  budgetRange: z.string().min(1, "Please select a budget range"),
});

/** Design & Brand */
export const designBrandSchema = z.object({
  designPreference: z.string().min(1, "Please select a design preference"),
  hasBrandAssets: z.string().min(1, "Please answer this question"),
  brandColors: z.string().optional().default(""),
  competitorSites: z.string().optional().default(""),
  inspirationSites: z.string().optional().default(""),
});

/** Final Details */
export const finalSchema = z.object({
  additionalNotes: z.string().optional().default(""),
  howDidYouHear: z.string().optional().default(""),
  preferredContact: z.string().optional().default(""),
});

// ============================================
// Service-specific validation
// ============================================

/**
 * Build a Zod schema for a specific service module's questions.
 * Required questions get `.min(1)`, optional get `.optional().default("")`.
 */
export function buildServiceSchema(
  module: ServiceModule,
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const q of module.questions) {
    if (q.type === "checkbox") {
      shape[q.id] = q.required
        ? z.array(z.string()).min(1, `Please select at least one option`)
        : z.array(z.string()).optional().default([]);
    } else {
      shape[q.id] = q.required
        ? z.string().min(1, `This field is required`)
        : z.string().optional().default("");
    }
  }

  return z.object(shape);
}

// ============================================
// Full form schema (for API submission)
// ============================================

/**
 * Zod record with a maximum key count.
 * Prevents abuse via unbounded objects.
 */
function boundedRecord<V extends z.ZodTypeAny>(
  valueSchema: V,
  maxKeys: number,
) {
  return z.record(z.string(), valueSchema).refine(
    (obj) => Object.keys(obj).length <= maxKeys,
    { message: `Object must have at most ${maxKeys} keys` },
  );
}

export const fullIntakeSchema = z.object({
  selectedServices: z.array(z.string().max(100)).min(1).max(20),
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional().default(""),
  company: z.string().min(1).max(255),
  industry: z.string().min(1).max(255),
  businessSize: z.string().min(1).max(100),
  website: z.string().max(500).optional().default(""),
  yearsInBusiness: z.string().max(100).optional().default(""),
  serviceAnswers: boundedRecord(
    boundedRecord(z.union([z.string().max(2000), z.array(z.string().max(500)).max(50)]), 50),
    20,
  ),
  timeline: z.string().min(1).max(100),
  budgetRange: z.string().min(1).max(100),
  designPreference: z.string().min(1).max(100),
  hasBrandAssets: z.string().min(1).max(100),
  brandColors: z.string().max(500).optional().default(""),
  competitorSites: z.string().max(1000).optional().default(""),
  inspirationSites: z.string().max(1000).optional().default(""),
  additionalNotes: z.string().max(2000).optional().default(""),
  howDidYouHear: z.string().max(255).optional().default(""),
  preferredContact: z.string().max(100).optional().default(""),
});

// ============================================
// Step validation helper
// ============================================

export type StepValidationResult =
  | { valid: true }
  | { valid: false; errors: Record<string, string> };

export function validateServiceStep(
  serviceId: string,
  answers: Record<string, string | string[]>,
): StepValidationResult {
  const module = SERVICE_MODULES.find((m) => m.serviceId === serviceId);
  if (!module) return { valid: true };

  const schema = buildServiceSchema(module);
  const result = schema.safeParse(answers);

  if (result.success) return { valid: true };

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) {
      errors[key] = issue.message;
    }
  }

  return { valid: false, errors };
}
