import { cn } from "@/lib/utils";
import type { ComplexityScore } from "@/types/intake-analysis";

interface ComplexityGaugeProps {
  complexity: ComplexityScore;
}

function getGaugeColor(score: number): string {
  if (score >= 8) return "text-red-500";
  if (score >= 6) return "text-orange-500";
  if (score >= 4) return "text-amber-500";
  return "text-emerald-500";
}

function getSegmentColor(index: number, active: boolean): string {
  if (!active) return "bg-white/10";
  if (index >= 7) return "bg-red-500";
  if (index >= 5) return "bg-orange-500";
  if (index >= 3) return "bg-amber-500";
  return "bg-emerald-500";
}

export function ComplexityGauge({ complexity }: ComplexityGaugeProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex gap-1"
        role="meter"
        aria-valuenow={complexity.overall}
        aria-valuemin={1}
        aria-valuemax={10}
        aria-label={`Complexity: ${complexity.overall} out of 10 — ${complexity.label}`}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-8 w-4 rounded-sm transition-colors",
              getSegmentColor(i, i < complexity.overall),
            )}
          />
        ))}
      </div>
      <div className="text-center">
        <span className={cn("text-3xl font-bold", getGaugeColor(complexity.overall))}>
          {complexity.overall}
        </span>
        <span className="text-lg text-muted-foreground">/10</span>
        <p className={cn("text-sm font-medium", getGaugeColor(complexity.overall))}>
          {complexity.label}
        </p>
      </div>
    </div>
  );
}
