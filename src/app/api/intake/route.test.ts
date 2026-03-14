import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";
import type { IntakeAnalysis } from "@/types/intake-analysis";

// ---------------------------------------------------------------------------
// Mocks — use vi.hoisted() so variables are available when vi.mock factories
// execute (vi.mock calls are hoisted above all other code).
// ---------------------------------------------------------------------------

const {
  mockSaveSubmission,
  mockListSubmissions,
  mockAnalyzeIntake,
  mockRequireAdmin,
} = vi.hoisted(() => ({
  mockSaveSubmission: vi.fn(),
  mockListSubmissions: vi.fn(),
  mockAnalyzeIntake: vi.fn(),
  mockRequireAdmin: vi.fn(),
}));

vi.mock("@/lib/intake-storage", () => ({
  saveSubmission: (...args: unknown[]) => mockSaveSubmission(...args),
  listSubmissions: (...args: unknown[]) => mockListSubmissions(...args),
}));

vi.mock("@/lib/intake-scoring", () => ({
  analyzeIntake: (...args: unknown[]) => mockAnalyzeIntake(...args),
}));

vi.mock("@/lib/api-auth", () => ({
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args),
}));

// ---------------------------------------------------------------------------
// Import the handlers under test AFTER mocks are registered
// ---------------------------------------------------------------------------
import { POST, GET } from "./route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** A minimal valid intake payload that satisfies fullIntakeSchema */
function validIntakeBody(): Record<string, unknown> {
  return {
    selectedServices: ["marketing-website"],
    name: "Marcus Thompson",
    email: "marcus@example.com",
    phone: "305-555-0142",
    company: "Test Corp",
    industry: "technology",
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
  };
}

/** Stub analysis object returned by analyzeIntake */
function stubAnalysis(): IntakeAnalysis {
  return {
    id: "analysis-123",
    submittedAt: new Date().toISOString(),
    formData: validIntakeBody() as unknown as IntakeAnalysis["formData"],
    clientProfile: {
      businessMaturity: { score: 5, label: "Medium", signals: [] },
      projectReadiness: { score: 5, label: "Medium", signals: [] },
      engagementLevel: { score: 5, label: "Medium", signals: [] },
      scopeClarity: { score: 5, label: "Medium", signals: [] },
      budgetAlignment: { score: 5, label: "Medium", signals: [] },
    },
    serviceRecommendations: [],
    complexityScore: { overall: 5, label: "Moderate", factors: [] },
    pathsForward: [],
    flags: [],
    summary: {
      headline: "Test",
      overview: "Test overview",
      fitAssessment: "Test fit",
      nextSteps: [],
    } as IntakeAnalysis["summary"],
  };
}

function buildPostRequest(
  body: unknown,
  ip = "127.0.0.1",
): NextRequest {
  const jsonFn =
    body === "INVALID_JSON"
      ? () => {
          throw new SyntaxError("Unexpected token");
        }
      : () => Promise.resolve(body);

  return {
    json: jsonFn,
    headers: new Headers({ "x-forwarded-for": ip }),
  } as unknown as NextRequest;
}

// ---------------------------------------------------------------------------
// Tests — POST /api/intake
// ---------------------------------------------------------------------------

describe("POST /api/intake", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await POST(buildPostRequest("INVALID_JSON"));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Invalid request body");
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(buildPostRequest({ name: "Only Name" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Validation failed");
  });

  it("returns 400 when email is invalid", async () => {
    const body = { ...validIntakeBody(), email: "not-an-email" };
    const res = await POST(buildPostRequest(body));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("returns 400 when selectedServices is empty", async () => {
    const body = { ...validIntakeBody(), selectedServices: [] };
    const res = await POST(buildPostRequest(body));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("returns 200 with analysis id on valid submission", async () => {
    const analysis = stubAnalysis();
    mockAnalyzeIntake.mockReturnValueOnce(analysis);
    mockSaveSubmission.mockResolvedValueOnce(undefined);

    const res = await POST(buildPostRequest(validIntakeBody()));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.id).toBe("analysis-123");
    expect(mockSaveSubmission).toHaveBeenCalledWith(analysis);
  });

  it("returns 500 when saveSubmission fails", async () => {
    mockAnalyzeIntake.mockReturnValueOnce(stubAnalysis());
    mockSaveSubmission.mockRejectedValueOnce(new Error("db down"));

    const res = await POST(buildPostRequest(validIntakeBody()));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Failed to save submission");
  });

  it("returns 429 after exceeding rate limit", async () => {
    const ip = "192.168.1.50";

    // The rate limiter allows 10 submissions per hour.
    // Each request counts toward the rate limit regardless of validation outcome.
    for (let i = 0; i < 10; i++) {
      await POST(buildPostRequest({ name: "X" }, ip));
    }

    // 11th request should be rate-limited
    const res = await POST(buildPostRequest(validIntakeBody(), ip));
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.success).toBe(false);
    expect(json.error).toContain("Too many submissions");
  });
});

// ---------------------------------------------------------------------------
// Tests — GET /api/intake
// ---------------------------------------------------------------------------

describe("GET /api/intake", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValueOnce({
      error: Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      ),
    });

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Authentication required");
  });

  it("returns 403 for non-admin users", async () => {
    mockRequireAdmin.mockResolvedValueOnce({
      error: Response.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 },
      ),
    });

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
  });

  it("returns submissions for authenticated admin", async () => {
    const stubSubmissions = [{ id: "sub-1" }, { id: "sub-2" }];
    mockRequireAdmin.mockResolvedValueOnce({
      user: { id: "u1", email: "bas@builtbybas.com", name: "Bas", role: "owner" },
    });
    mockListSubmissions.mockResolvedValueOnce(stubSubmissions);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toEqual(stubSubmissions);
  });

  it("returns 500 when listSubmissions fails", async () => {
    mockRequireAdmin.mockResolvedValueOnce({
      user: { id: "u1", email: "bas@builtbybas.com", name: "Bas", role: "owner" },
    });
    mockListSubmissions.mockRejectedValueOnce(new Error("db error"));

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Failed to retrieve submissions");
  });
});
