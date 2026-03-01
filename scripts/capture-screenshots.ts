/**
 * Capture portfolio project screenshots using Playwright.
 *
 * Usage:
 *   npx tsx scripts/capture-screenshots.ts
 *
 * Requires Playwright browsers installed:
 *   npx playwright install chromium
 *
 * Each screenshot is saved to public/images/projects/<slug>.png
 * Only attempts sites with a URL — skips demos and projects without URLs.
 */

import { chromium } from "playwright";
import { join } from "node:path";

const OUTPUT_DIR = join(process.cwd(), "public", "images", "projects");

const SITES = [
  { slug: "the-colour-parlor", url: "https://thecolourparlor.com" },
  { slug: "orca-child-in-the-wild", url: "https://orcachildinthewild.com" },
  { slug: "all-beauty-hair-studio", url: "https://allbeautyhairstudio.com" },
  { slug: "praxis-library", url: "https://praxislibrary.com" },
];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  for (const site of SITES) {
    const page = await context.newPage();
    const outPath = join(OUTPUT_DIR, `${site.slug}.png`);

    try {
      console.log(`Capturing ${site.url} ...`);
      await page.goto(site.url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: outPath, type: "png" });
      console.log(`  Saved: ${outPath}`);
    } catch (err) {
      console.error(`  Failed: ${site.url} — ${err instanceof Error ? err.message : err}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log("Done.");
}

main();
