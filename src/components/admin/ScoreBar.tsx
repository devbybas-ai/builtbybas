import { cn } from "@/lib/utils";
import type { ScoredDimension } from "@/types/intake-analysis";

interface ScoreBarProps {
  dimension: ScoredDimension;
  label: string;
}

function getBarColor(score: number): string {
  if (score >= 76) return "bg-emerald-500";
  if (score >= 51) return "bg-cyan-500";
  if (score >= 26) return "bg-amber-500";
  return "bg-red-500";
}

export function ScoreBar({ dimension, label }: ScoreBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className={cn("text-sm font-semibold", getBarColor(dimension.score).replace("bg-", "text-"))}>
          {dimension.score}/100 — {dimension.label}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={dimension.score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${dimension.score} out of 100`}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", getBarColor(dimension.score))}
          style={{ width: `${dimension.score}%` }}
        />
      </div>
      <ul className="space-y-0.5">
        {dimension.signals.map((signal) => (
          <li key={signal} className="text-xs text-muted-foreground">
            {signal}
          </li>
        ))}
      </ul>
    </div>
  );
}
