import { describe, it, expect } from "vitest";
import { escapeHtml, sanitizeString, sanitizeObject } from "./sanitize";

describe("escapeHtml", () => {
  it("escapes HTML entities", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
    );
  });

  it("escapes ampersands", () => {
    expect(escapeHtml("foo & bar")).toBe("foo &amp; bar");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('"hello"')).toBe("&quot;hello&quot;");
  });

  it("leaves safe strings unchanged", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });
});

describe("sanitizeString", () => {
  it("trims whitespace", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("trims and escapes", () => {
    expect(sanitizeString("  <b>bold</b>  ")).toBe(
      "&lt;b&gt;bold&lt;/b&gt;"
    );
  });
});

describe("sanitizeObject", () => {
  it("only keeps allowed keys", () => {
    const allowed = new Set(["name", "email"]);
    const result = sanitizeObject(
      { name: "Bas", email: "test@test.com", password: "secret" },
      allowed
    );
    expect(result).toEqual({ name: "Bas", email: "test@test.com" });
    expect(result).not.toHaveProperty("password");
  });

  it("sanitizes string values", () => {
    const allowed = new Set(["name"]);
    const result = sanitizeObject({ name: "  <script>  " }, allowed);
    expect(result).toEqual({ name: "&lt;script&gt;" });
  });

  it("preserves non-string values", () => {
    const allowed = new Set(["count"]);
    const result = sanitizeObject({ count: 42 }, allowed);
    expect(result).toEqual({ count: 42 });
  });
});
