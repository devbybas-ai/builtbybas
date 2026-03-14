"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import {
  demoStats,
  demoSubmissionTrend,
  demoComplexityDistribution,
  demoServiceDemand,
  demoBudgetDistribution,
  demoIndustryDistribution,
  demoRecentSubmissions,
  demoRecentActivity,
} from "@/data/demo-data";

function getComplexityBadgeColors(label: string) {
  switch (label) {
    case "Enterprise":
      return "bg-red-500/20 text-red-400";
    case "Complex":
      return "bg-orange-500/20 text-orange-400";
    case "Moderate":
      return "bg-amber-500/20 text-amber-400";
    default:
      return "bg-emerald-500/20 text-emerald-400";
  }
}

function getPriorityBadgeColors(label: string) {
  switch (label) {
    case "High":
      return "bg-red-500/20 text-red-400";
    case "Medium":
      return "bg-amber-500/20 text-amber-400";
    default:
      return "bg-emerald-500/20 text-emerald-400";
  }
}

function getStageBadge(stage: string) {
  const colors: Record<string, string> = {
    intake_review: "bg-blue-500/20 text-blue-400",
    discovery_call: "bg-violet-500/20 text-violet-400",
    proposal_sent: "bg-amber-500/20 text-amber-400",
    proposal_accepted: "bg-emerald-500/20 text-emerald-400",
    in_development: "bg-cyan-500/20 text-cyan-400",
    review_qa: "bg-orange-500/20 text-orange-400",
    launched: "bg-green-500/20 text-green-400",
  };
  const labels: Record<string, string> = {
    intake_review: "Intake Review",
    discovery_call: "Discovery Call",
    proposal_sent: "Proposal Sent",
    proposal_accepted: "Accepted",
    in_development: "In Development",
    review_qa: "Review / QA",
    launched: "Launched",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", colors[stage] ?? "bg-white/10 text-white/60")}>
      {labels[stage] ?? stage}
    </span>
  );
}

