import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Mocks — use vi.hoisted() so variables are available when vi.mock factories
// execute (vi.mock calls are hoisted above all other code).
// ---------------------------------------------------------------------------

const {
  mockLimit,
  mockWhere,
  mockFrom,
  mockSelect,
  mockVerifyPassword,
  mockCreateSession,
  mockCleanupExpiredSessions,
} = vi.hoisted(() => {
  const mockLimit = vi.fn();
  const mockWhere = vi.fn(() => ({ limit: mockLimit }));
  const mockFrom = vi.fn(() => ({ where: mockWhere }));
  const mockSelect = vi.fn(() => ({ from: mockFrom }));
  const mockVerifyPassword = vi.fn();
  const mockCreateSession = vi.fn();
  const mockCleanupExpiredSessions = vi.fn();
  return {
    mockLimit,
    mockWhere,
    mockFrom,
    mockSelect,
    mockVerifyPassword,
    mockCreateSession,
    mockCleanupExpiredSessions,
  };
});

vi.mock("@/lib/db", () => ({
  db: { select: mockSelect },
}));

vi.mock("@/lib/auth", () => ({
  verifyPassword: (...args: unknown[]) => mockVerifyPassword(...args),
  createSession: (...args: unknown[]) => mockCreateSession(...args),
  cleanupExpiredSessions: (...args: unknown[]) =>
    mockCleanupExpiredSessions(...args),
}));

vi.mock("@/lib/schema", () => ({
  users: { email: "email" },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Import the handler under test AFTER mocks are registered
// ---------------------------------------------------------------------------
import { POST } from "./route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Each test gets a unique IP to avoid cross-test rate limit interference.
// The rate limiter is a module-level singleton whose state persists across tests.
let ipCounter = 0;
function nextIp(): string {
  ipCounter++;
  return `10.${Math.floor(ipCounter / 256)}.${ipCounter % 256}.1`;
}

function buildRequest(
  body: Record<string, unknown>,
  ip?: string,
): NextRequest {
  return {
    json: () => Promise.resolve(body),
    headers: new Headers({ "x-forwarded-for": ip ?? nextIp() }),
  } as unknown as NextRequest;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Input validation ---------------------------------------------------

  it("returns 400 when email is missing", async () => {
    const res = await POST(buildRequest({ password: "securepassword" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Invalid email or password");
  });

  it("returns 400 when password is missing", async () => {
    const res = await POST(buildRequest({ email: "bas@builtbybas.com" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("returns 400 for an invalid email format", async () => {
    const res = await POST(
      buildRequest({ email: "not-an-email", password: "securepassword" }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("returns 400 when password is too short", async () => {
    const res = await POST(
      buildRequest({ email: "bas@builtbybas.com", password: "short" }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  // --- Authentication failures --------------------------------------------

  it("returns 401 when user is not found", async () => {
    mockLimit.mockResolvedValueOnce([]);

    const res = await POST(
      buildRequest({ email: "nobody@test.com", password: "securepassword" }),
    );
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Invalid email or password");
  });

  it("returns 401 when password is incorrect", async () => {
    mockLimit.mockResolvedValueOnce([
      {
        id: "user-1",
        email: "bas@builtbybas.com",
        name: "Bas",
        role: "owner",
        passwordHash: "$2a$12$fakehash",
      },
    ]);
    mockVerifyPassword.mockResolvedValueOnce(false);

    const res = await POST(
      buildRequest({ email: "bas@builtbybas.com", password: "wrongpassword" }),
    );
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Invalid email or password");
    expect(mockVerifyPassword).toHaveBeenCalledWith(
      "wrongpassword",
      "$2a$12$fakehash",
    );
  });

  // --- Successful login ---------------------------------------------------

  it("returns 200 with user data on valid credentials", async () => {
    mockLimit.mockResolvedValueOnce([
      {
        id: "user-1",
        email: "bas@builtbybas.com",
        name: "Bas Rosario",
        role: "owner",
        passwordHash: "$2a$12$fakehash",
      },
    ]);
    mockVerifyPassword.mockResolvedValueOnce(true);
    mockCreateSession.mockResolvedValueOnce("session-abc");
    mockCleanupExpiredSessions.mockResolvedValueOnce(undefined);

    const res = await POST(
      buildRequest({
        email: "bas@builtbybas.com",
        password: "securepassword",
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toEqual({
      id: "user-1",
      email: "bas@builtbybas.com",
      name: "Bas Rosario",
      role: "owner",
    });
    expect(mockCreateSession).toHaveBeenCalledWith("user-1");
  });

  it("does not expose passwordHash in the response", async () => {
    mockLimit.mockResolvedValueOnce([
      {
        id: "user-1",
        email: "bas@builtbybas.com",
        name: "Bas",
        role: "owner",
        passwordHash: "$2a$12$fakehash",
      },
    ]);
    mockVerifyPassword.mockResolvedValueOnce(true);
    mockCreateSession.mockResolvedValueOnce("session-abc");
    mockCleanupExpiredSessions.mockResolvedValueOnce(undefined);

    const res = await POST(
      buildRequest({
        email: "bas@builtbybas.com",
        password: "securepassword",
      }),
    );
    const json = await res.json();

    expect(json.data).not.toHaveProperty("passwordHash");
  });

  // --- Rate limiting ------------------------------------------------------

  it("returns 429 after exceeding rate limit", async () => {
    const ip = "10.0.0.99";

    // The rate limiter allows 5 attempts per window.
    // Each call that reaches the handler (even failures) counts.
    for (let i = 0; i < 5; i++) {
      mockLimit.mockResolvedValueOnce([]);
      await POST(
        buildRequest(
          { email: "x@test.com", password: "securepassword" },
          ip,
        ),
      );
    }

    // 6th request should be rate-limited (never reaches db)
    const res = await POST(
      buildRequest(
        { email: "x@test.com", password: "securepassword" },
        ip,
      ),
    );
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.success).toBe(false);
    expect(json.error).toContain("Too many login attempts");
  });
});
