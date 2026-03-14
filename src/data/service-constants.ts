/**
 * Shared service constants -- single source of truth for duration estimates,
 * industry labels, and common formatting / parsing helpers that were previously
 * duplicated across intake-scoring, proposal-generator, and dashboard-analytics.
 */

// Re-export formatCents from its canonical home in types/invoice so consumers
// that only need service helpers can import everything from one place.
export { formatCents } from "@/types/invoice";

// ---------------------------------------------------------------------------
// SERVICE_DURATION -- estimated delivery time per service data ID
// ---------------------------------------------------------------------------

export const SERVICE_DURATION: Record<string, string> = {
  "landing-pages": "1-2 weeks",
  "marketing-websites": "3-5 weeks",
  "website-redesigns": "3-5 weeks",
  "e-commerce": "6-10 weeks",
  "business-dashboards": "4-8 weeks",
  "client-portals": "4-8 weeks",
  "crm-systems": "6-10 weeks",
  "full-operations-platform": "12-20 weeks",
  "ai-powered-tools": "8-14 weeks",
};

// ---------------------------------------------------------------------------
// INDUSTRY_LABELS -- human-readable labels for intake industry slugs
// ---------------------------------------------------------------------------

export const INDUSTRY_LABELS: Record<string, string> = {
  "professional-services": "Professional Services",
  "home-services": "Home Services",
  healthcare: "Healthcare",
  "retail-ecommerce": "Retail / E-Commerce",
  retail: "Retail / E-Commerce",
  "food-hospitality": "Food & Hospitality",
  "fitness-wellness": "Fitness & Wellness",
  "real-estate": "Real Estate",
  construction: "Construction",
  education: "Education",
  nonprofit: "Nonprofit",
  technology: "Technology",
  "financial-services": "Financial Services",
  legal: "Legal",
  logistics: "Logistics & Transportation",
  automotive: "Automotive",
  other: "Other",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export type ComplexityLabel = "Simple" | "Moderate" | "Complex" | "Enterprise";

/** Map a complexity score (1-10) to a human label. */
export function getComplexityLabel(score: number): ComplexityLabel {
  if (score >= 8) return "Enterprise";
  if (score >= 6) return "Complex";
  if (score >= 4) return "Moderate";
  return "Simple";
}

/**
 * Parse a price-range string like "$3,000 - $8,000" into numeric low/high.
 * Returns `{ low, high }` in whole dollars.
 */
export function parsePriceRange(range: string): { low: number; high: number } {
  const numbers = range.match(/[\d,]+/g);
  if (!numbers || numbers.length < 2) return { low: 0, high: 0 };
  return {
    low: parseInt(numbers[0].replace(/,/g, ""), 10),
    high: parseInt(numbers[1].replace(/,/g, ""), 10),
  };
}
