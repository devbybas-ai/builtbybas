"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Eye,
  DollarSign,
  TrendingUp,
  Send,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Calendar,
  AlertCircle,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import GlassButton from "@/components/shared/GlassButton";
import { portalClients } from "@/data/seed";
import {
  staggerContainer,
  staggerItem,
  fadeUp,
  springs,
} from "@/lib/motion";
import { formatDate, getInitials, formatCurrency } from "@/lib/utils";

// ---- Helpers ----
type ProgressColorKey = "emerald" | "cyan" | "amber";

function getProgressColor(progress: number): ProgressColorKey {
  if (progress > 80) return "emerald";
  if (progress >= 40) return "cyan";
  return "amber";
}

const progressColorMap: Record<ProgressColorKey, { bar: string; glow: string }> = {
  emerald: { bar: "#10b981", glow: "rgba(16,185,129,0.4)" },
  cyan: { bar: "#00D4FF", glow: "rgba(0,212,255,0.4)" },
  amber: { bar: "#f59e0b", glow: "rgba(245,158,11,0.4)" },
};

function getBudgetColor(remaining: number, total: number): string {
  const ratio = remaining / total;
  if (ratio > 0.5) return "text-emerald-400";
  if (ratio > 0.2) return "text-amber-400";
  return "text-rose-400";
}

