"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Clock,
  CalendarDays,
  CheckCircle,
  Plus,
  X,
  MapPin,
  User,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import GlassButton from "@/components/shared/GlassButton";
import { staggerContainer, staggerItem, springs, fadeUp, scalePop } from "@/lib/motion";
import { cn, getRelativeTime, formatDate } from "@/lib/utils";
import { maintenanceRequests } from "@/data/seed";

type Priority = "critical" | "high" | "medium" | "low";
type Status = "pending" | "in-progress" | "scheduled" | "completed";

const PRIORITIES: (Priority | "All")[] = ["All", "critical", "high", "medium", "low"];

const priorityConfig: Record<Priority, { badge: string; label: string; marker: string }> = {
  critical: {
    badge: "bg-rose-400/15 text-rose-400 border-rose-400/30",
    label: "!! Critical",
    marker: "text-rose-400",
  },
  high: {
    badge: "bg-rose-400/10 text-rose-300 border-rose-400/20",
    label: "! High",
    marker: "text-rose-300",
  },
  medium: {
    badge: "bg-amber-400/15 text-amber-400 border-amber-400/20",
    label: "Medium",
    marker: "text-amber-400",
  },
  low: {
    badge: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20",
    label: "Low",
    marker: "text-emerald-400",
  },
};

const statusSteps: Status[] = ["pending", "scheduled", "in-progress", "completed"];

function getStepFill(status: Status): number {
  return statusSteps.indexOf(status) + 1;
}

const CATEGORIES = ["HVAC", "Facilities", "Plumbing", "Elevator", "Electrical"];
const PRIORITY_OPTIONS: Priority[] = ["critical", "high", "medium", "low"];

interface NewRequestForm {
  title: string;
  location: string;
  category: string;
  priority: Priority;
  description: string;
}