export default function DemoDashboardPage() {
  const router = useRouter();

  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back. Here&apos;s your business at a glance. Click any card to dive deeper.
          </p>
        </div>
      </div>

      {/* Top Stats — clickable */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button type="button" onClick={() => router.push("/demo/intake")} className="text-left">
          <GlassCard className="h-full transition-colors hover:border-primary/30">
            <p className="text-sm text-muted-foreground">Intake Submissions</p>
            <p className="mt-1 text-3xl font-bold text-foreground">
              {demoStats.totalSubmissions}
            </p>
            {demoSubmissionTrend.change !== 0 && (
              <p className="mt-1 text-xs font-medium text-emerald-400">
                +{demoSubmissionTrend.change}% vs last week
              </p>
            )}
          </GlassCard>
        </button>

        <button type="button" onClick={() => router.push("/demo/clients")} className="text-left">
          <GlassCard className="h-full transition-colors hover:border-primary/30">
            <p className="text-sm text-muted-foreground">Total Clients</p>
            <p className="mt-1 text-3xl font-bold text-foreground">
              {demoStats.totalClients}
            </p>
          </GlassCard>
        </button>

        <button type="button" onClick={() => router.push("/demo/pipeline")} className="text-left">
          <GlassCard className="h-full transition-colors hover:border-primary/30">
            <p className="text-sm text-muted-foreground">Pipeline Value</p>
            <p className="mt-1 text-3xl font-bold text-foreground">
              {demoStats.estimatedPipelineValue}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              estimated from all intakes
            </p>
          </GlassCard>
        </button>

        <button type="button" onClick={() => router.push("/demo/analytics")} className="text-left">
          <GlassCard className="h-full transition-colors hover:border-primary/30">
            <p className="text-sm text-muted-foreground">Avg Complexity</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground">
                {demoStats.avgComplexity}
              </p>
              <span className="text-sm text-muted-foreground">/ 10</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all"
                style={{ width: `${(demoStats.avgComplexity / 10) * 100}%` }}
              />
            </div>
          </GlassCard>
        </button>
      </div>

      {/* Charts Row 1 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <GlassCard className="flex flex-col">
          <h2 className="text-sm font-semibold text-foreground">Complexity Distribution</h2>
          <div className="mt-5 flex h-8 w-full overflow-hidden rounded-lg">
            {demoComplexityDistribution.map((b) =>
              b.percentage > 0 ? (
                <div
                  key={b.label}
                  className={cn("flex items-center justify-center text-[10px] font-bold text-white/90", b.color)}
                  style={{ width: `${b.percentage}%` }}
                  title={`${b.label}: ${b.count} (${b.percentage}%)`}
                >
                  {b.percentage >= 12 && b.count}
                </div>
              ) : null,
            )}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {demoComplexityDistribution.map((b) => (
              <div key={b.label} className="flex flex-col items-center rounded-md border border-white/5 bg-white/[0.02] py-2.5">
                <span className="text-2xl font-bold text-foreground">{b.count}</span>
                <span className="mt-0.5 text-[10px] text-muted-foreground">{b.label}</span>
                <span className="text-[10px] text-muted-foreground/60">{b.percentage}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground">Service Demand</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {demoServiceDemand.map((s, i) => (
              <div key={s.service} className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 text-center transition-colors hover:border-white/10">
                <p className="text-2xl font-bold" style={{ color: `hsl(${180 + i * 30}, 70%, 60%)` }}>
                  {s.count}
                </p>
                <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{s.service}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Charts Row 2 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground">Budget Ranges</h2>
          <div className="mt-4 flex items-center gap-6">
            <div className="relative h-32 w-32 shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" className="text-white/5" />
                {(() => {
                  const colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#f43f5e"];
                  const r = 40;
                  const circumference = 2 * Math.PI * r;
                  let accumulated = 0;
                  return demoBudgetDistribution.map((b, i) => {
                    const segmentLength = (b.percentage / 100) * circumference;
                    const gap = 2;
                    const segment = (
                      <circle
                        key={b.label}
                        cx="50" cy="50" r={r}
                        fill="none"
                        stroke={colors[i % colors.length]}
                        strokeWidth="12"
                        strokeDasharray={`${Math.max(0, segmentLength - gap)} ${circumference - segmentLength + gap}`}
                        strokeDashoffset={-accumulated}
                        strokeLinecap="butt"
                      />
                    );
                    accumulated += segmentLength;
                    return segment;
                  });
                })()}
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">
                {demoStats.totalSubmissions}
              </span>
            </div>
            <div className="flex-1 space-y-2">
              {demoBudgetDistribution.map((b, i) => {
                const colors = ["bg-cyan-500", "bg-violet-500", "bg-amber-500", "bg-emerald-500", "bg-rose-500"];
                return (
                  <div key={b.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("inline-block h-2.5 w-2.5 rounded-sm", colors[i % colors.length])} />
                      <span className="text-xs text-muted-foreground">{b.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">{b.count}</span>
                      <span className="text-[10px] text-muted-foreground">({b.percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground">Industry Mix</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {demoIndustryDistribution.map((ind, i) => {
              const maxCount = Math.max(...demoIndustryDistribution.map((x) => x.count), 1);
              const scale = 0.75 + (ind.count / maxCount) * 0.5;
              return (
                <span
                  key={ind.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 transition-colors hover:border-white/20"
                  style={{
                    fontSize: `${scale * 0.75}rem`,
                    background: `hsla(${180 + i * 40}, 60%, 50%, 0.1)`,
                    borderColor: `hsla(${180 + i * 40}, 60%, 50%, 0.2)`,
                  }}
                >
                  <span className="font-bold" style={{ color: `hsl(${180 + i * 40}, 60%, 60%)` }}>
                    {ind.count}
                  </span>
                  <span className="text-muted-foreground">{ind.label}</span>
                </span>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Top Priority Submissions — clickable to intake */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Top Priority</h2>
            <p className="text-xs text-muted-foreground">
              Ranked by readiness, scope clarity, engagement, timeline &amp; risk — never by industry, size, or budget amount
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/demo/intake")}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            View All
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {demoRecentSubmissions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => router.push("/demo/intake")}
              className="flex w-full items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-primary/30"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn("inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums", getPriorityBadgeColors(s.priority.label))}>
                    {s.priority.score}
                  </span>
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <span className={cn("inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold", getComplexityBadgeColors(s.complexityLabel))}>
                    {s.complexityLabel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {s.company} &middot; {s.primaryService} &middot; {s.estimatedInvestment}
                </p>
              </div>
              <time className="shrink-0 text-xs text-muted-foreground">
                {new Date(s.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </time>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Pipeline Activity — clickable to pipeline */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Pipeline Activity</h2>
          <button
            type="button"
            onClick={() => router.push("/demo/pipeline")}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            View Pipeline
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {demoRecentActivity.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => router.push("/demo/pipeline")}
              className="flex w-full items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:border-primary/30"
            >
              {a.fromStage && getStageBadge(a.fromStage)}
              {a.fromStage && <span className="text-xs text-muted-foreground">&rarr;</span>}
              {getStageBadge(a.toStage)}
              {a.note && <span className="ml-2 truncate text-xs text-muted-foreground">{a.note}</span>}
              <time className="ml-auto shrink-0 text-xs text-muted-foreground">
                {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </time>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
