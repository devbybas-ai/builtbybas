"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoFadeUp } from "@/lib/demo-motion";
import { cn } from "@/lib/utils";
import { demoFormatDate } from "@/lib/demo-utils";
import { inspectionTemplates, inspectionReports } from "@/data/demo-seed";

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

type ViewMode = "templates" | "reports";

const inspectorNames = ["Tom Fischer", "Marcus Hill", "Derek Lam", "Sarah Kim", "Priya Patel"];

export function InspectionsDemo() {
  const [reports, setReports] = useState(inspectionReports);
  const [view, setView] = useState<ViewMode>("templates");
  const [flashId, setFlashId] = useState<string | null>(null);

  const totalTemplates = inspectionTemplates.length;
  const completedReports = reports.length;
  const needsAttentionCount = reports.filter((r) => r.status === "needs-attention").length;
  const avgScore = reports.length > 0
    ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length)
    : 0;

  function handleRunInspection(template: typeof inspectionTemplates[0]) {
    const score = Math.floor(Math.random() * 31) + 70; // 70-100
    const totalItems = template.items;
    const failed = Math.floor((1 - score / 100) * totalItems);
    const passed = totalItems - failed;
    const status = score >= 85 ? "passed" : "needs-attention";
    const inspector = inspectorNames[Math.floor(Math.random() * inspectorNames.length)];
    const newId = `IR-${String(reports.length + 1).padStart(3, "0")}`;

    const newReport = {
      id: newId,
      template: template.name,
      inspector,
      date: new Date().toISOString().split("T")[0],
      score,
      status,
      items: totalItems,
      passed,
      failed,
    };

    setReports((prev) => [newReport, ...prev]);
    setFlashId(newId);
    setView("reports");
    setTimeout(() => setFlashId(null), 2000);
  }

  return (
    <DemoPageWrapper>
      <DemoPageHeader
        title="Inspections"
        subtitle="Audit checklists, compliance tracking, and inspection reports"
        icon={ClipboardList}
        color="violet"
      />

      {/* Stats */}
      <motion.div
        variants={demoStaggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <DemoStatCard label="Templates" value={totalTemplates} icon={ClipboardList} color="violet" />
        <DemoStatCard label="Completed" value={completedReports} icon={ClipboardCheck} color="emerald" />
        <DemoStatCard label="Needs Attention" value={needsAttentionCount} icon={AlertTriangle} color="amber" />
        <DemoStatCard label="Avg Score" value={`${avgScore}%`} icon={TrendingUp} color="cyan" />
      </motion.div>

      {/* View Toggle */}
      <motion.div variants={demoFadeUp} className="demo-glass rounded-xl p-1 flex gap-1 mb-8">
        {(["templates", "reports"] as ViewMode[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className="relative flex-1 text-[10px] font-bold uppercase tracking-wide py-1.5 rounded-lg transition-colors"
            style={{ color: view === tab ? "#8b5cf6" : "rgba(255,255,255,0.3)" }}
          >
            {view === tab && (
              <motion.div
                layoutId="inspections-tab"
                className="absolute inset-0 rounded-lg"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}
                transition={demoSprings.snappy}
              />
            )}
            <span className="relative z-10">{tab === "templates" ? `Templates (${totalTemplates})` : `Reports (${completedReports})`}</span>
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="popLayout">
      {view === "templates" && (
      <motion.div key="templates-section" variants={demoFadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -4 }} className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Inspection Templates
          </h2>
          <div className="flex-1 h-px bg-white/5 ml-2" />
          <span className="text-xs text-white/20">{totalTemplates} templates</span>
        </div>

        <motion.div
          variants={demoStaggerContainer}
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
                variants={demoStaggerItem}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={demoSprings.snappy}
                className="demo-glass rounded-xl p-5"
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
                    Last run {demoFormatDate(template.lastRun)}
                  </p>
                  <DemoGlassButton variant="primary" size="sm" icon={ClipboardCheck} onClick={() => handleRunInspection(template)}>
                    Run Inspection
                  </DemoGlassButton>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
      )}

      {view === "reports" && (
      <motion.div key="reports-section" variants={demoFadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -4 }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Recent Reports
          </h2>
          <div className="flex-1 h-px bg-white/5 ml-2" />
          <span className="text-xs text-white/20">{completedReports} reports</span>
        </div>

        <motion.div
          variants={demoStaggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {reports.map((report) => {
            const isPassed = report.status === "passed";
            const statusBadge = isPassed
              ? "bg-emerald-400/15 text-emerald-400 border-emerald-400/20"
              : "bg-amber-400/15 text-amber-400 border-amber-400/20";
            const statusLabel = isPassed ? "Passed" : "Needs Attention";

            return (
              <motion.div
                key={report.id}
                variants={demoStaggerItem}
                initial={flashId === report.id ? { opacity: 0, scale: 0.95 } : undefined}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.01, y: -1 }}
                transition={demoSprings.snappy}
                className={cn("demo-glass rounded-xl p-5", flashId === report.id && "ring-1 ring-violet-400/40")}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white truncate">{report.template}</p>
                    </div>
                    <p className="text-xs text-white/35">
                      {report.inspector} — {demoFormatDate(report.date)}
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
                    <DemoGlassButton variant="secondary" size="sm" icon={ChevronRight}>
                      View Report
                    </DemoGlassButton>
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
      )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}