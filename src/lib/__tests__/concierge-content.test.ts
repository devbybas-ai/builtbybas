import { describe, it, expect } from "vitest";
import { conciergeContent, getPayoff } from "../concierge-content";
import { projects } from "@/data/portfolio";
import type { CategoryId } from "../concierge-content";

describe("concierge-content", () => {
  it("every category has follow-up priorities", () => {
    const categoryIds = conciergeContent.greeting.categories.map((c) => c.id);
    for (const id of categoryIds) {
      if (id === "other") continue; // "other" skips to intake
      const followUp = conciergeContent.followUps[id];
      expect(followUp, `Missing follow-up for category: ${id}`).toBeDefined();
      expect(followUp.priorities.length).toBeGreaterThan(0);
    }
  });

  it("every category+priority combo has a payoff", () => {
    const categoryIds = conciergeContent.greeting.categories
      .map((c) => c.id)
      .filter((id): id is Exclude<CategoryId, "other"> => id !== "other");

    for (const catId of categoryIds) {
      const priorities = conciergeContent.followUps[catId].priorities;
      for (const priority of priorities) {
        const payoff = getPayoff(catId, priority.id);
        expect(
          payoff,
          `Missing payoff for ${catId}-${priority.id}`,
        ).not.toBeNull();
      }
    }
  });

  it("every payoff references a real portfolio project slug", () => {
    const slugs = projects.map((p) => p.slug);
    for (const [key, payoff] of Object.entries(conciergeContent.payoffs)) {
      expect(
        slugs,
        `Payoff "${key}" references unknown slug: ${payoff.projectSlug}`,
      ).toContain(payoff.projectSlug);
    }
  });

  it("every payoff has an intent-matched ctaLabel", () => {
    for (const [key, payoff] of Object.entries(conciergeContent.payoffs)) {
      expect(payoff.ctaLabel, `Missing ctaLabel for ${key}`).toBeTruthy();
      expect(payoff.ctaLabel.length).toBeGreaterThan(5);
    }
  });

  it("getPayoff returns null for unknown combos", () => {
    expect(getPayoff("website" as CategoryId, "nonexistent")).toBeNull();
  });

  it("greeting has 4 categories", () => {
    expect(conciergeContent.greeting.categories).toHaveLength(4);
  });

  it("other category has empty follow-ups", () => {
    expect(conciergeContent.followUps.other.priorities).toHaveLength(0);
  });
});
