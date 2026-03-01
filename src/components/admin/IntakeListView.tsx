"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import type { IntakeAnalysis } from "@/types/intake-analysis";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortKey = "date" | "complexity" | "name";
type SortDir = "asc" | "desc";
type ComplexityFilter = "all" | "Simple" | "Moderate" | "Complex" | "Enterprise";

interface IntakeListViewProps {
  submissions: IntakeAnalysis[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getComplexityLabel(score: number): string {
  if (score >= 8) return "Enterprise";
  if (score >= 6) return "Complex";
  if (score >= 4) return "Moderate";
  return "Simple";
}

function getComplexityBadge(label: string) {
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function IntakeListView({ submissions }: IntakeListViewProps) {
  const [complexityFilter, setComplexityFilter] =
    useState<ComplexityFilter>("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");

  // Derive available services for filter dropdown
  const availableServices = useMemo(() => {
    const set = new Set<string>();
    for (const s of submissions) {
      const primary = s.serviceRecommendations.find((r) => r.isPrimary);
      if (primary) set.add(primary.serviceTitle);
    }
    return [...set].sort();
  }, [submissions]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const total = submissions.length;
    const avgComplexity =
      total > 0
        ? Math.round(
            (submissions.reduce(
              (sum, s) => sum + s.complexityScore.overall,
              0,
            ) /
              total) *
              10,
          ) / 10
        : 0;

    const complexityCounts = { Simple: 0, Moderate: 0, Complex: 0, Enterprise: 0 };
    for (const s of submissions) {
      const label = getComplexityLabel(s.complexityScore.overall);
      complexityCounts[label as keyof typeof complexityCounts]++;
    }

    return { total, avgComplexity, complexityCounts };
  }, [submissions]);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = [...submissions];

    // Complexity filter
    if (complexityFilter !== "all") {
      result = result.filter(
        (s) =>
          getComplexityLabel(s.complexityScore.overall) === complexityFilter,
      );
    }

    // Service filter
    if (serviceFilter !== "all") {
      result = result.filter((s) => {
        const primary = s.serviceRecommendations.find((r) => r.isPrimary);
        return primary?.serviceTitle === serviceFilter;
      });
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.formData.name.toLowerCase().includes(q) ||
          s.formData.company.toLowerCase().includes(q) ||
          s.formData.email.toLowerCase().includes(q),
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "date":
          cmp =
            new Date(a.submittedAt).getTime() -
            new Date(b.submittedAt).getTime();
          break;
        case "complexity":
          cmp = a.complexityScore.overall - b.complexityScore.overall;
          break;
        case "name":
          cmp = a.formData.name.localeCompare(b.formData.name);
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [submissions, complexityFilter, serviceFilter, sortKey, sortDir, search]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <>
      {/* Summary Stats Bar */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <GlassCard className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{summaryStats.total}</p>
        </GlassCard>
        <GlassCard className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Avg Complexity</p>
          <p className="text-2xl font-bold">
            {summaryStats.avgComplexity}
            <span className="text-sm font-normal text-muted-foreground">
              /10
            </span>
          </p>
        </GlassCard>
        {(
          ["Simple", "Moderate", "Complex"] as const
        ).map((label) => (
          <GlassCard key={label} className="px-4 py-3">
            <p className="text-xs text-muted-foreground">{label}+</p>
            <p className="text-2xl font-bold">
              {label === "Simple"
                ? summaryStats.total
                : label === "Moderate"
                  ? summaryStats.complexityCounts.Moderate +
                    summaryStats.complexityCounts.Complex +
                    summaryStats.complexityCounts.Enterprise
                  : summaryStats.complexityCounts.Complex +
                    summaryStats.complexityCounts.Enterprise}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Filters + Sort */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, company, email..."
          className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none sm:w-64"
        />

        {/* Complexity filter */}
        <div className="flex items-center gap-1.5">
          {(
            ["all", "Simple", "Moderate", "Complex", "Enterprise"] as const
          ).map((f) => (
            <button
              key={f}
              onClick={() => setComplexityFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                complexityFilter === f
                  ? "bg-primary/20 text-primary"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10",
              )}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Service filter */}
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:border-primary/50 focus:outline-none"
        >
          <option value="all">All Services</option>
          {availableServices.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Sort buttons */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Sort:</span>
          {(
            [
              { key: "date" as const, label: "Date" },
              { key: "complexity" as const, label: "Complexity" },
              { key: "name" as const, label: "Name" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                sortKey === key
                  ? "bg-primary/20 text-primary"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10",
              )}
            >
              {label}
              {sortKey === key && (
                <span className="ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="mt-3 text-xs text-muted-foreground">
        Showing {filtered.length} of {submissions.length} submissions
      </p>

      {/* Submission List */}
      <div className="mt-4 space-y-2">
        {filtered.map((s) => {
          const primary = s.serviceRecommendations.find((r) => r.isPrimary);
          const label = getComplexityLabel(s.complexityScore.overall);

          return (
            <Link key={s.id} href={`/admin/intake/${s.id}`}>
              <GlassCard
                hover
                className="cursor-pointer px-4 py-3 transition-all hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {s.formData.name}
                      </h3>
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          getComplexityBadge(label),
                        )}
                      >
                        {label} ({s.complexityScore.overall})
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.formData.company} &middot; {s.formData.industry}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-muted-foreground">
                    {new Date(s.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </time>
                </div>

                <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
                  {s.summary.headline}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {primary && (
                    <span>
                      Primary:{" "}
                      <strong className="text-foreground">
                        {primary.serviceTitle}
                      </strong>
                    </span>
                  )}
                  <span>{s.summary.estimatedTotalInvestment}</span>
                  <span>
                    {s.formData.selectedServices.length} service
                    {s.formData.selectedServices.length !== 1 ? "s" : ""}
                  </span>
                  <span className="capitalize">
                    {s.formData.budgetRange === "unsure"
                      ? "Budget TBD"
                      : s.formData.budgetRange}
                  </span>
                </div>
              </GlassCard>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No submissions match your filters.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
