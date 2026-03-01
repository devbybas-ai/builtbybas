import { count, desc, eq } from "drizzle-orm";
import { db } from "./db";
import { clients, intakeSubmissions, pipelineHistory } from "./schema";
import { decryptAnalysisPii } from "./encryption";
import type { IntakeAnalysis } from "@/types/intake-analysis";
import type { PipelineStage } from "@/types/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DashboardStats {
  totalSubmissions: number;
  activeClients: number;
  avgComplexity: number;
  estimatedPipelineValue: string;
}

export interface ComplexityBucket {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ServiceDemand {
  service: string;
  count: number;
  percentage: number;
}

export interface BudgetBucket {
  label: string;
  count: number;
  percentage: number;
}

export interface IndustryBucket {
  label: string;
  count: number;
  percentage: number;
}

export interface SubmissionTrend {
  thisWeek: number;
  lastWeek: number;
  change: number;
}

export interface RecentSubmission {
  id: string;
  name: string;
  company: string;
  complexityLabel: string;
  complexityScore: number;
  primaryService: string;
  submittedAt: string;
  estimatedInvestment: string;
}

export interface DashboardData {
  stats: DashboardStats;
  complexityDistribution: ComplexityBucket[];
  serviceDemand: ServiceDemand[];
  budgetDistribution: BudgetBucket[];
  industryDistribution: IndustryBucket[];
  submissionTrend: SubmissionTrend;
  recentSubmissions: RecentSubmission[];
  recentActivity: Array<{
    id: string;
    clientId: string;
    fromStage: PipelineStage | null;
    toStage: PipelineStage;
    note: string | null;
    createdAt: Date;
  }>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const INDUSTRY_LABELS: Record<string, string> = {
  "professional-services": "Professional Services",
  "home-services": "Home Services",
  healthcare: "Healthcare",
  "retail-ecommerce": "Retail / E-Commerce",
  "food-hospitality": "Food & Hospitality",
  "fitness-wellness": "Fitness & Wellness",
  "real-estate": "Real Estate",
  construction: "Construction",
  education: "Education",
  nonprofit: "Nonprofit",
  technology: "Technology",
  other: "Other",
};

const BUDGET_LABELS: Record<string, string> = {
  unsure: "Undecided",
  "1k-5k": "$1K - $5K",
  "5k-15k": "$5K - $15K",
  "15k-30k": "$15K - $30K",
  "30k+": "$30K+",
};

const BUDGET_ORDER = ["1k-5k", "5k-15k", "15k-30k", "30k+", "unsure"];

function getComplexityLabel(score: number): string {
  if (score >= 8) return "Enterprise";
  if (score >= 6) return "Complex";
  if (score >= 4) return "Moderate";
  return "Simple";
}

function getComplexityColor(label: string): string {
  switch (label) {
    case "Enterprise": return "bg-red-500";
    case "Complex": return "bg-orange-500";
    case "Moderate": return "bg-amber-500";
    default: return "bg-emerald-500";
  }
}

function parsePipelineValue(investment: string): [number, number] {
  const numbers = investment.match(/[\d,]+/g);
  if (!numbers || numbers.length < 2) return [0, 0];
  return [
    parseInt(numbers[0].replace(/,/g, ""), 10),
    parseInt(numbers[1].replace(/,/g, ""), 10),
  ];
}

// ---------------------------------------------------------------------------
// Main query
// ---------------------------------------------------------------------------

export async function getDashboardData(): Promise<DashboardData> {
  // Parallel queries
  const [allSubmissions, [activeCount], activity] = await Promise.all([
    db
      .select({ analysis: intakeSubmissions.analysis })
      .from(intakeSubmissions)
      .orderBy(desc(intakeSubmissions.submittedAt)),
    db.select({ value: count() }).from(clients).where(eq(clients.status, "active")),
    db
      .select({
        id: pipelineHistory.id,
        clientId: pipelineHistory.clientId,
        fromStage: pipelineHistory.fromStage,
        toStage: pipelineHistory.toStage,
        note: pipelineHistory.note,
        createdAt: pipelineHistory.createdAt,
      })
      .from(pipelineHistory)
      .orderBy(desc(pipelineHistory.createdAt))
      .limit(5),
  ]);

  const analyses = allSubmissions.map((r) => decryptAnalysisPii(r.analysis as IntakeAnalysis));
  const total = analyses.length;

  // --- Stats ---
  const avgComplexity =
    total > 0
      ? Math.round(
          (analyses.reduce((sum, a) => sum + a.complexityScore.overall, 0) /
            total) *
            10,
        ) / 10
      : 0;

  let pipelineMin = 0;
  let pipelineMax = 0;
  for (const a of analyses) {
    const [min, max] = parsePipelineValue(
      a.summary.estimatedTotalInvestment,
    );
    pipelineMin += min;
    pipelineMax += max;
  }

  const stats: DashboardStats = {
    totalSubmissions: total,
    activeClients: activeCount.value,
    avgComplexity,
    estimatedPipelineValue:
      total > 0
        ? `$${Math.round(pipelineMin / 1000)}K - $${Math.round(pipelineMax / 1000)}K`
        : "$0",
  };

  // --- Complexity distribution ---
  const complexityMap: Record<string, number> = {
    Simple: 0,
    Moderate: 0,
    Complex: 0,
    Enterprise: 0,
  };
  for (const a of analyses) {
    const label = getComplexityLabel(a.complexityScore.overall);
    complexityMap[label]++;
  }
  const complexityDistribution: ComplexityBucket[] = Object.entries(
    complexityMap,
  ).map(([label, c]) => ({
    label,
    count: c,
    percentage: total > 0 ? Math.round((c / total) * 100) : 0,
    color: getComplexityColor(label),
  }));

  // --- Service demand ---
  const serviceMap = new Map<string, number>();
  for (const a of analyses) {
    const primary = a.serviceRecommendations.find((r) => r.isPrimary);
    if (primary) {
      serviceMap.set(
        primary.serviceTitle,
        (serviceMap.get(primary.serviceTitle) ?? 0) + 1,
      );
    }
  }
  const serviceDemand: ServiceDemand[] = [...serviceMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([service, c]) => ({
      service,
      count: c,
      percentage: total > 0 ? Math.round((c / total) * 100) : 0,
    }));

  // --- Budget distribution ---
  const budgetMap: Record<string, number> = {};
  for (const a of analyses) {
    const key = a.formData.budgetRange || "unsure";
    budgetMap[key] = (budgetMap[key] ?? 0) + 1;
  }
  const budgetDistribution: BudgetBucket[] = BUDGET_ORDER.filter(
    (k) => (budgetMap[k] ?? 0) > 0,
  ).map((key) => ({
    label: BUDGET_LABELS[key] ?? key,
    count: budgetMap[key],
    percentage: total > 0 ? Math.round((budgetMap[key] / total) * 100) : 0,
  }));

  // --- Industry distribution ---
  const industryMap = new Map<string, number>();
  for (const a of analyses) {
    const key = a.formData.industry || "other";
    industryMap.set(key, (industryMap.get(key) ?? 0) + 1);
  }
  const industryDistribution: IndustryBucket[] = [...industryMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key, c]) => ({
      label: INDUSTRY_LABELS[key] ?? key,
      count: c,
      percentage: total > 0 ? Math.round((c / total) * 100) : 0,
    }));

