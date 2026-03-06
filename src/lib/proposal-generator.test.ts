import { describe, it, expect } from "vitest";
import { generateProposal, parseMidpointCents, computeScopedPriceCents } from "./proposal-generator";
import type { IntakeAnalysis } from "@/types/intake-analysis";
import type { Service } from "@/types/services";

const mockServices: Service[] = [
  {
    id: "marketing-websites",
    title: "Marketing Websites",
    description: "Custom responsive websites designed to convert visitors into customers.",
    priceRange: "$2,500 - $8,000",
    icon: "globe",
    features: ["Custom responsive design", "SEO optimization", "Analytics integration"],
    category: "web",
  },
  {
    id: "crm-systems",
    title: "CRM Systems",
    description: "Custom CRM systems that track every client and deal.",
    priceRange: "$8,000 - $25,000",
    icon: "database",
    features: ["Lead tracking & scoring", "Pipeline management", "Reporting & analytics"],
    category: "software",
  },
];

const mockAnalysis: IntakeAnalysis = {
  id: "test-id",
  submittedAt: "2026-03-01T00:00:00Z",
  formData: {
    name: "John Doe",
    email: "john@acme.com",
    phone: "555-1234",
    company: "Acme Corp",
    industry: "professional-services",
    businessSize: "6-20",
    website: "https://acme.com",
    yearsInBusiness: "5",
    selectedServices: ["marketing-website"],
    serviceAnswers: {
      "marketing-website": {
        aboutBusiness: "We are a professional consulting firm serving mid-market companies.",
        currentChallenge: "Our current site is outdated and doesn't generate leads.",
        successVision: "We want a site that positions us as industry leaders and drives inbound.",
      },
    },
    timeline: "1-3-months",
    budgetRange: "5k-15k",
    designPreference: "modern",
    hasBrandAssets: "yes-partial",
    additionalNotes: "Looking for a complete refresh",
    howDidYouHear: "referral",
    preferredContact: "email",
    brandColors: "",
    competitorSites: "",
    inspirationSites: "",
  },
  clientProfile: {
    businessMaturity: { score: 70, label: "High", signals: ["Established business"] },
    projectReadiness: { score: 65, label: "High", signals: ["Clear timeline"] },
    engagementLevel: { score: 80, label: "Very High", signals: ["Detailed responses"] },
    scopeClarity: { score: 60, label: "Medium", signals: ["Basic scope defined"] },
    budgetAlignment: { score: 75, label: "High", signals: ["Budget matches services"] },
  },
  serviceRecommendations: [
    {
      serviceId: "marketing-websites",
      serviceTitle: "Marketing Websites",
      fitScore: 90,
      fitLabel: "Strong Fit",
      reasons: ["Directly selected service", "Budget aligns with range"],
      estimatedRange: "$2,500 - $8,000",
      isPrimary: true,
    },
    {
      serviceId: "crm-systems",
      serviceTitle: "CRM Systems",
      fitScore: 55,
      fitLabel: "Good Fit",
      reasons: ["Could benefit from client tracking"],
      estimatedRange: "$8,000 - $25,000",
      isPrimary: false,
    },
  ],
  complexityScore: {
    overall: 4,
    label: "Moderate",
    factors: [{ name: "Multiple integrations", impact: "medium", detail: "SEO + analytics" }],
  },
  pathsForward: [
    {
      name: "Direct Build",
      description: "Complete website build in a single phase.",
      phases: [
        {
          order: 1,
          title: "Website Design & Development",
          services: ["marketing-websites"],
          duration: "4-6 weeks",
          description: "Full design and development of the marketing website.",
        },
      ],
      estimatedTimeline: "4-6 weeks",
      estimatedInvestment: "$2,500 - $8,000",
      recommended: true,
    },
  ],
  flags: [
    { type: "opportunity", message: "Client has existing brand assets to leverage" },
  ],
  summary: {
    projectType: "Marketing Website",
    clientType: "Established Business",
    headline: "Marketing website build for an established professional services company",
    estimatedTotalInvestment: "$2,500 - $8,000",
    estimatedTotalTimeline: "4-6 weeks",
  },
};

