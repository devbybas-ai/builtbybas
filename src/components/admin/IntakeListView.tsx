"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { computePriorityScore, getPriorityBadgeColors } from "@/lib/prioritization";
import { GlassCard } from "@/components/shared/GlassCard";
import type { IntakeSubmissionRow, IntakeStatus } from "@/lib/intake-storage";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortKey = "date" | "complexity" | "name" | "priority";
type SortDir = "asc" | "desc";
type ComplexityFilter = "all" | "Simple" | "Moderate" | "Complex" | "Enterprise";
type StatusFilter = "all" | IntakeStatus;

interface IntakeListViewProps {
  submissions: IntakeSubmissionRow[];
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

const BUDGET_DISPLAY: Record<string, string> = {
  "1k-5k": "$1K - $5K",
  "5k-15k": "$5K - $15K",
  "15k-30k": "$15K - $30K",
  "30k+": "$30K+",
  unsure: "Budget TBD",
};

function formatBudget(raw: string): string {
  if (!raw || raw === "unsure") return "Budget TBD";
  return BUDGET_DISPLAY[raw] ?? raw;
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

const STATUS_BADGE: Record<IntakeStatus, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-500/20 text-blue-400" },
  reviewed: { label: "Reviewed", color: "bg-amber-500/20 text-amber-400" },
  accepted: { label: "Accepted", color: "bg-emerald-500/20 text-emerald-400" },
  rejected: { label: "Rejected", color: "bg-red-500/20 text-red-400" },
  converted: { label: "Converted", color: "bg-cyan-500/20 text-cyan-400" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function IntakeListView({ submissions }: IntakeListViewProps) {
  const [complexityFilter, setComplexityFilter] =
    useState<ComplexityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("priority");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");

  // Derive available services for filter dropdown
  const availableServices = useMemo(() => {
    const set = new Set<string>();
    for (const row of submissions) {
      const primary = row.analysis.serviceRecommendations.find(
        (r) => r.isPrimary,
      );
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
              (sum, row) => sum + row.analysis.complexityScore.overall,
              0,
            ) /
              total) *
              10,
          ) / 10
        : 0;

    const complexityCounts = {
      Simple: 0,
      Moderate: 0,
      Complex: 0,
      Enterprise: 0,
    };
    const statusCounts: Record<IntakeStatus, number> = {
      new: 0,
      reviewed: 0,
      accepted: 0,
      rejected: 0,
      converted: 0,
    };
    for (const row of submissions) {
      const label = getComplexityLabel(row.analysis.complexityScore.overall);
      complexityCounts[label as keyof typeof complexityCounts]++;
      statusCounts[row.status]++;
    }

    return { total, avgComplexity, complexityCounts, statusCounts };
  }, [submissions]);

  // Helper: apply all filters except the one being counted
  const applyFilters = useMemo(() => {
    return (rows: IntakeSubmissionRow[], skip?: "status" | "complexity" | "service") => {
      let result = rows;
      if (statusFilter !== "all" && skip !== "status") {
        result = result.filter((row) => row.status === statusFilter);
      }
      if (complexityFilter !== "all" && skip !== "complexity") {
        result = result.filter(
          (row) =>
            getComplexityLabel(row.analysis.complexityScore.overall) === complexityFilter,
        );
      }
      if (serviceFilter !== "all" && skip !== "service") {
        result = result.filter((row) => {
          const primary = row.analysis.serviceRecommendations.find((r) => r.isPrimary);
          return primary?.serviceTitle === serviceFilter;
        });
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        result = result.filter(
          (row) =>
            row.analysis.formData.name.toLowerCase().includes(q) ||
            row.analysis.formData.company.toLowerCase().includes(q) ||
            row.analysis.formData.email.toLowerCase().includes(q),
        );
      }
      return result;
    };
  }, [statusFilter, complexityFilter, serviceFilter, search]);

  // Counts for each filter option (excluding its own filter)
  const statusCounts = useMemo(() => {
    const base = applyFilters(submissions, "status");
    const counts: Record<string, number> = { all: base.length };
    for (const row of base) counts[row.status] = (counts[row.status] ?? 0) + 1;
    return counts;
  }, [submissions, applyFilters]);

  const complexityCounts = useMemo(() => {
    const base = applyFilters(submissions, "complexity");
    const counts: Record<string, number> = { all: base.length };
    for (const row of base) {
      const label = getComplexityLabel(row.analysis.complexityScore.overall);
      counts[label] = (counts[label] ?? 0) + 1;
    }
    return counts;
  }, [submissions, applyFilters]);

  const serviceCounts = useMemo(() => {
    const base = applyFilters(submissions, "service");
    const counts: Record<string, number> = { all: base.length };
    for (const row of base) {
      const primary = row.analysis.serviceRecommendations.find((r) => r.isPrimary);
      if (primary) counts[primary.serviceTitle] = (counts[primary.serviceTitle] ?? 0) + 1;
    }
    return counts;
  }, [submissions, applyFilters]);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = applyFilters(submissions);

    // Sort
    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "priority":
          cmp =
            computePriorityScore(a.analysis).score -
            computePriorityScore(b.analysis).score;
          break;
        case "date":
          cmp =
            new Date(a.analysis.submittedAt).getTime() -
            new Date(b.analysis.submittedAt).getTime();
          break;
        case "complexity":
          cmp =
            a.analysis.complexityScore.overall -
            b.analysis.complexityScore.overall;
          break;
        case "name":
          cmp = a.analysis.formData.name.localeCompare(
            b.analysis.formData.name,
          );
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [submissions, applyFilters, sortKey, sortDir]);

