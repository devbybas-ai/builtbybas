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

const PROJECT_TYPE_TO_SERVICE: Record<string, string> = {
  "Marketing Website": "marketing-websites",
  "Website Redesign": "website-redesigns",
  "Landing Page": "landing-pages",
  "E-Commerce Store": "e-commerce",
  "Business Dashboard": "business-dashboards",
  "Client Portal": "client-portals",
  "CRM System": "crm-systems",
  "Full Operations Platform": "full-operations-platform",
  "AI-Powered Tools": "ai-powered-tools",
};

const FEATURE_SERVICE_MAP: Record<string, string[]> = {
  "Contact / Lead Capture Forms": ["marketing-websites", "landing-pages"],
  "Online Booking / Scheduling": ["marketing-websites", "client-portals"],
  "E-Commerce / Payments": ["e-commerce"],
  "Client Portal / Dashboard": ["client-portals", "business-dashboards"],
  "Content Management (CMS)": ["marketing-websites", "website-redesigns"],
  "Email Marketing Integration": ["marketing-websites", "crm-systems"],
  "Analytics & Reporting": ["business-dashboards", "crm-systems"],
  "AI-Powered Features": ["ai-powered-tools"],
  "SEO Optimization": ["marketing-websites", "website-redesigns", "landing-pages"],
  "Social Media Integration": ["marketing-websites"],
  "Mobile App": ["full-operations-platform"],
  "Custom Integrations / API": ["business-dashboards", "crm-systems", "full-operations-platform"],
};

const INDUSTRY_SERVICE_MAP: Record<string, string[]> = {
  "Professional Services": ["marketing-websites", "crm-systems"],
  "Home Services": ["marketing-websites", "landing-pages"],
  "Healthcare": ["client-portals", "marketing-websites"],
  "Retail / E-Commerce": ["e-commerce"],
  "Food & Hospitality": ["marketing-websites", "landing-pages"],
  "Fitness & Wellness": ["marketing-websites", "client-portals"],
  "Real Estate": ["marketing-websites", "crm-systems"],
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
  if (range === "Not sure yet") return null;
  if (range === "$30,000+") return [30000, 100000];
  return parsePriceRange(range);
}

function parseDurationWeeks(dur: string): [number, number] {
  const match = dur.match(/(\d+)-(\d+)/);
  if (match) return [parseInt(match[1], 10), parseInt(match[2], 10)];
  return [4, 8];
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

  const hasWebsite =
    fd.hasExistingSite.startsWith("Yes") ||
    fd.hasExistingSite === "I have a basic template/builder site";
  if (hasWebsite) {
    score += 15;
    signals.push("Has existing web presence (+15)");
  }

  if (fd.hasBrandAssets === "Yes — logo, colors, brand guide") {
    score += 20;
    signals.push("Full brand guide (+20)");
  } else if (fd.hasBrandAssets === "Partial — logo only") {
    score += 10;
    signals.push("Has logo, no full brand guide (+10)");
  }

  if (["6-20 people", "21-50 people", "50+ people"].includes(fd.businessSize)) {
    score += 15;
    signals.push("Established team size (+15)");
  }
  if (["21-50 people", "50+ people"].includes(fd.businessSize)) {
    score += 25;
    signals.push("Large organization (+25)");
  }

  if (fd.industry !== "Other") {
    score += 10;
    signals.push("Established industry vertical (+10)");
  }

  if (fd.competitors.trim().length > 0) {
    score += 15;
    signals.push("Knows competitive landscape (+15)");
  }

  return { score: clamp(score, 0, 100), label: getScoreLabel(score), signals };
}

