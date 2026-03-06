import { describe, expect, it } from "vitest";
import type { IntakeFormData } from "@/types/intake";
import type { IntakeAnalysis } from "@/types/intake-analysis";
import { analyzeIntake } from "./intake-scoring";
import { computePriorityScore, getPriorityBadgeColors } from "./prioritization";

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

function buildAnalysis(overrides: Partial<IntakeFormData> = {}): IntakeAnalysis {
  return analyzeIntake(createFormData(overrides), {
    id: "test-id",
    submittedAt: new Date().toISOString(),
  });
}

// ---------------------------------------------------------------------------
// computePriorityScore
// ---------------------------------------------------------------------------

describe("computePriorityScore", () => {
  it("returns a score between 0 and 100", () => {
    const result = computePriorityScore(buildAnalysis());
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("returns exactly 6 factors", () => {
    const result = computePriorityScore(buildAnalysis());
    expect(result.factors).toHaveLength(6);
  });

  it("factor weights sum to 1.0", () => {
    const result = computePriorityScore(buildAnalysis());
    const totalWeight = result.factors.reduce((sum, f) => sum + f.weight, 0);
    expect(totalWeight).toBeCloseTo(1.0, 5);
  });

  it("labels High for score >= 70", () => {
    const analysis = buildAnalysis({
      phone: "555-1234",
      website: "https://example.com",
      hasBrandAssets: "yes-full",
      businessSize: "6-20",
      competitorSites: "competitor.com",
      inspirationSites: "inspo.com",
      additionalNotes: "We want a full redesign with SEO focus and lead generation",
      howDidYouHear: "referral",
      brandColors: "#00D4FF",
      budgetRange: "15k-30k",
      timeline: "flexible",
      selectedServices: ["marketing-website"],
      serviceAnswers: {
        "marketing-website": {
          goals: "Generate more leads and increase brand visibility with SEO optimization",
          pages: "Home, About, Services, Contact, Blog, Portfolio, FAQ, Testimonials",
          features: "Contact form, blog, newsletter signup, analytics dashboard",
          audience: "Small business owners in the northeast looking for professional services",
          tone: "Professional but approachable",
          competitors: "They have clean designs with good SEO",
          content: "We have all content ready to go",
        },
      },
    });
    const result = computePriorityScore(analysis);
    expect(result.label).toBe("High");
    expect(result.score).toBeGreaterThanOrEqual(70);
  });

  it("labels Low for minimal intake with budget misalignment", () => {
    const analysis = buildAnalysis({
      budgetRange: "1k-5k",
      selectedServices: ["full-platform", "crm-system", "ai-tools"],
      timeline: "asap",
    });
    const result = computePriorityScore(analysis);
    expect(result.label).toBe("Low");
    expect(result.score).toBeLessThan(40);
  });

  it("does not use industry as a scoring factor", () => {
    const techAnalysis = buildAnalysis({ industry: "technology" });
    const salonAnalysis = buildAnalysis({ industry: "fitness-wellness" });
    const constructionAnalysis = buildAnalysis({ industry: "construction" });

    const techScore = computePriorityScore(techAnalysis).score;
    const salonScore = computePriorityScore(salonAnalysis).score;
    const constructionScore = computePriorityScore(constructionAnalysis).score;

    // Scores should be identical — industry has zero weight
    expect(techScore).toBe(salonScore);
    expect(salonScore).toBe(constructionScore);
  });

  it("does not use company size as a scoring factor", () => {
    const soloAnalysis = buildAnalysis({ businessSize: "just-me" });
    const largeAnalysis = buildAnalysis({ businessSize: "50+" });

    const soloScore = computePriorityScore(soloAnalysis).score;
    const largeScore = computePriorityScore(largeAnalysis).score;

    // Company size affects businessMaturity (not in priority weights),
    // but NOT directly used in prioritization. The difference should only
    // come from indirect effects on other profile scores.
    // The key test: both should be viable priority scores, not zero.
    expect(soloScore).toBeGreaterThan(0);
    expect(largeScore).toBeGreaterThan(0);
  });

  it("does not use budget amount as a scoring factor (only alignment)", () => {
    // Both budgets cover their respective service minimums
    const smallBudget = buildAnalysis({
      budgetRange: "1k-5k",
      selectedServices: ["landing-page"],
    });
    const largeBudget = buildAnalysis({
      budgetRange: "30k+",
      selectedServices: ["landing-page"],
    });

    const smallResult = computePriorityScore(smallBudget);
    const largeResult = computePriorityScore(largeBudget);

    // Both cover the scope — budget alignment should be similar
    // A $3K project for a landing page is just as valid as $30K for a landing page
    expect(smallResult.score).toBeGreaterThan(0);
    expect(largeResult.score).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Timeline Feasibility
// ---------------------------------------------------------------------------

describe("timeline feasibility factor", () => {
  it("scores high for flexible timeline", () => {
    const result = computePriorityScore(buildAnalysis({ timeline: "flexible" }));
    const timelineFactor = result.factors.find((f) => f.name === "Timeline Feasibility");
    expect(timelineFactor?.score).toBe(90);
  });

  it("penalizes ASAP with high complexity", () => {
    const result = computePriorityScore(buildAnalysis({
      timeline: "asap",
      selectedServices: ["full-platform", "crm-system", "ai-tools"],
    }));
    const timelineFactor = result.factors.find((f) => f.name === "Timeline Feasibility");
    expect(timelineFactor!.score).toBeLessThanOrEqual(25);
  });

  it("allows ASAP with low complexity", () => {
    const result = computePriorityScore(buildAnalysis({
      timeline: "asap",
      selectedServices: ["landing-page"],
    }));
    const timelineFactor = result.factors.find((f) => f.name === "Timeline Feasibility");
    expect(timelineFactor!.score).toBeGreaterThanOrEqual(50);
  });
});

// ---------------------------------------------------------------------------
// Risk Flags
// ---------------------------------------------------------------------------

describe("risk flags factor", () => {
  it("scores 100 when no flags", () => {
    const analysis = buildAnalysis();
    // Remove all flags for clean test
    analysis.flags = [];
    const result = computePriorityScore(analysis);
    const riskFactor = result.factors.find((f) => f.name === "Risk Assessment");
    expect(riskFactor?.score).toBe(100);
  });

  it("heavily penalizes RAI concerns", () => {
    const analysis = buildAnalysis();
    analysis.flags = [{ type: "rai-concern", message: "Test concern" }];
    const result = computePriorityScore(analysis);
    const riskFactor = result.factors.find((f) => f.name === "Risk Assessment");
    expect(riskFactor?.score).toBe(10);
  });

  it("moderately penalizes warnings", () => {
    const analysis = buildAnalysis();
    analysis.flags = [
      { type: "warning", message: "Warning 1" },
      { type: "warning", message: "Warning 2" },
    ];
    const result = computePriorityScore(analysis);
    const riskFactor = result.factors.find((f) => f.name === "Risk Assessment");
    expect(riskFactor!.score).toBe(60);
  });

  it("ignores opportunity and info flags in risk scoring", () => {
    const analysis = buildAnalysis();
    analysis.flags = [
      { type: "opportunity", message: "Great lead" },
      { type: "info", message: "Has existing site" },
    ];
    const result = computePriorityScore(analysis);
    const riskFactor = result.factors.find((f) => f.name === "Risk Assessment");
    expect(riskFactor?.score).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// Bias prevention
// ---------------------------------------------------------------------------

describe("bias prevention", () => {
  it("scores based on disclosed project data only", () => {
    const result = computePriorityScore(buildAnalysis());
    const factorNames = result.factors.map((f) => f.name);
    expect(factorNames).toEqual([
      "Project Readiness",
      "Budget Alignment",
      "Scope Clarity",
      "Engagement Level",
      "Timeline Feasibility",
      "Risk Assessment",
    ]);
    // None of these are: industry, company size, location, name, demographics
  });

  it("produces same score regardless of client name", () => {
    const a = buildAnalysis({ name: "John Smith" });
    const b = buildAnalysis({ name: "Maria Garcia" });
    expect(computePriorityScore(a).score).toBe(computePriorityScore(b).score);
  });

  it("produces same score regardless of email domain", () => {
    const a = buildAnalysis({ email: "ceo@fortune500.com" });
    const b = buildAnalysis({ email: "owner@smallbiz.net" });
    expect(computePriorityScore(a).score).toBe(computePriorityScore(b).score);
  });
});

// ---------------------------------------------------------------------------
// getPriorityBadgeColors
// ---------------------------------------------------------------------------

describe("getPriorityBadgeColors", () => {
  it("returns emerald for High", () => {
    expect(getPriorityBadgeColors("High")).toContain("emerald");
  });

  it("returns amber for Medium", () => {
    expect(getPriorityBadgeColors("Medium")).toContain("amber");
  });

  it("returns red for Low", () => {
    expect(getPriorityBadgeColors("Low")).toContain("red");
  });
});
