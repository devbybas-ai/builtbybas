import type { IntakeAnalysis, ServiceRecommendation } from "@/types/intake-analysis";
import type { IntakeFormData } from "@/types/intake";
import type { Service } from "@/types/services";
import type { ProposalService } from "@/types/proposal";

interface GeneratedProposal {
  title: string;
  summary: string;
  content: string;
  services: ProposalService[];
  estimatedBudgetCents: number;
  timeline: string;
}

/** Maps intake form service IDs → service data IDs */
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

/** Reverse mapping: service data ID → intake ID */
const SERVICE_TO_INTAKE_ID: Record<string, string> = Object.fromEntries(
  Object.entries(INTAKE_TO_SERVICE_ID).map(([k, v]) => [v, k]),
);

/** Estimated duration per service (matches intake-scoring.ts) */
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

/**
 * Keywords in intake answers that signal premium scope for each service.
 * Each hit pushes the estimate higher within (or above) the base price range.
 */
const SCOPE_PREMIUM_KEYWORDS: Record<string, string[]> = {
  "e-commerce": [
    "configurator", "3d", "augmented reality", " ar ", "real-time preview",
    "erp", "enterprise resource", "subscription", "recurring", "marketplace",
    "multi-vendor", "wholesale", "b2b", "multi-currency", "international",
    "custom dimension", "personali", "membership", "loyalty program",
  ],
  "crm-systems": [
    "automation", "workflow engine", "api integration", "multi-team",
    "multi-location", "ai scoring", "machine learning", "predictive",
    "multi-tenant", "white label", "custom pipeline", "territory",
  ],
  "marketing-websites": [
    "multilingual", "multi-language", "membership", "gated content",
    "video production", "animation", "interactive", "headless cms",
    "blog platform", "multi-site", "personali",
  ],
  "website-redesigns": [
    "multilingual", "migration", "multi-site", "headless",
    "interactive", "animation", "personali", "membership",
  ],
  "client-portals": [
    "real-time", "video", "chat", "multi-tenant", "white label",
    "api integration", "mobile app", "offline", "file sharing",
    "custom workflow", "approval flow",
  ],
  "business-dashboards": [
    "real-time", "machine learning", "predictive", "multi-source",
    "etl", "data warehouse", "custom report", "embed", "white label",
    "geospatial", "map", "alert",
  ],
  "ai-powered-tools": [
    "fine-tune", "training data", "custom model", "nlp", "computer vision",
    "voice", "multi-modal", "real-time", "agent", "autonomous",
    "document processing", "ocr",
  ],
  "full-operations-platform": [
    "multi-location", "franchise", "white label", "api marketplace",
    "custom workflow", "enterprise", "sso", "audit trail", "compliance",
  ],
  "landing-pages": [
    "interactive", "calculator", "quiz", "multi-variant", "video",
    "animation", "personali",
  ],
};

/** Map budget range keys to their floor dollar value */
function parseBudgetFloor(budgetRange: string): number {
  const map: Record<string, number> = {
    "1k-5k": 1000,
    "5k-15k": 5000,
    "15k-30k": 15000,
    "30k+": 30000,
  };
  return map[budgetRange] ?? 0;
}

/** Parse a price range string into [low, high] dollar amounts */
function parseRangeDollars(range: string): [number, number] {
  const numbers = range.match(/[\d,]+/g);
  if (!numbers || numbers.length < 2) return [0, 0];
  return [
    parseInt(numbers[0].replace(/,/g, ""), 10),
    parseInt(numbers[1].replace(/,/g, ""), 10),
  ];
}

/**
 * Compute a scope-aware price for a service based on the full intake analysis.
 *
 * Instead of always using the midpoint of the service price range, this
 * positions the estimate within (or above) the range based on:
 *   1. Complexity score — higher overall score = higher in range
 *   2. Scope premium keywords — specific high-cost features push price up
 *   3. Client budget signal — if stated budget exceeds range, don't underprice
 *   4. Multi-service integration — additional services add overhead
 */
