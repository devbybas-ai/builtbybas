import { services } from "@/data/services";
import type { IntakeFormData } from "@/types/intake";
import type {
  AnalysisFlag,
  AnalysisSummary,
  ClientProfile,
  ComplexityFactor,
  ComplexityScore,
  IntakeAnalysis,
  PathForward,
  PathPhase,
  ScoredDimension,
  ServiceRecommendation,
} from "@/types/intake-analysis";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps intake form service IDs to service data IDs */
const INTAKE_TO_SERVICE_ID: Record<string, string> = {
  "marketing-website": "marketing-websites",
  "website-redesign": "website-redesigns",
  "landing-page": "landing-pages",
  "business-dashboard": "business-dashboards",
  "client-portal": "client-portals",
  ecommerce: "e-commerce",
  "crm-system": "crm-systems",
  "full-platform": "full-operations-platform",
  "ai-tools": "ai-powered-tools",
};

/** Keywords per service for recommendation scoring */
const SERVICE_KEYWORDS: Record<string, string[]> = {
  "marketing-websites": ["seo", "marketing", "leads", "brand", "content", "visibility"],
  "website-redesigns": ["redesign", "rebuild", "update", "modernize", "refresh", "migration"],
  "landing-pages": ["landing", "conversion", "campaign", "launch", "signup"],
  "e-commerce": ["e-commerce", "ecommerce", "shop", "product", "cart", "payment", "store", "sell"],
  "business-dashboards": ["dashboard", "analytics", "report", "metrics", "data", "kpi"],
  "client-portals": ["portal", "client", "login", "account", "self-service"],
  "crm-systems": ["crm", "pipeline", "leads", "sales", "contact", "follow-up", "relationship"],
  "full-operations-platform": ["platform", "operations", "workflow", "automation", "enterprise"],
  "ai-powered-tools": ["ai", "artificial", "machine", "intelligent", "automate", "chatbot"],
};

const INDUSTRY_SERVICE_MAP: Record<string, string[]> = {
  "professional-services": ["marketing-websites", "crm-systems"],
  "home-services": ["marketing-websites", "landing-pages"],
  healthcare: ["client-portals", "marketing-websites"],
  "retail-ecommerce": ["e-commerce"],
  "food-hospitality": ["marketing-websites", "landing-pages"],
  "fitness-wellness": ["marketing-websites", "client-portals"],
  "real-estate": ["marketing-websites", "crm-systems"],
  construction: ["marketing-websites", "landing-pages"],
  education: ["client-portals", "marketing-websites"],
  nonprofit: ["marketing-websites", "landing-pages"],
  technology: ["business-dashboards", "crm-systems", "ai-powered-tools"],
};

const INDUSTRY_LABELS: Record<string, string> = {
  "professional-services": "Professional Services",
  "home-services": "Home Services",
  healthcare: "Healthcare",
  "retail-ecommerce": "Retail / E-Commerce",
  "food-hospitality": "Food & Hospitality",
  "fitness-wellness": "Fitness & Wellness",
  "real-estate": "Real Estate",
  construction: "Construction",
  education: "Education",
  nonprofit: "Nonprofit",
  technology: "Technology",
  other: "Other",
};

