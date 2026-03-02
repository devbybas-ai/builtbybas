import type { IntakeAnalysis, ServiceRecommendation, PathForward } from "@/types/intake-analysis";
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

/**
 * Algorithmically generates a professional proposal from intake analysis data.
 * Uses templates populated with real data — no AI API calls.
 */
export function generateProposal(
  analysis: IntakeAnalysis,
  serviceCatalog: Service[]
): GeneratedProposal {
  const company = analysis.formData.company || "your company";
  const recommendedServices = analysis.serviceRecommendations.filter(
    (r) => r.fitScore >= 50
  );
  const recommendedPath = analysis.pathsForward.find((p) => p.recommended) ??
    analysis.pathsForward[0];

  const proposalServices = buildProposalServices(
    recommendedServices,
    serviceCatalog,
    recommendedPath
  );
  const estimatedBudgetCents = proposalServices.reduce(
    (sum, s) => sum + s.estimatedPriceCents,
    0
  );

  const sections = [
    buildExecutiveSummary(analysis, company, recommendedPath),
    buildUnderstandingNeeds(analysis, company),
    buildScopeOfWork(recommendedServices, serviceCatalog),
    buildTimeline(recommendedPath),
    buildInvestment(proposalServices, estimatedBudgetCents),
    buildIncluded(recommendedServices, serviceCatalog),
    buildNotIncluded(recommendedServices),
    buildNextSteps(company),
    buildTerms(),
  ];

  return {
    title: `Proposal for ${company}`,
    summary: analysis.summary.headline,
    content: sections.join("\n\n"),
    services: proposalServices,
    estimatedBudgetCents,
    timeline: recommendedPath?.estimatedTimeline ??
      analysis.summary.estimatedTotalTimeline,
  };
}

function buildProposalServices(
  recommendations: ServiceRecommendation[],
  catalog: Service[],
  path: PathForward | undefined
): ProposalService[] {
  return recommendations.map((rec) => {
    const catalogEntry = catalog.find((s) => s.id === rec.serviceId);
    const phase = path?.phases.find((p) => p.services.includes(rec.serviceId));
    return {
      serviceId: rec.serviceId,
      serviceName: rec.serviceTitle,
      description: catalogEntry?.description ?? rec.reasons.join(". "),
      estimatedPriceCents: parseMidpointCents(rec.estimatedRange),
      estimatedTimeline: phase?.duration ?? "TBD",
    };
  });
}

function buildExecutiveSummary(
  analysis: IntakeAnalysis,
  company: string,
  path: PathForward | undefined
): string {
  const { complexityScore, summary } = analysis;
  const serviceCount = analysis.serviceRecommendations.filter(
    (r) => r.fitScore >= 50
  ).length;

  const lines = [
    `## Executive Summary`,
    ``,
    `This proposal outlines a custom ${summary.projectType.toLowerCase()} solution for **${company}**. Based on our analysis of your needs, we recommend a ${complexityScore.label.toLowerCase()}-complexity engagement delivering ${serviceCount} integrated service${serviceCount !== 1 ? "s" : ""}.`,
    ``,
  ];

  if (path) {
    lines.push(
      `Our recommended approach is the **${path.name}** — ${path.description.charAt(0).toLowerCase()}${path.description.slice(1)} This positions ${company} for growth with an estimated investment of **${path.estimatedInvestment}** over **${path.estimatedTimeline}**.`
    );
  } else {
    lines.push(
      `The estimated total investment is **${summary.estimatedTotalInvestment}** with a timeline of **${summary.estimatedTotalTimeline}**.`
    );
  }

  return lines.join("\n");
}

function buildUnderstandingNeeds(
  analysis: IntakeAnalysis,
  company: string
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
    lines.push(`- **Services requested:** ${selectedServices.length} service${selectedServices.length !== 1 ? "s" : ""}`);
  }
  if (formData.timeline) {
    lines.push(`- **Preferred timeline:** ${formatTimeline(formData.timeline)}`);
  }
  if (formData.budgetRange) {
    lines.push(`- **Budget range:** ${formatBudgetRange(formData.budgetRange)}`);
  }

  lines.push(``);
  lines.push(
    `Your project readiness score is **${clientProfile.projectReadiness.label}** and your scope clarity is **${clientProfile.scopeClarity.label}**, which gives us confidence in delivering a well-defined engagement.`
  );

  return lines.join("\n");
}

function buildScopeOfWork(
  recommendations: ServiceRecommendation[],
  catalog: Service[]
): string {
  const lines = [
    `## Scope of Work`,
    ``,
    `Below is a breakdown of each recommended service, what it includes, and why it fits your needs.`,
  ];

  for (const rec of recommendations) {
    const catalogEntry = catalog.find((s) => s.id === rec.serviceId);
    lines.push(``);
    lines.push(`### ${rec.serviceTitle}`);
    lines.push(``);

    if (catalogEntry) {
      lines.push(catalogEntry.description);
      lines.push(``);
      lines.push(`**Deliverables:**`);
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

function buildTimeline(path: PathForward | undefined): string {
  if (!path || path.phases.length === 0) {
    return [
      `## Timeline`,
      ``,
      `A detailed timeline will be developed during the project planning phase based on the final scope of work.`,
    ].join("\n");
  }

  const lines = [
    `## Timeline`,
    ``,
    `We recommend the **${path.name}** approach, completed in ${path.phases.length} phase${path.phases.length !== 1 ? "s" : ""} over **${path.estimatedTimeline}**.`,
  ];

  for (const phase of path.phases) {
    lines.push(``);
    lines.push(`### Phase ${phase.order}: ${phase.title} (${phase.duration})`);
    lines.push(``);
    lines.push(phase.description);
    if (phase.services.length > 0) {
      lines.push(``);
      lines.push(`**Services in this phase:** ${phase.services.join(", ")}`);
    }
  }

  return lines.join("\n");
}

function buildInvestment(
  services: ProposalService[],
  totalCents: number
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
      `| ${svc.serviceName} | ${formatCents(svc.estimatedPriceCents)} | ${svc.estimatedTimeline} |`
    );
  }

  lines.push(`| **Total** | **${formatCents(totalCents)}** | |`);
  lines.push(``);
  lines.push(
    `*These are estimated figures based on the scope outlined above. Final pricing will be confirmed after the project planning phase.*`
  );

  return lines.join("\n");
}

function buildIncluded(
  recommendations: ServiceRecommendation[],
  catalog: Service[]
): string {
  const lines = [
    `## What's Included`,
    ``,
  ];

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
    (r) => r.serviceId === "e-commerce"
  );
  if (hasNoEcommerce) {
    lines.push(`- E-commerce and payment processing integration`);
  }

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
