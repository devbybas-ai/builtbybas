import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks — use vi.hoisted() so variables are available when vi.mock factories
// execute (vi.mock calls are hoisted above all other code).
// ---------------------------------------------------------------------------

const {
  mockRequireAdmin,
  mockLimit,
  mockSelectWhere,
  mockSelectFrom,
  mockSelect,
  mockUpdateWhere,
  mockUpdateSet,
  mockUpdate,
} = vi.hoisted(() => {
  const mockLimit = vi.fn();
  const mockSelectWhere = vi.fn(() => ({ limit: mockLimit }));
  const mockSelectFrom = vi.fn(() => ({ where: mockSelectWhere }));
  const mockSelect = vi.fn(() => ({ from: mockSelectFrom }));

  const mockUpdateWhere = vi.fn();
  const mockUpdateSet = vi.fn(() => ({ where: mockUpdateWhere }));
  const mockUpdate = vi.fn(() => ({ set: mockUpdateSet }));

  return {
    mockRequireAdmin: vi.fn(),
    mockLimit,
    mockSelectWhere,
    mockSelectFrom,
    mockSelect,
    mockUpdateWhere,
    mockUpdateSet,
    mockUpdate,
  };
});

vi.mock("@/lib/api-auth", () => ({
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args),
}));

vi.mock("@/lib/db", () => ({
  db: {
    select: (...args: unknown[]) => mockSelect(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
  },
}));

vi.mock("@/lib/schema", () => ({
  users: { id: "id", email: "email" },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

vi.mock("@/lib/sanitize", () => ({
  sanitizeString: (s: string) => s.trim(),
}));

// ---------------------------------------------------------------------------
// Import the handler under test AFTER mocks are registered
// ---------------------------------------------------------------------------
import { PATCH } from "./route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ownerUser = {
  id: "user-1",
  email: "bas@builtbybas.com",
  name: "Bas Rosario",
  role: "owner" as const,
};

function buildRequest(body: unknown): Request {
  const jsonFn =
    body === "INVALID_JSON"
      ? () => {
          throw new SyntaxError("Unexpected token");
        }
      : () => Promise.resolve(body);

  return { json: jsonFn } as unknown as Request;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("PATCH /api/settings/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Auth enforcement ---------------------------------------------------

  it("returns 401 when not authenticated", async () => {
    mockRequireAdmin.mockResolvedValueOnce({
      error: Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      ),
    });

    const res = await PATCH(buildRequest({ name: "X", email: "x@x.com" }));
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
  });

  it("returns 403 for non-admin users", async () => {
    mockRequireAdmin.mockResolvedValueOnce({
      error: Response.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 },
      ),
    });

    const res = await PATCH(buildRequest({ name: "X", email: "x@x.com" }));
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
  });

  // --- Malformed JSON -----------------------------------------------------

  it("returns 400 for malformed JSON body", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: ownerUser });

    const res = await PATCH(buildRequest("INVALID_JSON"));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Invalid request body");
  });

  // --- Validation ---------------------------------------------------------

  it("returns 400 when name is empty", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: ownerUser });

    const res = await PATCH(buildRequest({ name: "", email: "x@x.com" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Validation failed");
  });

  it("returns 400 when email is invalid", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: ownerUser });

    const res = await PATCH(
      buildRequest({ name: "Bas", email: "not-an-email" }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it("returns 400 when fields are missing", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: ownerUser });

    const res = await PATCH(buildRequest({}));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  // --- Email uniqueness ---------------------------------------------------

  it("returns 409 when email is already taken by another user", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: ownerUser });
    // Simulate finding an existing user with that email
    mockLimit.mockResolvedValueOnce([{ id: "other-user" }]);

    const res = await PATCH(
      buildRequest({ name: "Bas", email: "taken@example.com" }),
    );
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Email already in use");
  });

  // --- Success ------------------------------------------------------------

  it("returns 200 on valid profile update (same email)", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: ownerUser });
    mockUpdateWhere.mockResolvedValueOnce(undefined);

    const res = await PATCH(
      buildRequest({ name: "Bas Updated", email: "bas@builtbybas.com" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    // Should NOT check email uniqueness when email is unchanged
    expect(mockSelect).not.toHaveBeenCalled();
  });

  it("returns 200 on valid profile update (new unique email)", async () => {
    mockRequireAdmin.mockResolvedValueOnce({ user: ownerUser });
    // No existing user found with the new email
    mockLimit.mockResolvedValueOnce([]);
    mockUpdateWhere.mockResolvedValueOnce(undefined);

    const res = await PATCH(
      buildRequest({ name: "Bas", email: "newemail@builtbybas.com" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    // Email uniqueness check should have been called
    expect(mockSelect).toHaveBeenCalled();
  });
});
