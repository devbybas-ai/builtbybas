import type { IntakeAnalysis, ServiceRecommendation } from "@/types/intake-analysis";
import type { IntakeFormData } from "@/types/intake";
import type { Service } from "@/types/services";
import type { ProposalService } from "@/types/proposal";
import { toServiceDataId, toIntakeId } from "@/data/service-id-map";
import {
  SERVICE_DURATION,
  parsePriceRange,
  formatCents,
} from "@/data/service-constants";

interface GeneratedProposal {
  title: string;
  summary: string;
  content: string;
  services: ProposalService[];
  estimatedBudgetCents: number;
  timeline: string;
}

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
  const { low, high } = parsePriceRange(range);
  return [low, high];
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
  const intakeId = toIntakeId(rec.serviceId);
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
    .map((id) => toServiceDataId(id))
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
  const serviceNames = selectedServices.map((s) => s.serviceTitle);
  const serviceList = serviceNames.length <= 2
    ? serviceNames.join(" and ").toLowerCase()
    : `${serviceNames.slice(0, -1).join(", ").toLowerCase()}, and ${serviceNames[serviceNames.length - 1].toLowerCase()}`;

  // Pull the client's own vision to lead with
  const visionSnippet = extractFirstVision(analysis.formData);

  const lines = [
    `## Executive Summary`,
    ``,
  ];

  if (visionSnippet) {
    lines.push(
      `You told us what success looks like: "${truncateAnswer(visionSnippet, 150)}." This proposal is built around making that happen.`,
    );
    lines.push(``);
  }

  lines.push(
    `We're proposing a custom ${serviceList} build for **${company}**. The estimated investment is **${formatCents(totalCents)}** over **${timeline}**. Below is exactly what's included, why we're recommending it, and what you can expect at every stage.`,
  );

  return lines.join("\n");
}

function buildUnderstandingNeeds(
  analysis: IntakeAnalysis,
  company: string,
): string {
  const { formData, clientProfile } = analysis;

  const lines = [
    `## What We Understand`,
    ``,
    `Here's what we took away from your intake — we want to make sure we're on the same page before anything else.`,
    ``,
  ];

  // Pull the "about business" answer from their first service
  const aboutBusiness = extractFirstAnswer(formData, [
    "aboutBusiness",
  ]);
  if (aboutBusiness) {
    lines.push(`**About ${company}:** ${truncateAnswer(aboutBusiness, 250)}`);
    lines.push(``);
  }

  // Pull their main challenge
  const challenge = extractFirstAnswer(formData, [
    "currentChallenge", "biggestFrustration", "currentTracking",
    "currentProcess", "currentCommunication", "currentSelling",
    "fallingThroughCracks", "biggestPainPoint", "timeWasters",
  ]);
  if (challenge) {
    lines.push(`**The problem you described:** ${truncateAnswer(challenge, 250)}`);
    lines.push(``);
  }

  // Business context snapshot
  const contextParts: string[] = [];
  if (formData.industry) contextParts.push(formatIndustry(formData.industry));
  if (formData.businessSize) contextParts.push(`${formatBusinessSize(formData.businessSize)} team`);
  if (formData.yearsInBusiness) contextParts.push(`${formData.yearsInBusiness} years in business`);
  if (contextParts.length > 0) {
    lines.push(`**At a glance:** ${contextParts.join(" · ")}. Timeline: ${formatTimeline(formData.timeline)}. Budget: ${formatBudgetRange(formData.budgetRange)}.`);
    lines.push(``);
  }

  // Readiness assessment — honest, not flattering
  if (clientProfile.projectReadiness.score >= 70 && clientProfile.scopeClarity.score >= 70) {
    lines.push(`You came in well-prepared — clear requirements, defined budget, and specific goals. That means we can move efficiently and spend less time on discovery.`);
  } else if (clientProfile.projectReadiness.score >= 40) {
    lines.push(`You've given us a solid foundation to work from. There are some details we'll want to nail down together during our kickoff call, but nothing that blocks us from getting started.`);
  } else {
    lines.push(`There are some areas where we'll need to dig deeper together before development begins — that's normal at this stage. Our kickoff call will be focused on filling in those gaps so we build exactly the right thing.`);
  }

  return lines.join("\n");
}

function buildScopeOfWork(
  recommendations: ServiceRecommendation[],
  catalog: Service[],
  formData: IntakeFormData,
): string {
  const lines = [
    `## What We're Building`,
    ``,
    `Here's exactly what's in this proposal — each service is scoped around what you told us about your business, not a one-size-fits-all template.`,
  ];

  for (const rec of recommendations) {
    const catalogEntry = catalog.find((s) => s.id === rec.serviceId);
    const intakeId = toIntakeId(rec.serviceId);
    const answers = intakeId ? formData.serviceAnswers[intakeId] : undefined;

    lines.push(``);
    lines.push(`### ${rec.serviceTitle}`);
    lines.push(``);

    // Ground every section in the client's own words
    if (answers) {
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

      if (challenge) {
        lines.push(`**What you told us isn't working:** "${truncateAnswer(challenge, 250)}"`);
        lines.push(``);
      }
      if (vision) {
        lines.push(`**What success looks like to you:** "${truncateAnswer(vision, 250)}"`);
        lines.push(``);
      }
    }

    if (catalogEntry) {
      lines.push(`**Here's what we'll deliver to get you there:**`);
      for (const feature of catalogEntry.features) {
        lines.push(`- ${feature}`);
      }
    }

    lines.push(``);
    lines.push(`**Service fit:** ${rec.fitLabel} (${rec.fitScore}/100) — ${rec.estimatedRange}`);

    lines.push(``);
    lines.push(`**Why this service:**`);
    const whyReasons = buildWhyThisService(rec, formData);
    for (const reason of whyReasons) {
      lines.push(`- ${reason}`);
    }
  }

  return lines.join("\n");
}

