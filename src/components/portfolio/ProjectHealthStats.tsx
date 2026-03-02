"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check, X, ChevronDown } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";
import { GlassCard } from "@/components/shared/GlassCard";
import { CountUp } from "@/components/motion/CountUp";
import { staggerContainer, scaleIn, springs } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface HealthScores {
  security: number;
  accessibility: number;
  performance: number;
  stability: number;
}

interface HealthChecklist {
  security: boolean[];
  accessibility: boolean[];
  performance: boolean[];
  stability: boolean[];
}

interface ProjectHealthStatsProps {
  health: HealthScores;
  checklist?: HealthChecklist;
}

const dimensions = [
  { key: "security" as const, label: "Security", color: "#00D4FF", track: "rgba(0,212,255,0.15)" },
  { key: "accessibility" as const, label: "Accessibility", color: "#A78BFA", track: "rgba(167,139,250,0.15)" },
  { key: "performance" as const, label: "Performance", color: "#34D399", track: "rgba(52,211,153,0.15)" },
  { key: "stability" as const, label: "Stability", color: "#FBBF24", track: "rgba(251,191,36,0.15)" },
];

const checklistLabels: Record<string, string[]> = {
  security: [
    "Input validation on all endpoints",
    "No SQL injection (parameterized queries)",
    "No XSS vulnerabilities",
    "Authentication on protected routes",
    "HTTPS / SSL active",
    "Security headers configured",
    "No secrets in client-side code",
    "Rate limiting on sensitive endpoints",
    "CSRF protection",
    "Secure error handling",
  ],
  accessibility: [
    "WCAG 2.1 AA compliance (axe-core)",
    "Semantic HTML structure",
    "Keyboard navigable",
    "Screen reader compatible (ARIA)",
    "Color contrast \u2265 4.5:1",
    "Visible focus indicators",
    "Touch targets \u2265 44\u00d744px",
    "Reduced motion respected",
    "Form labels on all inputs",
    "Skip-to-content link",
  ],
  performance: [
    "Images optimized (WebP / next-gen)",
    "Lazy loading below-fold content",
    "No render-blocking resources",
    "Server-side rendering / static generation",
    "Mobile-optimized responsive design",
    "Bundle splitting / dynamic imports",
    "Font optimization",
    "Minified CSS/JS in production",
    "Caching headers configured",
    "Core Web Vitals targets met",
  ],
  stability: [
    "Automated test coverage",
    "Error boundaries / graceful degradation",
    "Database connection pooling",
    "Process management (auto-restart)",
    "SSL certificate auto-renewal",
    "Monitoring / health checks",
    "Backup strategy",
    "Zero-downtime deploys",
    "Environment separation (dev/prod)",
    "Dependency audit (no known vulns)",
  ],
};

function getGrade(score: number): { letter: string; color: string } {
  if (score >= 95) return { letter: "A+", color: "text-emerald-400" };
  if (score >= 90) return { letter: "A", color: "text-emerald-400" };
  if (score >= 85) return { letter: "B+", color: "text-cyan-400" };
  if (score >= 80) return { letter: "B", color: "text-cyan-400" };
  if (score >= 75) return { letter: "C+", color: "text-amber-400" };
  return { letter: "C", color: "text-amber-400" };
}

function getBarGradient(score: number): string {
  if (score >= 90) return "from-emerald-500 to-cyan-400";
  if (score >= 80) return "from-cyan-500 to-blue-400";
  if (score >= 70) return "from-amber-500 to-yellow-400";
  return "from-orange-500 to-red-400";
}