const SERVICE_DURATION: Record<string, string> = {
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

const SCOPE_KEYWORDS = [
  "page", "pages", "user", "users", "login", "dashboard", "api", "database",
  "integration", "e-commerce", "payment", "seo", "responsive", "mobile",
  "search", "filter", "upload", "notification", "email", "report", "booking",
  "cart", "checkout", "analytics", "portal", "crm", "inventory",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function parsePriceRange(range: string): [number, number] {
  const numbers = range.match(/[\d,]+/g);
  if (!numbers || numbers.length < 2) return [0, 0];
  return [
    parseInt(numbers[0].replace(/,/g, ""), 10),
    parseInt(numbers[1].replace(/,/g, ""), 10),
  ];
}

export function parseBudgetRange(range: string): [number, number] | null {
  switch (range) {
    case "unsure": return null;
    case "1k-5k": return [1000, 5000];
    case "5k-15k": return [5000, 15000];
    case "15k-30k": return [15000, 30000];
    case "30k+": return [30000, 100000];
    default: return null;
  }
}

function parseDurationWeeks(dur: string): [number, number] {
  const match = dur.match(/(\d+)-(\d+)/);
  if (match) return [parseInt(match[1], 10), parseInt(match[2], 10)];
  return [4, 8];
}

/** Resolves intake service IDs to service data IDs */
function resolveServiceIds(intakeIds: string[]): string[] {
  return intakeIds
    .map((id) => INTAKE_TO_SERVICE_ID[id])
    .filter((id): id is string => id !== undefined);
}

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

/** Counts total service-specific questions answered */
function countServiceAnswers(fd: IntakeFormData): number {
  let count = 0;
  for (const answers of Object.values(fd.serviceAnswers)) {
    for (const value of Object.values(answers)) {
      if (typeof value === "string" && value.trim().length > 0) {
        count++;
      } else if (Array.isArray(value) && value.length > 0) {
        count++;
      }
    }
  }
  return count;
}

export function getScoreLabel(score: number): ScoredDimension["label"] {
  if (score >= 76) return "Very High";
  if (score >= 51) return "High";
  if (score >= 26) return "Medium";
  return "Low";
}

export function getComplexityLabel(score: number): ComplexityScore["label"] {
  if (score >= 8) return "Enterprise";
  if (score >= 6) return "Complex";
  if (score >= 4) return "Moderate";
  return "Simple";
}

export function getFitLabel(score: number): ServiceRecommendation["fitLabel"] {
  if (score >= 75) return "Strong Fit";
  if (score >= 50) return "Good Fit";
  if (score >= 25) return "Partial Fit";
  return "Not Recommended";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function sumPriceRanges(serviceIds: string[]): string {
  let totalMin = 0;
  let totalMax = 0;
  for (const id of serviceIds) {
    const service = services.find((s) => s.id === id);
    if (service) {
      const [sMin, sMax] = parsePriceRange(service.priceRange);
      totalMin += sMin;
      totalMax += sMax;
    }
  }
  return `${formatMoney(totalMin)} - ${formatMoney(totalMax)}`;
}

function sumDurationWeeks(serviceIds: string[]): string {
  let totalMin = 0;
  let totalMax = 0;
  for (const id of serviceIds) {
    const dur = SERVICE_DURATION[id];
    if (dur) {
      const [dMin, dMax] = parseDurationWeeks(dur);
      totalMin += dMin;
      totalMax += dMax;
    }
  }
  if (totalMax <= 8) return `${totalMin}-${totalMax} weeks`;
  const minMonths = Math.ceil(totalMin / 4);
  const maxMonths = Math.ceil(totalMax / 4);
  return `${minMonths}-${maxMonths} months`;
}

// ---------------------------------------------------------------------------
// Client Profile Scoring
// ---------------------------------------------------------------------------

export function scoreBusinessMaturity(fd: IntakeFormData): ScoredDimension {
  const signals: string[] = [];
  let score = 0;

  if (fd.website.trim().length > 0) {
    score += 15;
    signals.push("Has existing web presence (+15)");
  }

  if (fd.hasBrandAssets === "yes-full") {
    score += 20;
    signals.push("Full brand guide (+20)");
  } else if (fd.hasBrandAssets === "yes-partial") {
    score += 10;
    signals.push("Has logo, no full brand guide (+10)");
  }

  if (["6-20", "21-50", "50+"].includes(fd.businessSize)) {
    score += 15;
    signals.push("Established team size (+15)");
  }
  if (["21-50", "50+"].includes(fd.businessSize)) {
    score += 25;
    signals.push("Large organization (+25)");
  }

  if (fd.industry !== "other" && fd.industry.length > 0) {
    score += 10;
    signals.push("Established industry vertical (+10)");
  }

  if (fd.competitorSites.trim().length > 0) {
    score += 15;
    signals.push("Knows competitive landscape (+15)");
  }

  return { score: clamp(score, 0, 100), label: getScoreLabel(score), signals };
}

export function scoreProjectReadiness(fd: IntakeFormData): ScoredDimension {
  const signals: string[] = [];
  let score = 0;

  const answerText = extractServiceText(fd);
  const answerCount = countServiceAnswers(fd);

  if (answerText.length > 200) {
    score += 20;
    signals.push("Detailed service-specific answers (+20)");
  } else if (answerText.length > 50) {
    score += 10;
    signals.push("Some project detail provided (+10)");
  }

  if (answerCount >= 5) {
    score += 15;
    signals.push("Answered many service questions (+15)");
  }

  if (fd.budgetRange !== "unsure") {
    score += 20;
    signals.push("Defined budget range (+20)");
  }

  if (fd.timeline !== "flexible") {
    score += 15;
    signals.push("Defined timeline (+15)");
  }

  if (fd.inspirationSites.trim().length > 0) {
    score += 10;
    signals.push("Provided inspiration references (+10)");
  }

  if (fd.selectedServices.length >= 1) {
    score += 15;
    signals.push("Selected specific services (+15)");
  }

  return { score: clamp(score, 0, 100), label: getScoreLabel(score), signals };
}

export function scoreEngagementLevel(fd: IntakeFormData): ScoredDimension {
  const signals: string[] = [];
  let score = 0;

  if (fd.phone.trim().length > 0) {
    score += 10;
    signals.push("Provided phone number (+10)");
  }

  const answerCount = countServiceAnswers(fd);
  if (answerCount >= 8) {
    score += 20;
    signals.push("Thorough service answers (+20)");
  } else if (answerCount >= 4) {
    score += 10;
    signals.push("Good service answer coverage (+10)");
  }

  if (fd.competitorSites.trim().length > 0) {
    score += 15;
    signals.push("Listed competitors (+15)");
  }

  if (fd.inspirationSites.trim().length > 0) {
    score += 15;
    signals.push("Shared inspiration sites (+15)");
  }

  if (fd.additionalNotes.trim().length > 0) {
    score += 15;
    signals.push("Added additional notes (+15)");
  }

  if (fd.howDidYouHear.length > 0) {
    score += 10;
    signals.push("Shared referral source (+10)");
  }

  if (fd.selectedServices.length >= 2) {
    score += 10;
    signals.push("Selected multiple services (+10)");
  }

  if (fd.brandColors.trim().length > 0) {
    score += 5;
    signals.push("Specified brand colors (+5)");
  }

  return { score: clamp(score, 0, 100), label: getScoreLabel(score), signals };
}

export function scoreScopeClarity(fd: IntakeFormData): ScoredDimension {
  const signals: string[] = [];
  let score = 0;

  if (fd.selectedServices.length >= 1 && fd.selectedServices.length <= 2) {
    score += 25;
    signals.push("Focused project scope — 1-2 services (+25)");
  } else if (fd.selectedServices.length >= 3) {
    score += 15;
    signals.push("Broad but defined scope — 3+ services (+15)");
  }

  const answerText = extractServiceText(fd).toLowerCase();
  const matchedKeywords = SCOPE_KEYWORDS.filter((kw) => answerText.includes(kw));
  if (matchedKeywords.length > 0) {
    score += 20;
    signals.push(`Answers contain specific terms: ${matchedKeywords.slice(0, 3).join(", ")} (+20)`);
  }

  const hasMetrics = /\d/.test(answerText) ||
    /\b(more|increase|decrease|reduce|improve|grow|conversion|traffic|revenue|leads|sales|roi)\b/i.test(answerText);
  if (hasMetrics) {
    score += 20;
    signals.push("Answers reference measurable outcomes (+20)");
  }

  if (fd.designPreference !== "let-us-decide" && fd.designPreference.length > 0) {
    score += 10;
    signals.push("Defined design direction (+10)");
  }

  if (fd.website.trim().length > 0 || fd.yearsInBusiness.length > 0) {
    score += 10;
    signals.push("Current state is clear (+10)");
  }

  return { score: clamp(score, 0, 100), label: getScoreLabel(score), signals };
}

export function scoreBudgetAlignment(fd: IntakeFormData): ScoredDimension {
  const signals: string[] = [];
  const budget = parseBudgetRange(fd.budgetRange);

  if (!budget) {
    return {
      score: 40,
      label: getScoreLabel(40),
      signals: ["Budget not yet defined — consultation recommended"],
    };
  }

  const serviceDataIds = resolveServiceIds(fd.selectedServices);
  let minViableCost = 0;
  for (const serviceId of serviceDataIds) {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      const [sMin] = parsePriceRange(service.priceRange);
      minViableCost += sMin;
    }
  }

  if (minViableCost === 0) {
    return {
      score: 50,
      label: getScoreLabel(50),
      signals: ["Selected services don't map to standard pricing"],
    };
  }

  const [, budgetMax] = budget;
  let score: number;

  if (budgetMax >= minViableCost) {
    score = clamp(80 + Math.round(((budgetMax / minViableCost) - 1) * 20), 80, 100);
    signals.push(`Budget covers estimated minimum (${formatMoney(minViableCost)})`);
  } else if (budgetMax >= minViableCost * 0.5) {
    score = clamp(40 + Math.round((budgetMax / minViableCost) * 40), 40, 79);
    signals.push("Budget partially covers scope — phased approach may work");
  } else {
    score = clamp(Math.round((budgetMax / minViableCost) * 40), 0, 39);
    signals.push(`Budget significantly below scope minimum (${formatMoney(minViableCost)})`);
  }

  return { score, label: getScoreLabel(score), signals };
}

// ---------------------------------------------------------------------------
// Service Recommendations
// ---------------------------------------------------------------------------

export function scoreServiceRecommendations(fd: IntakeFormData): ServiceRecommendation[] {
  const budget = parseBudgetRange(fd.budgetRange);
  const industryServices = INDUSTRY_SERVICE_MAP[fd.industry] ?? [];
  const directServiceIds = resolveServiceIds(fd.selectedServices);
  const answerText = extractServiceText(fd).toLowerCase();

  const recommendations: ServiceRecommendation[] = [];

  for (const service of services) {
    let fitScore = 0;
    const reasons: string[] = [];

    // Direct match (0-40)
    if (directServiceIds.includes(service.id)) {
      fitScore += 40;
      reasons.push("Directly selected service");
    }

    // Keyword alignment from service answers (0-25)
    const keywords = SERVICE_KEYWORDS[service.id] ?? [];
    let keywordHits = 0;
    for (const kw of keywords) {
      if (answerText.includes(kw)) keywordHits++;
    }
    const keywordScore = Math.min(25, keywordHits * 5);
    if (keywordScore > 0) {
      fitScore += keywordScore;
      reasons.push(`${keywordHits} ${keywordHits === 1 ? "capability aligns" : "capabilities align"} with your needs`);
    }

    // Budget fit (0-20)
    if (budget) {
      const [sMin, sMax] = parsePriceRange(service.priceRange);
      const [bMin, bMax] = budget;
      if (bMax >= sMin && bMin <= sMax) {
        fitScore += 20;
        reasons.push("Budget range compatible");
      } else if (bMax >= sMin * 0.5) {
        fitScore += 10;
        reasons.push("Budget partially compatible");
      }
    }

    // Industry alignment (0-5)
    if (industryServices.includes(service.id)) {
      fitScore += 5;
      const industryLabel = INDUSTRY_LABELS[fd.industry] ?? fd.industry;
      reasons.push(`Common for ${industryLabel} businesses`);
    }

    if (fitScore >= 25) {
      recommendations.push({
        serviceId: service.id,
        serviceTitle: service.title,
        fitScore: clamp(fitScore, 0, 100),
        fitLabel: getFitLabel(fitScore),
        reasons,
        estimatedRange: service.priceRange,
        isPrimary: false,
      });
    }
  }

  recommendations.sort((a, b) => b.fitScore - a.fitScore);
  if (recommendations.length > 0) {
    recommendations[0].isPrimary = true;
  }

  return recommendations;
}

// ---------------------------------------------------------------------------
// Complexity Scoring
// ---------------------------------------------------------------------------

export function scoreComplexity(fd: IntakeFormData): ComplexityScore {
  let overall = 1;
  const factors: ComplexityFactor[] = [];

  // Multi-service scope (+1 per additional service, max +3)
  const additionalServices = fd.selectedServices.length - 1;
  if (additionalServices > 0) {
    const impact = Math.min(3, additionalServices);
    overall += impact;
    factors.push({
      name: "Multi-service scope",
      impact: impact >= 2 ? "high" : "medium",
      detail: `${fd.selectedServices.length} services selected`,
    });
  }

  // Service answer volume indicates scope complexity
  const answerCount = countServiceAnswers(fd);
  if (answerCount >= 15) {
    overall += 2;
    factors.push({
      name: "Extensive requirements",
      impact: "high",
      detail: `${answerCount} detailed answers provided`,
    });
  } else if (answerCount >= 8) {
    overall += 1;
    factors.push({
      name: "Multiple requirements",
      impact: "medium",
      detail: `${answerCount} answers provided`,
    });
  }

  // AI requirement
  if (fd.selectedServices.includes("ai-tools")) {
    overall += 2;
    factors.push({
      name: "AI integration",
      impact: "high",
      detail: "AI-powered features require specialized implementation",
    });
  }

  // Greenfield build
  if (fd.website.trim().length === 0 && fd.yearsInBusiness === "pre-launch") {
    overall += 1;
    factors.push({
      name: "Greenfield build",
      impact: "low",
      detail: "New venture starting from scratch",
    });
  }

  // Needs branding
  if (fd.hasBrandAssets === "no") {
    overall += 1;
    factors.push({
      name: "Branding required",
      impact: "low",
      detail: "Brand identity work needed before design phase",
    });
  }

  // Tight timeline with high complexity
  if (fd.timeline === "asap" && overall > 4) {
    overall += 1;
    factors.push({
      name: "Tight timeline",
      impact: "high",
      detail: "ASAP timeline with complex scope increases delivery pressure",
    });
  }

  // Enterprise budget
  if (fd.budgetRange === "30k+") {
    overall += 1;
    factors.push({
      name: "Enterprise-scale investment",
      impact: "medium",
      detail: "Higher investment signals larger scope expectations",
    });
  }

  // Custom integrations detected in answers
  const answerText = extractServiceText(fd).toLowerCase();
  if (/\b(api|integration|third.?party|connect|sync|import|export)\b/.test(answerText)) {
    overall += 1;
    factors.push({
      name: "Custom integrations",
      impact: "medium",
      detail: "Integration requirements add technical complexity",
    });
  }

  overall = clamp(overall, 1, 10);

  return {
    overall,
    label: getComplexityLabel(overall),
    factors,
  };
}

// ---------------------------------------------------------------------------
// Paths Forward
// ---------------------------------------------------------------------------

export function generatePathsForward(
  complexity: ComplexityScore,
  recommendations: ServiceRecommendation[],
): PathForward[] {
  const serviceIds = recommendations.map((r) => r.serviceId);
  if (serviceIds.length === 0) return [];

  const primary = recommendations[0];
  const secondary = serviceIds.filter((id) => id !== primary.serviceId);

  if (complexity.overall <= 3) {
    return [buildDirectPath(primary, serviceIds)];
  }

  if (complexity.overall <= 5) {
    return [
      buildComprehensivePath(serviceIds),
      buildPhasedPath(primary, secondary),
    ];
  }

  return [
    buildFullPlatformPath(serviceIds),
    buildStrategicPhasesPath(serviceIds),
    buildQuickWinPath(primary, secondary),
  ];
}

function buildDirectPath(
  primary: ServiceRecommendation,
  allIds: string[],
): PathForward {
  return {
    name: "Direct Build",
    description: "Single-phase delivery focused on your primary need",
    phases: [{
      order: 1,
      title: primary.serviceTitle,
      services: allIds,
      duration: sumDurationWeeks(allIds),
      description: `Build and launch your ${primary.serviceTitle.toLowerCase()}`,
    }],
    estimatedTimeline: sumDurationWeeks(allIds),
    estimatedInvestment: sumPriceRanges(allIds),
    recommended: true,
  };
}

function buildComprehensivePath(serviceIds: string[]): PathForward {
  return {
    name: "Comprehensive Build",
    description: "All recommended services built in one engagement",
    phases: [{
      order: 1,
      title: "Full Build",
      services: serviceIds,
      duration: sumDurationWeeks(serviceIds),
      description: "Complete build of all recommended services in parallel",
    }],
    estimatedTimeline: sumDurationWeeks(serviceIds),
    estimatedInvestment: sumPriceRanges(serviceIds),
    recommended: true,
  };
}

function buildPhasedPath(
  primary: ServiceRecommendation,
  secondary: string[],
): PathForward {
  const phases: PathPhase[] = [
    {
      order: 1,
      title: `Phase 1: ${primary.serviceTitle}`,
      services: [primary.serviceId],
      duration: SERVICE_DURATION[primary.serviceId] ?? "4-8 weeks",
      description: `Launch your ${primary.serviceTitle.toLowerCase()} first`,
    },
  ];

  if (secondary.length > 0) {
    const secondaryTitles = secondary.map((id) => {
      const svc = services.find((s) => s.id === id);
      return svc?.title ?? id;
    });
    phases.push({
      order: 2,
      title: `Phase 2: ${secondaryTitles.join(" + ")}`,
      services: secondary,
      duration: sumDurationWeeks(secondary),
      description: "Build remaining services on top of the foundation",
    });
  }

  return {
    name: "Phased Approach",
    description: "Primary service first, then expand with additional services",
    phases,
    estimatedTimeline: sumDurationWeeks([primary.serviceId, ...secondary]),
    estimatedInvestment: sumPriceRanges([primary.serviceId, ...secondary]),
    recommended: false,
  };
}

function buildFullPlatformPath(serviceIds: string[]): PathForward {
  return {
    name: "Full Platform Build",
    description: "Everything built at once for maximum integration",
    phases: [{
      order: 1,
      title: "Complete Platform",
      services: serviceIds,
      duration: sumDurationWeeks(serviceIds),
      description: "Unified build of all services for seamless integration",
    }],
    estimatedTimeline: sumDurationWeeks(serviceIds),
    estimatedInvestment: sumPriceRanges(serviceIds),
    recommended: false,
  };
}

function buildStrategicPhasesPath(serviceIds: string[]): PathForward {
  const webIds = serviceIds.filter((id) => {
    const svc = services.find((s) => s.id === id);
    return svc?.category === "web";
  });
  const softwareIds = serviceIds.filter((id) => {
    const svc = services.find((s) => s.id === id);
    return svc?.category === "software";
  });
  const aiIds = serviceIds.filter((id) => {
    const svc = services.find((s) => s.id === id);
    return svc?.category === "ai";
  });

  const phases: PathPhase[] = [];
  let order = 1;

  const phase1Ids = webIds.length > 0 ? webIds : serviceIds.slice(0, 1);
  phases.push({
    order: order++,
    title: "Phase 1: Web Presence",
    services: phase1Ids,
    duration: sumDurationWeeks(phase1Ids),
    description: "Establish your online presence and start generating leads",
  });

  const phase2Ids = softwareIds.length > 0 ? softwareIds : serviceIds.slice(1, 3);
  if (phase2Ids.length > 0) {
    phases.push({
      order: order++,
      title: "Phase 2: Business Tools",
      services: phase2Ids,
      duration: sumDurationWeeks(phase2Ids),
      description: "Build operational tools to manage your growing business",
    });
  }

  if (aiIds.length > 0) {
    phases.push({
      order: order++,
      title: "Phase 3: AI Integration",
      services: aiIds,
      duration: sumDurationWeeks(aiIds),
      description: "Add AI-powered capabilities for competitive advantage",
    });
  }

  return {
    name: "Strategic Phases",
    description: "Phased delivery — each phase delivers usable value",
    phases,
    estimatedTimeline: sumDurationWeeks(serviceIds),
    estimatedInvestment: sumPriceRanges(serviceIds),
    recommended: true,
  };
}

function buildQuickWinPath(
  primary: ServiceRecommendation,
  secondary: string[],
): PathForward {
  const phases: PathPhase[] = [{
    order: 1,
    title: `Quick Win: ${primary.serviceTitle}`,
    services: [primary.serviceId],
    duration: SERVICE_DURATION[primary.serviceId] ?? "4-8 weeks",
    description: "Get the most impactful service live fast",
  }];

  if (secondary.length > 0) {
    phases.push({
      order: 2,
      title: "Scale Up",
      services: secondary,
      duration: sumDurationWeeks(secondary),
      description: "Iterate and expand with additional services",
    });
  }

  return {
    name: "Quick Win + Scale",
    description: "Launch the highest-impact service first, then build iteratively",
    phases,
    estimatedTimeline: sumDurationWeeks([primary.serviceId, ...secondary]),
    estimatedInvestment: sumPriceRanges([primary.serviceId, ...secondary]),
    recommended: false,
  };
}

// ---------------------------------------------------------------------------
// RAI Screening — Responsible AI red flags
// ---------------------------------------------------------------------------

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
 * Scans all text content from the intake for RAI concerns.
 * Returns flags for any matches found.
 */
function screenForRaiConcerns(fd: IntakeFormData): AnalysisFlag[] {
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
          message: `RAI Red Flag: Potential ${group.category.toLowerCase()} detected in submission — requires manual review before proceeding`,
        });
        break;
      }
    }
  }

  return flags;
}

