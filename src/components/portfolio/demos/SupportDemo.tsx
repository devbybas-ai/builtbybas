"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Zap,
  MessageSquare,
  User,
  Tag,
  ChevronRight,
  UserPlus,
  X,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { supportTickets } from "@/data/demo-seed";
import {
  demoStaggerContainer,
  demoStaggerItem,
  demoFadeUp,
  demoSprings,
  demoScalePop,
} from "@/lib/demo-motion";
import { demoGetRelativeTime, demoGetInitials } from "@/lib/demo-utils";

// ---- Config ----
const priorityConfig = {
  high:   { bg: "rgba(244,63,94,0.1)",  border: "rgba(244,63,94,0.3)",  text: "text-rose-400",    label: "High",   sla: "4hr SLA",  color: "#f43f5e", slaBg: "rgba(244,63,94,0.12)"  },
  medium: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", text: "text-amber-400",   label: "Medium", sla: "8hr SLA",  color: "#f59e0b", slaBg: "rgba(245,158,11,0.12)" },
  low:    { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", text: "text-emerald-400", label: "Low",    sla: "24hr SLA", color: "#10b981", slaBg: "rgba(16,185,129,0.12)" },
};

const statusConfig = {
  open:        { bg: "rgba(244,63,94,0.1)",  text: "text-rose-400",    label: "Open",        border: "rgba(244,63,94,0.3)"  },
  "in-progress": { bg: "rgba(245,158,11,0.1)", text: "text-amber-400",   label: "In Progress", border: "rgba(245,158,11,0.3)" },
  resolved:    { bg: "rgba(255,255,255,0.05)", text: "text-white/30",   label: "Resolved",    border: "rgba(255,255,255,0.1)" },
};

const slaTimerConfig = {
  high:   { label: "3hr 24m remaining", color: "text-rose-400",    bg: "rgba(244,63,94,0.1)"  },
  medium: { label: "5hr 15m remaining", color: "text-amber-400",   bg: "rgba(245,158,11,0.1)" },
  low:    { label: "18hr remaining",    color: "text-emerald-400", bg: "rgba(16,185,129,0.1)" },
};

const categories = ["Account", "Billing", "Technical", "General"];

const priorityRadio = [
  { key: "high",   label: "High",   color: "#f43f5e", bg: "rgba(244,63,94,0.12)"  },
  { key: "medium", label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { key: "low",    label: "Low",    color: "#10b981", bg: "rgba(16,185,129,0.12)" },
];

type StatusFilter   = "All" | "Open" | "In Progress" | "Resolved";
type PriorityFilter = "All" | "High" | "Medium" | "Low";

const STATUS_TABS:   StatusFilter[]   = ["All", "Open", "In Progress", "Resolved"];
const PRIORITY_TABS: PriorityFilter[] = ["All", "High", "Medium", "Low"];

// ---- Ticket type ----
type Ticket = (typeof supportTickets)[0];

// ---- Ticket Card ----
interface TicketCardProps {
  ticket: Ticket;
  onAssign: (id: string) => void;
  onResolve: (id: string) => void;
}

function TicketCard({ ticket, onAssign, onResolve }: TicketCardProps) {
  const pc = priorityConfig[ticket.priority as keyof typeof priorityConfig];
  const sc = statusConfig[ticket.status as keyof typeof statusConfig];
  const slaCfg = slaTimerConfig[ticket.priority as keyof typeof slaTimerConfig];
  const initials = demoGetInitials(ticket.client);
  const isActive = ticket.status !== "resolved";

  return (
    <motion.div
      variants={demoStaggerItem}
      whileHover={{ scale: 1.01, y: -1 }}
      transition={demoSprings.snappy}
      className="group demo-glass rounded-xl p-4 relative overflow-hidden"
      style={{ borderColor: isActive ? pc.border : "rgba(255,255,255,0.08)" }}
    >
      {/* Top accent */}
      {isActive && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${pc.color}60, transparent)` }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Left: SLA + avatar column */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          {/* Client initials */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
            style={{ background: pc.bg, border: `1px solid ${pc.border}` }}
          >
            {initials}
          </div>
          {/* SLA badge */}
          <div
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${pc.text} text-center leading-tight`}
            style={{ background: pc.slaBg }}
          >
            {pc.sla}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Ticket ID */}
              <span className="font-mono text-[10px] text-white/20">{ticket.id}</span>
              {/* Category */}
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white/50"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                {ticket.category}
              </span>
            </div>
            {/* Status badge */}
            <span
              className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.text}`}
              style={{ background: sc.bg, border: `1px solid ${sc.border}` }}
            >
              {sc.label}
            </span>
          </div>

          {/* Subject */}
          <p className="text-sm font-semibold text-white leading-snug mb-1.5">{ticket.subject}</p>

          {/* Client + email */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <User size={11} />
              {ticket.client}
            </div>
            <span className="text-white/20 text-xs">{ticket.email}</span>
          </div>

          {/* Bottom row: assignee, time, messages */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Assignee */}
            <div className="flex items-center gap-1.5">
              <Tag size={10} className="text-white/30" />
              {ticket.assignee ? (
                <span className="text-[10px] text-white/50">{ticket.assignee}</span>
              ) : (
                <span className="text-[10px] text-rose-400">Unassigned</span>
              )}
            </div>

            <span className="text-white/20">·</span>

            {/* Created */}
            <span className="text-[10px] text-white/30">{demoGetRelativeTime(ticket.created)}</span>

            <span className="text-white/20">·</span>

            {/* Message count */}
            <div className="flex items-center gap-1">
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
                style={{ background: ticket.messages > 0 ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.05)" }}
              >
                <MessageSquare size={10} className={ticket.messages > 0 ? "text-cyan-400" : "text-white/30"} />
                <span className={`text-[10px] font-bold ${ticket.messages > 0 ? "text-cyan-400" : "text-white/30"}`}>
                  {ticket.messages}
                </span>
              </div>
            </div>

            {/* SLA timer (open/in-progress only) */}
            {isActive && (
              <>
                <span className="text-white/20">·</span>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${slaCfg.color}`}
                  style={{ background: slaCfg.bg }}
                >
                  {slaCfg.label}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Hover actions — slide in from right */}
        <div className="flex-shrink-0 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-200">
          {ticket.status !== "resolved" && (
            <DemoGlassButton variant="primary" size="sm" icon={CheckCircle} onClick={() => onResolve(ticket.id)}>
              Resolve
            </DemoGlassButton>
          )}
          {!ticket.assignee && ticket.status !== "resolved" && (
            <DemoGlassButton variant="ghost" size="sm" icon={UserPlus} onClick={() => onAssign(ticket.id)}>
              Assign
            </DemoGlassButton>
          )}
          {ticket.status === "resolved" && (
            <DemoGlassButton variant="ghost" size="sm" icon={ChevronRight} disabled>
              Closed
            </DemoGlassButton>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---- New Ticket Modal ----
interface NewTicketModalProps {
  onClose: () => void;
  onSubmit: (ticket: Ticket) => void;
}

function NewTicketModal({ onClose, onSubmit }: NewTicketModalProps) {
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Technical");
  const [subject, setSubject]   = useState("");
  const [description, setDesc]  = useState("");

  const handleSubmit = () => {
    if (!subject) return;
    setLoading(true);
    setTimeout(() => {
      const newTicket: Ticket = {
        id: `TKT-${String(Date.now()).slice(-6)}`,
        subject,
        client: "New Client",
        email: "client@example.com",
        priority,
        status: "open",
        category,
        created: new Date().toISOString(),
        assignee: null,
        sla: priority === "high" ? "4hr" : priority === "medium" ? "8hr" : "24hr",
        messages: 0,
      };
      onSubmit(newTicket);
      setLoading(false);
      setSuccess(true);
    }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        variants={demoScalePop}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, scale: 0.92 }}
        className="demo-glass rounded-2xl p-6 w-full max-w-md relative"
        style={{ border: "1px solid rgba(255,255,255,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              variants={demoScalePop}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center py-8 gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...demoSprings.bouncy, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center"
              >
                <CheckCircle className="text-emerald-400" size={32} />
              </motion.div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">Ticket Submitted</p>
                <p className="text-white/40 text-sm mt-1">Our team will respond within your SLA window.</p>
              </div>
              <DemoGlassButton variant="secondary" onClick={onClose}>Close</DemoGlassButton>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-1">New Support Ticket</h2>
              <p className="text-white/40 text-xs -mt-2">Describe your issue and we&apos;ll get back to you fast.</p>

              {/* Subject */}
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Briefly describe the issue..."
                  className="w-full demo-glass rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-400/30 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full demo-glass rounded-xl px-3 py-2.5 text-sm text-white/70 outline-none bg-transparent"
                  style={{ border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c} style={{ background: "#0A0A0F" }}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-2">Priority</label>
                <div className="flex gap-2">
                  {priorityRadio.map((p) => {
                    const isSelected = priority === p.key;
                    return (
                      <motion.button
                        key={p.key}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={demoSprings.snappy}
                        onClick={() => setPriority(p.key)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          background: isSelected ? p.bg : "rgba(255,255,255,0.03)",
                          border: isSelected ? `1px solid ${p.color}44` : "1px solid rgba(255,255,255,0.06)",
                          color: isSelected ? p.color : "rgba(255,255,255,0.3)",
                        }}
                      >
                        <AlertCircle size={11} />
                        {p.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Provide more detail about the issue, steps to reproduce, expected vs actual behavior..."
                  rows={4}
                  className="w-full demo-glass rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-400/30 transition-colors resize-none"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>

              {/* Submit */}
              <motion.button
                whileHover={loading ? undefined : { scale: 1.02 }}
                whileTap={loading ? undefined : { scale: 0.98 }}
                transition={demoSprings.snappy}
                onClick={handleSubmit}
                disabled={loading || !subject}
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: loading
                    ? "rgba(16,185,129,0.2)"
                    : "linear-gradient(135deg, #10b981, #059669)",
                  color: loading ? "#10b981" : "#052e16",
                  boxShadow: loading ? "none" : "0 0 20px rgba(16,185,129,0.3)",
                  opacity: !subject ? 0.4 : 1,
                  cursor: !subject ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <PlusCircle size={15} />
                    Submit Ticket
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ---- Demo ----
export function SupportDemo() {
  const [tickets, setTickets] = useState<Ticket[]>([...supportTickets]);
  const [statusTab,   setStatusTab]   = useState<StatusFilter>("All");
  const [priorityTab, setPriorityTab] = useState<PriorityFilter>("All");
  const [showModal,   setShowModal]   = useState(false);
  const [flashId,     setFlashId]     = useState<string | null>(null);

  const openCount       = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in-progress").length;
  const resolvedCount   = tickets.filter((t) => t.status === "resolved").length;

  const handleAddTicket = (ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
    setFlashId(ticket.id);
    setTimeout(() => setFlashId(null), 2000);
  };

  const handleAssign = (id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, assignee: "Support Team", status: "in-progress" } : t
      )
    );
    setFlashId(id);
    setTimeout(() => setFlashId(null), 1500);
  };

  const handleResolve = (id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "resolved" } : t
      )
    );
    setFlashId(id);
    setTimeout(() => setFlashId(null), 1500);
  };

  const filtered = tickets.filter((t) => {
    const matchStatus =
      statusTab === "All" ||
      (statusTab === "Open" && t.status === "open") ||
      (statusTab === "In Progress" && t.status === "in-progress") ||
      (statusTab === "Resolved" && t.status === "resolved");

    const matchPriority =
      priorityTab === "All" ||
      t.priority === priorityTab.toLowerCase();

    return matchStatus && matchPriority;
  });

  return (
    <DemoPageWrapper>
      {/* Header */}
      <DemoPageHeader
        title="Support"
        subtitle="Track and resolve client support tickets"
        icon={AlertCircle}
        color="emerald"
        action={
          <DemoGlassButton variant="primary" icon={PlusCircle} onClick={() => setShowModal(true)}>
            New Ticket
          </DemoGlassButton>
        }
      />

      {/* Stats */}
      <motion.div
        variants={demoStaggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      >
        <DemoStatCard
          label="Open"
          value={openCount}
          icon={AlertCircle}
          color="rose"
          trend={{ value: "+1 today", up: false }}
        />
        <DemoStatCard label="In Progress" value={inProgressCount} icon={Clock}        color="amber" />
        <DemoStatCard label="Resolved"    value={resolvedCount}   icon={CheckCircle}  color="emerald" />
        <DemoStatCard label="Avg SLA Met" value="87%"             icon={Zap}          color="cyan" />
      </motion.div>

      {/* Filter bar */}
      <motion.div
        variants={demoFadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row gap-3 mb-5"
      >
        {/* Status tabs */}
        <div className="demo-glass rounded-xl p-1 flex gap-1 flex-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className="relative flex-1 text-[10px] font-bold uppercase tracking-wide py-1.5 rounded-lg transition-colors"
              style={{ color: statusTab === tab ? "#10b981" : "rgba(255,255,255,0.3)" }}
            >
              {statusTab === tab && (
                <motion.div
                  layoutId="status-tab"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}
                  transition={demoSprings.snappy}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        {/* Priority tabs */}
        <div className="demo-glass rounded-xl p-1 flex gap-1">
          {PRIORITY_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setPriorityTab(tab)}
              className="relative px-3 text-[10px] font-bold uppercase tracking-wide py-1.5 rounded-lg transition-colors whitespace-nowrap"
              style={{ color: priorityTab === tab ? "#f59e0b" : "rgba(255,255,255,0.3)" }}
            >
              {priorityTab === tab && (
                <motion.div
                  layoutId="priority-tab"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
                  transition={demoSprings.snappy}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Ticket list */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={statusTab + priorityTab}
          variants={demoStaggerContainer}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -4 }}
          className="space-y-3"
        >
          {filtered.length === 0 ? (
            <motion.div variants={demoStaggerItem} className="demo-glass rounded-xl p-10 text-center">
              <p className="text-white/30 text-sm">No tickets match your filters.</p>
            </motion.div>
          ) : (
            filtered.map((ticket) => (
              <div key={ticket.id} className={flashId === ticket.id ? "ring-1 ring-emerald-400/50 rounded-xl transition-all duration-700" : ""}>
                <TicketCard ticket={ticket} onAssign={handleAssign} onResolve={handleResolve} />
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* New ticket modal */}
      <AnimatePresence>
        {showModal && <NewTicketModal onClose={() => setShowModal(false)} onSubmit={handleAddTicket} />}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