describe("proposal-generator", () => {
  describe("generateProposal", () => {
    it("generates a proposal with all required fields", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      expect(result.title).toBe("Proposal for Acme Corp");
      expect(result.summary).toBe(mockAnalysis.summary.headline);
      expect(result.content).toContain("## Executive Summary");
      expect(result.services.length).toBeGreaterThan(0);
      expect(result.estimatedBudgetCents).toBeGreaterThan(0);
      expect(result.timeline).toBe("3-5 weeks");
    });

    it("includes all major sections in content", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      expect(result.content).toContain("## Executive Summary");
      expect(result.content).toContain("## What We Understand");
      expect(result.content).toContain("## What We're Building");
      expect(result.content).toContain("## Timeline");
      expect(result.content).toContain("## Investment");
      expect(result.content).toContain("## What's Included");
      expect(result.content).toContain("## What's Not Included");
      expect(result.content).toContain("## Next Steps");
      expect(result.content).toContain("## Terms");
    });

    it("only includes services the client selected", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      expect(result.services.length).toBe(1);
      expect(result.services[0].serviceId).toBe("marketing-websites");
    });

    it("shows unselected high-fit services as future opportunities", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      expect(result.content).toContain("## Future Opportunities");
      expect(result.content).toContain("CRM Systems");
    });

    it("includes company name in content", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      expect(result.content).toContain("Acme Corp");
    });

    it("includes service features in scope of work", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      expect(result.content).toContain("Custom responsive design");
      expect(result.content).toContain("SEO optimization");
    });

    it("includes timeline phases from selected services", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      expect(result.content).toContain("Phase 1: Marketing Websites (3-5 weeks)");
    });

    it("includes RAI footer", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      expect(result.content).toContain("Reviewed and approved by Bas Rosario");
    });

    it("includes client profile data in at-a-glance format", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      expect(result.content).toContain("Professional Services");
      expect(result.content).toContain("6-20 people");
      expect(result.content).toContain("At a glance");
    });

    it("personalizes scope with client answers", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      expect(result.content).toContain("**What you told us isn't working:**");
      expect(result.content).toContain("professional consulting firm");
      expect(result.content).toContain("**What success looks like to you:**");
    });

    it("investment matches selected services only", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      // Midpoint of $2,500 - $8,000 = $5,250
      expect(result.estimatedBudgetCents).toBe(525000);
    });
  });

  describe("parseMidpointCents", () => {
    it("parses standard range", () => {
      expect(parseMidpointCents("$2,500 - $8,000")).toBe(525000);
    });

    it("parses range without commas", () => {
      expect(parseMidpointCents("$1000 - $3000")).toBe(200000);
    });

    it("returns 0 for invalid input", () => {
      expect(parseMidpointCents("TBD")).toBe(0);
    });

    it("returns 0 for empty string", () => {
      expect(parseMidpointCents("")).toBe(0);
    });
  });

  describe("computeScopedPriceCents", () => {
    it("returns midpoint for moderate complexity with no premium signals", () => {
      // Complexity 4, no premium keywords, budget within range, 1 service
      const rec = mockAnalysis.serviceRecommendations[0]; // marketing-websites $2,500-$8,000
      const result = computeScopedPriceCents(rec, mockAnalysis);
      // position = 0.3 + (4/10)*0.5 = 0.5 → price = 2500 + 5500*0.5 = $5,250
      expect(result).toBe(525000);
    });

    it("prices higher for high complexity", () => {
      const highComplexity: IntakeAnalysis = {
        ...mockAnalysis,
        complexityScore: { overall: 8, label: "Enterprise", factors: [] },
      };
      const rec = highComplexity.serviceRecommendations[0];
      const result = computeScopedPriceCents(rec, highComplexity);
      // position = 0.3 + (8/10)*0.5 = 0.7 → price = 2500 + 5500*0.7 = $6,350 → rounds to $6,250
      expect(result).toBeGreaterThan(525000);
    });

    it("prices lower for simple complexity", () => {
      const simple: IntakeAnalysis = {
        ...mockAnalysis,
        complexityScore: { overall: 2, label: "Simple", factors: [] },
      };
      const rec = simple.serviceRecommendations[0];
      const result = computeScopedPriceCents(rec, simple);
      // position = 0.3 + (2/10)*0.5 = 0.4 → price = 2500 + 5500*0.4 = $4,700 → rounds to $4,750
      expect(result).toBeLessThan(525000);
    });

    it("increases price when scope premium keywords are present", () => {
      const withKeywords: IntakeAnalysis = {
        ...mockAnalysis,
        serviceRecommendations: [{
          serviceId: "e-commerce",
          serviceTitle: "E-Commerce",
          fitScore: 90,
          fitLabel: "Strong Fit",
          reasons: ["Directly selected service"],
          estimatedRange: "$8,000 - $25,000",
          isPrimary: true,
        }],
        formData: {
          ...mockAnalysis.formData,
          selectedServices: ["ecommerce"],
          serviceAnswers: {
            ecommerce: {
              aboutBusiness: "We build custom furniture",
              currentSelling: "We need a 3D configurator with augmented reality preview and ERP integration",
              successVision: "70% DTC sales with a subscription loyalty program",
            },
          },
          budgetRange: "30k+",
        },
        complexityScore: { overall: 7, label: "Complex", factors: [] },
      };
      const rec = withKeywords.serviceRecommendations[0];
      const result = computeScopedPriceCents(rec, withKeywords);
      // High complexity + 5 keyword hits + budget exceeds range + 1 service
      // Should be well above the midpoint of $16,500
      expect(result).toBeGreaterThan(1650000);
      // Should not exceed 1.5x range cap: 8000 + 17000*1.5 = $33,500
      expect(result).toBeLessThanOrEqual(3350000);
    });

    it("boosts price when client budget exceeds service range", () => {
      const highBudget: IntakeAnalysis = {
        ...mockAnalysis,
        formData: { ...mockAnalysis.formData, budgetRange: "30k+" },
      };
      const rec = highBudget.serviceRecommendations[0]; // marketing-websites, high=$8,000
      const result = computeScopedPriceCents(rec, highBudget);
      // Budget floor $30K > high $8K → +0.2 boost
      expect(result).toBeGreaterThan(525000);
    });

    it("adds integration overhead for multi-service projects", () => {
      const multiService: IntakeAnalysis = {
        ...mockAnalysis,
        formData: {
          ...mockAnalysis.formData,
          selectedServices: ["marketing-website", "crm-system", "ecommerce"],
        },
      };
      const rec = multiService.serviceRecommendations[0];
      const single = computeScopedPriceCents(rec, mockAnalysis);
      const multi = computeScopedPriceCents(rec, multiService);
      // 3 services → +0.1 boost over single
      expect(multi).toBeGreaterThan(single);
    });

    it("returns 0 for invalid range", () => {
      const badRec = {
        ...mockAnalysis.serviceRecommendations[0],
        estimatedRange: "TBD",
      };
      expect(computeScopedPriceCents(badRec, mockAnalysis)).toBe(0);
    });
  });
});
