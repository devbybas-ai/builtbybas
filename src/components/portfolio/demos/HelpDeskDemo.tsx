"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Zap,
  Plus,
  X,
  UserCheck,
  CheckCheck,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { helpTickets } from "@/data/demo-seed";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoFadeUp, demoScalePop } from "@/lib/demo-motion";
import { demoGetRelativeTime } from "@/lib/demo-utils";

// ---- Filter tabs ----
const FILTERS = ["All", "Open", "In Progress", "Resolved"] as const;
type FilterOption = (typeof FILTERS)[number];

// Status → filter value mapping
const statusToFilter: Record<string, FilterOption> = {
  open:        "Open",
  "in-progress": "In Progress",
  resolved:    "Resolved",
};

// ---- Status badge config ----
const statusConfig: Record<string, { label: string; cls: string }> = {
  open:         { label: "Open",        cls: "bg-amber-400/15 text-amber-400 border border-amber-400/30" },
  "in-progress":{ label: "In Progress", cls: "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30" },
  resolved:     { label: "Resolved",    cls: "bg-white/8 text-white/30 border border-white/10" },
};

// ---- Priority badge config ----
const prioritySymbol: Record<string, string> = { high: "!", medium: "~", low: "." };

// ---- Category chip colors ----
const categoryColor: Record<string, string> = {
  IT:         "bg-cyan-400/10 text-cyan-400",
  Facilities: "bg-amber-400/10 text-amber-400",
  Software:   "bg-violet-400/10 text-violet-400",
  HR:         "bg-rose-400/10 text-rose-400",
};

// ---- New Ticket form ----
interface TicketForm {
  title: string;
  category: string;
  priority: string;
  description: string;
  requester: string;
}

const emptyTicket: TicketForm = {
  title: "",
  category: "IT",
  priority: "medium",
  description: "",
  requester: "",
};

const CATEGORIES = ["IT", "Facilities", "Software", "HR", "Other"];
const PRIORITIES  = ["low", "medium", "high"];

// Ticket type for mutable state
interface Ticket {
  id: string;
  title: string;
  requester: string;
  dept: string;
  priority: string;
  status: string;
  category: string;
  created: string;
  assignee: string | null;
  updates: number;
}

