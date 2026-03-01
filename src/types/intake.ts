export interface IntakeFormData {
  // Step 1: Contact
  name: string;
  email: string;
  phone: string;
  company: string;

  // Step 2: Business
  industry: string;
  businessSize: string;
  website: string;

  // Step 3: Project Type
  projectTypes: string[];

  // Step 4: Project Details
  description: string;
  goals: string;

  // Step 5: Timeline & Budget
  timeline: string;
  budgetRange: string;

  // Step 6: Current State
  hasExistingSite: string;
  currentPainPoints: string;

  // Step 7: Features
  desiredFeatures: string[];

  // Step 8: Design
  designPreference: string;
  hasBrandAssets: string;

  // Step 9: Competitors
  competitors: string;
  inspiration: string;

  // Step 10: Anything Else
  additionalNotes: string;
  howDidYouHear: string;
}

export const STEP_LABELS = [
  "Contact Info",
  "Your Business",
  "Project Type",
  "Project Details",
  "Timeline & Budget",
  "Current State",
  "Features",
  "Design",
  "Inspiration",
  "Anything Else",
] as const;

export const INITIAL_FORM_DATA: IntakeFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  industry: "",
  businessSize: "",
  website: "",
  projectTypes: [],
  description: "",
  goals: "",
  timeline: "",
  budgetRange: "",
  hasExistingSite: "",
  currentPainPoints: "",
  desiredFeatures: [],
  designPreference: "",
  hasBrandAssets: "",
  competitors: "",
  inspiration: "",
  additionalNotes: "",
  howDidYouHear: "",
};
