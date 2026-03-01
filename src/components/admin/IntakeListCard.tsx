import Link from "next/link";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import type { IntakeAnalysis } from "@/types/intake-analysis";

interface IntakeListCardProps {
  analysis: IntakeAnalysis;
}

function getComplexityBadge(label: string): { bg: string; text: string } {
  switch (label) {
    case "Enterprise":
      return { bg: "bg-red-500/20", text: "text-red-400" };
    case "Complex":
      return { bg: "bg-orange-500/20", text: "text-orange-400" };
    case "Moderate":
      return { bg: "bg-amber-500/20", text: "text-amber-400" };
    default:
      return { bg: "bg-emerald-500/20", text: "text-emerald-400" };
  }
}

export function IntakeListCard({ analysis }: IntakeListCardProps) {
  const { formData, complexityScore, summary, serviceRecommendations } = analysis;
  const badge = getComplexityBadge(complexityScore.label);
  const primary = serviceRecommendations.find((r) => r.isPrimary);
  const submitted = new Date(analysis.submittedAt);

  return (
    <Link href={`/admin/intake/${analysis.id}`}>
      <GlassCard hover className="cursor-pointer transition-all hover:border-primary/30">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="truncate text-base font-semibold text-foreground">
                {formData.name}
              </h3>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  badge.bg,
                  badge.text,
                )}
              >
                {complexityScore.label}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formData.company} — {formData.industry}
            </p>
          </div>
          <time
            dateTime={analysis.submittedAt}
            className="shrink-0 text-xs text-muted-foreground"
          >
            {submitted.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </time>
        </div>

        <p className="mt-3 text-sm text-muted-foreground line-clamp-1">
          {summary.headline}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          {primary && (
            <span>
              Primary: <strong className="text-foreground">{primary.serviceTitle}</strong>
            </span>
          )}
          <span>{summary.estimatedTotalInvestment}</span>
        </div>
      </GlassCard>
    </Link>
  );
}