/**
 * Builds informative, client-specific "Why this service" reasons.
 * Pulls from the client's actual intake answers to ground every statement
 * in real context — no generic sales copy, no exaggeration.
 */
function buildWhyThisService(
  rec: ServiceRecommendation,
  formData: IntakeFormData,
): string[] {
  const reasons: string[] = [];
  const intakeId = toIntakeId(rec.serviceId);
  const answers = intakeId ? formData.serviceAnswers[intakeId] : undefined;

  // 1. What problem does this solve? (from their challenge/frustration answers)
  if (answers) {
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

    if (challenge) {
      reasons.push(`Addresses what you described: "${truncateAnswer(challenge, 120)}"`);
    }

    // 2. What outcome did they envision? (from their success vision)
    const vision = getAnswerText(answers, "successVision");
    if (vision) {
      reasons.push(`Designed to deliver your goal: "${truncateAnswer(vision, 120)}"`);
    }

    // 3. What specific capability did they request? (from mostImportant or unique answers)
    const priority =
      getAnswerText(answers, "mostImportant") ??
      getAnswerText(answers, "uniqueValue") ??
      getAnswerText(answers, "uniqueAdvantage");
    if (priority) {
      reasons.push(`Your stated priority: "${truncateAnswer(priority, 120)}"`);
    }
  }

  // 4. Service fit context (from scoring engine, but rephrased to be informative)
  if (rec.fitScore >= 75) {
    reasons.push(`Strong alignment (${rec.fitScore}/100) between your requirements and this service's capabilities`);
  } else if (rec.fitScore >= 50) {
    reasons.push(`Good alignment (${rec.fitScore}/100) with your stated needs — some details to refine during planning`);
  }

  // 5. Budget compatibility (factual, not persuasive)
  const budgetReason = rec.reasons.find((r) => r.includes("Budget"));
  if (budgetReason) {
    reasons.push(budgetReason);
  }

  // Fallback: if no intake answers available, use the scoring reasons
  if (reasons.length === 0) {
    return rec.reasons;
  }

  return reasons;
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
      ? `We'll work through this in ${selectedServices.length} phases over **${totalTimeline}**. Each phase delivers something usable — you won't wait until the end to see results.`
      : `Estimated delivery: **${totalTimeline}** from kickoff to launch.`,
  ];

  for (let i = 0; i < selectedServices.length; i++) {
    const svc = selectedServices[i];
    const duration = SERVICE_DURATION[svc.serviceId] ?? "TBD";
    lines.push(``);
    lines.push(`### Phase ${i + 1}: ${svc.serviceTitle} (${duration})`);
    lines.push(``);
    lines.push(`Design, build, test, and launch your ${svc.serviceTitle.toLowerCase()}. You'll review progress at each milestone before we move forward.`);
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
    `Here's the breakdown. No hidden fees, no surprises — what you see is what you pay.`,
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
    `Here's exactly what happens from here:`,
    ``,
    `1. **Review this proposal** — Take your time. If anything doesn't make sense or doesn't match what you're looking for, let us know.`,
    `2. **Let's talk** — We'll hop on a call to answer questions, refine the scope if needed, and make sure we're aligned.`,
    `3. **Accept and kick off** — Once you're confident, we lock in the scope and get started.`,
    `4. **You'll see progress early** — We don't disappear for weeks. You'll see working progress and have a say at every milestone.`,
    `5. **Launch and support** — We deliver, walk you through everything, and stick around for 30 days after launch to make sure it's solid.`,
    ``,
    `We're ready when you are. Looking forward to building something great for **${company}**.`,
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
    `## Confidentiality`,
    ``,
    `This proposal and all information contained herein is confidential and proprietary to BuiltByBas. It is provided solely for the intended recipient's evaluation of the proposed engagement. You agree not to share, distribute, reproduce, or disclose this proposal or any of its contents to any third party without prior written consent from BuiltByBas.`,
    ``,
    `All business information, pricing, methodologies, and technical approaches described in this proposal are trade secrets of BuiltByBas and are protected as such.`,
    ``,
    `## Privacy Policy`,
    ``,
    `BuiltByBas is committed to protecting your privacy in accordance with applicable data protection laws, including the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and equivalent international privacy frameworks. The personal and business information you provided through our intake process is used exclusively for preparing this proposal and delivering the services described. We will never sell, share, or disclose your information to third parties without your explicit consent. All data is stored securely with encryption at rest and in transit. You have the right to access, correct, or request deletion of your personal data at any time by contacting us directly at privacy@builtbybas.com.`,
    ``,
    `---`,
    ``,
    `*Reviewed and approved by BuiltByBas staff*`,
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

/** Extract the first successVision answer across all service modules */
function extractFirstVision(formData: IntakeFormData): string | null {
  for (const answers of Object.values(formData.serviceAnswers)) {
    const vision = getAnswerText(answers, "successVision");
    if (vision) return vision;
  }
  return null;
}

/** Extract the first matching answer across all service modules */
function extractFirstAnswer(formData: IntakeFormData, keys: string[]): string | null {
  for (const answers of Object.values(formData.serviceAnswers)) {
    for (const key of keys) {
      const val = getAnswerText(answers, key);
      if (val) return val;
    }
  }
  return null;
}

function truncateAnswer(text: string, maxLength = 200): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}