export function HelpDeskDemo() {
  const [tickets, setTickets] = useState<Ticket[]>(helpTickets as Ticket[]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<TicketForm>(emptyTicket);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Count per status for badges
  const counts: Record<FilterOption, number> = {
    All:          tickets.length,
    Open:         tickets.filter((t) => t.status === "open").length,
    "In Progress":tickets.filter((t) => t.status === "in-progress").length,
    Resolved:     tickets.filter((t) => t.status === "resolved").length,
  };

  const filtered = tickets.filter((t) => {
    if (activeFilter === "All") return true;
    return statusToFilter[t.status] === activeFilter;
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newTicket: Ticket = {
      id: `HD-${String(tickets.length + 1).padStart(3, "0")}`,
      title: form.title,
      requester: form.requester,
      dept: "—",
      priority: form.priority,
      status: "open",
      category: form.category,
      created: new Date().toISOString(),
      assignee: null,
      updates: 0,
    };
    setTickets((prev) => [newTicket, ...prev]);
    setShowModal(false);
    setForm(emptyTicket);
  }

  function assignTicket(id: string) {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, assignee: t.assignee === "You" ? null : "You", status: t.status === "open" ? "in-progress" : t.status }
          : t
      )
    );
  }

  function resolveTicket(id: string) {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "resolved" } : t
      )
    );
  }

  return (
    <DemoPageWrapper>
      {/* Header */}
      <DemoPageHeader
        title="Help Desk"
        subtitle="Internal support tickets — submit, track, and resolve"
        icon={AlertCircle}
        color="rose"
        action={
          <DemoGlassButton variant="primary" icon={Plus} onClick={() => setShowModal(true)}>
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
          label="Open Tickets"
          value={counts.Open}
          icon={AlertCircle}
          color="rose"
        />
        <DemoStatCard label="In Progress"    value={counts["In Progress"]} icon={Clock}        color="amber" />
        <DemoStatCard label="Resolved" value={counts.Resolved} icon={CheckCircle}  color="emerald" />
        <DemoStatCard label="Total Tickets"   value={counts.All} icon={Zap}      color="cyan" />
      </motion.div>

      {/* Filter tabs + New Ticket button */}
      <motion.div variants={demoFadeUp} className="flex items-center justify-between gap-3 mb-5">
        {/* Filter tabs */}
        <div className="flex items-center demo-glass rounded-xl p-1 gap-0.5">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ color: isActive ? "#00D4FF" : "rgba(255,255,255,0.3)" }}
              >
                {isActive && (
                  <motion.div
                    layoutId="hd-filter-tab"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.2)" }}
                    transition={demoSprings.snappy}
                  />
                )}
                <span className="relative z-10">{filter}</span>
                <span
                  className="relative z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? "rgba(0,212,255,0.2)" : "rgba(255,255,255,0.06)",
                    color: isActive ? "#00D4FF" : "rgba(255,255,255,0.3)",
                  }}
                >
                  {counts[filter]}
                </span>
              </button>
            );
          })}
        </div>

        <DemoGlassButton variant="primary" icon={Plus} size="sm" onClick={() => setShowModal(true)}>
          New Ticket
        </DemoGlassButton>
      </motion.div>

      {/* Ticket list */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeFilter}
          variants={demoStaggerContainer}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -4 }}
          className="space-y-2"
        >
          {filtered.length === 0 ? (
            <motion.div variants={demoStaggerItem} className="demo-glass rounded-xl p-8 text-center">
              <p className="text-white/30 text-sm">No tickets in this category.</p>
            </motion.div>
          ) : (
            filtered.map((ticket) => {
              const sc   = statusConfig[ticket.status]   ?? statusConfig.open;
              const catC = categoryColor[ticket.category] ?? "bg-white/8 text-white/40";
              const isHovered = hoveredId === ticket.id;

              return (
                <motion.div
                  key={ticket.id}
                  variants={demoStaggerItem}
                  whileHover={{ scale: 1.01, y: -1 }}
                  transition={demoSprings.snappy}
                  onHoverStart={() => setHoveredId(ticket.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  className="group demo-glass rounded-xl p-4 relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {/* Priority badge */}
                    <div className="flex-shrink-0 pt-0.5">
                      <span className={`demo-badge demo-priority-${ticket.priority} w-6 h-6 flex items-center justify-center text-sm font-black rounded-lg p-0`}>
                        {prioritySymbol[ticket.priority]}
                      </span>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-[10px] text-white/25">{ticket.id}</span>
                            <span className={`demo-badge ${sc.cls} text-[9px]`}>{sc.label}</span>
                          </div>
                          <p className="text-sm font-medium text-white leading-snug">{ticket.title}</p>
                        </div>

                        {/* Action buttons — slide in on hover */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0, x: 12 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 12 }}
                              transition={demoSprings.snappy}
                              className="flex-shrink-0 flex items-center gap-1"
                            >
                              <button
                                onClick={(e) => { e.stopPropagation(); assignTicket(ticket.id); }}
                                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                                  ticket.assignee === "You"
                                    ? "bg-cyan-400/25 text-cyan-300 hover:bg-cyan-400/15"
                                    : "bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20"
                                }`}
                              >
                                <UserCheck size={10} />
                                {ticket.assignee === "You" ? "Unassign" : "Assign"}
                              </button>
                              {ticket.status !== "resolved" && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); resolveTicket(ticket.id); }}
                                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-400/10 text-emerald-400 text-[10px] font-semibold hover:bg-emerald-400/20 transition-colors"
                                >
                                  <CheckCheck size={10} />
                                  Resolve
                                </button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Second row: requester + dept + category + assignee */}
                      <div className="flex items-center flex-wrap gap-2 text-[10px] text-white/40 mb-1.5">
                        <span>{ticket.requester}</span>
                        <span className="text-white/20">·</span>
                        <span>{ticket.dept}</span>
                        <span className="text-white/20">·</span>

                        {/* Category chip */}
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${catC}`}>
                          {ticket.category}
                        </span>

                        <span className="text-white/20">·</span>

                        {/* Assignee */}
                        {ticket.assignee ? (
                          <span className="text-white/50">{ticket.assignee}</span>
                        ) : (
                          <span className="text-rose-400 font-medium">Unassigned</span>
                        )}
                      </div>

                      {/* Bottom row: time ago + updates */}
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-white/25">
                          {demoGetRelativeTime(ticket.created)}
                        </span>

                        {ticket.updates > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-white/30">
                            <MessageSquare size={9} />
                            <span
                              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                              style={{ background: "rgba(0,212,255,0.15)", color: "#00D4FF" }}
                            >
                              {ticket.updates}
                            </span>
                          </span>
                        )}

                        <ChevronRight size={11} className="ml-auto text-white/15 group-hover:text-white/30 transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>

      {/* ---- New Ticket Modal ---- */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              key="hd-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowModal(false)}
            />

            {/* Slide-up modal */}
            <motion.div
              key="hd-modal"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={demoSprings.smooth}
              className="fixed bottom-0 left-0 right-0 z-50 md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md"
            >
              <div className="demo-glass rounded-t-2xl md:rounded-2xl p-6 mx-auto max-w-md w-full border-rose-500/20">
                {/* Modal header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold text-white">New Support Ticket</h2>
                    <p className="text-xs text-white/40 mt-0.5">Describe your issue and we&apos;ll get it sorted</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 font-medium">Title</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Brief description of the issue"
                      className="w-full demo-glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-rose-400/30 transition-colors"
                    />
                  </div>

                  {/* Category + Priority */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-white/40 mb-1.5 font-medium">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full demo-glass rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors"
                        style={{ colorScheme: "dark" }}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c} style={{ background: "#0A0A0F" }}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1.5 font-medium">Priority</label>
                      <select
                        value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                        className="w-full demo-glass rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors"
                        style={{ colorScheme: "dark" }}
                      >
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p} style={{ background: "#0A0A0F" }}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Requester */}
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 font-medium">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.requester}
                      onChange={(e) => setForm({ ...form, requester: e.target.value })}
                      placeholder="Full name"
                      className="w-full demo-glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-rose-400/30 transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 font-medium">Description</label>
                    <textarea
                      rows={3}
                      required
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="What's happening? Include steps to reproduce if it's a software issue…"
                      className="w-full demo-glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-rose-400/30 transition-colors resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <DemoGlassButton variant="secondary" size="md" onClick={() => setShowModal(false)}>
                      Cancel
                    </DemoGlassButton>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={demoSprings.snappy}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-rose-500/80 hover:bg-rose-500 transition-colors"
                    >
                      Submit Ticket
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
