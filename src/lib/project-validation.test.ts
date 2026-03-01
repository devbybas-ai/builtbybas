import { describe, it, expect } from "vitest";
import { createProjectSchema, updateProjectSchema } from "./project-validation";

describe("project-validation", () => {
  describe("createProjectSchema", () => {
    it("accepts valid project data", () => {
      const result = createProjectSchema.safeParse({
        clientId: "550e8400-e29b-41d4-a716-446655440000",
        name: "Website Redesign",
      });
      expect(result.success).toBe(true);
    });

    it("accepts full project data", () => {
      const result = createProjectSchema.safeParse({
        clientId: "550e8400-e29b-41d4-a716-446655440000",
        name: "Full Platform Build",
        description: "Complete website and CRM system",
        status: "in_progress",
        startDate: "2026-03-01T00:00:00Z",
        targetDate: "2026-06-01T00:00:00Z",
        budgetCents: 1500000,
        services: ["marketing-website", "crm-system"],
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing name", () => {
      const result = createProjectSchema.safeParse({
        clientId: "550e8400-e29b-41d4-a716-446655440000",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid clientId", () => {
      const result = createProjectSchema.safeParse({
        clientId: "not-a-uuid",
        name: "Test",
      });
      expect(result.success).toBe(false);
    });

    it("rejects negative budget", () => {
      const result = createProjectSchema.safeParse({
        clientId: "550e8400-e29b-41d4-a716-446655440000",
        name: "Test",
        budgetCents: -100,
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid status", () => {
      const result = createProjectSchema.safeParse({
        clientId: "550e8400-e29b-41d4-a716-446655440000",
        name: "Test",
        status: "invalid",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateProjectSchema", () => {
    it("accepts partial updates", () => {
      expect(
        updateProjectSchema.safeParse({ name: "New Name" }).success
      ).toBe(true);
      expect(
        updateProjectSchema.safeParse({ status: "completed" }).success
      ).toBe(true);
      expect(
        updateProjectSchema.safeParse({}).success
      ).toBe(true);
    });

    it("accepts nullable fields", () => {
      const result = updateProjectSchema.safeParse({
        startDate: null,
        targetDate: null,
        budgetCents: null,
        assignedTo: null,
      });
      expect(result.success).toBe(true);
    });
  });
});
