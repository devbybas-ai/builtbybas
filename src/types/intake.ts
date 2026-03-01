export interface IntakeFormData {
  // Step 1: Service Selection
  selectedServices: string[];

  // Step 2: Contact Info
  name: string;
  email: string;
  phone: string;
  company: string;

  // Step 3: Business Profile
  industry: string;
  businessSize: string;
  website: string;
  yearsInBusiness: string;

  // Dynamic: Service-specific answers (keyed by serviceId)
  serviceAnswers: Record<string, Record<string, string | string[]>>;

  // Timeline & Budget
  timeline: string;
  budgetRange: string;

  // Design & Brand
  designPreference: string;
  hasBrandAssets: string;
  brandColors: string;
  competitorSites: string;
  inspirationSites: string;

  // Final
  additionalNotes: string;
  howDidYouHear: string;
  preferredContact: string;
}

export const INITIAL_FORM_DATA: IntakeFormData = {
  selectedServices: [],
  name: "",
  email: "",
  phone: "",
  company: "",
  industry: "",
  businessSize: "",
  website: "",
  yearsInBusiness: "",
  serviceAnswers: {},
  timeline: "",
  budgetRange: "",
  designPreference: "",
  hasBrandAssets: "",
  brandColors: "",
  competitorSites: "",
  inspirationSites: "",
  additionalNotes: "",
  howDidYouHear: "",
  preferredContact: "",
};

/**
 * Step types for the dynamic intake form.
 * Common steps are fixed. Service-specific steps are inserted
 * between the business profile and timeline/budget steps.
 */
export type StepType =
  | "service-selection"
  | "contact"
  | "business"
  | "service-questions"
  | "timeline-budget"
  | "design-brand"
  | "final";

export interface StepConfig {
  type: StepType;
  label: string;
  serviceId?: string;
}

export function buildSteps(selectedServices: string[]): StepConfig[] {
  const steps: StepConfig[] = [
    { type: "service-selection", label: "Services" },
    { type: "contact", label: "Contact Info" },
    { type: "business", label: "Your Business" },
  ];

  for (const serviceId of selectedServices) {
    const label = SERVICE_LABELS[serviceId] ?? serviceId;
    steps.push({ type: "service-questions", label, serviceId });
  }

  steps.push(
    { type: "timeline-budget", label: "Timeline & Budget" },
    { type: "design-brand", label: "Design & Brand" },
    { type: "final", label: "Final Details" },
  );

  return steps;
}

const SERVICE_LABELS: Record<string, string> = {
  "marketing-website": "Website Details",
  "website-redesign": "Redesign Details",
  "landing-page": "Landing Page Details",
  "business-dashboard": "Dashboard Details",
  "client-portal": "Portal Details",
  ecommerce: "E-Commerce Details",
  "crm-system": "CRM Details",
  "full-platform": "Platform Details",
  "ai-tools": "AI Tool Details",
};
