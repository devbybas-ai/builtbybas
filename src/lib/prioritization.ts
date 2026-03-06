import type { IntakeAnalysis } from "@/types/intake-analysis";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PriorityFactor {
  name: string;
  score: number;
  weight: number;
  weightedScore: number;
  reason: string;
}

export interface PriorityResult {
  score: number;
  label: "High" | "Medium" | "Low";
  factors: PriorityFactor[];
}

// ---------------------------------------------------------------------------
// Factor weights — total = 1.0
// ---------------------------------------------------------------------------

const WEIGHTS = {
  projectReadiness: 0.25,
  budgetAlignment: 0.2,
  scopeClarity: 0.2,
  engagementLevel: 0.15,
  timelineFeasibility: 0.1,
  riskFlags: 0.1,
} as const;

// ---------------------------------------------------------------------------
// Individual factor scorers
// ---------------------------------------------------------------------------

function scoreTimelineFeasibility(analysis: IntakeAnalysis): { score: number; reason: string } {
  const complexity = analysis.complexityScore.overall;
  const timeline = analysis.formData.timeline;

  if (timeline === "flexible") {
    return { score: 90, reason: "Flexible timeline — easy to schedule" };
  }

  if (timeline === "asap") {
    if (complexity <= 3) {
      return { score: 80, reason: "ASAP but low complexity — achievable" };
    }
    if (complexity <= 5) {
      return { score: 50, reason: "ASAP with moderate complexity — tight but possible" };
    }
    return { score: 25, reason: "ASAP with high complexity — delivery risk" };
  }

  // Specific date — check if reasonable for complexity
  const targetDate = new Date(timeline);
  if (isNaN(targetDate.getTime())) {
    return { score: 60, reason: "Timeline provided but not parseable — clarify in consultation" };
  }

  const weeksUntilTarget = Math.max(0, (targetDate.getTime() - Date.now()) / (7 * 86400000));
  const minWeeksNeeded = complexity <= 3 ? 2 : complexity <= 5 ? 4 : complexity <= 7 ? 8 : 12;

  if (weeksUntilTarget >= minWeeksNeeded * 1.5) {
    return { score: 95, reason: "Target date has comfortable buffer" };
  }
  if (weeksUntilTarget >= minWeeksNeeded) {
    return { score: 70, reason: "Target date is achievable with focused execution" };
  }
  if (weeksUntilTarget >= minWeeksNeeded * 0.5) {
    return { score: 40, reason: "Target date is tight for this scope" };
  }
  return { score: 15, reason: "Target date likely unrealistic for this complexity" };
}

function scoreRiskFlags(analysis: IntakeAnalysis): { score: number; reason: string } {
  const flags = analysis.flags;
  if (flags.length === 0) {
    return { score: 100, reason: "No risk flags detected" };
  }

  const raiConcerns = flags.filter((f) => f.type === "rai-concern").length;
  const warnings = flags.filter((f) => f.type === "warning").length;

  if (raiConcerns > 0) {
    return { score: 10, reason: `${raiConcerns} RAI concern(s) — requires manual review before proceeding` };
  }

  // Warnings reduce score but don't block
  const warningPenalty = warnings * 20;
  const score = Math.max(20, 100 - warningPenalty);
  const reason = warnings === 1
    ? "1 warning flag — manageable risk"
    : `${warnings} warning flags — review before prioritizing`;

  return { score, reason };
}

// ---------------------------------------------------------------------------
// Main scorer
// ---------------------------------------------------------------------------

export function computePriorityScore(analysis: IntakeAnalysis): PriorityResult {
  const profile = analysis.clientProfile;

  const timelineFeasibility = scoreTimelineFeasibility(analysis);
  const riskFlags = scoreRiskFlags(analysis);

  const rawFactors: Array<{ name: string; score: number; weight: number; reason: string }> = [
    {
      name: "Project Readiness",
      score: profile.projectReadiness.score,
      weight: WEIGHTS.projectReadiness,
      reason: profile.projectReadiness.label === "Very High"
        ? "Well-prepared — clear requirements and defined scope"
        : profile.projectReadiness.label === "High"
          ? "Good preparation — most details provided"
          : profile.projectReadiness.label === "Medium"
            ? "Some preparation — needs consultation to fill gaps"
            : "Early stage — significant scoping needed",
    },
    {
      name: "Budget Alignment",
      score: profile.budgetAlignment.score,
      weight: WEIGHTS.budgetAlignment,
      reason: profile.budgetAlignment.signals[0] ?? "Budget assessment pending",
    },
    {
      name: "Scope Clarity",
      score: profile.scopeClarity.score,
      weight: WEIGHTS.scopeClarity,
      reason: profile.scopeClarity.label === "Very High"
        ? "Crystal clear scope — specific requirements documented"
        : profile.scopeClarity.label === "High"
          ? "Well-defined scope with measurable goals"
          : profile.scopeClarity.label === "Medium"
            ? "Scope partially defined — some ambiguity remains"
            : "Scope needs significant clarification",
    },
    {
      name: "Engagement Level",
      score: profile.engagementLevel.score,
      weight: WEIGHTS.engagementLevel,
      reason: profile.engagementLevel.label === "Very High"
        ? "Highly engaged — thorough intake responses"
        : profile.engagementLevel.label === "High"
          ? "Good engagement — solid effort in intake"
          : profile.engagementLevel.label === "Medium"
            ? "Moderate engagement — basic information provided"
            : "Low engagement — minimal intake responses",
    },
    {
      name: "Timeline Feasibility",
      score: timelineFeasibility.score,
      weight: WEIGHTS.timelineFeasibility,
      reason: timelineFeasibility.reason,
    },
    {
      name: "Risk Assessment",
      score: riskFlags.score,
      weight: WEIGHTS.riskFlags,
      reason: riskFlags.reason,
    },
  ];

  const factors: PriorityFactor[] = rawFactors.map((f) => ({
    ...f,
    weightedScore: Math.round(f.score * f.weight),
  }));

  const totalScore = factors.reduce((sum, f) => sum + f.weightedScore, 0);
  const score = Math.min(100, Math.max(0, totalScore));

  let label: PriorityResult["label"];
  if (score >= 70) label = "High";
  else if (score >= 40) label = "Medium";
  else label = "Low";

  return { score, label, factors };
}

export function getPriorityBadgeColors(label: PriorityResult["label"]): string {
  switch (label) {
    case "High":
      return "bg-emerald-500/20 text-emerald-400";
    case "Medium":
      return "bg-amber-500/20 text-amber-400";
    case "Low":
      return "bg-red-500/20 text-red-400";
  }
}