  const hasActiveFilters =
    statusFilter !== "all" || complexityFilter !== "all" || serviceFilter !== "all" || search.trim() !== "";

  function resetFilters() {
    setStatusFilter("all");
    setComplexityFilter("all");
    setServiceFilter("all");
    setSearch("");
  }

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
        <GlassCard className="px-4 py-3">
          <p className="text-xs text-muted-foreground">New</p>
          <p className="text-2xl font-bold text-blue-400">
            {summaryStats.statusCounts.new}
          </p>
        </GlassCard>
        <GlassCard className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Accepted</p>
          <p className="text-2xl font-bold text-emerald-400">
            {summaryStats.statusCounts.accepted}
          </p>
        </GlassCard>
        <GlassCard className="px-4 py-3">
          <p className="text-xs text-muted-foreground">Converted</p>
          <p className="text-2xl font-bold text-cyan-400">
            {summaryStats.statusCounts.converted}
          </p>
        </GlassCard>
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

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          {(
            ["all", "new", "reviewed", "accepted", "rejected", "converted"] as const
          ).map((f) => {
            const badge = f === "all" ? null : STATUS_BADGE[f];
            const count = statusCounts[f] ?? 0;
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                disabled={count === 0 && f !== "all"}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  statusFilter === f
                    ? badge
                      ? badge.color
                      : "bg-primary/20 text-primary"
                    : count === 0 && f !== "all"
                      ? "bg-white/5 text-muted-foreground/30 cursor-not-allowed"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10",
                )}
              >
                {f === "all" ? "All" : STATUS_BADGE[f].label}
                {f !== "all" && <span className="ml-1 opacity-60">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Complexity filter */}
        <div className="flex items-center gap-1.5">
          {(
            ["all", "Simple", "Moderate", "Complex", "Enterprise"] as const
          ).map((f) => {
            const count = complexityCounts[f] ?? 0;
            return (
              <button
                key={f}
                onClick={() => setComplexityFilter(f)}
                disabled={count === 0 && f !== "all"}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  complexityFilter === f
                    ? "bg-primary/20 text-primary"
                    : count === 0 && f !== "all"
                      ? "bg-white/5 text-muted-foreground/30 cursor-not-allowed"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10",
                )}
              >
                {f === "all" ? "All Complexity" : f}
                {f !== "all" && <span className="ml-1 opacity-60">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Service filter */}
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:border-primary/50 focus:outline-none"
        >
          <option value="all">All Services</option>
          {availableServices.map((s) => {
            const count = serviceCounts[s] ?? 0;
            return (
              <option key={s} value={s} disabled={count === 0}>
                {s} ({count})
              </option>
            );
          })}
        </select>

        {/* Sort buttons */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Sort:</span>
          {(
            [
              { key: "priority" as const, label: "Priority" },
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
                <span className="ml-1">
                  {sortDir === "desc" ? "\u2193" : "\u2191"}
                </span>
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
        {filtered.map((row) => {
          const s = row.analysis;
          const primary = s.serviceRecommendations.find((r) => r.isPrimary);
          const label = getComplexityLabel(s.complexityScore.overall);
          const statusBadge = STATUS_BADGE[row.status];
          const priority = computePriorityScore(s);

          return (
            <Link key={s.id} href={`/admin/intake/${s.id}`}>
              <GlassCard
                hover
                className="cursor-pointer px-4 py-3 transition-all hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums",
                          getPriorityBadgeColors(priority.label),
                        )}
                        title={priority.factors.map((f) => `${f.name}: ${f.score}`).join(", ")}
                      >
                        {priority.score}
                      </span>
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {s.formData.name}
                      </h3>
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          statusBadge.color,
                        )}
                      >
                        {statusBadge.label}
                      </span>
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
                  <span>
                    {formatBudget(s.formData.budgetRange)}
                  </span>
                </div>
              </GlassCard>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No submissions match your current filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-3 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/30"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