// SVG ring component
function HealthRing({
  score,
  label,
  color,
  track,
  delay,
  animated,
}: {
  score: number;
  label: string;
  color: string;
  track: string;
  delay: number;
  animated: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const passing = Math.round(score / 10);
  const circumference = 2 * Math.PI * 40; // radius = 40
  const offset = circumference - (score / 100) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative h-28 w-28 sm:h-32 sm:w-32">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full -rotate-90"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={track}
            strokeWidth="6"
          />
          {/* Progress */}
          {animated ? (
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={
                isInView
                  ? { strokeDashoffset: offset }
                  : { strokeDashoffset: circumference }
              }
              transition={{
                duration: 1.2,
                delay,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ) : (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          )}
        </svg>

        {/* Center number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {animated ? (
            <CountUp
              target={score}
              className="text-2xl font-bold sm:text-3xl"
            />
          ) : (
            <span className="text-2xl font-bold sm:text-3xl">{score}</span>
          )}
        </div>
      </div>

      {/* Label + passing count */}
      <div className="text-center">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">
          {passing}/10 checks
        </p>
      </div>
    </div>
  );
}

// Checklist accordion
function ChecklistAccordion({ checklist }: { checklist: HealthChecklist }) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  return (
    <div className="mt-4 space-y-1.5">
      {dimensions.map((dim) => {
        const checks = checklist[dim.key];
        const labels = checklistLabels[dim.key];
        const passing = checks.filter(Boolean).length;
        const isOpen = openSection === dim.key;

        return (
          <div
            key={dim.key}
            className="overflow-hidden rounded-lg border border-white/5 bg-white/[0.02]"
          >
            <button
              type="button"
              onClick={() => toggle(dim.key)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: dim.color }}
                />
                <span className="text-sm font-medium">{dim.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-xs font-medium",
                  passing === 10 ? "text-emerald-400" : "text-muted-foreground",
                )}>
                  {passing}/10 passed
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1.5 border-t border-white/5 px-4 py-3">
                    {labels.map((label, i) => {
                      const passed = checks[i];
                      return (
                        <div key={label} className="flex items-start gap-2.5">
                          {passed ? (
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          ) : (
                            <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                          )}
                          <span
                            className={cn(
                              "text-xs leading-relaxed",
                              passed ? "text-muted-foreground" : "text-red-400/80",
                            )}
                          >
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function ProjectHealthStats({ health, checklist }: ProjectHealthStatsProps) {
  const shouldReduceMotion = useReducedMotion();
  const overall = Math.round(
    (health.security + health.accessibility + health.performance + health.stability) / 4
  );
  const grade = getGrade(overall);
  const barGradient = getBarGradient(overall);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  return (
    <FadeIn>
      <GlassCard as="section">
        <h2 className="text-lg font-semibold">Project Health</h2>

        {/* Overall Score Bar */}
        <div ref={containerRef} className="mt-6 space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${grade.color}`}>
                {grade.letter}
              </span>
              <span className="text-sm text-muted-foreground">Overall</span>
            </div>
            <div className="flex items-baseline gap-1">
              {shouldReduceMotion ? (
                <span className="text-2xl font-bold">{overall}</span>
              ) : (
                <CountUp target={overall} className="text-2xl font-bold" />
              )}
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 overflow-hidden rounded-full bg-white/5">
            {shouldReduceMotion ? (
              <div
                className={`h-full rounded-full bg-gradient-to-r ${barGradient}`}
                style={{ width: `${overall}%` }}
              />
            ) : (
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${barGradient}`}
                initial={{ width: "0%" }}
                animate={isInView ? { width: `${overall}%` } : { width: "0%" }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </div>
        </div>

        {/* 4 Dimension Rings */}
        {shouldReduceMotion ? (
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {dimensions.map((dim) => (
              <HealthRing
                key={dim.key}
                score={health[dim.key]}
                label={dim.label}
                color={dim.color}
                track={dim.track}
                delay={0}
                animated={false}
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer(0.15, 0.4)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {dimensions.map((dim, i) => (
              <motion.div key={dim.key} variants={scaleIn} transition={springs.smooth}>
                <HealthRing
                  score={health[dim.key]}
                  label={dim.label}
                  color={dim.color}
                  track={dim.track}
                  delay={0.4 + i * 0.15}
                  animated
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Footer + Checklist Accordion */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Based on 40-point verifiable checklist
        </p>

        {checklist && <ChecklistAccordion checklist={checklist} />}
      </GlassCard>
    </FadeIn>
  );
}
