"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PipelineStage } from "@/types/client";

interface PipelineClient {
  id: string;
  name: string;
  company: string;
  email: string;
  daysInStage: number;
  isIntake?: boolean;
  intakeStatus?: string;
  primaryService?: string;
}

interface PipelineColumn {
  stage: { value: PipelineStage; label: string; order: number };
  count: number;
  clients: PipelineClient[];
}

interface PipelineBoardProps {
  columns: PipelineColumn[];
}

// ============================================================
// Phase groupings — 12 stages into 4 manageable phases
// ============================================================

interface Phase {
  id: string;
  label: string;
  stages: PipelineStage[];
  accent: string;
  activeAccent: string;
}

const PHASES: Phase[] = [
  {
    id: "inbound",
    label: "Inbound",
    stages: ["lead", "intake_submitted", "analysis_complete", "fit_assessment"],
    accent: "text-blue-400",
    activeAccent: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  },
  {
    id: "proposal",
    label: "Proposal",
    stages: ["proposal_draft", "proposal_sent", "proposal_accepted"],
    accent: "text-cyan-400",
    activeAccent: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  },
  {
    id: "active",
    label: "Active Work",
    stages: ["contract_signed", "project_planning", "in_progress"],
    accent: "text-emerald-400",
    activeAccent: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  },
  {
    id: "delivered",
    label: "Delivered",
    stages: ["delivered", "completed"],
    accent: "text-amber-400",
    activeAccent: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  },
];

function getColumnAccent(order: number): string {
  if (order <= 4) return "border-t-blue-500";
  if (order <= 7) return "border-t-cyan-500";
  if (order <= 10) return "border-t-emerald-500";
  return "border-t-amber-500";
}

const INTAKE_STATUS_BADGE: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  reviewed: "bg-amber-500/20 text-amber-400",
  accepted: "bg-emerald-500/20 text-emerald-400",
};

export function PipelineBoard({ columns }: PipelineBoardProps) {
  // Find the first phase that has clients, default to "inbound"
  const firstActivePhase =
    PHASES.find((p) =>
      p.stages.some((s) => columns.find((c) => c.stage.value === s && c.count > 0))
    )?.id ?? "inbound";

  const [activePhase, setActivePhase] = useState(firstActivePhase);

  const phase = PHASES.find((p) => p.id === activePhase) ?? PHASES[0];
  const visibleColumns = columns.filter((c) =>
    phase.stages.includes(c.stage.value)
  );

  return (
    <div>
      {/* Phase tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PHASES.map((p) => {
          const totalInPhase = p.stages.reduce((sum, s) => {
            const col = columns.find((c) => c.stage.value === s);
            return sum + (col?.count ?? 0);
          }, 0);
          const isActive = activePhase === p.id;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePhase(p.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? p.activeAccent
                  : "border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {p.label}
              {totalInPhase > 0 && (
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                    isActive ? "bg-white/15" : "bg-white/10"
                  )}
                >
                  {totalInPhase}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stage columns — responsive grid, no horizontal scroll */}
      <div
        className={cn(
          "grid gap-4",
          visibleColumns.length === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : visibleColumns.length === 3
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {visibleColumns.map((col) => {
          const hasClients = col.clients.length > 0;

          return (
            <div
              key={col.stage.value}
              className={cn(
                "flex min-w-0 flex-col rounded-lg border border-white/5 border-t-2 bg-white/[0.02]",
                getColumnAccent(col.stage.order)
              )}
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-3 py-2.5">
                <h3 className="text-xs font-semibold">{col.stage.label}</h3>
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-medium",
                    hasClients ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"
                  )}
                >
                  {col.count}
                </span>
              </div>

              {/* Client cards */}
              <div className="flex flex-1 flex-col gap-2 px-2 pb-2">
                {!hasClients && (
                  <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                    No clients
                  </p>
                )}
                {col.clients.map((client) => (
                  <Link
                    key={client.id}
                    href={
                      client.isIntake
                        ? `/admin/intake/${client.id}`
                        : `/admin/clients/${client.id}`
                    }
                    className={cn(
                      "group rounded-md border bg-white/[0.03] p-2.5 transition-colors hover:border-primary/30 hover:bg-white/[0.06]",
                      client.isIntake
                        ? "border-blue-500/20"
                        : "border-white/5"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-medium group-hover:text-primary">
                        {client.name}
                      </p>
                      {client.isIntake && client.intakeStatus && (
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                            INTAKE_STATUS_BADGE[client.intakeStatus] ??
                              "bg-white/10 text-muted-foreground"
                          )}
                        >
                          {client.intakeStatus === "new" ? "Intake" : client.intakeStatus}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {client.company}
                    </p>
                    {client.primaryService && (
                      <p className="mt-0.5 truncate text-xs text-primary/70">
                        {client.primaryService}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {client.daysInStage}d in stage
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
