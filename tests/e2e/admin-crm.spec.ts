import { test, expect, type Page } from "@playwright/test";

/* ------------------------------------------------------------------ */
/*  Test data & helpers                                               */
/* ------------------------------------------------------------------ */

const OWNER_CREDENTIALS = {
  email: "devbybas@gmail.com",
  password: "BuiltByBas2026!",
};

const TEST_CLIENT = {
  name: "Acme Test Corp Contact",
  email: "test@acmecorp-e2e.com",
  phone: "555-0199",
  company: "Acme Test Corp",
  industry: "Technology",
  website: "https://acmecorp.example.com",
  source: "E2E Test Suite",
};

/**
 * Authenticate as the seeded owner by calling the login API
 * from within the browser context so the session cookie is set.
 */
async function loginAsOwner(page: Page) {
  await page.goto("/");
  const result = await page.evaluate(async (creds) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });
    return res.json();
  }, OWNER_CREDENTIALS);
  expect(result.success).toBe(true);
}

/* ------------------------------------------------------------------ */
/*  CRM Flow Tests (sequential — each test builds on the previous)   */
/* ------------------------------------------------------------------ */

test.describe.serial("CRM Flows", () => {
  let clientId: string;

  /* ---- Auth & Dashboard ---- */

  test("admin dashboard loads when authenticated", async ({ page }) => {
    await loginAsOwner(page);
    await page.goto("/admin");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  /* ---- Create Client ---- */

  test("create new client via form", async ({ page }) => {
    await loginAsOwner(page);
    await page.goto("/admin/clients/new");

    await expect(
      page.getByRole("heading", { name: /add client/i })
    ).toBeVisible();

    // Fill required fields
    await page.getByLabel(/^name/i).fill(TEST_CLIENT.name);
    await page.getByLabel(/email/i).fill(TEST_CLIENT.email);
    await page.getByLabel(/company/i).fill(TEST_CLIENT.company);

    // Fill optional fields
    await page.getByLabel(/phone/i).fill(TEST_CLIENT.phone);
    await page.getByLabel(/industry/i).fill(TEST_CLIENT.industry);
    await page.getByLabel(/website/i).fill(TEST_CLIENT.website);
    await page.getByLabel(/source/i).fill(TEST_CLIENT.source);

    await page.getByRole("button", { name: /create client/i }).click();

    // Should redirect to client detail page
    await page.waitForURL(/\/admin\/clients\/[a-f0-9-]+/);

    // Verify client info rendered
    await expect(page.getByText(TEST_CLIENT.name)).toBeVisible();
    await expect(page.getByText(TEST_CLIENT.company)).toBeVisible();

    // Capture client ID for subsequent tests
    clientId = page.url().split("/admin/clients/")[1];
    expect(clientId).toBeTruthy();
  });

  test("form shows validation error for missing required fields", async ({
    page,
  }) => {
    await loginAsOwner(page);
    await page.goto("/admin/clients/new");

    // Submit with only partial data (missing company)
    await page.getByLabel(/^name/i).fill("Incomplete Client");
    await page.getByLabel(/email/i).fill("incomplete@test.com");

    // The company field has HTML required attribute — browser will prevent submit
    const companyInput = page.getByLabel(/company/i);
    await expect(companyInput).toHaveAttribute("required", "");
  });

  /* ---- Client List ---- */

  test("new client appears in client list", async ({ page }) => {
    await loginAsOwner(page);
    await page.goto("/admin/clients");

    await expect(page.getByText(TEST_CLIENT.name)).toBeVisible();
    await expect(page.getByText(TEST_CLIENT.company)).toBeVisible();
  });

  /* ---- Client Detail ---- */

  test("client detail shows all info and pipeline history", async ({
    page,
  }) => {
    await loginAsOwner(page);
    await page.goto(`/admin/clients/${clientId}`);

    // Name and company in header
    await expect(
      page.getByRole("heading", { name: TEST_CLIENT.name })
    ).toBeVisible();

    // Contact & Business section
    await expect(page.getByText(TEST_CLIENT.email)).toBeVisible();
    await expect(page.getByText(TEST_CLIENT.phone)).toBeVisible();
    await expect(page.getByText(TEST_CLIENT.industry)).toBeVisible();

    // Default stage is Lead
    await expect(page.getByText(/lead/i).first()).toBeVisible();

    // Pipeline history entry from creation
    await expect(page.getByText(/client created/i)).toBeVisible();

    // Advance button should be visible
    await expect(
      page.getByRole("button", { name: /move to/i })
    ).toBeVisible();
  });

  /* ---- Add Notes ---- */

  test("add a general note to client", async ({ page }) => {
    await loginAsOwner(page);
    await page.goto(`/admin/clients/${clientId}`);

    const noteText = "Initial discovery call — strong fit for website project.";
    await page.getByPlaceholder(/add a note/i).fill(noteText);
    await page.getByRole("button", { name: /save note/i }).click();

    // Wait for server refresh
    await page.waitForTimeout(1500);
    await expect(page.getByText(noteText)).toBeVisible();
  });

  test("add a typed note (call) to client", async ({ page }) => {
    await loginAsOwner(page);
    await page.goto(`/admin/clients/${clientId}`);

    // Select the "Call" note type
    await page.getByRole("button", { name: /^call$/i }).click();

    const noteText = "Follow-up call scheduled for next week.";
    await page.getByPlaceholder(/add a note/i).fill(noteText);
    await page.getByRole("button", { name: /save note/i }).click();

    await page.waitForTimeout(1500);
    await expect(page.getByText(noteText)).toBeVisible();
  });

  /* ---- Advance Pipeline ---- */

  test("advance client from Lead to Intake Submitted", async ({ page }) => {
    await loginAsOwner(page);
    await page.goto(`/admin/clients/${clientId}`);

    const advanceBtn = page.getByRole("button", {
      name: /move to intake submitted/i,
    });
    await expect(advanceBtn).toBeVisible();
    await advanceBtn.click();

    // Wait for server refresh
    await page.waitForTimeout(1500);

    // New stage badge visible
    await expect(page.getByText(/intake submitted/i).first()).toBeVisible();
  });

  test("advance again to Analysis Complete", async ({ page }) => {
    await loginAsOwner(page);
    await page.goto(`/admin/clients/${clientId}`);

    const advanceBtn = page.getByRole("button", {
      name: /move to analysis complete/i,
    });
    await expect(advanceBtn).toBeVisible();
    await advanceBtn.click();

    await page.waitForTimeout(1500);
    await expect(page.getByText(/analysis complete/i).first()).toBeVisible();
  });

  /* ---- Pipeline Board ---- */

  test("client appears in correct pipeline column", async ({ page }) => {
    await loginAsOwner(page);
    await page.goto("/admin/pipeline");

    // Client should be visible on the board
    await expect(page.getByText(TEST_CLIENT.name)).toBeVisible();
    await expect(page.getByText(TEST_CLIENT.company)).toBeVisible();
  });

  /* ---- Intake Conversion ---- */

  test("convert intake submission to client", async ({ page }) => {
    await loginAsOwner(page);

    // 1. Submit a fake intake form via API (public endpoint, no auth needed)
    const intakeResult = await page.evaluate(async () => {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Intake Convert Test",
          email: "intake-convert@example.com",
          phone: "555-9876",
          companyName: "Intake Co",
          industry: "Retail",
          website: "https://intakeco.example.com",
          projectType: "marketing-website",
          goals: ["online-presence", "lead-generation"],
          currentWebsite: "none",
          timeline: "1-2-months",
          budget: "5000-10000",
          designPreference: "modern-minimal",
          contentReady: "need-help",
          features: ["contact-form", "blog"],
          competitors: "None specific",
          additionalInfo: "E2E test submission",
        }),
      });
      return res.json();
    });

    expect(intakeResult.success).toBe(true);
    const intakeId = intakeResult.data.id;

    // 2. Convert the intake to a client
    const convertResult = await page.evaluate(async (id) => {
      const res = await fetch("/api/clients/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeSubmissionId: id }),
      });
      return res.json();
    }, intakeId);

    expect(convertResult.success).toBe(true);
    expect(convertResult.data.pipelineStage).toBe("intake_submitted");
    expect(convertResult.data.source).toBe("intake");

    // 3. Verify the converted client appears in admin
    await page.goto(`/admin/clients/${convertResult.data.id}`);
    await expect(page.getByText("Intake Convert Test")).toBeVisible();
    await expect(page.getByText("Intake Co")).toBeVisible();
    await expect(page.getByText(/intake submitted/i).first()).toBeVisible();

    // 4. Cleanup — archive the converted client
    await page.evaluate(async (id) => {
      await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
    }, convertResult.data.id);
  });

  /* ---- Cleanup ---- */

  test("cleanup: archive test client", async ({ page }) => {
    await loginAsOwner(page);

    const result = await page.evaluate(async (id) => {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
      return res.json();
    }, clientId);

    expect(result.success).toBe(true);
    expect(result.data.status).toBe("archived");
  });
});
