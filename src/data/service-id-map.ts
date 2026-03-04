/**
 * Bidirectional mapping between service data IDs (used in services.ts / walkthrough)
 * and intake IDs (used in intake-questions.ts / intake form).
 */

const serviceToIntake: Record<string, string> = {
  "marketing-websites": "marketing-website",
  "website-redesigns": "website-redesign",
  "landing-pages": "landing-page",
  "business-dashboards": "business-dashboard",
  "client-portals": "client-portal",
  "e-commerce": "ecommerce",
  "crm-systems": "crm-system",
  "full-operations-platform": "full-platform",
  "ai-powered-tools": "ai-tools",
};

const intakeToService: Record<string, string> = Object.fromEntries(
  Object.entries(serviceToIntake).map(([k, v]) => [v, k]),
);

export function toIntakeId(serviceDataId: string): string | undefined {
  return serviceToIntake[serviceDataId];
}

export function toServiceDataId(intakeId: string): string | undefined {
  return intakeToService[intakeId];
}
