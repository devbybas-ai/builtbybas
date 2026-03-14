"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import { demoAnalytics } from "@/data/demo-data";

const periods = ["6M", "YTD", "12M"] as const;

const extendedRevenue = [
  { month: "Apr", amount: 5500 },
  { month: "May", amount: 7200 },
  { month: "Jun", amount: 6800 },
  { month: "Jul", amount: 7500 },
  { month: "Aug", amount: 9000 },
  { month: "Sep", amount: 8200 },
  ...demoAnalytics.monthlyRevenue,
];

export default function DemoAnalyticsPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("6M");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const revenueData = period === "6M"
    ? demoAnalytics.monthlyRevenue
    : period === "YTD"
      ? demoAnalytics.monthlyRevenue.slice(-3)
      : extendedRevenue;

  const maxRevenue = Math.max(...revenueData.map((m) => m.amount));
  const totalForPeriod = revenueData.reduce((sum, m) => sum + m.amount, 0);
  const avgForPeriod = Math.round(totalForPeriod / revenueData.length);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Business performance overview. Hover over bars for details.
        </p>
      </div>

      {/* Top metrics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{demoAnalytics.revenue.total}</p>
          <p className="mt-1 text-xs font-medium text-emerald-400">
            +{demoAnalytics.revenue.change}% vs last month
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-muted-foreground">Active Clients</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{demoAnalytics.clients.active}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            +{demoAnalytics.clients.newThisMonth} new this month
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-muted-foreground">Proposal Conversion</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{demoAnalytics.proposals.conversionRate}%</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {demoAnalytics.proposals.accepted} of {demoAnalytics.proposals.sent} accepted
          </p>
        </GlassCard>

        <GlassCard>
          <p className="text-sm text-muted-foreground">Avg Delivery</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{demoAnalytics.projects.avgDeliveryDays}</p>
          <p className="mt-1 text-xs text-muted-foreground">days to launch</p>
        </GlassCard>
      </div>

      {/* Revenue chart + Project summary */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Monthly Revenue</h2>
            <div className="flex gap-1">
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "rounded-md px-2 py-1 text-[10px] font-semibold transition-colors",
                    period === p
                      ? "bg-primary/20 text-primary"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Period summary */}
          <div className="mt-3 flex gap-4 text-xs">
            <span className="text-muted-foreground">
              Period total: <span className="font-semibold text-foreground">${totalForPeriod.toLocaleString()}</span>
            </span>
            <span className="text-muted-foreground">
              Avg: <span className="font-semibold text-foreground">${avgForPeriod.toLocaleString()}/mo</span>
            </span>
          </div>

          <div className="mt-4 flex items-end gap-2" style={{ height: "180px" }}>
            {revenueData.map((m, i) => {
              const heightPct = (m.amount / maxRevenue) * 100;
              const isHovered = hoveredBar === i;
              return (
                <div
                  key={`${m.month}-${i}`}
                  className="relative flex flex-1 flex-col items-center gap-2"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {isHovered && (
                    <div className="absolute -top-8 rounded-md bg-foreground/90 px-2 py-1 text-[10px] font-bold text-background">
                      ${m.amount.toLocaleString()}
                    </div>
                  )}
                  <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                    ${(m.amount / 1000).toFixed(1)}k
                  </span>
                  <div className="w-full flex-1 flex flex-col justify-end">
                    <div
                      className={cn(
                        "w-full rounded-t-md transition-all",
                        isHovered
                          ? "bg-gradient-to-t from-primary to-primary/80"
                          : "bg-gradient-to-t from-primary/60 to-primary",
                      )}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{m.month}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-sm font-semibold text-foreground">Project Summary</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Projects</span>
              <span className="text-lg font-bold text-cyan-400">{demoAnalytics.projects.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed Projects</span>
              <span className="text-lg font-bold text-emerald-400">{demoAnalytics.projects.completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Proposals Sent</span>
              <span className="text-lg font-bold text-amber-400">{demoAnalytics.proposals.sent}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Clients</span>
              <span className="text-lg font-bold text-foreground">{demoAnalytics.clients.total}</span>
            </div>

            <div className="mt-4 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-lg font-bold text-primary">{demoAnalytics.revenue.thisMonth}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Month</span>
                <span className="text-lg font-bold text-muted-foreground">{demoAnalytics.revenue.lastMonth}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
