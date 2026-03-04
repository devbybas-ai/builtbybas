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
    selectedServices: ["marketing-website"],
    name: "Test User",
    email: "test@example.com",
    phone: "",
    company: "Test Co",
    industry: "professional-services",
    businessSize: "just-me",
    website: "",
    yearsInBusiness: "1-3",
    serviceAnswers: {},
    timeline: "1-3-months",
    budgetRange: "5k-15k",
    designPreference: "modern-minimal",
    hasBrandAssets: "no",
    brandColors: "",
    competitorSites: "",
    inspirationSites: "",
    additionalNotes: "",
    howDidYouHear: "",
    preferredContact: "",
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
  it("returns null for 'unsure'", () => {
    expect(parseBudgetRange("unsure")).toBeNull();
  });

  it("parses 30k+ as open-ended", () => {
    expect(parseBudgetRange("30k+")).toEqual([30000, 100000]);
  });

  it("parses standard budget ranges", () => {
    expect(parseBudgetRange("1k-5k")).toEqual([1000, 5000]);
    expect(parseBudgetRange("5k-15k")).toEqual([5000, 15000]);
    expect(parseBudgetRange("15k-30k")).toEqual([15000, 30000]);
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
    // industry not "other" = +10, that's it
    expect(result.score).toBeLessThanOrEqual(25);
    expect(result.label).toBe("Low");
  });

  it("scores high for an established business", () => {
    const fd = createFormData({
      website: "https://currentsite.com",
      hasBrandAssets: "yes-full",
      businessSize: "21-50",
      industry: "healthcare",
      competitorSites: "Mayo Clinic, CVS Health",
    });
    const result = scoreBusinessMaturity(fd);
    // website +15, full brand +20, 6+ +15, 21+ +25, not other +10, competitors +15 = 100
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
      serviceAnswers: {},
      budgetRange: "unsure",
      timeline: "flexible",
      inspirationSites: "",
      selectedServices: [],
    });
    const result = scoreProjectReadiness(fd);
    expect(result.score).toBeLessThanOrEqual(25);
  });

  it("scores high with detailed input", () => {
    const fd = createFormData({
      selectedServices: ["marketing-website"],
      serviceAnswers: {
        "marketing-website": {
          "primary-goal":
            "Increase monthly leads from 10 to 50 within 6 months of launch and improve our conversion rate by 30%",
          "page-count": "5-7 pages with contact forms and SEO optimization",
          "target-audience":
            "Homeowners in the greater Phoenix area looking for plumbing services",
          "must-have-features": ["contact-form", "seo", "cms"],
          "content-ready":
            "We have most content ready to go, including photos and testimonials",
        },
      },
      budgetRange: "5k-15k",
      timeline: "1-3-months",
      inspirationSites: "https://example1.com, https://example2.com",
    });
    const result = scoreProjectReadiness(fd);
    // answerText > 200 +20, answerCount >= 5 +15, budget +20, timeline +15, inspiration +10, services +15 = 95
    expect(result.score).toBeGreaterThanOrEqual(80);
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
      competitorSites: "Competitor A, Competitor B",
      inspirationSites: "https://stripe.com",
      additionalNotes: "We want to launch before summer",
      howDidYouHear: "google",
      selectedServices: ["marketing-website", "crm-system"],
      brandColors: "#00D4FF, #0A0A0F",
      serviceAnswers: {
        "marketing-website": {
          "primary-goal": "Get more leads online through organic search",
          "page-count": "5-7 pages",
          "target-audience": "Small businesses",
          "content-ready": "We have all content prepared and ready to upload",
          "must-have-features": ["contact-form", "seo", "analytics"],
          "seo-importance": "Critical for our business growth",
          "call-to-action": "Request a quote",
          "blog-needed": "yes",
        },
        "crm-system": {
          "team-size": "5 users",
          "current-tools": "Excel spreadsheets",
          "key-workflows": "Lead tracking and follow-up management",
          "integration-needs": "Email and calendar",
        },
      },
    });
    const result = scoreEngagementLevel(fd);
    // phone +10, answerCount(12) >= 8 +20, competitors +15, inspiration +15, notes +15, hear +10, 2+ services +10, colors +5 = 100
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
      selectedServices: ["marketing-website"],
      serviceAnswers: {
        "marketing-website": {
          "primary-goal": "Increase leads by 50% and improve conversion rate",
          "page-count": "5 pages with login portal and SEO optimization",
          "target-audience": "Local homeowners looking for services",
        },
      },
      designPreference: "modern-minimal",
      website: "https://oldsite.com",
    });
    const result = scoreScopeClarity(fd);
    // focused +25, specific terms (page, login, seo) +20, metrics (50%, increase, conversion) +20, design defined +10, website/years +10 = 85
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.label).toBe("Very High");
  });
});

