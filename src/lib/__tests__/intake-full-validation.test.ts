import { describe, it, expect } from "vitest";
import { fullIntakeSchema } from "@/lib/intake-validation";
import { INITIAL_FORM_DATA } from "@/types/intake";

describe("fullIntakeSchema with concierge flow", () => {
  it("passes with all fields filled (concierge: service + priority + timeline)", () => {
    const formData = {
      selectedServices: ["marketing-website"],
      conciergePriority: "budget",
      timeline: "asap",
      name: "Test User",
      email: "test@example.com",
      phone: "",
      company: "Test Co",
      industry: "technology",
      businessSize: "2-5",
      website: "",
      yearsInBusiness: "1-3",
      serviceAnswers: {
        "marketing-website": {
          aboutBusiness: "We build software",
          successVision: "More customers",
          contentReady: "partial",
        },
      },
      budgetRange: "5k-15k",
      designPreference: "modern-minimal",
      hasBrandAssets: "yes-full",
      brandColors: "",
      competitorSites: "",
      inspirationSites: "",
      additionalNotes: "",
      howDidYouHear: "google",
      preferredContact: "phone",
    };
    const result = fullIntakeSchema.safeParse(formData);
    if (!result.success) {
      const fields = result.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`,
      );
      expect.fail(`Validation failed on: ${fields.join(", ")}`);
    }
    expect(result.success).toBe(true);
  });

  it("shows which fields fail with INITIAL_FORM_DATA + concierge overrides only", () => {
    const formData = {
      ...INITIAL_FORM_DATA,
      selectedServices: ["marketing-website"],
      conciergePriority: "budget",
      timeline: "asap",
    };
    const result = fullIntakeSchema.safeParse(formData);
    // This SHOULD fail because user hasn't filled contact/business/design steps
    expect(result.success).toBe(false);
    if (!result.success) {
      const failingFields = result.error.issues.map((i) => i.path.join("."));
      // These are the fields that need user input
      console.log("Fields that require user input:", failingFields);
      expect(failingFields).toContain("name");
      expect(failingFields).toContain("company");
      expect(failingFields).toContain("industry");
      expect(failingFields).toContain("businessSize");
      expect(failingFields).toContain("budgetRange");
      expect(failingFields).toContain("designPreference");
      expect(failingFields).toContain("hasBrandAssets");
    }
  });
});
