"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";
import { PROJECT_STATUSES, getProjectStatusMeta } from "@/types/project";
import { formatCents } from "@/types/invoice";
import type { ProjectStatus } from "@/types/project";
import { BillingTimeline } from "@/components/admin/BillingTimeline";
import type { MilestoneType, MilestoneStatus } from "@/types/billing";

interface ProjectData {
  id: string;
  clientId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate: Date | null;
  targetDate: Date | null;
  completedDate: Date | null;
  budgetCents: number | null;
  services: string[];
  clientName: string | null;
  clientCompany: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MilestoneData {
  id: string;
  type: MilestoneType;
  percentage: number;
  amountCents: number;
  scheduledDate: Date | null;
  status: MilestoneStatus;
  invoiceId: string | null;
}

interface ProjectDetailViewProps {
  project: ProjectData;
  milestones: MilestoneData[];
}

export function ProjectDetailView({ project, milestones }: ProjectDetailViewProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const statusMeta = getProjectStatusMeta(project.status);

  async function updateStatus(status: string) {
    setUpdating(true);
    try {
      await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setUpdating(false);
    }
  }

  const formatDate = (d: Date | null) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/projects"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; All Projects
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">
            {project.name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {project.clientCompany}
            {project.clientName ? ` — ${project.clientName}` : ""}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
            statusMeta.color
          )}
        >
          {statusMeta.label}
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className="mt-1 text-xl font-bold">
            {project.budgetCents ? formatCents(project.budgetCents) : "—"}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Start Date</p>
          <p className="mt-1 text-xl font-bold">
            {formatDate(project.startDate)}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Target Date</p>
          <p className="mt-1 text-xl font-bold">
            {formatDate(project.targetDate)}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Created</p>
          <p className="mt-1 text-xl font-bold">
            {formatDate(project.createdAt)}
          </p>
        </GlassCard>
      </div>

      {project.description && (
        <GlassCard className="mt-6">
          <h2 className="text-sm font-semibold">Description</h2>
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
            {project.description}
          </p>
        </GlassCard>
      )}

      {project.services.length > 0 && (
        <GlassCard className="mt-4">
          <h2 className="text-sm font-semibold">Services</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.services.map((s) => (
              <span
                key={s}
                className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard className="mt-6">
        <h2 className="text-sm font-semibold">Update Status</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROJECT_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => updateStatus(s.value)}
              disabled={updating || s.value === project.status}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-40",
                s.value === project.status
                  ? s.color
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </GlassCard>

      <BillingTimeline
        milestones={milestones.map((m) => ({
          ...m,
          scheduledDate: m.scheduledDate ? m.scheduledDate.toISOString() : null,
        }))}
      />
    </>
  );
}