  // --- Submission trend (last 7 days vs prior 7 days) ---
  const now = Date.now();
  const sevenDays = 7 * 86400000;
  let thisWeek = 0;
  let lastWeek = 0;
  for (const a of analyses) {
    const t = new Date(a.submittedAt).getTime();
    if (t >= now - sevenDays) thisWeek++;
    else if (t >= now - sevenDays * 2) lastWeek++;
  }
  const submissionTrend: SubmissionTrend = {
    thisWeek,
    lastWeek,
    change:
      lastWeek > 0
        ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
        : thisWeek > 0
          ? 100
          : 0,
  };

  // --- Recent submissions ---
  const recentSubmissions: RecentSubmission[] = analyses
    .slice(0, 5)
    .map((a) => {
      const primary = a.serviceRecommendations.find((r) => r.isPrimary);
      return {
        id: a.id,
        name: a.formData.name,
        company: a.formData.company,
        complexityLabel: getComplexityLabel(a.complexityScore.overall),
        complexityScore: a.complexityScore.overall,
        primaryService: primary?.serviceTitle ?? "—",
        submittedAt: a.submittedAt,
        estimatedInvestment: a.summary.estimatedTotalInvestment,
      };
    });

  return {
    stats,
    complexityDistribution,
    serviceDemand,
    budgetDistribution,
    industryDistribution,
    submissionTrend,
    recentSubmissions,
    recentActivity: activity,
  };
}