export default function MaintenancePage() {
  const [activePriority, setActivePriority] = useState<Priority | "All">("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewRequestForm>({
    title: "",
    location: "",
    category: CATEGORIES[0],
    priority: "medium",
    description: "",
  });

  const openCount = maintenanceRequests.filter((r) => r.status !== "completed").length;
  const inProgressCount = maintenanceRequests.filter((r) => r.status === "in-progress").length;
  const scheduledCount = maintenanceRequests.filter((r) => r.status === "scheduled").length;
  const completedCount = maintenanceRequests.filter((r) => r.status === "completed").length;
  const criticalCount = maintenanceRequests.filter((r) => r.priority === "critical").length;

  const filtered = maintenanceRequests.filter(
    (r) => activePriority === "All" || r.priority === activePriority
  );

  return (
    <PageWrapper>
      <PageHeader
        title="Maintenance"
        subtitle="Work order management and facility scheduling"
        icon={Wrench}
        color="violet"
        action={
          <GlassButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>
            New Request
          </GlassButton>
        }
      />

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <StatCard label="Open Requests" value={openCount} icon={Wrench} color="violet" />
        <StatCard label="In Progress" value={inProgressCount} icon={Clock} color="cyan" />
        <StatCard label="Scheduled" value={scheduledCount} icon={CalendarDays} color="amber" />
        <StatCard label="Completed" value={completedCount} icon={CheckCircle} color="emerald" />
      </motion.div>

      {/* Priority Filter Tabs */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6 flex-wrap">
        {PRIORITIES.map((p) => {
          const isAll = p === "All";
          const count = isAll
            ? maintenanceRequests.length
            : maintenanceRequests.filter((r) => r.priority === p).length;
          const active = activePriority === p;
          const isCritical = p === "critical";

          return (
            <motion.button
              key={p}
              onClick={() => setActivePriority(p)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={springs.snappy}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                active
                  ? isCritical
                    ? "bg-rose-400/20 text-rose-300 border-rose-400/40"
                    : "bg-violet-400/20 text-violet-300 border-violet-400/40"
                  : "bg-white/5 text-white/40 border-white/10 hover:text-white/70 hover:bg-white/8"
              )}
            >
              <span className="capitalize">{p}</span>
              <span
                className={cn(
                  "text-xs px-1.5 py-0 rounded-full font-bold",
                  active && isCritical
                    ? "bg-rose-400/30 text-rose-300"
                    : active
                    ? "bg-violet-400/30 text-violet-300"
                    : "bg-white/10 text-white/30"
                )}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
        {criticalCount > 0 && (
          <span className="text-xs text-rose-400 font-medium ml-auto">
            {criticalCount} critical — immediate action required
          </span>
        )}
      </motion.div>

      {/* Request Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {filtered.map((req) => {
          const pcfg = priorityConfig[req.priority as Priority];
          const isCritical = req.priority === "critical";
          const stepFill = getStepFill(req.status as Status);

          return (
            <motion.div
              key={req.id}
              variants={staggerItem}
              whileHover={{ scale: 1.01, y: -1 }}
              transition={springs.snappy}
              className="glass rounded-xl p-5"
              style={
                isCritical
                  ? { boxShadow: "0 0 0 1px rgba(244,63,94,0.4)" }
                  : undefined
              }
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Priority badge */}
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 rounded-full text-xs font-bold border flex-shrink-0 mt-0.5",
                      pcfg.badge
                    )}
                  >
                    {pcfg.label}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-white/25 font-mono mb-0.5">{req.id}</p>
                    <p className="text-sm font-semibold text-white leading-tight">{req.title}</p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-white/40">
                        <MapPin size={11} /> {req.location}
                      </span>
                      <span className="text-xs text-white/25">•</span>
                      <span className="text-xs px-1.5 py-0 rounded bg-white/5 text-white/40">
                        {req.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status step dots */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {statusSteps.map((step, idx) => {
                    const filled = idx < stepFill;
                    const isCurrent = idx === stepFill - 1;
                    return (
                      <div key={step} className="flex items-center gap-1.5">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ ...springs.bouncy, delay: idx * 0.06 }}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            filled
                              ? isCurrent && step !== "completed"
                                ? "bg-cyan-400"
                                : step === "completed"
                                ? "bg-emerald-400"
                                : "bg-violet-400"
                              : "bg-white/15"
                          )}
                        />
                        {idx < statusSteps.length - 1 && (
                          <div
                            className={cn(
                              "w-4 h-px",
                              filled ? "bg-violet-400/40" : "bg-white/10"
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 text-xs text-white/35 flex-wrap">
                <span>Reported {getRelativeTime(req.reported)}</span>
                <span className="text-white/15">|</span>
                <span className="flex items-center gap-1">
                  <User size={11} />
                  {req.assignee ?? "Unassigned"}
                </span>
                <span className="text-white/15">|</span>
                <span className="flex items-center gap-1">
                  <CalendarDays size={11} />
                  {req.scheduledFor ? `Scheduled ${formatDate(req.scheduledFor)}` : "Not Scheduled"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* New Request Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              key="modal"
              variants={scalePop}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={springs.smooth}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="glass rounded-2xl p-6 w-full max-w-md"
                style={{ border: "1px solid rgba(139,92,246,0.2)" }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-400/10 flex items-center justify-center">
                      <Wrench className="w-4 h-4 text-violet-400" />
                    </div>
                    <h2 className="text-base font-bold text-white">New Maintenance Request</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    transition={springs.snappy}
                    onClick={() => setShowModal(false)}
                    className="text-white/30 hover:text-white/70"
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block font-medium uppercase tracking-wide">
                      Title
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Describe the issue..."
                      className="w-full glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-violet-400/30 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block font-medium uppercase tracking-wide">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      placeholder="e.g. 2nd Floor, Server Room..."
                      className="w-full glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-violet-400/30 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block font-medium uppercase tracking-wide">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full glass rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-400/30 transition-colors appearance-none"
                      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#0A0A0F]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority selector */}
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block font-medium uppercase tracking-wide">
                      Priority
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {PRIORITY_OPTIONS.map((p) => {
                        const pcfg = priorityConfig[p];
                        const active = form.priority === p;
                        return (
                          <motion.button
                            key={p}
                            onClick={() => setForm((f) => ({ ...f, priority: p }))}
                            whileTap={{ scale: 0.95 }}
                            transition={springs.snappy}
                            className={cn(
                              "py-2 rounded-lg text-xs font-medium border transition-all capitalize",
                              active
                                ? pcfg.badge
                                : "bg-white/5 text-white/30 border-white/10 hover:text-white/50"
                            )}
                          >
                            {p}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block font-medium uppercase tracking-wide">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Additional details..."
                      rows={3}
                      className="w-full glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-violet-400/30 transition-colors resize-none"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <GlassButton
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                      className="flex-1 justify-center"
                    >
                      Cancel
                    </GlassButton>
                    <GlassButton
                      variant="primary"
                      icon={Plus}
                      onClick={() => setShowModal(false)}
                      className="flex-1 justify-center"
                    >
                      Submit Request
                    </GlassButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
