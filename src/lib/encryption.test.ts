import { describe, it, expect, beforeAll } from "vitest";

// Set a test encryption key before importing the module
beforeAll(() => {
  // 32 bytes base64-encoded
  process.env.ENCRYPTION_KEY = "dGVzdGtleWZvcmFlczI1NmdjbXRlc3Rz";
  // Ensure it's exactly 32 bytes
  const buf = Buffer.from(process.env.ENCRYPTION_KEY, "base64");
  if (buf.length !== 32) {
    // Generate a proper 32-byte key
    process.env.ENCRYPTION_KEY = Buffer.from(
      "0123456789abcdef0123456789abcdef"
    ).toString("base64");
  }
});

import {
  encrypt,
  decrypt,
  isEncrypted,
  hmacHash,
  encryptAnalysisPii,
  decryptAnalysisPii,
} from "./encryption";

describe("encryption", () => {
  describe("encrypt / decrypt", () => {
    it("encrypts and decrypts a string correctly", () => {
      const plaintext = "hello@example.com";
      const encrypted = encrypt(plaintext);
      expect(encrypted).not.toBe(plaintext);
      expect(encrypted.startsWith("enc:v1:")).toBe(true);
      expect(decrypt(encrypted)).toBe(plaintext);
    });

    it("produces different ciphertexts for the same plaintext (random IV)", () => {
      const plaintext = "test@test.com";
      const a = encrypt(plaintext);
      const b = encrypt(plaintext);
      expect(a).not.toBe(b);
      expect(decrypt(a)).toBe(plaintext);
      expect(decrypt(b)).toBe(plaintext);
    });

    it("returns empty string unchanged", () => {
      expect(encrypt("")).toBe("");
      expect(decrypt("")).toBe("");
    });

    it("handles unicode characters", () => {
      const plaintext = "Bj\u00f6rk Gu\u00f0mundsd\u00f3ttir";
      const encrypted = encrypt(plaintext);
      expect(decrypt(encrypted)).toBe(plaintext);
    });

    it("handles long strings", () => {
      const plaintext = "a".repeat(500);
      const encrypted = encrypt(plaintext);
      expect(decrypt(encrypted)).toBe(plaintext);
    });

    it("handles special characters", () => {
      const plaintext = "name+tag@sub.domain.co.uk";
      const encrypted = encrypt(plaintext);
      expect(decrypt(encrypted)).toBe(plaintext);
    });

    it("handles phone numbers", () => {
      const plaintext = "+1 (305) 555-0142";
      const encrypted = encrypt(plaintext);
      expect(decrypt(encrypted)).toBe(plaintext);
    });

    it("throws on tampered ciphertext", () => {
      const encrypted = encrypt("test");
      const tampered = encrypted.slice(0, -2) + "XX";
      expect(() => decrypt(tampered)).toThrow();
    });
  });

  describe("isEncrypted", () => {
    it("returns true for encrypted values", () => {
      expect(isEncrypted(encrypt("test"))).toBe(true);
    });

    it("returns false for plaintext", () => {
      expect(isEncrypted("hello@example.com")).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isEncrypted("")).toBe(false);
    });
  });

  describe("decrypt backwards compatibility", () => {
    it("returns plaintext values unchanged", () => {
      expect(decrypt("hello@example.com")).toBe("hello@example.com");
    });

    it("returns plain names unchanged", () => {
      expect(decrypt("Marcus Thompson")).toBe("Marcus Thompson");
    });
  });

  describe("hmacHash", () => {
    it("produces deterministic hashes", () => {
      const a = hmacHash("test@example.com");
      const b = hmacHash("test@example.com");
      expect(a).toBe(b);
    });

    it("is case-insensitive", () => {
      expect(hmacHash("Test@Example.COM")).toBe(hmacHash("test@example.com"));
    });

    it("produces different hashes for different inputs", () => {
      expect(hmacHash("a@b.com")).not.toBe(hmacHash("c@d.com"));
    });

    it("returns a hex string", () => {
      expect(hmacHash("test")).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe("encryptAnalysisPii / decryptAnalysisPii", () => {
    const mockAnalysis = {
      id: "test-id",
      submittedAt: "2026-03-01T00:00:00Z",
      formData: {
        name: "Marcus Thompson",
        email: "marcus@example.com",
        phone: "305-555-0142",
        company: "Test Corp",
        industry: "technology",
        selectedServices: ["marketing-website"],
        businessSize: "1-10",
        website: "",
        yearsInBusiness: "1-3",
        serviceAnswers: {},
        timeline: "1-3-months",
        budgetRange: "5k-15k",
        designPreference: "modern",
        hasBrandAssets: "no",
        brandColors: "",
        competitorSites: "",
        inspirationSites: "",
        additionalNotes: "",
        howDidYouHear: "search",
        preferredContact: "email",
      },
    };

    it("encrypts PII fields in analysis", () => {
      const encrypted = encryptAnalysisPii(mockAnalysis);
      expect(encrypted.formData.name).not.toBe("Marcus Thompson");
      expect(encrypted.formData.email).not.toBe("marcus@example.com");
      expect(encrypted.formData.phone).not.toBe("305-555-0142");
      expect(isEncrypted(encrypted.formData.name)).toBe(true);
      expect(isEncrypted(encrypted.formData.email)).toBe(true);
      expect(isEncrypted(encrypted.formData.phone)).toBe(true);
    });

    it("preserves non-PII fields", () => {
      const encrypted = encryptAnalysisPii(mockAnalysis);
      expect(encrypted.id).toBe("test-id");
      expect(encrypted.formData.company).toBe("Test Corp");
      expect(encrypted.formData.industry).toBe("technology");
    });

    it("round-trips correctly", () => {
      const encrypted = encryptAnalysisPii(mockAnalysis);
      const decrypted = decryptAnalysisPii(encrypted);
      expect(decrypted.formData.name).toBe("Marcus Thompson");
      expect(decrypted.formData.email).toBe("marcus@example.com");
      expect(decrypted.formData.phone).toBe("305-555-0142");
    });

    it("does not mutate the original object", () => {
      const original = JSON.parse(JSON.stringify(mockAnalysis));
      encryptAnalysisPii(mockAnalysis);
      expect(mockAnalysis).toEqual(original);
    });
  });
});