export function computeScopedPriceCents(
  rec: ServiceRecommendation,
  analysis: IntakeAnalysis,
): number {
  const [low, high] = parseRangeDollars(rec.estimatedRange);
  if (low === 0 && high === 0) return 0;

  // Base position from complexity (0.3 at score 0, 0.8 at score 10)
  const complexity = analysis.complexityScore.overall;
  let position = 0.3 + (complexity / 10) * 0.5;

  // Scope premium keywords from service-specific answers + additional notes
  const intakeId = SERVICE_TO_INTAKE_ID[rec.serviceId];
  const answers = intakeId ? analysis.formData.serviceAnswers[intakeId] : undefined;
  const parts: string[] = [];
  if (answers) {
    for (const val of Object.values(answers)) {
      if (typeof val === "string") parts.push(val);
      else if (Array.isArray(val)) parts.push(val.join(" "));
    }
  }
  if (analysis.formData.additionalNotes) parts.push(analysis.formData.additionalNotes);
  const scopeText = parts.join(" ").toLowerCase();

  const premiumKeywords = SCOPE_PREMIUM_KEYWORDS[rec.serviceId] ?? [];
  let premiumHits = 0;
  for (const kw of premiumKeywords) {
    if (scopeText.includes(kw)) premiumHits++;
  }
  position += premiumHits * 0.1;

  // Budget signal — if client budget floor exceeds service range high, scale up
  const budgetFloor = parseBudgetFloor(analysis.formData.budgetRange);
  if (budgetFloor > high) {
    position += 0.2;
  } else if (budgetFloor > (low + high) / 2) {
    position += 0.1;
  }

  // Multi-service integration overhead
  const serviceCount = analysis.formData.selectedServices.length;
  if (serviceCount > 1) {
    position += 0.05 * (serviceCount - 1);
  }

  // Cap: can extend up to 1.5x the range width above the low end
  const cappedPosition = Math.min(position, 1.5);
  const price = low + (high - low) * cappedPosition;

  // Round to nearest $250
  const rounded = Math.round(price / 250) * 250;
  return rounded * 100;
}

/**
 * Algorithmically generates a professional proposal from intake analysis data.
 * Uses templates populated with real data — no AI API calls.
 *
 * Only includes services the client actually selected. Additional
 * recommendations appear as "Future Opportunities" for upsell.
 */
export function generateProposal(
  analysis: IntakeAnalysis,
  serviceCatalog: Service[],
): GeneratedProposal {
  const company = analysis.formData.company || "your company";

  // Only include services the client actually selected
  const selectedDataIds = analysis.formData.selectedServices
    .map((id) => INTAKE_TO_SERVICE_ID[id])
    .filter((id): id is string => id !== undefined);

  const selectedServices = analysis.serviceRecommendations.filter((r) =>
    selectedDataIds.includes(r.serviceId),
  );

  // Additional recommendations (not selected but high fit) for upsell
  const additionalRecommendations = analysis.serviceRecommendations.filter(
    (r) => !selectedDataIds.includes(r.serviceId) && r.fitScore >= 50,
  );

  const proposalServices = buildProposalServices(selectedServices, serviceCatalog, analysis);
  const estimatedBudgetCents = proposalServices.reduce(
    (sum, s) => sum + s.estimatedPriceCents,
    0,
  );
  const timeline = computeTimeline(selectedServices);

  const sections = [
    buildExecutiveSummary(analysis, company, selectedServices, estimatedBudgetCents, timeline),
    buildUnderstandingNeeds(analysis, company),
    buildScopeOfWork(selectedServices, serviceCatalog, analysis.formData),
    buildTimelineSection(selectedServices, timeline),
    buildInvestment(proposalServices, estimatedBudgetCents),
    buildIncluded(selectedServices, serviceCatalog),
    buildNotIncluded(selectedServices),
    ...(additionalRecommendations.length > 0
      ? [buildFutureOpportunities(additionalRecommendations)]
      : []),
    buildNextSteps(company),
    buildTerms(),
  ];

  return {
    title: `Proposal for ${company}`,
    summary: analysis.summary.headline,
    content: sections.join("\n\n"),
    services: proposalServices,
    estimatedBudgetCents,
    timeline,
  };
}

function buildProposalServices(
  recommendations: ServiceRecommendation[],
  catalog: Service[],
  analysis: IntakeAnalysis,
): ProposalService[] {
  return recommendations.map((rec) => {
    const catalogEntry = catalog.find((s) => s.id === rec.serviceId);
    const duration = SERVICE_DURATION[rec.serviceId] ?? "TBD";
    return {
      serviceId: rec.serviceId,
      serviceName: rec.serviceTitle,
      description: catalogEntry?.description ?? rec.reasons.join(". "),
      estimatedPriceCents: computeScopedPriceCents(rec, analysis),
      estimatedTimeline: duration,
    };
  });
}

