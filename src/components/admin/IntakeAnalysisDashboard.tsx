"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import { ComplexityGauge } from "./ComplexityGauge";
import { ScoreBar } from "./ScoreBar";
import type { IntakeAnalysis } from "@/types/intake-analysis";

/** Convert camelCase or kebab-case key to a readable label */
function formatKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Render a single field from the raw submission data */
function RawField({ label, value }: { label: string; value: unknown }) {
  const displayLabel = formatKey(label);

  if (value == null || value === "") {
    return (
      <div>
        <dt className="text-xs font-medium text-muted-foreground">{displayLabel}</dt>
        <dd className="text-sm text-muted-foreground/60">—</dd>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div>
        <dt className="text-xs font-medium text-muted-foreground">{displayLabel}</dt>
        <dd className="mt-1 flex flex-wrap gap-1.5">
          {value.length === 0 ? (
            <span className="text-sm text-muted-foreground/60">—</span>
          ) : (
            value.map((item, i) => (
              <span
                key={i}
                className="inline-block rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-xs text-foreground"
              >
                {formatKey(String(item))}
              </span>
            ))
          )}
        </dd>
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    return (
      <div>
        <dt className="text-xs font-medium text-muted-foreground">{displayLabel}</dt>
        <dd className="mt-2 space-y-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
          {entries.map(([subKey, subVal]) => (
            <RawField key={subKey} label={subKey} value={subVal} />
          ))}
        </dd>
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <div>
        <dt className="text-xs font-medium text-muted-foreground">{displayLabel}</dt>
        <dd className="text-sm text-foreground">{value ? "Yes" : "No"}</dd>
      </div>
    );
  }

  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{displayLabel}</dt>
      <dd className="text-sm text-foreground">{String(value)}</dd>
    </div>
  );
}

interface IntakeAnalysisDashboardProps {
  analysis: IntakeAnalysis;
}

export function IntakeAnalysisDashboard({ analysis }: IntakeAnalysisDashboardProps) {
  const { formData, clientProfile, serviceRecommendations, complexityScore, pathsForward, flags, summary } = analysis;
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{formData.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {formData.company} — {formData.email}
            {formData.phone && ` — ${formData.phone}`}
          </p>
          <time dateTime={analysis.submittedAt} className="text-xs text-muted-foreground">
            Submitted{" "}
            {new Date(analysis.submittedAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </time>
        </div>
        <ComplexityGauge complexity={complexityScore} />
      </div>

      {/* Summary */}
      <GlassCard as="section">
        <h2 className="text-lg font-semibold">Summary</h2>
        <p className="mt-2 text-muted-foreground">{summary.headline}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Project Type</p>
            <p className="font-medium">{summary.projectType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Est. Investment</p>
            <p className="font-medium">{summary.estimatedTotalInvestment}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Est. Timeline</p>
            <p className="font-medium">{summary.estimatedTotalTimeline}</p>
          </div>
        </div>
      </GlassCard>

      {/* Flags */}
      {flags.length > 0 && (
        <div className="space-y-2">
          {flags.map((flag, i) => (
            <div
              key={i}
              className={cn(
                "rounded-lg border px-4 py-3 text-sm",
                flag.type === "warning" && "border-amber-500/30 bg-amber-500/10 text-amber-300",
                flag.type === "opportunity" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                flag.type === "info" && "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
              )}
            >
              <span className="mr-2 font-medium uppercase">
                {flag.type === "warning" ? "Heads Up" : flag.type === "opportunity" ? "Opportunity" : "Note"}:
              </span>
              {flag.message}
            </div>
          ))}
        </div>
      )}

      {/* Client Profile */}
      <GlassCard as="section">
        <h2 className="text-lg font-semibold">Client Profile</h2>
        <p className="mt-1 text-xs text-muted-foreground">{summary.clientType}</p>
        <div className="mt-6 space-y-6">
          <ScoreBar dimension={clientProfile.businessMaturity} label="Business Maturity" />
          <ScoreBar dimension={clientProfile.projectReadiness} label="Project Readiness" />
          <ScoreBar dimension={clientProfile.engagementLevel} label="Engagement Level" />
          <ScoreBar dimension={clientProfile.scopeClarity} label="Scope Clarity" />
          <ScoreBar dimension={clientProfile.budgetAlignment} label="Budget Alignment" />
        </div>
      </GlassCard>

      {/* Service Recommendations */}
      <section>
        <h2 className="text-lg font-semibold">Service Recommendations</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {serviceRecommendations.map((rec) => (
            <GlassCard
              key={rec.serviceId}
              className={cn(rec.isPrimary && "border-primary/30 ring-1 ring-primary/20")}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">
                    {rec.serviceTitle}
                    {rec.isPrimary && (
                      <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                        Primary
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">{rec.estimatedRange}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-foreground">{rec.fitScore}</span>
                  <p className={cn(
                    "text-xs font-medium",
                    rec.fitScore >= 75 ? "text-emerald-400" :
                    rec.fitScore >= 50 ? "text-cyan-400" : "text-amber-400",
                  )}>
                    {rec.fitLabel}
                  </p>
                </div>
              </div>
              <ul className="mt-3 space-y-1">
                {rec.reasons.map((reason) => (
                  <li key={reason} className="text-xs text-muted-foreground">
                    {reason}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Complexity Breakdown */}
      {complexityScore.factors.length > 0 && (
        <GlassCard as="section">
          <h2 className="text-lg font-semibold">Complexity Factors</h2>
          <div className="mt-4 space-y-3">
            {complexityScore.factors.map((factor) => (
              <div key={factor.name} className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full",
                    factor.impact === "high" ? "bg-red-500" :
                    factor.impact === "medium" ? "bg-amber-500" : "bg-cyan-500",
                  )}
                />
                <div>
                  <p className="text-sm font-medium">{factor.name}</p>
                  <p className="text-xs text-muted-foreground">{factor.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Paths Forward */}
      <section>
        <h2 className="text-lg font-semibold">Paths Forward</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {pathsForward.map((path) => (
            <GlassCard
              key={path.name}
              className={cn(path.recommended && "border-primary/30 ring-1 ring-primary/20")}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{path.name}</h3>
                {path.recommended && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                    Recommended
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{path.description}</p>

              <div className="mt-4 space-y-2">
                {path.phases.map((phase) => (
                  <div key={phase.order} className="rounded border border-white/5 bg-white/[0.02] p-2">
                    <p className="text-xs font-medium">{phase.title}</p>
                    <p className="text-xs text-muted-foreground">{phase.duration}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-4 border-t border-white/5 pt-3 text-xs text-muted-foreground">
                <span>{path.estimatedTimeline}</span>
                <span>{path.estimatedInvestment}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Raw Submission Data */}
      <GlassCard as="section">
        <button
          onClick={() => setShowRaw((prev) => !prev)}
          className="flex w-full items-center justify-between text-left"
          type="button"
        >
          <h2 className="text-lg font-semibold">Raw Submission Data</h2>
          <span className="text-sm text-muted-foreground">{showRaw ? "Hide" : "Show"}</span>
        </button>

        {showRaw && (
          <dl className="mt-4 space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <RawField key={key} label={key} value={value} />
            ))}
          </dl>
        )}
      </GlassCard>
    </div>
  );
}
