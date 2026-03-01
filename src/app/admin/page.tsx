import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getDashboardData } from "@/lib/dashboard-analytics";
import { GlassCard } from "@/components/shared/GlassCard";
import { StageBadge } from "@/components/admin/StageBadge";
import { SendIntakeLinkButton } from "@/components/admin/SendIntakeLinkButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — BuiltByBas Admin",
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

function getBarColor(index: number): string {
  const colors = [
    "bg-primary",
    "bg-cyan-400",
    "bg-blue-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-indigo-500",
    "bg-orange-400",
  ];
  return colors[index % colors.length];
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
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

      {/* ---- Charts Row 1: Complexity + Service Demand ---- */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Complexity Distribution */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground">
            Complexity Distribution
          </h2>
          {/* Stacked bar */}
          <div className="mt-4 flex h-8 w-full overflow-hidden rounded-lg">
            {complexityDistribution
              .filter((b) => b.count > 0)
              .map((b) => (
                <div
                  key={b.label}
                  className={cn(
                    "flex items-center justify-center text-xs font-semibold text-white transition-all",
                    b.color,
                  )}
                  style={{ width: `${b.percentage}%` }}
                  title={`${b.label}: ${b.count}`}
                >
                  {b.percentage >= 12 ? b.count : ""}
                </div>
              ))}
          </div>
          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
            {complexityDistribution.map((b) => (
              <div key={b.label} className="flex items-center gap-1.5">
                <span
                  className={cn("inline-block h-2.5 w-2.5 rounded-sm", b.color)}
                />
                <span className="text-xs text-muted-foreground">
                  {b.label}{" "}
                  <span className="font-medium text-foreground">
                    {b.count}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Service Demand */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground">
            Service Demand
          </h2>
          <div className="mt-4 space-y-2.5">
            {serviceDemand.map((s, i) => (
              <div key={s.service}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.service}</span>
                  <span className="font-medium text-foreground">
                    {s.count}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      getBarColor(i),
                    )}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ---- Charts Row 2: Budget + Industry ---- */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Budget Distribution */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground">
            Budget Ranges
          </h2>
          <div className="mt-4 space-y-2.5">
            {budgetDistribution.map((b, i) => (
              <div key={b.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{b.label}</span>
                  <span className="font-medium text-foreground">
                    {b.count}{" "}
                    <span className="text-muted-foreground">
                      ({b.percentage}%)
                    </span>
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      getBarColor(i + 3),
                    )}
                    style={{ width: `${b.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Industry Mix */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground">
            Industry Mix
          </h2>
          <div className="mt-4 space-y-2.5">
            {industryDistribution.map((ind, i) => (
              <div key={ind.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{ind.label}</span>
                  <span className="font-medium text-foreground">
                    {ind.count}{" "}
                    <span className="text-muted-foreground">
                      ({ind.percentage}%)
                    </span>
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      getBarColor(i),
                    )}
                    style={{ width: `${ind.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ---- Recent Submissions ---- */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Submissions</h2>
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