function buildExecutiveSummary(
  analysis: IntakeAnalysis,
  company: string,
  selectedServices: ServiceRecommendation[],
  totalCents: number,
  timeline: string,
): string {
  const { complexityScore } = analysis;
  const serviceCount = selectedServices.length;
  const serviceNames = selectedServices.map((s) => s.serviceTitle);

  const lines = [
    `## Executive Summary`,
    ``,
    `This proposal outlines a custom ${serviceNames.join(" and ").toLowerCase()} solution for **${company}**. Based on our analysis of your needs, we recommend a ${complexityScore.label.toLowerCase()}-complexity engagement delivering ${serviceCount} integrated service${serviceCount !== 1 ? "s" : ""}.`,
    ``,
    `The estimated investment is **${formatCents(totalCents)}** with a delivery timeline of **${timeline}**.`,
  ];

  return lines.join("\n");
}

function buildUnderstandingNeeds(
  analysis: IntakeAnalysis,
  company: string,
): string {
  const { formData, clientProfile } = analysis;
  const selectedServices = formData.selectedServices ?? [];

  const lines = [
    `## Understanding Your Needs`,
    ``,
    `After reviewing your intake submission, here is what we understand about **${company}** and your project:`,
    ``,
  ];

  if (formData.industry) {
    lines.push(`- **Industry:** ${formatIndustry(formData.industry)}`);
  }
  if (formData.businessSize) {
    lines.push(`- **Team size:** ${formatBusinessSize(formData.businessSize)}`);
  }
  if (formData.yearsInBusiness) {
    lines.push(`- **Years in business:** ${formData.yearsInBusiness}`);
  }
  if (selectedServices.length > 0) {
    lines.push(
      `- **Services requested:** ${selectedServices.length} service${selectedServices.length !== 1 ? "s" : ""}`,
    );
  }
  if (formData.timeline) {
    lines.push(`- **Preferred timeline:** ${formatTimeline(formData.timeline)}`);
  }
  if (formData.budgetRange) {
    lines.push(`- **Budget range:** ${formatBudgetRange(formData.budgetRange)}`);
  }

  lines.push(``);
  lines.push(
    `Your project readiness score is **${clientProfile.projectReadiness.label}** and your scope clarity is **${clientProfile.scopeClarity.label}**, which gives us confidence in delivering a well-defined engagement.`,
  );

  return lines.join("\n");
}

function buildScopeOfWork(
  recommendations: ServiceRecommendation[],
  catalog: Service[],
  formData: IntakeFormData,
): string {
  const lines = [
    `## Scope of Work`,
    ``,
    `Below is a detailed breakdown of each service, tailored to what you've told us about your business.`,
  ];

  for (const rec of recommendations) {
    const catalogEntry = catalog.find((s) => s.id === rec.serviceId);
    const intakeId = SERVICE_TO_INTAKE_ID[rec.serviceId];
    const answers = intakeId ? formData.serviceAnswers[intakeId] : undefined;

    lines.push(``);
    lines.push(`### ${rec.serviceTitle}`);
    lines.push(``);

    // Personalize with the client's own words
    if (answers) {
      const about = getAnswerText(answers, "aboutBusiness");
      const challenge =
        getAnswerText(answers, "currentChallenge") ??
        getAnswerText(answers, "biggestFrustration") ??
        getAnswerText(answers, "currentTracking") ??
        getAnswerText(answers, "currentProcess") ??
        getAnswerText(answers, "currentCommunication") ??
        getAnswerText(answers, "currentSelling") ??
        getAnswerText(answers, "fallingThroughCracks") ??
        getAnswerText(answers, "biggestPainPoint") ??
        getAnswerText(answers, "timeWasters");
      const vision = getAnswerText(answers, "successVision");

      if (about) {
        lines.push(`**Your business:** ${truncateAnswer(about)}`);
        lines.push(``);
      }
      if (challenge) {
        lines.push(`**The challenge:** ${truncateAnswer(challenge)}`);
        lines.push(``);
      }
      if (vision) {
        lines.push(`**Your vision:** ${truncateAnswer(vision)}`);
        lines.push(``);
      }
    }

    if (catalogEntry) {
      lines.push(`**What we'll build:**`);
      for (const feature of catalogEntry.features) {
        lines.push(`- ${feature}`);
      }
    }

    lines.push(``);
    lines.push(`**Fit:** ${rec.fitLabel} (${rec.fitScore}/100)`);
    lines.push(`**Estimated investment:** ${rec.estimatedRange}`);

    if (rec.reasons.length > 0) {
      lines.push(``);
      lines.push(`**Why this service:**`);
      for (const reason of rec.reasons) {
        lines.push(`- ${reason}`);
      }
    }
  }

  return lines.join("\n");
}

