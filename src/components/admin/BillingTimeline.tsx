"use client";

import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";
import { formatCents } from "@/types/invoice";
import { getMilestoneStatusMeta, getMilestoneTypeLabel } from "@/types/billing";
import type { MilestoneType, MilestoneStatus } from "@/types/billing";

interface MilestoneData {
  id: string;
  type: MilestoneType;
  percentage: number;
  amountCents: number;
  scheduledDate: string | null;
  status: MilestoneStatus;
  invoiceId: string | null;
}

interface BillingTimelineProps {
  milestones: MilestoneData[];
}

function connectorColor(status: MilestoneStatus): string {
  if (status === "paid") return "bg-emerald-500";
  if (status === "sent" || status === "draft_created") return "bg-primary";
  return "bg-white/10";
}

export function BillingTimeline({ milestones }: BillingTimelineProps) {
  if (milestones.length === 0) {
    return (
      <GlassCard className="mt-6">
        <h2 className="text-sm font-semibold">Billing Timeline</h2>
        <p className="mt-3 text-sm text-white/50">No billing milestones</p>
      </GlassCard>
    );
  }

  const sorted = [...milestones].sort((a, b) => a.percentage - b.percentage);

  return (
    <GlassCard className="mt-6">
      <h2 className="text-sm font-semibold">Billing Timeline</h2>
      <div className="mt-6 flex items-start">
        {sorted.map((milestone, index) => {
          const meta = getMilestoneStatusMeta(milestone.status);
          const isLast = index === sorted.length - 1;

          const circleColor =
            milestone.status === "paid"
              ? "bg-emerald-500 border-emerald-500"
              : milestone.status === "sent" || milestone.status === "draft_created"
              ? "bg-primary border-primary"
              : "bg-white/10 border-white/20";

          const formattedDate = milestone.scheduledDate
            ? new Date(milestone.scheduledDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : null;

          return (
            <div key={milestone.id} className="flex flex-1 items-start">
              {/* Node + label column */}
              <div className="flex flex-col items-center flex-1 min-w-0">
                {/* Circle indicator */}
                <div
                  className={cn(
                    "h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0",
                    circleColor
                  )}
                >
                  <span className="text-xs font-bold text-white">
                    {milestone.percentage}%
                  </span>
                </div>

                {/* Node details */}
                <div className="mt-3 text-center px-1">
                  <p className="text-xs font-semibold text-white truncate">
                    {getMilestoneTypeLabel(milestone.type)}
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {formatCents(milestone.amountCents)}
                  </p>
                  {formattedDate && (
                    <p className="mt-1 text-xs text-white/50">{formattedDate}</p>
                  )}
                  <span
                    className={cn(
                      "mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                      meta.color
                    )}
                  >
                    {meta.label}
                  </span>
                </div>
              </div>

              {/* Connector line between nodes */}
              {!isLast && (
                <div className="flex items-center pt-4 shrink-0 w-8">
                  <div
                    className={cn(
                      "h-0.5 w-full",
                      connectorColor(milestone.status)
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
