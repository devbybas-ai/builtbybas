import { describe, expect, it } from "vitest";
import {
  createClientSchema,
  updateClientSchema,
  updatePipelineStageSchema,
  createNoteSchema,
  convertIntakeSchema,
} from "./client-validation";
import {
  PIPELINE_STAGES,
  getStageMeta,
} from "@/types/client";

// ============================================
// createClientSchema
// ============================================

describe("createClientSchema", () => {
  const validClient = {
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Corp",
  };

  it("validates a minimal valid client", () => {
    const result = createClientSchema.safeParse(validClient);
    expect(result.success).toBe(true);
  });

  it("validates a fully populated client", () => {
    const result = createClientSchema.safeParse({
      ...validClient,
      phone: "555-1234",
      industry: "Technology",
      website: "https://acme.com",
      pipelineStage: "lead",
      source: "referral",
      intakeSubmissionId: "abc-123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = createClientSchema.safeParse({
      email: "john@example.com",
      company: "Acme",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = createClientSchema.safeParse({
      ...validClient,
      name: "J",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = createClientSchema.safeParse({
      ...validClient,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing company", () => {
    const result = createClientSchema.safeParse({
      name: "John",
      email: "john@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid website URL", () => {
    const result = createClientSchema.safeParse({
      ...validClient,
      website: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty string for website", () => {
    const result = createClientSchema.safeParse({
      ...validClient,
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("validates all 12 pipeline stage values", () => {
    for (const stage of PIPELINE_STAGES) {
      const result = createClientSchema.safeParse({
        ...validClient,
        pipelineStage: stage.value,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid pipeline stage", () => {
    const result = createClientSchema.safeParse({
      ...validClient,
      pipelineStage: "invalid_stage",
    });
    expect(result.success).toBe(false);
  });
});

// ============================================
// updateClientSchema
// ============================================

describe("updateClientSchema", () => {
  it("accepts partial updates", () => {
    const result = updateClientSchema.safeParse({ name: "Jane Doe" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object (no updates)", () => {
    const result = updateClientSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = updateClientSchema.safeParse({ status: "deleted" });
    expect(result.success).toBe(false);
  });

  it("accepts valid status values", () => {
    for (const status of ["active", "archived", "lost"]) {
      const result = updateClientSchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it("accepts null for nullable fields", () => {
    const result = updateClientSchema.safeParse({
      phone: null,
      industry: null,
      website: null,
      assignedTo: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid assignedTo UUID", () => {
    const result = updateClientSchema.safeParse({
      assignedTo: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });
});

// ============================================
// updatePipelineStageSchema
// ============================================

describe("updatePipelineStageSchema", () => {
  it("accepts valid stage", () => {
    const result = updatePipelineStageSchema.safeParse({
      stage: "proposal_sent",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid stage", () => {
    const result = updatePipelineStageSchema.safeParse({
      stage: "nonexistent",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional note", () => {
    const result = updatePipelineStageSchema.safeParse({
      stage: "lead",
      note: "Initial contact via website",
    });
    expect(result.success).toBe(true);
  });

  it("rejects note over 500 characters", () => {
    const result = updatePipelineStageSchema.safeParse({
      stage: "lead",
      note: "x".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});

// ============================================
// createNoteSchema
// ============================================

describe("createNoteSchema", () => {
  it("validates a simple note", () => {
    const result = createNoteSchema.safeParse({
      content: "Called the client today.",
    });
    expect(result.success).toBe(true);
  });

  it("requires content", () => {
    const result = createNoteSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects empty content", () => {
    const result = createNoteSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
  });

  it("rejects content over 5000 characters", () => {
    const result = createNoteSchema.safeParse({
      content: "x".repeat(5001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid note types", () => {
    for (const type of ["general", "call", "email", "meeting", "internal"]) {
      const result = createNoteSchema.safeParse({
        type,
        content: "Test note",
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid note type", () => {
    const result = createNoteSchema.safeParse({
      type: "sms",
      content: "Test",
    });
    expect(result.success).toBe(false);
  });
});

// ============================================
// convertIntakeSchema
// ============================================

describe("convertIntakeSchema", () => {
  it("accepts a valid intake ID", () => {
    const result = convertIntakeSchema.safeParse({
      intakeSubmissionId: "abc-def-123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty intake ID", () => {
    const result = convertIntakeSchema.safeParse({
      intakeSubmissionId: "",
    });
    expect(result.success).toBe(false);
  });
});

// ============================================
// PIPELINE_STAGES constant
// ============================================

describe("PIPELINE_STAGES", () => {
  it("has exactly 12 stages", () => {
    expect(PIPELINE_STAGES).toHaveLength(12);
  });

  it("stages are in correct order (1-12)", () => {
    PIPELINE_STAGES.forEach((stage, i) => {
      expect(stage.order).toBe(i + 1);
    });
  });

  it("all stage values are unique", () => {
    const values = PIPELINE_STAGES.map((s) => s.value);
    expect(new Set(values).size).toBe(12);
  });

  it("first stage is lead, last is completed", () => {
    expect(PIPELINE_STAGES[0].value).toBe("lead");
    expect(PIPELINE_STAGES[11].value).toBe("completed");
  });
});

// ============================================
// getStageMeta / getNextStage helpers
// ============================================

describe("getStageMeta", () => {
  it("returns metadata for valid stages", () => {
    const meta = getStageMeta("lead");
    expect(meta).toBeDefined();
    expect(meta?.label).toBe("Lead");
    expect(meta?.order).toBe(1);
  });

  it("returns undefined for invalid stage", () => {
    const meta = getStageMeta("invalid" as never);
    expect(meta).toBeUndefined();
  });
});

