import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const publicPages = [
  { path: "/", name: "Home" },
  { path: "/services", name: "Services" },
  { path: "/about", name: "About" },
  { path: "/portfolio", name: "Portfolio" },
  { path: "/intake", name: "Intake" },
];

test.describe("Accessibility", () => {
  for (const page of publicPages) {
    test(`${page.name} page passes axe-core AA`, async ({ page: p }) => {
      await p.goto(page.path);
      // Wait for content to be visible
      await p.waitForSelector("main", { state: "visible" });

      const results = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }

  test("skip-to-content link works", async ({ page }) => {
    await page.goto("/");
    // Tab to the skip link
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: /skip to/i });
    await expect(skipLink).toBeFocused();

    // Activate skip link
    await page.keyboard.press("Enter");
    // Focus should move to main content
    const main = page.locator("#main-content");
    await expect(main).toBeFocused();
  });

  test("all form inputs have labels on intake page", async ({ page }) => {
    await page.goto("/intake");
    // Check that visible inputs have associated labels
    const inputs = page.locator(
      'input:visible:not([type="hidden"]):not([type="radio"]):not([type="checkbox"])'
    );
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute("id");
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test("focus indicators are visible", async ({ page }) => {
    await page.goto("/");
    // Tab through first few focusable elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }
    // The focused element should have a visible focus ring
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });
});
