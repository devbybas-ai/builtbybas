import { test, expect } from "@playwright/test";

test.describe("Intake Form", () => {
  test("navigates through steps with next/back buttons", async ({ page }) => {
    await page.goto("/intake");

    // Step 1: Fill contact info
    await page.getByLabel(/full name/i).fill("Test User");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/company name/i).fill("Test Company");

    // Click Next
    await page.getByRole("button", { name: /next/i }).click();

    // Should be on step 2 (Business)
    await expect(page.getByText(/about your business/i)).toBeVisible();

    // Click Back
    await page.getByRole("button", { name: /back/i }).click();

    // Should be back on step 1 with data preserved
    await expect(page.getByLabel(/full name/i)).toHaveValue("Test User");
  });

  test("shows validation errors on empty required fields", async ({
    page,
  }) => {
    await page.goto("/intake");

    // Try to advance without filling required fields
    await page.getByRole("button", { name: /next/i }).click();

    // Should show validation errors
    await expect(page.getByText(/name must be/i)).toBeVisible();
  });

  test("persists form data in localStorage", async ({ page }) => {
    await page.goto("/intake");

    // Fill step 1
    await page.getByLabel(/full name/i).fill("Persistence Test");
    await page.getByLabel(/email/i).fill("persist@test.com");
    await page.getByLabel(/company name/i).fill("Persist Co");

    // Wait a moment for localStorage to save
    await page.waitForTimeout(500);

    // Reload the page
    await page.reload();

    // Data should be restored
    await expect(page.getByLabel(/full name/i)).toHaveValue(
      "Persistence Test"
    );
    await expect(page.getByLabel(/email/i)).toHaveValue("persist@test.com");
  });

  test("works on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/intake");

    // Form should be visible and usable
    await expect(page.getByLabel(/full name/i)).toBeVisible();

    // Progress should show compact mobile version
    await expect(page.getByText(/step 1 of 10/i)).toBeVisible();

    // Fill and navigate
    await page.getByLabel(/full name/i).fill("Mobile User");
    await page.getByLabel(/email/i).fill("mobile@test.com");
    await page.getByLabel(/company name/i).fill("Mobile Co");
    await page.getByRole("button", { name: /next/i }).click();

    // Should advance to step 2
    await expect(page.getByText(/step 2 of 10/i)).toBeVisible();
  });

  test("full form flow to submission", async ({ page }) => {
    await page.goto("/intake");

    // Step 1: Contact
    await page.getByLabel(/full name/i).fill("Full Flow Test");
    await page.getByLabel(/email/i).fill("flow@test.com");
    await page.getByLabel(/company name/i).fill("Flow Inc");
    await page.getByRole("button", { name: /next/i }).click();

    // Step 2: Business
    await page.getByText("Professional Services").click();
    await page.getByText("2-5 people").click();
    await page.getByRole("button", { name: /next/i }).click();

    // Step 3: Project Type
    await page.getByText("Marketing Website").click();
    await page.getByRole("button", { name: /next/i }).click();

    // Step 4: Details
    await page
      .locator("#description")
      .fill("We need a professional marketing website for our consulting firm.");
    await page
      .locator("#goals")
      .fill("Generate 50 leads per month through the website.");
    await page.getByRole("button", { name: /next/i }).click();

    // Step 5: Timeline & Budget
    await page.getByText("1-3 months").click();
    await page.getByText("$5,000 - $15,000").click();
    await page.getByRole("button", { name: /next/i }).click();

    // Step 6: Current State
    await page.getByText(/starting from scratch/i).click();
    await page.getByRole("button", { name: /next/i }).click();

    // Step 7: Features (optional — just advance)
    await page.getByRole("button", { name: /next/i }).click();

    // Step 8: Design
    await page.getByText("Modern & Minimal").click();
    await page.getByText(/logo only/i).click();
    await page.getByRole("button", { name: /next/i }).click();

    // Step 9: Inspiration (optional — just advance)
    await page.getByRole("button", { name: /next/i }).click();

    // Step 10: Anything Else — submit
    await page.getByRole("button", { name: /submit project/i }).click();

    // Should navigate to confirmation page
    await expect(page).toHaveURL(/\/intake\/confirmation/);
    await expect(page.getByText(/thank you/i)).toBeVisible();
  });
});