// ---------------------------------------------------------------------------
// Flags
// ---------------------------------------------------------------------------

export function generateFlags(
  fd: IntakeFormData,
  complexity: ComplexityScore,
  profile: ClientProfile,
): AnalysisFlag[] {
  // RAI screening runs first — ethical concerns take priority
  const flags: AnalysisFlag[] = screenForRaiConcerns(fd);

  if (profile.budgetAlignment.score < 30) {
    flags.push({
      type: "warning",
      message: "Budget may be below minimum for requested scope — discuss phasing options",
    });
  }

  if (fd.timeline === "asap" && complexity.overall >= 6) {
    flags.push({
      type: "warning",
      message: "ASAP timeline with complex scope — set realistic expectations early",
    });
  }

  if (fd.budgetRange === "unsure") {
    flags.push({
      type: "warning",
      message: "Budget undefined — lead with consultation call to scope and price",
    });
  }

  if (profile.engagementLevel.score >= 70) {
    flags.push({
      type: "opportunity",
      message: "High engagement score — likely a serious, motivated lead",
    });
  }

  if (fd.selectedServices.length >= 3) {
    flags.push({
      type: "opportunity",
      message: "Multiple services selected — potential for long-term relationship",
    });
  }

  if (fd.website.trim().length > 0) {
    flags.push({
      type: "info",
      message: "Has existing site — consider migration and redirect strategy",
    });
  }

  if (fd.hasBrandAssets === "no") {
    flags.push({
      type: "info",
      message: "No brand assets — branding work needed before design phase",
    });
  }

  return flags;
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

export function generateSummary(
  fd: IntakeFormData,
  complexity: ComplexityScore,
  recommendations: ServiceRecommendation[],
): AnalysisSummary {
  const serviceDataIds = resolveServiceIds(fd.selectedServices);
  const serviceTitles = serviceDataIds.map((id) => {
    const svc = services.find((s) => s.id === id);
    return svc?.title ?? id;
  });

  const projectType = serviceTitles.length <= 2
    ? serviceTitles.join(" + ")
    : `${serviceTitles.slice(0, 2).join(" + ")} (+${serviceTitles.length - 2} more)`;

  const sizeLabel = fd.businessSize === "just-me"
    ? "solo founder"
    : `${fd.businessSize} team`;
  const industryLabel = INDUSTRY_LABELS[fd.industry] ?? fd.industry;
  const clientType = fd.industry !== "other" && fd.industry.length > 0
    ? `${industryLabel}, ${sizeLabel}`
    : sizeLabel;

  const headline = `${complexity.label}-complexity ${projectType.toLowerCase()} for ${
    fd.industry !== "other" && fd.industry.length > 0
      ? `a ${industryLabel.toLowerCase()} business`
      : "a new venture"
  }`;

  const recIds = recommendations.map((r) => r.serviceId);

  return {
    projectType,
    clientType,
    headline,
    estimatedTotalInvestment: sumPriceRanges(recIds),
    estimatedTotalTimeline: sumDurationWeeks(recIds),
  };
}

// ---------------------------------------------------------------------------
// Main Entry Point
// ---------------------------------------------------------------------------

export function analyzeIntake(
  formData: IntakeFormData,
  options?: { id?: string; submittedAt?: string },
): IntakeAnalysis {
  const clientProfile: ClientProfile = {
    businessMaturity: scoreBusinessMaturity(formData),
    projectReadiness: scoreProjectReadiness(formData),
    engagementLevel: scoreEngagementLevel(formData),
    scopeClarity: scoreScopeClarity(formData),
    budgetAlignment: scoreBudgetAlignment(formData),
  };

  const serviceRecommendations = scoreServiceRecommendations(formData);
  const complexityScore = scoreComplexity(formData);
  const pathsForward = generatePathsForward(complexityScore, serviceRecommendations);
  const flags = generateFlags(formData, complexityScore, clientProfile);
  const summary = generateSummary(formData, complexityScore, serviceRecommendations);

  return {
    id: options?.id ?? crypto.randomUUID(),
    submittedAt: options?.submittedAt ?? new Date().toISOString(),
    formData,
    clientProfile,
    serviceRecommendations,
    complexityScore,
    pathsForward,
    flags,
    summary,
  };
}