function buildTimelineSection(
  selectedServices: ServiceRecommendation[],
  totalTimeline: string,
): string {
  if (selectedServices.length === 0) {
    return [
      `## Timeline`,
      ``,
      `A detailed timeline will be developed during the project planning phase.`,
    ].join("\n");
  }

  const isMultiPhase = selectedServices.length > 1;

  const lines = [
    `## Timeline`,
    ``,
    isMultiPhase
      ? `We recommend a phased approach, completed in ${selectedServices.length} phases over **${totalTimeline}**.`
      : `Estimated delivery: **${totalTimeline}**.`,
  ];

  for (let i = 0; i < selectedServices.length; i++) {
    const svc = selectedServices[i];
    const duration = SERVICE_DURATION[svc.serviceId] ?? "TBD";
    lines.push(``);
    lines.push(`### Phase ${i + 1}: ${svc.serviceTitle} (${duration})`);
    lines.push(``);
    lines.push(`Design, build, and launch your ${svc.serviceTitle.toLowerCase()}.`);
  }

  return lines.join("\n");
}

function buildInvestment(
  services: ProposalService[],
  totalCents: number,
): string {
  const lines = [
    `## Investment`,
    ``,
    `Below is the estimated investment for each service in this proposal.`,
    ``,
    `| Service | Estimated Investment | Timeline |`,
    `| --- | --- | --- |`,
  ];

  for (const svc of services) {
    lines.push(
      `| ${svc.serviceName} | ${formatCents(svc.estimatedPriceCents)} | ${svc.estimatedTimeline} |`,
    );
  }

  lines.push(`| **Total** | **${formatCents(totalCents)}** | |`);
  lines.push(``);
  lines.push(
    `*These are estimated figures based on the scope outlined above. Final pricing will be confirmed after the project planning phase.*`,
  );

  return lines.join("\n");
}

function buildIncluded(
  recommendations: ServiceRecommendation[],
  catalog: Service[],
): string {
  const lines = [`## What's Included`, ``];

  const allFeatures: string[] = [];
  for (const rec of recommendations) {
    const entry = catalog.find((s) => s.id === rec.serviceId);
    if (entry) {
      for (const feature of entry.features) {
        if (!allFeatures.includes(feature)) {
          allFeatures.push(feature);
        }
      }
    }
  }

  for (const feature of allFeatures) {
    lines.push(`- ${feature}`);
  }

  lines.push(`- Project management and regular progress updates`);
  lines.push(`- Two rounds of revision per deliverable`);
  lines.push(`- 30-day post-launch support period`);
  lines.push(`- Source code ownership transferred at completion`);

  return lines.join("\n");
}

function buildNotIncluded(recommendations: ServiceRecommendation[]): string {
  const lines = [
    `## What's Not Included`,
    ``,
    `The following are outside the scope of this proposal unless separately agreed upon:`,
    ``,
    `- Content writing and copywriting (client provides content unless content creation is scoped)`,
    `- Stock photography and licensed media`,
    `- Third-party service subscriptions (hosting, domains, API fees)`,
    `- Ongoing maintenance beyond the 30-day support period`,
    `- Training sessions beyond initial walkthrough`,
  ];

  const hasNoEcommerce = !recommendations.some(
    (r) => r.serviceId === "e-commerce",
  );
  if (hasNoEcommerce) {
    lines.push(`- E-commerce and payment processing integration`);
  }

  return lines.join("\n");
}

function buildFutureOpportunities(
  recommendations: ServiceRecommendation[],
): string {
  const lines = [
    `## Future Opportunities`,
    ``,
    `Based on your business profile, we also see potential value in these services for future phases:`,
    ``,
  ];

  for (const rec of recommendations) {
    lines.push(
      `- **${rec.serviceTitle}** (${rec.fitLabel}) — ${rec.reasons[0] ?? "Aligns with your business needs"}`,
    );
  }

  lines.push(``);
  lines.push(
    `*These are not included in this proposal but can be discussed as your business grows.*`,
  );

  return lines.join("\n");
}