// ---------------------------------------------------------------------------
// Client Profile: Budget Alignment
// ---------------------------------------------------------------------------

describe("scoreBudgetAlignment", () => {
  it("returns 40 for 'unsure'", () => {
    const fd = createFormData({ budgetRange: "unsure" });
    const result = scoreBudgetAlignment(fd);
    expect(result.score).toBe(40);
  });

  it("scores high when budget covers scope", () => {
    const fd = createFormData({
      selectedServices: ["marketing-website"],
      budgetRange: "5k-15k",
    });
    const result = scoreBudgetAlignment(fd);
    // Marketing website min = $2,500, budget max $15,000 covers it
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it("scores low when budget is far below scope", () => {
    const fd = createFormData({
      selectedServices: ["full-platform", "ai-tools"],
      budgetRange: "1k-5k",
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
  it("recommends the correct primary service for a single selection", () => {
    const fd = createFormData({ selectedServices: ["marketing-website"] });
    const recs = scoreServiceRecommendations(fd);
    expect(recs.length).toBeGreaterThanOrEqual(1);
    expect(recs[0].serviceId).toBe("marketing-websites");
    expect(recs[0].isPrimary).toBe(true);
  });

  it("recommends multiple services for multiple selections", () => {
    const fd = createFormData({
      selectedServices: ["marketing-website", "crm-system"],
      budgetRange: "15k-30k",
    });
    const recs = scoreServiceRecommendations(fd);
    const ids = recs.map((r) => r.serviceId);
    expect(ids).toContain("marketing-websites");
    expect(ids).toContain("crm-systems");
  });

  it("boosts services matching service answer content", () => {
    const fd = createFormData({
      selectedServices: ["marketing-website"],
      serviceAnswers: {
        "marketing-website": {
          "primary-goal":
            "Sell products online and process payments through an e-commerce storefront",
        },
      },
    });
    const recs = scoreServiceRecommendations(fd);
    const ids = recs.map((r) => r.serviceId);
    // e-commerce should appear due to keyword alignment
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
  it("scores simple for a single service with few requirements", () => {
    const fd = createFormData({
      selectedServices: ["landing-page"],
    });
    const result = scoreComplexity(fd);
    expect(result.overall).toBeLessThanOrEqual(3);
    expect(result.label).toBe("Simple");
  });

  it("scores enterprise for full platform + AI + branding + tight timeline", () => {
    const fd = createFormData({
      selectedServices: [
        "marketing-website",
        "crm-system",
        "client-portal",
        "ai-tools",
      ],
      hasBrandAssets: "no",
      website: "",
      yearsInBusiness: "pre-launch",
      budgetRange: "30k+",
      timeline: "asap",
    });
    const result = scoreComplexity(fd);
    expect(result.overall).toBeGreaterThanOrEqual(8);
    expect(result.label).toBe("Enterprise");
    expect(result.factors.length).toBeGreaterThanOrEqual(5);
  });

  it("caps at 10", () => {
    const fd = createFormData({
      selectedServices: [
        "marketing-website",
        "website-redesign",
        "crm-system",
        "client-portal",
        "ai-tools",
      ],
      serviceAnswers: {
        "marketing-website": {
          q1: "answer1", q2: "answer2", q3: "answer3", q4: "answer4",
          q5: "answer5", q6: "answer6", q7: "answer7", q8: "answer8",
        },
        "crm-system": {
          q1: "api integration needed", q2: "third-party sync",
          q3: "answer3", q4: "answer4", q5: "answer5", q6: "answer6",
          q7: "answer7",
        },
      },
      hasBrandAssets: "no",
      website: "",
      yearsInBusiness: "pre-launch",
      budgetRange: "30k+",
      timeline: "asap",
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
      selectedServices: ["full-platform"],
      budgetRange: "1k-5k",
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

  it("flags opportunity for multiple services", () => {
    const fd = createFormData({
      selectedServices: ["marketing-website", "crm-system", "client-portal"],
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
    expect(opportunities.some((o) => o.message.includes("Multiple services"))).toBe(true);
  });

  it("flags info for existing site", () => {
    const fd = createFormData({
      website: "https://currentsite.com",
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

    expect(summary.projectType).toContain("Marketing Website");
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
      selectedServices: ["marketing-website", "crm-system"],
      serviceAnswers: {
        "marketing-website": {
          "primary-goal":
            "Increase monthly revenue by 25% and track all leads from inquiry to close",
          "page-count": "5-7 pages with lead capture forms",
          "target-audience": "Local businesses and homeowners",
          "content-ready": "We have most content ready",
          "seo-importance": "Critical for local search ranking",
        },
        "crm-system": {
          "team-size": "5 sales reps need access",
          "current-tools": "Spreadsheets and manual tracking — losing leads",
          "key-workflows": "Lead tracking from inquiry to close",
          "integration-needs": "Email marketing integration needed",
        },
      },
      budgetRange: "15k-30k",
      timeline: "3-6-months",
      website: "https://currentsite.com",
      hasBrandAssets: "yes-full",
      competitorSites: "Local Competitor A, Regional Competitor B",
      inspirationSites: "https://stripe.com",
      additionalNotes: "We want to stand out in our market",
      howDidYouHear: "referral",
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
      selectedServices: ["landing-page"],
      serviceAnswers: {
        "landing-page": {
          "primary-goal": "Get signups for launch of new business idea",
        },
      },
      budgetRange: "1k-5k",
      timeline: "asap",
    });

    const analysis = analyzeIntake(fd, { id: "minimal-test" });

    expect(analysis.complexityScore.label).toBe("Simple");
    expect(analysis.pathsForward).toHaveLength(1);
    expect(analysis.clientProfile.businessMaturity.label).toBe("Low");
    expect(analysis.serviceRecommendations.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// RAI Screening
// ---------------------------------------------------------------------------

describe("RAI concern flagging", () => {
  it("flags surveillance / tracking without consent", () => {
    const fd = createFormData({
      additionalNotes: "I want to secretly monitor my employees without them knowing",
    });
    const analysis = analyzeIntake(fd);
    const raiFlags = analysis.flags.filter((f) => f.type === "rai-concern");
    expect(raiFlags.length).toBeGreaterThanOrEqual(1);
    expect(raiFlags[0].message).toContain("surveillance");
  });

  it("flags deceptive practices like fake reviews", () => {
    const fd = createFormData({
      serviceAnswers: {
        "marketing-website": {
          notes: "I need a system to generate fake reviews for my business",
        },
      },
    });
    const analysis = analyzeIntake(fd);
    const raiFlags = analysis.flags.filter((f) => f.type === "rai-concern");
    expect(raiFlags.length).toBeGreaterThanOrEqual(1);
    expect(raiFlags[0].message).toContain("deceptive");
  });

  it("flags dark patterns", () => {
    const fd = createFormData({
      additionalNotes: "Make it impossible to unsubscribe once they sign up",
    });
    const analysis = analyzeIntake(fd);
    const raiFlags = analysis.flags.filter((f) => f.type === "rai-concern");
    expect(raiFlags.length).toBeGreaterThanOrEqual(1);
    expect(raiFlags[0].message).toContain("dark pattern");
  });

  it("flags exploitation of vulnerable populations", () => {
    const fd = createFormData({
      additionalNotes: "We want to target children with gambling features",
    });
    const analysis = analyzeIntake(fd);
    const raiFlags = analysis.flags.filter((f) => f.type === "rai-concern");
    expect(raiFlags.length).toBeGreaterThanOrEqual(1);
  });

  it("does NOT flag legitimate business requests", () => {
    const fd = createFormData({
      additionalNotes: "We need a professional website to attract more customers to our salon",
      serviceAnswers: {
        "marketing-website": {
          aboutBusiness: "We run a hair salon and want to grow our client base",
          idealCustomer: "Women aged 25-55 looking for premium hair services",
        },
      },
    });
    const analysis = analyzeIntake(fd);
    const raiFlags = analysis.flags.filter((f) => f.type === "rai-concern");
    expect(raiFlags).toHaveLength(0);
  });

  it("does NOT flag legitimate tracking/analytics requests", () => {
    const fd = createFormData({
      additionalNotes: "We need Google Analytics tracking and conversion tracking on our site",
    });
    const analysis = analyzeIntake(fd);
    const raiFlags = analysis.flags.filter((f) => f.type === "rai-concern");
    expect(raiFlags).toHaveLength(0);
  });
});
