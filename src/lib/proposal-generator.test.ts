import { describe, it, expect } from "vitest";
import { generateProposal, parseMidpointCents } from "./proposal-generator";
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
      expect(result.content).toContain("## Understanding Your Needs");
      expect(result.content).toContain("## Scope of Work");
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

    it("includes client profile data", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      expect(result.content).toContain("Professional Services");
      expect(result.content).toContain("6-20 people");
      expect(result.content).toContain("1-3 months");
    });

    it("personalizes scope with client answers", () => {
      const result = generateProposal(mockAnalysis, mockServices);
      expect(result.content).toContain("**Your business:**");
      expect(result.content).toContain("professional consulting firm");
      expect(result.content).toContain("**The challenge:**");
      expect(result.content).toContain("**Your vision:**");
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
});