function buildNextSteps(company: string): string {
  return [
    `## Next Steps`,
    ``,
    `Ready to move forward? Here's what happens next:`,
    ``,
    `1. **Review this proposal** — Take your time to review the scope, timeline, and investment.`,
    `2. **Accept the proposal** — Reply to confirm you'd like to proceed.`,
    `3. **Kickoff call** — We'll schedule a 30-minute call to align on priorities and timeline.`,
    `4. **Project planning** — We finalize the detailed project plan, milestones, and deliverables.`,
    `5. **Work begins** — Development starts according to the agreed timeline.`,
    ``,
    `We're excited about the opportunity to work with **${company}** and build something that makes a real impact on your business.`,
  ].join("\n");
}

function buildTerms(): string {
  return [
    `## Terms`,
    ``,
    `- **Validity:** This proposal is valid for 30 days from the date of issue.`,
    `- **Payment schedule:** 50% deposit to begin work, 50% upon completion. For projects over $10,000, milestone-based payments will be arranged.`,
    `- **Revisions:** Two rounds of revisions per deliverable are included. Additional revision rounds are billed at an hourly rate.`,
    `- **Timeline:** Timelines are estimates and may adjust based on feedback cycles and content delivery.`,
    `- **Ownership:** All source code, designs, and deliverables are transferred to the client upon final payment.`,
    ``,
    `---`,
    ``,
    `*Reviewed and approved by Bas Rosario*`,
  ].join("\n");
}

// --- Helpers ---

export function parseMidpointCents(range: string): number {
  const numbers = range.match(/[\d,]+/g);
  if (!numbers || numbers.length < 2) return 0;
  const low = parseInt(numbers[0].replace(/,/g, ""), 10);
  const high = parseInt(numbers[1].replace(/,/g, ""), 10);
  return Math.round(((low + high) / 2) * 100);
}

function computeTimeline(selectedServices: ServiceRecommendation[]): string {
  if (selectedServices.length === 0) return "TBD";

  let totalMinWeeks = 0;
  let totalMaxWeeks = 0;

  for (const svc of selectedServices) {
    const dur = SERVICE_DURATION[svc.serviceId];
    if (dur) {
      const match = dur.match(/(\d+)-(\d+)/);
      if (match) {
        totalMinWeeks += parseInt(match[1], 10);
        totalMaxWeeks += parseInt(match[2], 10);
      }
    }
  }

  if (totalMinWeeks === 0) return "TBD";
  if (totalMaxWeeks <= 8) return `${totalMinWeeks}-${totalMaxWeeks} weeks`;
  const minMonths = Math.ceil(totalMinWeeks / 4);
  const maxMonths = Math.ceil(totalMaxWeeks / 4);
  return `${minMonths}-${maxMonths} months`;
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatIndustry(industry: string): string {
  return industry
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatBusinessSize(size: string): string {
  const map: Record<string, string> = {
    "just-me": "Solo founder",
    "2-5": "2-5 people",
    "6-20": "6-20 people",
    "21-50": "21-50 people",
    "50+": "50+ people",
  };
  return map[size] ?? size;
}

function formatTimeline(timeline: string): string {
  const map: Record<string, string> = {
    asap: "As soon as possible",
    "1-3-months": "1-3 months",
    "3-6-months": "3-6 months",
    flexible: "Flexible",
  };
  return map[timeline] ?? timeline;
}

function formatBudgetRange(budget: string): string {
  const map: Record<string, string> = {
    unsure: "Not yet determined",
    "1k-5k": "$1,000 - $5,000",
    "5k-15k": "$5,000 - $15,000",
    "15k-30k": "$15,000 - $30,000",
    "30k+": "$30,000+",
  };
  return map[budget] ?? budget;
}

function getAnswerText(
  answers: Record<string, string | string[]>,
  key: string,
): string | null {
  const val = answers[key];
  if (typeof val === "string" && val.trim().length > 0) return val.trim();
  if (Array.isArray(val) && val.length > 0) return val.join(", ");
  return null;
}

function truncateAnswer(text: string, maxLength = 200): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}
