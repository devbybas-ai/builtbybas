import type { Metadata } from "next";
import Link from "next/link";
import { sql, eq } from "drizzle-orm";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { invoices, billingMilestones, projects } from "@/lib/schema";
import { getDashboardData } from "@/lib/dashboard-analytics";
import { getPriorityBadgeColors } from "@/lib/prioritization";
import { GlassCard } from "@/components/shared/GlassCard";
import { StageBadge } from "@/components/admin/StageBadge";
import { SendIntakeLinkButton } from "@/components/admin/SendIntakeLinkButton";
import { formatCents } from "@/types/invoice";
import { getMilestoneTypeLabel } from "@/types/billing";
import type { MilestoneType } from "@/types/billing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard - BuiltByBas Admin",
  robots: { index: false, follow: false },
};

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


export default async function AdminDashboardPage() {
  const [data, billingStatsRows, nextMilestoneRows] = await Promise.all([
    getDashboardData(),
    db
      .select({
        outstandingCents: sql<number>`coalesce(sum(case when ${invoices.status} in ('sent', 'overdue') then ${invoices.totalCents} else 0 end), 0)::int`,
        overdueCount: sql<number>`coalesce(sum(case when ${invoices.status} = 'overdue' then 1 else 0 end), 0)::int`,
      })
      .from(invoices),
    db
      .select({
        type: billingMilestones.type,
        amountCents: billingMilestones.amountCents,
        scheduledDate: billingMilestones.scheduledDate,
        projectName: projects.name,
      })
      .from(billingMilestones)
      .innerJoin(projects, eq(billingMilestones.projectId, projects.id))
      .where(eq(billingMilestones.status, "pending"))
      .orderBy(billingMilestones.scheduledDate)
      .limit(1),
  ]);

  const billingStats = billingStatsRows[0] ?? { outstandingCents: 0, overdueCount: 0 };
  const nextMilestone = nextMilestoneRows[0] ?? null;

  const {
    stats,
    complexityDistribution,
    serviceDemand,
    budgetDistribution,
    industryDistribution,
    submissionTrend,
    recentSubmissions,
    recentActivity,
  } = data;

  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back. Here&apos;s your business at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SendIntakeLinkButton />
          <Link
            href="/admin/intake"
            className="text-sm text-primary hover:underline"
          >
            View all submissions &rarr;
          </Link>
        </div>
      </div>

      {/* ---- Top Stats ---- */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <p className="text-sm text-muted-foreground">Intake Submissions</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {stats.totalSubmissions}
          </p>
          {submissionTrend.change !== 0 && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                submissionTrend.change > 0
                  ? "text-emerald-400"
                  : "text-red-400",
              )}
            >
              {submissionTrend.change > 0 ? "+" : ""}
              {submissionTrend.change}% vs last week
            </p>
          )}
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-muted-foreground">Active Clients</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {stats.activeClients}
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-muted-foreground">Pipeline Value</p>
          <p className="mt-1 text-3xl font-bold text-foreground">
            {stats.estimatedPipelineValue}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            estimated from all intakes
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-muted-foreground">Avg Complexity</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">
              {stats.avgComplexity}
            </p>
            <span className="text-sm text-muted-foreground">/ 10</span>
          </div>
          {/* Mini complexity bar */}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all"
              style={{ width: `${(stats.avgComplexity / 10) * 100}%` }}
            />
          </div>
        </GlassCard>
      </div>

      {/* ---- Billing Summary ---- */}
      <div className="mt-6">
        <GlassCard>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Billing</h2>
            <Link href="/admin/invoices" className="text-sm text-primary hover:underline">
              View invoices &rarr;
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wide">Outstanding</p>
              <p className="text-xl font-bold text-primary">
                {formatCents(billingStats.outstandingCents)}
              </p>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wide">Overdue</p>
              <p
                className={cn(
                  "text-xl font-bold",
                  billingStats.overdueCount > 0 ? "text-red-400" : "text-white/75",
                )}
              >
                {billingStats.overdueCount}
              </p>
            </div>
          </div>
          {nextMilestone && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Next Milestone</p>
              <p className="text-sm text-white">
                {nextMilestone.projectName} -{" "}
                {getMilestoneTypeLabel(nextMilestone.type as MilestoneType)}
              </p>
              {nextMilestone.scheduledDate && (
                <p className="text-xs text-white/50">
                  {new Date(nextMilestone.scheduledDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          )}
        </GlassCard>
      </div>

      {/* ---- Charts Row 1: Complexity + Service Demand ---- */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Complexity Distribution — Stacked bar + legend */}
        <GlassCard className="flex flex-col">
          <h2 className="text-sm font-semibold text-foreground">
            Complexity Distribution
          </h2>
          {/* Stacked horizontal bar */}
          <div className="mt-5 flex h-8 w-full overflow-hidden rounded-lg">
            {complexityDistribution.map((b) =>
              b.percentage > 0 ? (
                <div
                  key={b.label}
                  className={cn("flex items-center justify-center text-[10px] font-bold text-white/90 transition-all", b.color)}
                  style={{ width: `${b.percentage}%` }}
                  title={`${b.label}: ${b.count} (${b.percentage}%)`}
                >
                  {b.percentage >= 12 && b.count}
                </div>
              ) : null,
            )}
          </div>
          {/* Legend grid */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {complexityDistribution.map((b) => (
              <div key={b.label} className="flex flex-col items-center rounded-md border border-white/5 bg-white/[0.02] py-2.5">
                <span className="text-2xl font-bold text-foreground">{b.count}</span>
                <span className="mt-0.5 text-[10px] text-muted-foreground">{b.label}</span>
                <span className="text-[10px] text-muted-foreground/60">{b.percentage}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Service Demand — Grid of mini cards */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground">
            Service Demand
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {serviceDemand.map((s, i) => (
              <div
                key={s.service}
                className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 text-center transition-colors hover:border-white/10"
              >
                <p className="text-2xl font-bold" style={{ color: `hsl(${180 + i * 30}, 70%, 60%)` }}>
                  {s.count}
                </p>
                <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                  {s.service}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ---- Charts Row 2: Budget + Industry ---- */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Budget Distribution — Stacked donut segments */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground">
            Budget Ranges
          </h2>
          <div className="mt-4 flex items-center gap-6">
            {/* Ring chart */}
            <div className="relative h-28 w-28 shrink-0">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-white/5"
                />
                {(() => {
                  const colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#f43f5e"];
                  let offset = 0;
                  return budgetDistribution.map((b, i) => {
                    const segment = (
                      <circle
                        key={b.label}
                        cx="18" cy="18" r="14"
                        fill="none"
                        stroke={colors[i % colors.length]}
                        strokeWidth="4"
                        strokeDasharray={`${b.percentage * 0.88} ${88 - b.percentage * 0.88}`}
                        strokeDashoffset={-offset * 0.88}
                        strokeLinecap="round"
                      />
                    );
                    offset += b.percentage;
                    return segment;
                  });
                })()}
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">
                {stats.totalSubmissions}
              </span>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2">
              {budgetDistribution.map((b, i) => {
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

        {/* Industry Mix — Proportional pill tags */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground">
            Industry Mix
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {industryDistribution.map((ind, i) => {
              const maxCount = Math.max(...industryDistribution.map((x) => x.count), 1);
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
                  <span
                    className="font-bold"
                    style={{ color: `hsl(${180 + i * 40}, 60%, 60%)` }}
                  >
                    {ind.count}
                  </span>
                  <span className="text-muted-foreground">{ind.label}</span>
                </span>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* ---- Top Priority Submissions ---- */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Top Priority</h2>
            <p className="text-xs text-muted-foreground">
              Ranked by readiness, scope clarity, engagement, timeline &amp; risk — never by industry, size, or budget amount
            </p>
          </div>
          <Link
            href="/admin/intake"
            className="text-sm text-primary hover:underline"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {recentSubmissions.map((s) => (
            <Link
              key={s.id}
              href={`/admin/intake/${s.id}`}
              className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 transition-colors hover:border-primary/30"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums",
                      getPriorityBadgeColors(s.priority.label),
                    )}
                  >
                    {s.priority.score}
                  </span>
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      getComplexityBadgeColors(s.complexityLabel),
                    )}
                  >
                    {s.complexityLabel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {s.company} &middot; {s.primaryService} &middot;{" "}
                  {s.estimatedInvestment}
                </p>
              </div>
              <time className="shrink-0 text-xs text-muted-foreground">
                {new Date(s.submittedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </Link>
          ))}
          {recentSubmissions.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No submissions yet. They&apos;ll show up here when someone
              completes the intake form.
            </p>
          )}
        </div>
      </div>

      {/* ---- Recent Pipeline Activity ---- */}
      {recentActivity.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Recent Pipeline Activity</h2>
          <div className="mt-4 space-y-2">
            {recentActivity.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                {a.fromStage && <StageBadge stage={a.fromStage} />}
                {a.fromStage && (
                  <span className="text-xs text-muted-foreground">&rarr;</span>
                )}
                <StageBadge stage={a.toStage} />
                {a.note && (
                  <span className="ml-2 truncate text-xs text-muted-foreground">
                    {a.note}
                  </span>
                )}
                <time className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {new Date(a.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