export function scoreProjectReadiness(fd: IntakeFormData): ScoredDimension {
  const signals: string[] = [];
  let score = 0;

  if (fd.description.length > 100) {
    score += 20;
    signals.push("Detailed project description (+20)");
  }

  if (fd.goals.length > 50) {
    score += 20;
    signals.push("Well-defined goals (+20)");
  }

  if (fd.budgetRange !== "Not sure yet") {
    score += 20;
    signals.push("Defined budget range (+20)");
  }

  if (fd.timeline !== "Flexible — quality over speed") {
    score += 15;
    signals.push("Defined timeline (+15)");
  }

  if (fd.inspiration.trim().length > 0) {
    score += 10;
    signals.push("Provided inspiration references (+10)");
  }

  if (fd.desiredFeatures.length > 0) {
    score += 15;
    signals.push("Selected specific features (+15)");
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

  if (fd.currentPainPoints.trim().length > 0) {
    score += 15;
    signals.push("Shared current pain points (+15)");
  }

  if (fd.competitors.trim().length > 0) {
    score += 15;
    signals.push("Listed competitors (+15)");
  }

  if (fd.inspiration.trim().length > 0) {
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

  if (fd.desiredFeatures.length >= 3) {
    score += 10;
    signals.push("Selected 3+ features (+10)");
  }
  if (fd.desiredFeatures.length >= 6) {
    score += 10;
    signals.push("Selected 6+ features (+10)");
  }

  return { score: clamp(score, 0, 100), label: getScoreLabel(score), signals };
}

export function scoreScopeClarity(fd: IntakeFormData): ScoredDimension {
  const signals: string[] = [];
  let score = 0;

  if (fd.projectTypes.length >= 1 && fd.projectTypes.length <= 2) {
    score += 25;
    signals.push("Focused project scope — 1-2 types (+25)");
  } else if (fd.projectTypes.length >= 3) {
    score += 15;
    signals.push("Broad but defined scope — 3+ types (+15)");
  }

  const descLower = fd.description.toLowerCase();
  const matchedKeywords = SCOPE_KEYWORDS.filter((kw) => descLower.includes(kw));
  if (matchedKeywords.length > 0) {
    score += 20;
    signals.push(`Description contains specific terms: ${matchedKeywords.slice(0, 3).join(", ")} (+20)`);
  }

  const hasMetrics = /\d/.test(fd.goals) ||
    /\b(more|increase|decrease|reduce|improve|grow|conversion|traffic|revenue|leads|sales|roi)\b/i.test(fd.goals);
  if (hasMetrics) {
    score += 20;
    signals.push("Goals reference measurable outcomes (+20)");
  }

  if (fd.designPreference !== "Let BuiltByBas decide") {
    score += 10;
    signals.push("Defined design direction (+10)");
  }

  if (fd.hasExistingSite.length > 0) {
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

  let minViableCost = 0;
  for (const pt of fd.projectTypes) {
    const serviceId = PROJECT_TYPE_TO_SERVICE[pt];
    if (serviceId) {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        const [sMin] = parsePriceRange(service.priceRange);
        minViableCost += sMin;
      }
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

  const recommendations: ServiceRecommendation[] = [];

  for (const service of services) {
    let fitScore = 0;
    const reasons: string[] = [];

    // Direct match (0-40)
    const directMatch = fd.projectTypes.some(
      (pt) => PROJECT_TYPE_TO_SERVICE[pt] === service.id,
    );
    if (directMatch) {
      fitScore += 40;
      reasons.push("Directly requested project type");
    }

    // Feature alignment (0-25)
    let featureHits = 0;
    for (const feature of fd.desiredFeatures) {
      const mappedServices = FEATURE_SERVICE_MAP[feature];
      if (mappedServices?.includes(service.id)) featureHits++;
    }
    const featureScore = Math.min(25, featureHits * 5);
    if (featureScore > 0) {
      fitScore += featureScore;
      reasons.push(`${featureHits} desired feature(s) align with this service`);
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

    // Context signals (0-15)
    if (industryServices.includes(service.id)) {
      fitScore += 5;
      reasons.push(`Common for ${fd.industry} businesses`);
    }

    const painLower = fd.currentPainPoints.toLowerCase();
    const goalsLower = fd.goals.toLowerCase();
    const serviceKeywords = service.features.map((f) => f.toLowerCase().split(" ")[0]);
    const painMatch = serviceKeywords.some((kw) => painLower.includes(kw));
    const goalMatch = serviceKeywords.some((kw) => goalsLower.includes(kw));
    if (painMatch) {
      fitScore += 5;
      reasons.push("Pain points align with service capabilities");
    }
    if (goalMatch) {
      fitScore += 5;
      reasons.push("Goals align with service outcomes");
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

  // Multi-service scope (+1 per additional type, max +3)
  const additionalTypes = fd.projectTypes.length - 1;
  if (additionalTypes > 0) {
    const impact = Math.min(3, additionalTypes);
    overall += impact;
    factors.push({
      name: "Multi-service scope",
      impact: impact >= 2 ? "high" : "medium",
      detail: `${fd.projectTypes.length} project types selected`,
    });
  }

  // Feature count
  if (fd.desiredFeatures.length >= 7) {
    overall += 2;
    factors.push({
      name: "Extensive feature set",
      impact: "high",
      detail: `${fd.desiredFeatures.length} features requested`,
    });
  } else if (fd.desiredFeatures.length >= 4) {
    overall += 1;
    factors.push({
      name: "Multiple features",
      impact: "medium",
      detail: `${fd.desiredFeatures.length} features requested`,
    });
  }

  // AI requirement
  const hasAI =
    fd.projectTypes.includes("AI-Powered Tools") ||
    fd.desiredFeatures.includes("AI-Powered Features");
  if (hasAI) {
    overall += 2;
    factors.push({
      name: "AI integration",
      impact: "high",
      detail: "AI-powered features require specialized implementation",
    });
  }

  // No existing site
  if (fd.hasExistingSite === "No — starting from scratch") {
    overall += 1;
    factors.push({
      name: "Greenfield build",
      impact: "low",
      detail: "No existing site to build upon",
    });
  }

  // Needs branding
  if (fd.hasBrandAssets === "No — I need branding too") {
    overall += 1;
    factors.push({
      name: "Branding required",
      impact: "low",
      detail: "Brand identity work needed before design phase",
    });
  }

  // Tight timeline with high complexity
  if (fd.timeline.startsWith("ASAP") && overall > 4) {
    overall += 1;
    factors.push({
      name: "Tight timeline",
      impact: "high",
      detail: "ASAP timeline with complex scope increases delivery pressure",
    });
  }

  // Enterprise budget
  if (fd.budgetRange === "$30,000+") {
    overall += 1;
    factors.push({
      name: "Enterprise-scale investment",
      impact: "medium",
      detail: "Higher investment signals larger scope expectations",
    });
  }

  // Custom integrations
  if (fd.desiredFeatures.includes("Custom Integrations / API")) {
    overall += 1;
    factors.push({
      name: "Custom integrations",
      impact: "medium",
      detail: "API and integration work adds technical complexity",
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
// Flags
// ---------------------------------------------------------------------------

export function generateFlags(
  fd: IntakeFormData,
  complexity: ComplexityScore,
  profile: ClientProfile,
): AnalysisFlag[] {
  const flags: AnalysisFlag[] = [];

  if (profile.budgetAlignment.score < 30) {
    flags.push({
      type: "warning",
      message: "Budget may be below minimum for requested scope — discuss phasing options",
    });
  }

  if (fd.timeline.startsWith("ASAP") && complexity.overall >= 6) {
    flags.push({
      type: "warning",
      message: "ASAP timeline with complex scope — set realistic expectations early",
    });
  }

  if (fd.budgetRange === "Not sure yet") {
    flags.push({
      type: "warning",
      message: "Budget undefined — lead with consultation call to scope and price",
    });
  }

  if (fd.projectTypes.includes("Marketing Strategy")) {
    flags.push({
      type: "opportunity",
      message: "Marketing Strategy requested — position full-stack dev + marketing value",
    });
  }

  if (profile.engagementLevel.score >= 70) {
    flags.push({
      type: "opportunity",
      message: "High engagement score — likely a serious, motivated lead",
    });
  }

  if (fd.projectTypes.length >= 3) {
    flags.push({
      type: "opportunity",
      message: "Multiple project types — potential for long-term relationship",
    });
  }

  if (fd.hasExistingSite.startsWith("Yes")) {
    flags.push({
      type: "info",
      message: "Has existing site — consider migration and redirect strategy",
    });
  }

  if (fd.hasBrandAssets === "No — I need branding too") {
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
  const projectType = fd.projectTypes.length <= 2
    ? fd.projectTypes.join(" + ")
    : `${fd.projectTypes.slice(0, 2).join(" + ")} (+${fd.projectTypes.length - 2} more)`;

  const sizeLabel = fd.businessSize === "Just me"
    ? "solo founder"
    : `${fd.businessSize} team`;
  const clientType = fd.industry !== "Other"
    ? `${fd.industry}, ${sizeLabel}`
    : sizeLabel;

  const headline = `${complexity.label}-complexity ${projectType.toLowerCase()} for ${
    fd.industry !== "Other" ? `a ${fd.industry.toLowerCase()} business` : "a new venture"
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
