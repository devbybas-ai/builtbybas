import { randomBytes } from "crypto";
import { hmacHash } from "./encryption";

export function calculateMilestoneAmounts(budgetCents: number): {
  deposit: number;
  midpoint: number;
  final: number;
} {
  // 50/25/25 split. Deposit gets extra cent on odd amounts.
  // Midpoint rounds to nearest cent; final absorbs any remainder.
  const deposit = Math.ceil(budgetCents * 0.5);
  const midpoint = Math.round(budgetCents * 0.25);
  const final = budgetCents - deposit - midpoint;
  return { deposit, midpoint, final };
}

export function mapTimelineToWeeks(timeline: string): number {
  const map: Record<string, number> = {
    asap: 2,
    "2-4-weeks": 3,
    "5-6-weeks": 5.5,
    flexible: 8,
  };
  return map[timeline] ?? 8;
}

export function calculateMilestoneDates(
  startDate: Date,
  targetDate: Date
): {
  deposit: Date;
  midpoint: Date;
  final: Date;
} {
  const midMs =
    startDate.getTime() +
    (targetDate.getTime() - startDate.getTime()) / 2;
  return {
    deposit: new Date(startDate),
    midpoint: new Date(midMs),
    final: new Date(targetDate),
  };
}

export function generateInvoiceToken(): {
  rawToken: string;
  hashedToken: string;
} {
  const rawToken = randomBytes(32).toString("hex");
  const hashedToken = hmacHash(rawToken);
  return { rawToken, hashedToken };
}

export function buildDepositLineItems(
  services: { serviceName: string; estimatedPriceCents: number }[],
  depositPercentage: number
): {
  description: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
  sortOrder: number;
}[] {
  if (!services.length) {
    return [
      {
        description: `Project Deposit (${depositPercentage}%)`,
        quantity: 1,
        unitPriceCents: 0,
        totalCents: 0,
        sortOrder: 0,
      },
    ];
  }
  return services.map((svc, i) => {
    const scaledCents = Math.round(
      (svc.estimatedPriceCents * depositPercentage) / 100
    );
    return {
      description: `${svc.serviceName} (Deposit - ${depositPercentage}%)`,
      quantity: 1,
      unitPriceCents: scaledCents,
      totalCents: scaledCents,
      sortOrder: i,
    };
  });
}
