import { describe, expect, it } from "vitest";
import type { IntakeFormData } from "@/types/intake";
import {
  analyzeIntake,
  generateFlags,
  generatePathsForward,
  generateSummary,
  getComplexityLabel,
  getFitLabel,
  getScoreLabel,
  parseBudgetRange,
  parsePriceRange,
  scoreBudgetAlignment,
  scoreBusinessMaturity,
  scoreComplexity,
  scoreEngagementLevel,
  scoreProjectReadiness,
  scoreScopeClarity,
  scoreServiceRecommendations,
} from "./intake-scoring";

// ---------------------------------------------------------------------------
// Test Helpers
// ---------------------------------------------------------------------------

function createFormData(overrides: Partial<IntakeFormData> = {}): IntakeFormData {
  return {
    name: "Test User",
    email: "test@example.com",
    phone: "",
    company: "Test Co",
    industry: "Professional Services",
    businessSize: "Just me",
    website: "",
    projectTypes: ["Marketing Website"],
    description: "I need a new website for my business",
    goals: "Get more leads online",
    timeline: "1-3 months",
    budgetRange: "$5,000 - $15,000",
    hasExistingSite: "No — starting from scratch",
    currentPainPoints: "",
    desiredFeatures: [],
    designPreference: "Modern & Minimal",
    hasBrandAssets: "No — I need branding too",
    competitors: "",
    inspiration: "",
    additionalNotes: "",
    howDidYouHear: "",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

describe("parsePriceRange", () => {
  it("parses standard price ranges", () => {
    expect(parsePriceRange("$2,500 - $8,000")).toEqual([2500, 8000]);
    expect(parsePriceRange("$15,000 - $50,000+")).toEqual([15000, 50000]);
  });
});

describe("parseBudgetRange", () => {
  it("returns null for 'Not sure yet'", () => {
    expect(parseBudgetRange("Not sure yet")).toBeNull();
  });

  it("parses $30,000+ as open-ended", () => {
    expect(parseBudgetRange("$30,000+")).toEqual([30000, 100000]);
  });

  it("parses standard budget ranges", () => {
    expect(parseBudgetRange("$1,000 - $5,000")).toEqual([1000, 5000]);
    expect(parseBudgetRange("$5,000 - $15,000")).toEqual([5000, 15000]);
  });
});

describe("label helpers", () => {
  it("getScoreLabel maps ranges correctly", () => {
    expect(getScoreLabel(0)).toBe("Low");
    expect(getScoreLabel(25)).toBe("Low");
    expect(getScoreLabel(26)).toBe("Medium");
    expect(getScoreLabel(50)).toBe("Medium");
    expect(getScoreLabel(51)).toBe("High");
    expect(getScoreLabel(75)).toBe("High");
    expect(getScoreLabel(76)).toBe("Very High");
    expect(getScoreLabel(100)).toBe("Very High");
  });

  it("getComplexityLabel maps ranges correctly", () => {
    expect(getComplexityLabel(1)).toBe("Simple");
    expect(getComplexityLabel(3)).toBe("Simple");
    expect(getComplexityLabel(4)).toBe("Moderate");
    expect(getComplexityLabel(5)).toBe("Moderate");
    expect(getComplexityLabel(6)).toBe("Complex");
    expect(getComplexityLabel(7)).toBe("Complex");
    expect(getComplexityLabel(8)).toBe("Enterprise");
    expect(getComplexityLabel(10)).toBe("Enterprise");
  });

  it("getFitLabel maps ranges correctly", () => {
    expect(getFitLabel(80)).toBe("Strong Fit");
    expect(getFitLabel(60)).toBe("Good Fit");
    expect(getFitLabel(30)).toBe("Partial Fit");
    expect(getFitLabel(10)).toBe("Not Recommended");
  });
});

// ---------------------------------------------------------------------------
// Client Profile: Business Maturity
// ---------------------------------------------------------------------------

describe("scoreBusinessMaturity", () => {
  it("scores low for a solo founder starting fresh", () => {
    const fd = createFormData();
    const result = scoreBusinessMaturity(fd);
    // industry not "Other" = +10, that's it
    expect(result.score).toBeLessThanOrEqual(25);
    expect(result.label).toBe("Low");
  });

  it("scores high for an established business", () => {
    const fd = createFormData({
      hasExistingSite: "Yes — it needs a complete rebuild",
      hasBrandAssets: "Yes — logo, colors, brand guide",
      businessSize: "21-50 people",
      industry: "Healthcare",
      competitors: "Mayo Clinic, CVS Health",
    });
    const result = scoreBusinessMaturity(fd);
    // website +15, full brand +20, 6+ +15, 21+ +25, not Other +10, competitors +15 = 100
    expect(result.score).toBe(100);
    expect(result.label).toBe("Very High");
    expect(result.signals.length).toBeGreaterThanOrEqual(5);
  });
});

// ---------------------------------------------------------------------------
// Client Profile: Project Readiness
// ---------------------------------------------------------------------------

describe("scoreProjectReadiness", () => {
  it("scores low with minimal input", () => {
    const fd = createFormData({
      description: "Need a website",
      goals: "Be online",
      budgetRange: "Not sure yet",
      timeline: "Flexible — quality over speed",
    });
    const result = scoreProjectReadiness(fd);
    expect(result.score).toBeLessThanOrEqual(25);
  });

  it("scores high with detailed input", () => {
    const fd = createFormData({
      description:
        "We need a custom marketing website with lead capture, CMS integration, and SEO optimization for our plumbing business serving the greater Phoenix area.",
      goals: "Increase monthly leads from 10 to 50 within 6 months of launch and improve our conversion rate by 30%",
      budgetRange: "$5,000 - $15,000",
      timeline: "1-3 months",
      inspiration: "https://example1.com, https://example2.com",
      desiredFeatures: ["SEO Optimization", "Contact / Lead Capture Forms"],
    });
    const result = scoreProjectReadiness(fd);
    // desc >100 +20, goals >50 +20, budget defined +20, timeline defined +15, inspiration +10, features +15 = 100
    expect(result.score).toBe(100);
    expect(result.label).toBe("Very High");
  });
});

// ---------------------------------------------------------------------------
// Client Profile: Engagement Level
// ---------------------------------------------------------------------------

describe("scoreEngagementLevel", () => {
  it("scores low when all optional fields are empty", () => {
    const fd = createFormData();
    const result = scoreEngagementLevel(fd);
    expect(result.score).toBeLessThanOrEqual(25);
    expect(result.label).toBe("Low");
  });

  it("scores high when all optional fields are filled", () => {
    const fd = createFormData({
      phone: "(555) 123-4567",
      currentPainPoints: "Our current site is slow and ugly",
      competitors: "Competitor A, Competitor B",
      inspiration: "https://stripe.com",
      additionalNotes: "We want to launch before summer",
      howDidYouHear: "Google Search",
      desiredFeatures: [
        "Contact / Lead Capture Forms",
        "SEO Optimization",
        "Analytics & Reporting",
        "Content Management (CMS)",
        "Email Marketing Integration",
        "Social Media Integration",
      ],
    });
    const result = scoreEngagementLevel(fd);
    // phone +10, pain +15, competitors +15, inspiration +15, notes +15, hear +10, 3+ features +10, 6+ features +10 = 100
    expect(result.score).toBe(100);
    expect(result.label).toBe("Very High");
  });
});

// ---------------------------------------------------------------------------
// Client Profile: Scope Clarity
// ---------------------------------------------------------------------------

describe("scoreScopeClarity", () => {
  it("scores higher for focused scope with specific terms", () => {
    const fd = createFormData({
      projectTypes: ["Marketing Website"],
      description: "I need a 5-page marketing website with login portal and SEO",
      goals: "Increase leads by 50% and improve conversion rate",
      designPreference: "Modern & Minimal",
    });
    const result = scoreScopeClarity(fd);
    // focused +25, specific terms +20, metrics +20, design defined +10, existing state +10 = 85
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.label).toBe("Very High");
  });
});

// ---------------------------------------------------------------------------
// Client Profile: Budget Alignment
// ---------------------------------------------------------------------------

describe("scoreBudgetAlignment", () => {
  it("returns 40 for 'Not sure yet'", () => {
    const fd = createFormData({ budgetRange: "Not sure yet" });
    const result = scoreBudgetAlignment(fd);
    expect(result.score).toBe(40);
  });

  it("scores high when budget covers scope", () => {
    const fd = createFormData({
      projectTypes: ["Marketing Website"],
      budgetRange: "$5,000 - $15,000",
    });
    const result = scoreBudgetAlignment(fd);
    // Marketing website min = $2,500, budget max $15,000 covers it
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it("scores low when budget is far below scope", () => {
    const fd = createFormData({
      projectTypes: ["Full Operations Platform", "AI-Powered Tools"],
      budgetRange: "$1,000 - $5,000",
    });
    const result = scoreBudgetAlignment(fd);
    // Min viable: $15,000 + $10,000 = $25,000; budget max $5,000 — far below
    expect(result.score).toBeLessThanOrEqual(25);
  });
});

// ---------------------------------------------------------------------------
// Service Recommendations
// ---------------------------------------------------------------------------

describe("scoreServiceRecommendations", () => {
  it("recommends the correct primary service for a single project type", () => {
    const fd = createFormData({ projectTypes: ["Marketing Website"] });
    const recs = scoreServiceRecommendations(fd);
    expect(recs.length).toBeGreaterThanOrEqual(1);
    expect(recs[0].serviceId).toBe("marketing-websites");
    expect(recs[0].isPrimary).toBe(true);
  });

  it("recommends multiple services for multiple project types", () => {
    const fd = createFormData({
      projectTypes: ["Marketing Website", "CRM System"],
      budgetRange: "$15,000 - $30,000",
    });
    const recs = scoreServiceRecommendations(fd);
    const ids = recs.map((r) => r.serviceId);
    expect(ids).toContain("marketing-websites");
    expect(ids).toContain("crm-systems");
  });

  it("boosts services matching desired features", () => {
    const fd = createFormData({
      projectTypes: ["Marketing Website"],
      desiredFeatures: [
        "E-Commerce / Payments",
        "Client Portal / Dashboard",
      ],
    });
    const recs = scoreServiceRecommendations(fd);
    const ids = recs.map((r) => r.serviceId);
    // e-commerce and client-portals should appear due to feature alignment
    expect(ids).toContain("e-commerce");
  });

  it("only returns services with fitScore >= 25", () => {
    const fd = createFormData();
    const recs = scoreServiceRecommendations(fd);
    for (const rec of recs) {
      expect(rec.fitScore).toBeGreaterThanOrEqual(25);
    }
  });
});

// ---------------------------------------------------------------------------
// Complexity Scoring
// ---------------------------------------------------------------------------

describe("scoreComplexity", () => {
  it("scores simple for a single project type with few features", () => {
    const fd = createFormData({
      projectTypes: ["Landing Page"],
      desiredFeatures: ["Contact / Lead Capture Forms"],
    });
    const result = scoreComplexity(fd);
    expect(result.overall).toBeLessThanOrEqual(3);
    expect(result.label).toBe("Simple");
  });

  it("scores enterprise for full platform + AI + branding + integrations", () => {
    const fd = createFormData({
      projectTypes: [
        "Marketing Website",
        "CRM System",
        "Client Portal",
        "AI-Powered Tools",
      ],
      desiredFeatures: [
        "Contact / Lead Capture Forms",
        "Analytics & Reporting",
        "Custom Integrations / API",
        "AI-Powered Features",
        "Email Marketing Integration",
        "Client Portal / Dashboard",
        "Content Management (CMS)",
      ],
      hasBrandAssets: "No — I need branding too",
      hasExistingSite: "No — starting from scratch",
      budgetRange: "$30,000+",
      timeline: "ASAP — I needed this yesterday",
    });
    const result = scoreComplexity(fd);
    expect(result.overall).toBeGreaterThanOrEqual(8);
    expect(result.label).toBe("Enterprise");
    expect(result.factors.length).toBeGreaterThanOrEqual(5);
  });

  it("caps at 10", () => {
    const fd = createFormData({
      projectTypes: [
        "Marketing Website",
        "Website Redesign",
        "CRM System",
        "Client Portal",
        "AI-Powered Tools",
      ],
      desiredFeatures: [
        "Contact / Lead Capture Forms",
        "Analytics & Reporting",
        "Custom Integrations / API",
        "AI-Powered Features",
        "Email Marketing Integration",
        "Client Portal / Dashboard",
        "Content Management (CMS)",
        "SEO Optimization",
      ],
      hasBrandAssets: "No — I need branding too",
      hasExistingSite: "No — starting from scratch",
      budgetRange: "$30,000+",
      timeline: "ASAP — I needed this yesterday",
    });
    const result = scoreComplexity(fd);
    expect(result.overall).toBeLessThanOrEqual(10);
  });
});

// ---------------------------------------------------------------------------
// Paths Forward
// ---------------------------------------------------------------------------

describe("generatePathsForward", () => {
  it("returns 1 path for simple projects", () => {
    const complexity = { overall: 2, label: "Simple" as const, factors: [] };
    const recs = [{
      serviceId: "marketing-websites",
      serviceTitle: "Marketing Websites",
      fitScore: 80,
      fitLabel: "Strong Fit" as const,
      reasons: [],
      estimatedRange: "$2,500 - $8,000",
      isPrimary: true,
    }];
    const paths = generatePathsForward(complexity, recs);
    expect(paths).toHaveLength(1);
    expect(paths[0].name).toBe("Direct Build");
    expect(paths[0].recommended).toBe(true);
  });

  it("returns 2 paths for moderate projects", () => {
    const complexity = { overall: 4, label: "Moderate" as const, factors: [] };
    const recs = [
      {
        serviceId: "marketing-websites",
        serviceTitle: "Marketing Websites",
        fitScore: 80,
        fitLabel: "Strong Fit" as const,
        reasons: [],
        estimatedRange: "$2,500 - $8,000",
        isPrimary: true,
      },
      {
        serviceId: "crm-systems",
        serviceTitle: "CRM Systems",
        fitScore: 60,
        fitLabel: "Good Fit" as const,
        reasons: [],
        estimatedRange: "$8,000 - $25,000",
        isPrimary: false,
      },
    ];
    const paths = generatePathsForward(complexity, recs);
    expect(paths).toHaveLength(2);
    expect(paths.map((p) => p.name)).toContain("Comprehensive Build");
    expect(paths.map((p) => p.name)).toContain("Phased Approach");
  });

  it("returns 3 paths for complex projects", () => {
    const complexity = { overall: 7, label: "Complex" as const, factors: [] };
    const recs = [
      {
        serviceId: "marketing-websites",
        serviceTitle: "Marketing Websites",
        fitScore: 80,
        fitLabel: "Strong Fit" as const,
        reasons: [],
        estimatedRange: "$2,500 - $8,000",
        isPrimary: true,
      },
      {
        serviceId: "crm-systems",
        serviceTitle: "CRM Systems",
        fitScore: 60,
        fitLabel: "Good Fit" as const,
        reasons: [],
        estimatedRange: "$8,000 - $25,000",
        isPrimary: false,
      },
    ];
    const paths = generatePathsForward(complexity, recs);
    expect(paths).toHaveLength(3);
    expect(paths.map((p) => p.name)).toContain("Full Platform Build");
    expect(paths.map((p) => p.name)).toContain("Strategic Phases");
    expect(paths.map((p) => p.name)).toContain("Quick Win + Scale");
  });

  it("returns empty array when no recommendations", () => {
    const complexity = { overall: 3, label: "Simple" as const, factors: [] };
    const paths = generatePathsForward(complexity, []);
    expect(paths).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Flags
// ---------------------------------------------------------------------------

describe("generateFlags", () => {
  it("warns when budget is below scope minimum", () => {
    const fd = createFormData({
      projectTypes: ["Full Operations Platform"],
      budgetRange: "$1,000 - $5,000",
    });
    const complexity = scoreComplexity(fd);
    const profile = {
      businessMaturity: scoreBusinessMaturity(fd),
      projectReadiness: scoreProjectReadiness(fd),
      engagementLevel: scoreEngagementLevel(fd),
      scopeClarity: scoreScopeClarity(fd),
      budgetAlignment: scoreBudgetAlignment(fd),
    };
    const flags = generateFlags(fd, complexity, profile);
    const warnings = flags.filter((f) => f.type === "warning");
    expect(warnings.length).toBeGreaterThanOrEqual(1);
    expect(warnings.some((w) => w.message.includes("Budget"))).toBe(true);
  });

  it("flags opportunity for Marketing Strategy", () => {
    const fd = createFormData({
      projectTypes: ["Marketing Website", "Marketing Strategy"],
    });
    const complexity = scoreComplexity(fd);
    const profile = {
      businessMaturity: scoreBusinessMaturity(fd),
      projectReadiness: scoreProjectReadiness(fd),
      engagementLevel: scoreEngagementLevel(fd),
      scopeClarity: scoreScopeClarity(fd),
      budgetAlignment: scoreBudgetAlignment(fd),
    };
    const flags = generateFlags(fd, complexity, profile);
    const opportunities = flags.filter((f) => f.type === "opportunity");
    expect(opportunities.some((o) => o.message.includes("Marketing Strategy"))).toBe(true);
  });

  it("flags info for existing site", () => {
    const fd = createFormData({
      hasExistingSite: "Yes — it needs a complete rebuild",
    });
    const complexity = scoreComplexity(fd);
    const profile = {
      businessMaturity: scoreBusinessMaturity(fd),
      projectReadiness: scoreProjectReadiness(fd),
      engagementLevel: scoreEngagementLevel(fd),
      scopeClarity: scoreScopeClarity(fd),
      budgetAlignment: scoreBudgetAlignment(fd),
    };
    const flags = generateFlags(fd, complexity, profile);
    const infos = flags.filter((f) => f.type === "info");
    expect(infos.some((i) => i.message.includes("existing site"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

describe("generateSummary", () => {
  it("generates a coherent summary for a simple project", () => {
    const fd = createFormData();
    const complexity = scoreComplexity(fd);
    const recs = scoreServiceRecommendations(fd);
    const summary = generateSummary(fd, complexity, recs);

    expect(summary.projectType).toBe("Marketing Website");
    expect(summary.clientType).toContain("Professional Services");
    expect(summary.headline).toContain("marketing website");
    expect(summary.estimatedTotalInvestment.length).toBeGreaterThan(0);
    expect(summary.estimatedTotalTimeline.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Integration: Full Analysis
// ---------------------------------------------------------------------------

describe("analyzeIntake (integration)", () => {
  it("produces a complete analysis from form data", () => {
    const fd = createFormData({
      phone: "(555) 999-0000",
      projectTypes: ["Marketing Website", "CRM System"],
      description:
        "We need a modern marketing website with lead capture and a CRM to track our sales pipeline",
      goals: "Increase monthly revenue by 25% and track all leads from inquiry to close",
      budgetRange: "$15,000 - $30,000",
      timeline: "3-6 months",
      hasExistingSite: "Yes — it needs a complete rebuild",
      currentPainPoints: "Losing track of leads, no online presence",
      desiredFeatures: [
        "Contact / Lead Capture Forms",
        "Analytics & Reporting",
        "SEO Optimization",
        "Email Marketing Integration",
      ],
      hasBrandAssets: "Yes — logo, colors, brand guide",
      competitors: "Local Competitor A, Regional Competitor B",
      inspiration: "https://stripe.com",
      additionalNotes: "We want to stand out in our market",
      howDidYouHear: "Referral",
    });

    const analysis = analyzeIntake(fd, {
      id: "test-uuid",
      submittedAt: "2026-02-28T12:00:00.000Z",
    });

    // Structure
    expect(analysis.id).toBe("test-uuid");
    expect(analysis.submittedAt).toBe("2026-02-28T12:00:00.000Z");
    expect(analysis.formData).toEqual(fd);

    // Client profile — all 5 dimensions populated
    expect(analysis.clientProfile.businessMaturity.score).toBeGreaterThan(0);
    expect(analysis.clientProfile.projectReadiness.score).toBeGreaterThan(0);
    expect(analysis.clientProfile.engagementLevel.score).toBeGreaterThan(0);
    expect(analysis.clientProfile.scopeClarity.score).toBeGreaterThan(0);
    expect(analysis.clientProfile.budgetAlignment.score).toBeGreaterThan(0);

    // Service recommendations
    expect(analysis.serviceRecommendations.length).toBeGreaterThanOrEqual(2);
    const primaryRec = analysis.serviceRecommendations.find((r) => r.isPrimary);
    expect(primaryRec).toBeDefined();

    // Complexity
    expect(analysis.complexityScore.overall).toBeGreaterThanOrEqual(1);
    expect(analysis.complexityScore.overall).toBeLessThanOrEqual(10);
    expect(analysis.complexityScore.label).toBeTruthy();

    // Paths forward
    expect(analysis.pathsForward.length).toBeGreaterThanOrEqual(1);
    for (const path of analysis.pathsForward) {
      expect(path.phases.length).toBeGreaterThanOrEqual(1);
      expect(path.estimatedTimeline).toBeTruthy();
      expect(path.estimatedInvestment).toBeTruthy();
    }

    // Flags
    expect(Array.isArray(analysis.flags)).toBe(true);

    // Summary
    expect(analysis.summary.projectType).toContain("Marketing Website");
    expect(analysis.summary.headline).toBeTruthy();
    expect(analysis.summary.estimatedTotalInvestment).toBeTruthy();
  });

  it("handles a minimal solo founder submission", () => {
    const fd = createFormData({
      projectTypes: ["Landing Page"],
      description: "Simple landing page for my new business idea",
      goals: "Get signups for launch",
      budgetRange: "$1,000 - $5,000",
      timeline: "ASAP — I needed this yesterday",
      desiredFeatures: ["Contact / Lead Capture Forms"],
    });

    const analysis = analyzeIntake(fd, { id: "minimal-test" });

    expect(analysis.complexityScore.label).toBe("Simple");
    expect(analysis.pathsForward).toHaveLength(1);
    expect(analysis.clientProfile.businessMaturity.label).toBe("Low");
    expect(analysis.serviceRecommendations.length).toBeGreaterThanOrEqual(1);
  });
});
