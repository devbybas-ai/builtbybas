import { describe, it, expect } from "vitest";
import {
  calculateMilestoneAmounts,
  mapTimelineToWeeks,
  calculateMilestoneDates,
  generateInvoiceToken,
  buildDepositLineItems,
} from "../billing";

describe("calculateMilestoneAmounts", () => {
  it("splits 10000 into 5000/2500/2500", () => {
    expect(calculateMilestoneAmounts(10000)).toEqual({ deposit: 5000, midpoint: 2500, final: 2500 });
  });
  it("gives extra cent to deposit on odd split (10001)", () => {
    expect(calculateMilestoneAmounts(10001)).toEqual({ deposit: 5001, midpoint: 2500, final: 2500 });
  });
  it("handles zero", () => {
    expect(calculateMilestoneAmounts(0)).toEqual({ deposit: 0, midpoint: 0, final: 0 });
  });
  it("handles 1 cent", () => {
    expect(calculateMilestoneAmounts(1)).toEqual({ deposit: 1, midpoint: 0, final: 0 });
  });
  it("handles 3 cents", () => {
    expect(calculateMilestoneAmounts(3)).toEqual({ deposit: 2, midpoint: 1, final: 0 });
  });
});

describe("mapTimelineToWeeks", () => {
  it("maps asap to 2", () => expect(mapTimelineToWeeks("asap")).toBe(2));
  it("maps 2-4-weeks to 3", () => expect(mapTimelineToWeeks("2-4-weeks")).toBe(3));
  it("maps 5-6-weeks to 5.5", () => expect(mapTimelineToWeeks("5-6-weeks")).toBe(5.5));
  it("maps flexible to 8", () => expect(mapTimelineToWeeks("flexible")).toBe(8));
  it("defaults unknown to 8", () => expect(mapTimelineToWeeks("unknown")).toBe(8));
});

describe("calculateMilestoneDates", () => {
  it("returns deposit=start, midpoint=halfway, final=target", () => {
    const start = new Date("2026-03-15");
    const target = new Date("2026-04-15");
    const result = calculateMilestoneDates(start, target);
    expect(result.deposit).toEqual(start);
    expect(result.final).toEqual(target);
    const expectedMid = new Date("2026-03-31");
    expect(Math.abs(result.midpoint.getTime() - expectedMid.getTime())).toBeLessThan(86400000);
  });
});

describe("generateInvoiceToken", () => {
  it("returns 64-char hex raw token", () => {
    const { rawToken } = generateInvoiceToken();
    expect(rawToken).toMatch(/^[a-f0-9]{64}$/);
  });
  it("returns hashed token different from raw", () => {
    const { rawToken, hashedToken } = generateInvoiceToken();
    expect(hashedToken).not.toBe(rawToken);
    expect(hashedToken).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe("buildDepositLineItems", () => {
  it("scales service prices to 50%", () => {
    const services = [{ serviceName: "Web Design", estimatedPriceCents: 10000 }];
    const items = buildDepositLineItems(services, 50);
    expect(items).toHaveLength(1);
    expect(items[0].description).toContain("Web Design");
    expect(items[0].totalCents).toBe(5000);
  });
  it("handles empty services with fallback line item", () => {
    const items = buildDepositLineItems([], 50);
    expect(items).toHaveLength(1);
    expect(items[0].description).toContain("Project Deposit");
  });
  it("handles multiple services", () => {
    const services = [
      { serviceName: "Design", estimatedPriceCents: 6000 },
      { serviceName: "Dev", estimatedPriceCents: 4000 },
    ];
    const items = buildDepositLineItems(services, 50);
    expect(items).toHaveLength(2);
    expect(items[0].totalCents + items[1].totalCents).toBe(5000);
  });
});
