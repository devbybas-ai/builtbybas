"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ClipboardList,
  ClipboardCheck,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  UtensilsCrossed,
  Lock,
  Truck,
  ChevronRight,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import GlassButton from "@/components/shared/GlassButton";
import { staggerContainer, staggerItem, springs, fadeUp } from "@/lib/motion";
import { cn, formatDate } from "@/lib/utils";
import { inspectionTemplates, inspectionReports } from "@/data/seed";

const categoryIconMap: Record<string, React.ElementType> = {
  Safety: ShieldCheck,
  Health: UtensilsCrossed,
  Security: Lock,
  Fleet: Truck,
};

const frequencyConfig: Record<string, { badge: string; label: string }> = {
  Monthly: { badge: "bg-cyan-400/15 text-cyan-400 border-cyan-400/20", label: "Monthly" },
  Weekly: { badge: "bg-violet-400/15 text-violet-400 border-violet-400/20", label: "Weekly" },
  Quarterly: { badge: "bg-amber-400/15 text-amber-400 border-amber-400/20", label: "Quarterly" },
};

function ScoreBar({ score }: { score: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  const barColor =
    score >= 90
      ? "bg-emerald-400"
      : score >= 70
      ? "bg-amber-400"
      : "bg-rose-400";

  const textColor =
    score >= 90
      ? "text-emerald-400"
      : score >= 70
      ? "text-amber-400"
      : "text-rose-400";

  return (
    <div ref={ref} className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", barColor)}
          initial={{ width: "0%" }}
          animate={inView ? { width: `${score}%` } : { width: "0%" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
      </div>
      <span className={cn("text-sm font-bold tabular-nums w-10 text-right", textColor)}>
        {score}%
      </span>
    </div>
  );
}

export default function InspectionsPage() {
  const totalTemplates = inspectionTemplates.length;
  const completedReports = inspectionReports.length;
  const needsAttentionCount = inspectionReports.filter((r) => r.status === "needs-attention").length;
  const avgScore = Math.round(
    inspectionReports.reduce((sum, r) => sum + r.score, 0) / inspectionReports.length
  );

  return (
    <PageWrapper>
      <PageHeader
        title="Inspections"
        subtitle="Audit checklists, compliance tracking, and inspection reports"
        icon={ClipboardList}
        color="violet"
      />

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatCard label="Templates" value={totalTemplates} icon={ClipboardList} color="violet" />
        <StatCard label="Completed" value={completedReports} icon={ClipboardCheck} color="emerald" />
        <StatCard label="Needs Attention" value={needsAttentionCount} icon={AlertTriangle} color="amber" />
        <StatCard label="Avg Score" value={`${avgScore}%`} icon={TrendingUp} color="cyan" />
      </motion.div>

      {/* Templates Section */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Inspection Templates
          </h2>
          <div className="flex-1 h-px bg-white/5 ml-2" />
          <span className="text-xs text-white/20">{totalTemplates} templates</span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {inspectionTemplates.map((template) => {
            const IconComp = categoryIconMap[template.category] ?? ClipboardList;
            const freqCfg = frequencyConfig[template.frequency] ?? frequencyConfig.Monthly;

            return (
              <motion.div
                key={template.id}
                variants={staggerItem}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={springs.snappy}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-400/10 flex items-center justify-center flex-shrink-0">
                    <IconComp className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white leading-tight">{template.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border font-medium",
                          freqCfg.badge
                        )}
                      >
                        {freqCfg.label}
                      </span>
                      <span className="text-xs text-white/30">
                        {template.items} checks
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/30">
                    Last run {formatDate(template.lastRun)}
                  </p>
                  <GlassButton variant="primary" size="sm" icon={ClipboardCheck}>
                    Run Inspection
                  </GlassButton>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Reports Section */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Recent Reports
          </h2>
          <div className="flex-1 h-px bg-white/5 ml-2" />
          <span className="text-xs text-white/20">{completedReports} reports</span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {inspectionReports.map((report) => {
            const isPassed = report.status === "passed";
            const statusBadge = isPassed
              ? "bg-emerald-400/15 text-emerald-400 border-emerald-400/20"
              : "bg-amber-400/15 text-amber-400 border-amber-400/20";
            const statusLabel = isPassed ? "Passed" : "Needs Attention";

            return (
              <motion.div
                key={report.id}
                variants={staggerItem}
                whileHover={{ scale: 1.01, y: -1 }}
                transition={springs.snappy}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white truncate">{report.template}</p>
                    </div>
                    <p className="text-xs text-white/35">
                      {report.inspector} — {formatDate(report.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full border font-medium",
                        statusBadge
                      )}
                    >
                      {statusLabel}
                    </span>
                    <GlassButton variant="secondary" size="sm" icon={ChevronRight}>
                      View Report
                    </GlassButton>
                  </div>
                </div>

                {/* Score bar */}
                <div className="mb-3">
                  <ScoreBar score={report.score} />
                </div>

                {/* Passed / failed summary */}
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-white/50">
                      <span className="text-emerald-400 font-semibold">{report.passed}</span> passed
                    </span>
                  </span>
                  {report.failed > 0 && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span className="text-white/50">
                        <span className="text-rose-400 font-semibold">{report.failed}</span> failed
                      </span>
                    </span>
                  )}
                  <span className="text-white/20">
                    {report.passed}/{report.items} checks passed
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
