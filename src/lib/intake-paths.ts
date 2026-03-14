import { services } from "@/data/services";
import { SERVICE_DURATION } from "@/data/service-constants";
import type {
  ComplexityScore,
  PathForward,
  PathPhase,
  ServiceRecommendation,
} from "@/types/intake-analysis";
import { parsePriceRange } from "./intake-scoring";

// ---------------------------------------------------------------------------
// Helpers (scoped to path building)
// ---------------------------------------------------------------------------

function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function parseDurationWeeks(dur: string): [number, number] {
  const match = dur.match(/(\d+)-(\d+)/);
  if (match) return [parseInt(match[1], 10), parseInt(match[2], 10)];
  return [4, 8];
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
// Path Builders
// ---------------------------------------------------------------------------

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
    description: "Phased delivery - each phase delivers usable value",
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
// Main Entry Point
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
