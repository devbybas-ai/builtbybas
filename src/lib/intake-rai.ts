import type { IntakeFormData } from "@/types/intake";
import type { AnalysisFlag } from "@/types/intake-analysis";

/**
 * Keyword groups that indicate potentially unethical project requests.
 * Each group has a category label and an array of patterns.
 * When matched, a rai-concern flag is raised for Bas to review.
 */
const RAI_CONCERN_PATTERNS: { category: string; patterns: RegExp[] }[] = [
  {
    category: "Surveillance / tracking without consent",
    patterns: [
      /\b(spy|spying|stalk|stalking|track\s*(people|users|employees|staff)\s*without)\b/i,
      /\b(hidden\s*tracking|covert\s*monitor|secret(ly)?\s*(monitor|track|record))\b/i,
      /\b(keylog|keystroke\s*log|screen\s*capture\s*without)\b/i,
    ],
  },
  {
    category: "Deceptive practices",
    patterns: [
      /\b(fake\s*(review|testimonial|rating|profile|account)s?)\b/i,
      /\b(impersonat|catfish|phishing|spoof\s*(email|site|website))\b/i,
      /\b(astroturf|shill|sock\s*puppet|fake\s*engagement)\b/i,
      /\b(mislead|deceiv|manipulat)\w*\s*(user|customer|visitor|client)s?\b/i,
    ],
  },
  {
    category: "Discrimination / bias by design",
    patterns: [
      /\b(discriminat|exclude\s*based\s*on\s*(race|gender|age|religion|disability|ethnicity|orientation))\b/i,
      /\b(racial\s*profil|redlin(e|ing)|deny\s*service\s*based\s*on)\b/i,
      /\b(filter\s*out\s*(minorities|women|disabled|elderly))\b/i,
    ],
  },
  {
    category: "Data harvesting / privacy violation",
    patterns: [
      /\b(scrape\s*(personal|user|private)\s*data)\b/i,
      /\b(harvest\s*(email|phone|contact)s?\s*without)\b/i,
      /\b(sell\s*(user|personal|customer)\s*data)\b/i,
      /\b(collect\s*data\s*(without\s*consent|secretly|covertly))\b/i,
      /\b(bypass\s*(gdpr|ccpa|privacy\s*law|consent))\b/i,
    ],
  },
  {
    category: "Dark patterns / manipulative UX",
    patterns: [
      /\b(dark\s*pattern|trick\s*(user|people)\s*into|forced\s*(consent|signup))\b/i,
      /\b(hidden\s*(fee|charge|cost)s?|bait\s*and\s*switch)\b/i,
      /\b(make\s*it\s*(hard|impossible)\s*to\s*(cancel|unsubscribe|opt\s*out))\b/i,
      /\b(roach\s*motel|confirm\s*sham|misdirect)\b/i,
    ],
  },
  {
    category: "Exploitation of vulnerable populations",
    patterns: [
      /\b(target\s*(children|minors|elderly|vulnerable|addicts))\b/i,
      /\b(predatory\s*(lending|pricing|marketing))\b/i,
      /\b(exploit\s*(children|minors|students|elderly|disabled))\b/i,
      /\b(gambling\s*(for|targeting)\s*(kids|minors|children))\b/i,
    ],
  },
  {
    category: "Illegal or harmful content",
    patterns: [
      /\b(deepfake|non.?consensual\s*(image|video|content))\b/i,
      /\b(counterfeit|pirat(e|ed|ing)\s*(content|software|product))\b/i,
      /\b(harassment\s*tool|dox(x)?ing|swat(t)?ing)\b/i,
      /\b(weapon|drug\s*(market|sales|deal)|illegal\s*(market|sales|trade))\b/i,
    ],
  },
  {
    category: "Circumventing laws / regulations",
    patterns: [
      /\b(bypass\s*(regulation|law|compliance|audit))\b/i,
      /\b(money\s*launder|tax\s*evas|fraud\s*scheme)\b/i,
      /\b(circumvent\s*(law|legal|restriction|ban))\b/i,
      /\b(hide\s*(income|revenue|transaction)s?\s*from)\b/i,
    ],
  },
];

/**
 * Extracts all text answers from serviceAnswers for text-based scoring.
 * Includes both string and array values.
 */
function extractServiceText(fd: IntakeFormData): string {
  const parts: string[] = [];
  for (const answers of Object.values(fd.serviceAnswers)) {
    for (const value of Object.values(answers)) {
      if (typeof value === "string" && value.trim().length > 0) {
        parts.push(value);
      } else if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === "string" && item.trim().length > 0) {
            parts.push(item);
          }
        }
      }
    }
  }
  return parts.join(" ");
}

/**
 * Scans all text content from the intake for RAI concerns.
 * Returns flags for any matches found.
 */
export function screenForRaiConcerns(fd: IntakeFormData): AnalysisFlag[] {
  const flags: AnalysisFlag[] = [];

  // Gather all text from the form
  const textParts: string[] = [
    fd.company,
    fd.additionalNotes,
    fd.competitorSites,
    fd.inspirationSites,
    extractServiceText(fd),
  ];
  const fullText = textParts.join(" ");

  if (fullText.trim().length === 0) return flags;

  const matched = new Set<string>();

  for (const group of RAI_CONCERN_PATTERNS) {
    for (const pattern of group.patterns) {
      if (pattern.test(fullText) && !matched.has(group.category)) {
        matched.add(group.category);
        flags.push({
          type: "rai-concern",
          message: `RAI Red Flag: Potential ${group.category.toLowerCase()} detected in submission - requires manual review before proceeding`,
        });
        break;
      }
    }
  }

  return flags;
}
