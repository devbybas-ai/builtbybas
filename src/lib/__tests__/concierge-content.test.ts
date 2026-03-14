import { describe, it, expect } from "vitest";
import {
  conciergeContent,
  buildIntakeUrl,
  serviceDisplayLabels,
  priorityDisplayLabels,
  timelineDisplayLabels,
} from "../concierge-content";
import type { CategoryId, QualifierId, TimelineId } from "../concierge-content";

describe("concierge-content", () => {
  it("every category has follow-up priorities", () => {
    const categoryIds = conciergeContent.greeting.categories.map((c) => c.id);
    for (const id of categoryIds) {
      if (id === "other") continue;
      const followUp = conciergeContent.followUps[id];
      expect(followUp, `Missing follow-up for category: ${id}`).toBeDefined();
      expect(followUp.priorities.length).toBeGreaterThan(0);
    }
  });

  it("every non-other category has qualifier options", () => {
    const categoryIds = conciergeContent.greeting.categories
      .map((c) => c.id)
      .filter((id): id is Exclude<CategoryId, "other"> => id !== "other");

    for (const catId of categoryIds) {
      const qualifier = conciergeContent.qualifiers[catId];
      expect(
        qualifier,
        `Missing qualifier for category: ${catId}`,
      ).toBeDefined();
      expect(qualifier.options.length).toBeGreaterThan(0);
      expect(qualifier.headline).toBeTruthy();
    }
  });

  it("every qualifier option has a matching service display label", () => {
    const categoryIds = Object.keys(conciergeContent.qualifiers) as Exclude<
      CategoryId,
      "other"
    >[];

    for (const catId of categoryIds) {
      for (const opt of conciergeContent.qualifiers[catId].options) {
        expect(
          serviceDisplayLabels[opt.id],
          `Missing display label for qualifier: ${opt.id}`,
        ).toBeTruthy();
      }
    }
  });

  it("has 4 timeline options", () => {
    expect(conciergeContent.timelines).toHaveLength(4);
    for (const tl of conciergeContent.timelines) {
      expect(
        timelineDisplayLabels[tl.id],
        `Missing display label for timeline: ${tl.id}`,
      ).toBeTruthy();
    }
  });

  it("has 3 other priorities", () => {
    expect(conciergeContent.otherPriorities).toHaveLength(3);
    for (const pri of conciergeContent.otherPriorities) {
      expect(
        priorityDisplayLabels[pri.id],
        `Missing display label for priority: ${pri.id}`,
      ).toBeTruthy();
    }
  });

  it("greeting has 4 categories", () => {
    expect(conciergeContent.greeting.categories).toHaveLength(4);
  });

  it("greeting headline uses 'we' not 'you'", () => {
    expect(conciergeContent.greeting.headline).toBe("What are we building?");
  });

  it("other category has empty follow-ups", () => {
    expect(conciergeContent.followUps.other.priorities).toHaveLength(0);
  });

  it("confirmation has both standard and other templates", () => {
    expect(conciergeContent.confirmation.headline).toBeTruthy();
    expect(
      conciergeContent.confirmation.standardTemplate.serviceLine,
    ).toBeTruthy();
    expect(
      conciergeContent.confirmation.otherTemplate.serviceLine,
    ).toBeTruthy();
  });

  it("buildIntakeUrl includes all provided params", () => {
    const url = buildIntakeUrl(
      "marketing-website" as QualifierId,
      "design",
      "asap" as TimelineId,
      "website" as CategoryId,
    );
    expect(url).toContain("service=marketing-website");
    expect(url).toContain("priority=design");
    expect(url).toContain("timeline=asap");
    // category should NOT be included when service is present
    expect(url).not.toContain("category=");
  });

  it("buildIntakeUrl includes category when service is null", () => {
    const url = buildIntakeUrl(
      null,
      "quality",
      "flexible" as TimelineId,
      "other" as CategoryId,
    );
    expect(url).toContain("category=other");
    expect(url).toContain("priority=quality");
    expect(url).toContain("timeline=flexible");
    expect(url).not.toContain("service=");
  });

  it("buildIntakeUrl handles all nulls gracefully", () => {
    const url = buildIntakeUrl(null, null, null, null);
    expect(url).toBe("/intake?");
  });
});
