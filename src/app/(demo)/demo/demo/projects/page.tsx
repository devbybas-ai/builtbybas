"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import { demoProjects, type DemoProject } from "@/data/demo-data";

const statusOptions = ["planning", "in_progress", "review", "completed"] as const;
const statusLabels: Record<string, string> = {
  planning: "Planning",
  in_progress: "In Progress",
  review: "Review",
  completed: "Completed",
};
const statusColors: Record<string, string> = {
  planning: "bg-violet-500/20 text-violet-400",
  in_progress: "bg-cyan-500/20 text-cyan-400",
  review: "bg-amber-500/20 text-amber-400",
  completed: "bg-emerald-500/20 text-emerald-400",
};

function getStatusBadge(status: string) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", statusColors[status] ?? "bg-white/10 text-white/60")}>
      {statusLabels[status] ?? status}
    </span>
  );
}

function getProgressColor(progress: number) {
  if (progress >= 80) return "bg-emerald-500";
  if (progress >= 50) return "bg-cyan-500";
  if (progress >= 25) return "bg-amber-500";
  return "bg-violet-500";
}

export default function DemoProjectsPage() {
  const [projects, setProjects] = useState<DemoProject[]>(() => [...demoProjects]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function updateStatus(id: string, newStatus: DemoProject["status"]) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const progressMap: Record<string, number> = {
          planning: 10,
          in_progress: 50,
          review: 85,
          completed: 100,
        };
        return {
          ...p,
          status: newStatus,
          progress: Math.max(p.progress, progressMap[newStatus] ?? p.progress),
        };
      }),
    );
  }

  function updateProgress(id: string, delta: number) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newProgress = Math.min(100, Math.max(0, p.progress + delta));
        let newStatus = p.status;
        if (newProgress === 100) newStatus = "completed";
        else if (newProgress >= 80) newStatus = "review";
        else if (newProgress >= 15) newStatus = "in_progress";
        else newStatus = "planning";
        return { ...p, progress: newProgress, status: newStatus };
      }),
    );
  }

  const filtered = filterStatus === "all"
    ? projects
    : projects.filter((p) => p.status === filterStatus);

  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="mt-1 text-muted-foreground">
          {projects.length} projects tracked. Click to expand, update status, and adjust progress.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <GlassCard>
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="mt-1 text-2xl font-bold">{projects.length}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-1 text-2xl font-bold text-cyan-400">
            {projects.filter((p) => p.status === "in_progress" || p.status === "review").length}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            {projects.filter((p) => p.status === "completed").length}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Avg Progress</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-2xl font-bold text-primary">{avgProgress}%</p>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${avgProgress}%` }}
              />
            </div>
          </div>
        </GlassCard>
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
          All ({projects.length})
        </button>
        {statusOptions.map((s) => {
          const count = projects.filter((p) => p.status === s).length;
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

      {/* Project list */}
      <div className="mt-6 space-y-3">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border border-white/5 bg-white/[0.02] transition-colors hover:border-primary/20"
          >
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
              className="w-full p-4 text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{project.name}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {project.clientName} &middot; {project.company}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={cn("h-full rounded-full transition-all", getProgressColor(project.progress))}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-semibold tabular-nums">
                      {project.progress}%
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">{project.budget}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {" — "}
                    {new Date(project.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            </button>

            {expandedId === project.id && (
              <div className="border-t border-white/5 px-4 pb-4 pt-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Client</h4>
                    <p className="mt-1 text-sm">{project.clientName}</p>
                    <p className="text-xs text-muted-foreground">{project.company}</p>

                    <h4 className="mt-3 text-xs font-semibold text-muted-foreground">Timeline</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(project.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      {" — "}
                      {new Date(project.targetDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>

                    <h4 className="mt-3 text-xs font-semibold text-muted-foreground">Adjust Progress</h4>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateProgress(project.id, -10)}
                        className="rounded-md bg-white/5 px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/10"
                      >
                        -10%
                      </button>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/5">
                        <div
                          className={cn("h-full rounded-full transition-all", getProgressColor(project.progress))}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold tabular-nums">{project.progress}%</span>
                      <button
                        type="button"
                        onClick={() => updateProgress(project.id, 10)}
                        className="rounded-md bg-white/5 px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-white/10"
                      >
                        +10%
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Update Status</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {statusOptions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateStatus(project.id, s)}
                          className={cn(
                            "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                            project.status === s
                              ? "bg-primary/20 text-primary"
                              : "bg-white/5 text-muted-foreground hover:bg-white/10",
                          )}
                        >
                          {statusLabels[s]}
                        </button>
                      ))}
                    </div>

                    {project.status !== "completed" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(project.id, "completed")}
                        className="mt-3 rounded-lg bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No projects match this filter.
          </p>
        )}
      </div>
    </>
  );
}
