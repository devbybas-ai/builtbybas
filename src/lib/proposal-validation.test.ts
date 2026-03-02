import { describe, it, expect } from "vitest";
import {
  generateProposalSchema,
  createProposalSchema,
  updateProposalSchema,
  sendProposalSchema,
} from "./proposal-validation";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("proposal-validation", () => {
  describe("generateProposalSchema", () => {
    it("accepts valid intakeSubmissionId", () => {
      expect(
        generateProposalSchema.safeParse({ intakeSubmissionId: VALID_UUID }).success
      ).toBe(true);
    });

    it("accepts with optional clientId", () => {
      expect(
        generateProposalSchema.safeParse({
          intakeSubmissionId: VALID_UUID,
          clientId: VALID_UUID,
        }).success
      ).toBe(true);
    });

    it("rejects invalid UUID", () => {
      expect(
        generateProposalSchema.safeParse({ intakeSubmissionId: "bad" }).success
      ).toBe(false);
    });

    it("rejects missing intakeSubmissionId", () => {
      expect(generateProposalSchema.safeParse({}).success).toBe(false);
    });
  });

  describe("createProposalSchema", () => {
    const validProposal = {
      clientId: VALID_UUID,
      title: "Proposal for Acme Corp",
      summary: "A marketing website and CRM system",
      content: "## Executive Summary\n\nThis proposal outlines...",
    };

    it("accepts minimal valid proposal", () => {
      expect(createProposalSchema.safeParse(validProposal).success).toBe(true);
    });

    it("accepts full proposal data", () => {
      const result = createProposalSchema.safeParse({
        ...validProposal,
        intakeSubmissionId: VALID_UUID,
        services: [
          {
            serviceId: "marketing-websites",
            serviceName: "Marketing Websites",
            description: "Custom responsive website",
            estimatedPriceCents: 500000,
            estimatedTimeline: "4-6 weeks",
          },
        ],
        estimatedBudgetCents: 500000,
        timeline: "6-8 weeks",
        validUntil: "2026-04-01T00:00:00Z",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty title", () => {
      expect(
        createProposalSchema.safeParse({ ...validProposal, title: "" }).success
      ).toBe(false);
    });

    it("rejects empty content", () => {
      expect(
        createProposalSchema.safeParse({ ...validProposal, content: "" }).success
      ).toBe(false);
    });

    it("rejects invalid clientId", () => {
      expect(
        createProposalSchema.safeParse({ ...validProposal, clientId: "bad" }).success
      ).toBe(false);
    });

    it("rejects missing required fields", () => {
      expect(createProposalSchema.safeParse({}).success).toBe(false);
    });
  });

  describe("updateProposalSchema", () => {
    it("accepts status update", () => {
      expect(
        updateProposalSchema.safeParse({ status: "reviewed" }).success
      ).toBe(true);
    });

    it("accepts empty update", () => {
      expect(updateProposalSchema.safeParse({}).success).toBe(true);
    });

    it("rejects invalid status", () => {
      expect(
        updateProposalSchema.safeParse({ status: "invalid" }).success
      ).toBe(false);
    });

    it("accepts content update", () => {
      expect(
        updateProposalSchema.safeParse({ content: "Updated proposal content" }).success
      ).toBe(true);
    });

    it("accepts nullable fields", () => {
      expect(
        updateProposalSchema.safeParse({
          timeline: null,
          estimatedBudgetCents: null,
          rejectionReason: null,
        }).success
      ).toBe(true);
    });

    it("accepts rejection reason", () => {
      expect(
        updateProposalSchema.safeParse({
          status: "rejected",
          rejectionReason: "Budget too high",
        }).success
      ).toBe(true);
    });
  });

  describe("sendProposalSchema", () => {
    it("accepts valid email", () => {
      expect(
        sendProposalSchema.safeParse({ recipientEmail: "client@example.com" }).success
      ).toBe(true);
    });

    it("accepts email with name and message", () => {
      expect(
        sendProposalSchema.safeParse({
          recipientEmail: "client@example.com",
          recipientName: "John Doe",
          customMessage: "Looking forward to working together!",
        }).success
      ).toBe(true);
    });

    it("rejects invalid email", () => {
      expect(
        sendProposalSchema.safeParse({ recipientEmail: "not-an-email" }).success
      ).toBe(false);
    });

    it("rejects missing email", () => {
      expect(sendProposalSchema.safeParse({}).success).toBe(false);
    });
  });
});
