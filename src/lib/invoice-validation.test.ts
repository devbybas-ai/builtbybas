import { describe, it, expect } from "vitest";
import { createInvoiceSchema, updateInvoiceSchema } from "./invoice-validation";

describe("invoice-validation", () => {
  describe("createInvoiceSchema", () => {
    it("accepts valid invoice with one item", () => {
      const result = createInvoiceSchema.safeParse({
        clientId: "550e8400-e29b-41d4-a716-446655440000",
        dueDate: "2026-04-01T00:00:00Z",
        items: [
          { description: "Website Design", quantity: 1, unitPriceCents: 500000 },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("accepts full invoice data", () => {
      const result = createInvoiceSchema.safeParse({
        clientId: "550e8400-e29b-41d4-a716-446655440000",
        projectId: "660e8400-e29b-41d4-a716-446655440000",
        dueDate: "2026-04-01T00:00:00Z",
        taxRate: 0.08,
        notes: "Thank you for your business",
        items: [
          { description: "Website Design", quantity: 1, unitPriceCents: 300000 },
          { description: "SEO Setup", quantity: 1, unitPriceCents: 100000 },
          { description: "Hosting (monthly)", quantity: 12, unitPriceCents: 5000 },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty items array", () => {
      const result = createInvoiceSchema.safeParse({
        clientId: "550e8400-e29b-41d4-a716-446655440000",
        dueDate: "2026-04-01T00:00:00Z",
        items: [],
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing dueDate", () => {
      const result = createInvoiceSchema.safeParse({
        clientId: "550e8400-e29b-41d4-a716-446655440000",
        items: [
          { description: "Test", quantity: 1, unitPriceCents: 100 },
        ],
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid clientId", () => {
      const result = createInvoiceSchema.safeParse({
        clientId: "bad",
        dueDate: "2026-04-01T00:00:00Z",
        items: [
          { description: "Test", quantity: 1, unitPriceCents: 100 },
        ],
      });
      expect(result.success).toBe(false);
    });

    it("rejects tax rate above 100%", () => {
      const result = createInvoiceSchema.safeParse({
        clientId: "550e8400-e29b-41d4-a716-446655440000",
        dueDate: "2026-04-01T00:00:00Z",
        taxRate: 1.5,
        items: [
          { description: "Test", quantity: 1, unitPriceCents: 100 },
        ],
      });
      expect(result.success).toBe(false);
    });

    it("rejects item with empty description", () => {
      const result = createInvoiceSchema.safeParse({
        clientId: "550e8400-e29b-41d4-a716-446655440000",
        dueDate: "2026-04-01T00:00:00Z",
        items: [
          { description: "", quantity: 1, unitPriceCents: 100 },
        ],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateInvoiceSchema", () => {
    it("accepts status update", () => {
      expect(
        updateInvoiceSchema.safeParse({ status: "paid" }).success
      ).toBe(true);
    });

    it("accepts empty update", () => {
      expect(updateInvoiceSchema.safeParse({}).success).toBe(true);
    });

    it("rejects invalid status", () => {
      expect(
        updateInvoiceSchema.safeParse({ status: "invalid" }).success
      ).toBe(false);
    });

    it("accepts items update", () => {
      const result = updateInvoiceSchema.safeParse({
        items: [
          { description: "Updated line item", quantity: 2, unitPriceCents: 250000 },
        ],
      });
      expect(result.success).toBe(true);
    });
  });
});
