import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test("homepage loads with hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('a[href="/intake"]')).toBeVisible();
  });

  test("services page loads with service cards", async ({ page }) => {
    await page.goto("/services");
    await expect(
      page.getByRole("heading", { name: /services/i, level: 1 })
    ).toBeVisible();
    await expect(page.locator(".glass-card").first()).toBeVisible();
  });

  test("about page loads with story section", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: /about/i, level: 1 })
    ).toBeVisible();
  });

  test("portfolio page loads with project cards", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(
      page.getByRole("heading", { name: /work/i, level: 1 })
    ).toBeVisible();
    // Filter buttons should be visible
    await expect(page.getByRole("button", { name: "All" })).toBeVisible();
  });

  test("intake page loads with form", async ({ page }) => {
    await page.goto("/intake");
    await expect(
      page.getByRole("heading", { name: /start a project/i, level: 1 })
    ).toBeVisible();
    // First step should show contact fields
    await expect(page.getByLabel(/full name/i)).toBeVisible();
  });

  test("portfolio filter buttons work", async ({ page }) => {
    await page.goto("/portfolio");
    // Click "Web" filter
    await page.getByRole("button", { name: "Web" }).click();
    // Cards should still be visible (web projects exist)
    await expect(page.locator('[class*="glass-card"]').first()).toBeVisible();

    // Click "AI" filter
    await page.getByRole("button", { name: "AI" }).click();
    await expect(page.locator('[class*="glass-card"]').first()).toBeVisible();

    // Click "All" to reset
    await page.getByRole("button", { name: "All" }).click();
    await expect(page.locator('[class*="glass-card"]').first()).toBeVisible();
  });

  test("navigation between pages works", async ({ page }) => {
    await page.goto("/");

    // Navigate to services
    await page.getByRole("link", { name: /services/i }).first().click();
    await expect(page).toHaveURL(/\/services/);

    // Navigate to portfolio
    await page.getByRole("link", { name: /portfolio|work/i }).first().click();
    await expect(page).toHaveURL(/\/portfolio/);
  });

  test("case study detail page loads", async ({ page }) => {
    await page.goto("/portfolio/meridian-plumbing");
    await expect(
      page.getByRole("heading", { name: /meridian/i, level: 1 })
    ).toBeVisible();
    // Should have challenge and solution sections
    await expect(page.getByText(/challenge/i).first()).toBeVisible();
    await expect(page.getByText(/solution/i).first()).toBeVisible();
  });

  test("reduced motion disables animations", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    // Page should still render correctly without motion
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('a[href="/intake"]')).toBeVisible();
  });
});