function getStatusStyle(status: string) {
  switch (status) {
    case "in-progress":
      return { bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.3)", text: "text-cyan-400", label: "In Progress" };
    case "review":
      return { bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.3)", text: "text-violet-400", label: "In Review" };
    case "planning":
      return { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", text: "text-amber-400", label: "Planning" };
    default:
      return { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", text: "text-white/40", label: status };
  }
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / 86400000);
}

// ---- Client Card ----
interface ClientCardProps {
  client: (typeof portalClients)[0];
}

function ClientCard({ client }: ClientCardProps) {
  const [expanded, setExpanded] = useState(false);
  const progressColor = getProgressColor(client.progress);
  const pc = progressColorMap[progressColor];
  const statusStyle = getStatusStyle(client.status);
  const remaining = client.budget - client.billed;
  const budgetColor = getBudgetColor(remaining, client.budget);
  const billedRatio = client.billed / client.budget;
  const days = daysUntil(client.milestoneDate);
  const isUrgent = days <= 7 && days >= 0;
  const initials = getInitials(client.contact);

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={springs.snappy}
      className="glass rounded-xl p-5 relative overflow-hidden"
      style={{ borderColor: statusStyle.border }}
    >
      {/* Subtle top glow based on status */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${statusStyle.border}, transparent)` }}
      />

      {/* Header row */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={springs.bouncy}
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg text-white"
          style={{
            background: `linear-gradient(135deg, ${pc.bar}22, ${pc.bar}44)`,
            border: `1px solid ${pc.bar}44`,
            boxShadow: `0 0 16px ${pc.glow}`,
          }}
        >
          {initials}
        </motion.div>

        {/* Name + project */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-white text-base leading-tight">{client.name}</h3>
              <p className="text-white/50 text-xs mt-0.5">{client.contact} · {client.email}</p>
            </div>
            {/* Phase badge */}
            <span
              className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyle.text}`}
              style={{ background: statusStyle.bg, border: `1px solid ${statusStyle.border}` }}
            >
              {client.phase}
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1 font-medium">{client.project}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-white/40">Project Progress</span>
          <span className="text-xs font-bold" style={{ color: pc.bar }}>
            {client.progress}% complete
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${client.progress}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${pc.bar}aa, ${pc.bar})`,
              boxShadow: `0 0 8px ${pc.glow}`,
            }}
          />
        </div>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Budget */}
        <div className="glass rounded-xl p-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-2">Budget</p>
          <p className="text-sm font-bold text-white">{formatCurrency(client.budget)}</p>
          <p className="text-[10px] text-white/40 mt-0.5">Billed: {formatCurrency(client.billed)}</p>
          <p className={`text-[10px] font-semibold mt-0.5 ${budgetColor}`}>
            Remaining: {formatCurrency(remaining)}
          </p>
          {/* Mini billed bar */}
          <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${billedRatio * 100}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              className="h-full rounded-full"
              style={{ background: "#10b981" }}
            />
          </div>
        </div>

        {/* Next Milestone */}
        <div className="glass rounded-xl p-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-2">Next Milestone</p>
          <p className="text-xs font-semibold text-white leading-snug">{client.nextMilestone}</p>
          <div
            className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{
              background: isUrgent ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.05)",
              color: isUrgent ? "#f59e0b" : "rgba(255,255,255,0.4)",
            }}
          >
            <Calendar size={9} />
            {formatDate(client.milestoneDate)}
          </div>
          {isUrgent && (
            <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
              <AlertCircle size={9} />
              {days === 0 ? "Due today" : `${days}d remaining`}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="glass rounded-xl p-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-2">Status</p>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle.text}`}
            style={{ background: statusStyle.bg }}
          >
            {statusStyle.label}
          </span>
          {client.messages.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                  style={{ background: "rgba(0,212,255,0.3)" }}
                >
                  {getInitials(client.messages[client.messages.length - 1].from)}
                </div>
                <p className="text-[10px] text-white/40 truncate leading-snug">
                  {client.messages[client.messages.length - 1].text}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={13} className="text-white/30" />
          <span className="text-xs text-white/40">{client.messages.length} message{client.messages.length !== 1 ? "s" : ""}</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
        >
          {expanded ? "Hide Messages" : "View Messages"}
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Expandable messages */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.smooth}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
              {client.messages.map((msg, i) => {
                const isUs = msg.from === "BuiltByBas";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, ...springs.snappy }}
                    className={`flex gap-2.5 ${isUs ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                      style={{
                        background: isUs
                          ? "linear-gradient(135deg, #00D4FF44, #0EA5E944)"
                          : "rgba(255,255,255,0.1)",
                      }}
                    >
                      {getInitials(msg.from)}
                    </div>
                    <div className={`max-w-[75%] ${isUs ? "items-end" : "items-start"} flex flex-col`}>
                      <div
                        className={`px-3 py-2 rounded-xl text-xs text-white leading-relaxed ${
                          isUs
                            ? "bg-cyan-400/10 border border-cyan-400/20"
                            : "bg-white/5 border border-white/10"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <p className="text-[10px] text-white/25 mt-1 px-1">
                        {msg.from} · {formatDate(msg.date)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Reply input */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                <input
                  type="text"
                  placeholder="Reply..."
                  disabled
                  className="flex-1 glass rounded-lg px-3 py-2 text-xs text-white/40 placeholder-white/20 outline-none cursor-not-allowed"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                />
                <div className="relative group">
                  <GlassButton variant="primary" icon={Send} size="sm" disabled>
                    Send
                  </GlassButton>
                  <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black/80 rounded-lg text-[10px] text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Demo only
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---- Page ----
export default function ClientPortalPage() {
  const totalBilled = portalClients.reduce((s, c) => s + c.billed, 0);
  const inReview = portalClients.filter((c) => c.status === "review").length;
  const avgProgress = Math.round(
    portalClients.reduce((s, c) => s + c.progress, 0) / portalClients.length
  );

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Client Portal"
        subtitle="Live project status for every active client"
        icon={Briefcase}
        color="emerald"
      />

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      >
        <StatCard label="Active Projects" value={portalClients.length} icon={Briefcase} color="emerald" />
        <StatCard label="In Review" value={inReview} icon={Eye} color="cyan" />
        <StatCard label="Total Billed" value={formatCurrency(totalBilled)} icon={DollarSign} color="violet" />
        <StatCard label="Avg Progress" value={`${avgProgress}%`} icon={TrendingUp} color="amber" />
      </motion.div>

      {/* Section heading */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4"
      >
        Active Clients
      </motion.p>

      {/* Client cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {portalClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </motion.div>
    </PageWrapper>
  );
}
