import { z } from "zod";

// Step 1: Contact
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().default(""),
  company: z.string().min(1, "Company name is required"),
});

// Step 2: Business
export const businessSchema = z.object({
  industry: z.string().min(1, "Please select your industry"),
  businessSize: z.string().min(1, "Please select your business size"),
  website: z.string().optional().default(""),
});

// Step 3: Project Type
export const projectTypeSchema = z.object({
  projectTypes: z
    .array(z.string())
    .min(1, "Please select at least one project type"),
});

// Step 4: Project Details
export const projectDetailsSchema = z.object({
  description: z
    .string()
    .min(20, "Please describe your project in at least 20 characters"),
  goals: z.string().min(10, "Please share your goals"),
});

// Step 5: Timeline & Budget
export const timelineBudgetSchema = z.object({
  timeline: z.string().min(1, "Please select a timeline"),
  budgetRange: z.string().min(1, "Please select a budget range"),
});

// Step 6: Current State
export const currentStateSchema = z.object({
  hasExistingSite: z.string().min(1, "Please answer this question"),
  currentPainPoints: z.string().optional().default(""),
});

// Step 7: Features
export const featuresSchema = z.object({
  desiredFeatures: z.array(z.string()).optional().default([]),
});

// Step 8: Design
export const designSchema = z.object({
  designPreference: z.string().min(1, "Please select a design preference"),
  hasBrandAssets: z.string().min(1, "Please answer this question"),
});

// Step 9: Inspiration
export const inspirationSchema = z.object({
  competitors: z.string().optional().default(""),
  inspiration: z.string().optional().default(""),
});

// Step 10: Anything Else
export const anythingElseSchema = z.object({
  additionalNotes: z.string().optional().default(""),
  howDidYouHear: z.string().optional().default(""),
});

export const stepSchemas = [
  contactSchema,
  businessSchema,
  projectTypeSchema,
  projectDetailsSchema,
  timelineBudgetSchema,
  currentStateSchema,
  featuresSchema,
  designSchema,
  inspirationSchema,
  anythingElseSchema,
] as const;

export const fullIntakeSchema = z.object({
  ...contactSchema.shape,
  ...businessSchema.shape,
  ...projectTypeSchema.shape,
  ...projectDetailsSchema.shape,
  ...timelineBudgetSchema.shape,
  ...currentStateSchema.shape,
  ...featuresSchema.shape,
  ...designSchema.shape,
  ...inspirationSchema.shape,
  ...anythingElseSchema.shape,
});

export type StepSchema = (typeof stepSchemas)[number];
