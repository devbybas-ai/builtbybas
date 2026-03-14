"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { demoIntakes, type DemoIntake } from "@/data/demo-data";

function getComplexityBadge(label: string) {
  const colors: Record<string, string> = {
    Simple: "bg-emerald-500/20 text-emerald-400",
    Moderate: "bg-amber-500/20 text-amber-400",
    Complex: "bg-orange-500/20 text-orange-400",
    Enterprise: "bg-red-500/20 text-red-400",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", colors[label] ?? "bg-white/10 text-white/60")}>
      {label}
    </span>
  );
}

function getStatusBadge(status: string) {
  const colors: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-400",
    reviewed: "bg-violet-500/20 text-violet-400",
    discovery: "bg-amber-500/20 text-amber-400",
    proposal: "bg-cyan-500/20 text-cyan-400",
    in_progress: "bg-emerald-500/20 text-emerald-400",
    archived: "bg-white/10 text-white/40",
  };
  const labels: Record<string, string> = {
    new: "New",
    reviewed: "Reviewed",
    discovery: "Discovery",
    proposal: "Proposal",
    in_progress: "In Progress",
    archived: "Archived",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", colors[status] ?? "bg-white/10 text-white/60")}>
      {labels[status] ?? status}
    </span>
  );
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

const statusOptions = ["new", "reviewed", "discovery", "proposal", "in_progress", "archived"];
const statusLabels: Record<string, string> = {
  new: "New",
  reviewed: "Reviewed",
  discovery: "Discovery",
  proposal: "Proposal",
  in_progress: "In Progress",
  archived: "Archived",
};

export default function DemoIntakePage() {
  const [intakes, setIntakes] = useState<DemoIntake[]>(() => [...demoIntakes]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  function updateStatus(id: string, newStatus: string) {
    setIntakes((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)),
    );
  }

  const filtered = filterStatus === "all"
    ? intakes
    : intakes.filter((i) => i.status === filterStatus);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Intake Submissions</h1>
        <p className="mt-1 text-muted-foreground">
          {intakes.length} submissions received. Click to expand details and change status.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterStatus("all")}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            filterStatus === "all"
              ? "bg-primary/20 text-primary"
              : "bg-white/5 text-muted-foreground hover:bg-white/10",
          )}
        >
          All ({intakes.length})
        </button>
        {statusOptions.map((s) => {
          const count = intakes.filter((i) => i.status === s).length;
          if (count === 0) return null;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filterStatus === s
                  ? "bg-primary/20 text-primary"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10",
              )}
            >
              {statusLabels[s]} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.map((intake) => (
          <div key={intake.id} className="rounded-lg border border-white/5 bg-white/[0.02] transition-colors hover:border-primary/20">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === intake.id ? null : intake.id)}
              className="w-full p-4 text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums", getPriorityBadgeColors(intake.priority.label))}>
                      {intake.priority.score}
                    </span>
                    <h3 className="text-sm font-semibold">{intake.name}</h3>
                    {getComplexityBadge(intake.complexityLabel)}
                    {getStatusBadge(intake.status)}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {intake.company} &middot; {intake.industry}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">{intake.budget}</p>
                  <p className="text-[10px] text-muted-foreground">{intake.timeline}</p>
                </div>
              </div>
            </button>

            {/* Expanded detail */}
            {expandedId === intake.id && (
              <div className="border-t border-white/5 px-4 pb-4 pt-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Project Description</h4>
                    <p className="mt-1 text-sm text-foreground/80">{intake.description}</p>

                    <h4 className="mt-4 text-xs font-semibold text-muted-foreground">Services Requested</h4>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {intake.services.map((s) => (
                        <span key={s} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Contact</h4>
                    <p className="mt-1 text-sm">{intake.name}</p>
                    <p className="text-xs text-muted-foreground">{intake.email}</p>

                    <h4 className="mt-4 text-xs font-semibold text-muted-foreground">Complexity Score</h4>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                          style={{ width: `${(intake.complexity / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">{intake.complexity}/10</span>
                    </div>

                    <h4 className="mt-4 text-xs font-semibold text-muted-foreground">Update Status</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {statusOptions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateStatus(intake.id, s)}
                          className={cn(
                            "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                            intake.status === s
                              ? "bg-primary/20 text-primary"
                              : "bg-white/5 text-muted-foreground hover:bg-white/10",
                          )}
                        >
                          {statusLabels[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-right text-[10px] text-muted-foreground/60">
                  Submitted {new Date(intake.submittedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No submissions match this filter.
          </p>
        )}
      </div>
    </>
  );
}
