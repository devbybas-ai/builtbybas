import { cn } from "@/lib/utils";
import { getStageMeta, type PipelineStage } from "@/types/client";

interface StageBadgeProps {
  stage: PipelineStage;
  className?: string;
}

function getStageColors(stage: PipelineStage): string {
  const meta = getStageMeta(stage);
  if (!meta) return "bg-gray-500/20 text-gray-400";

  const { order } = meta;
  if (order <= 3) return "bg-blue-500/20 text-blue-400";
  if (order <= 6) return "bg-cyan-500/20 text-cyan-400";
  if (order <= 8) return "bg-emerald-500/20 text-emerald-400";
  if (order <= 10) return "bg-amber-500/20 text-amber-400";
  return "bg-primary/20 text-primary";
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  const meta = getStageMeta(stage);
  const label = meta?.label ?? stage;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        getStageColors(stage),
        className
      )}
    >
      {label}
    </span>
  );
}
