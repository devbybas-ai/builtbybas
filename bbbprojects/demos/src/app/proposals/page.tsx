"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Send,
  DollarSign,
  Edit,
  Check,
  ChevronDown,
  ChevronUp,
  FilePlus,
  Bell,
  Receipt,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import GlassButton from "@/components/shared/GlassButton";
import { demoProposals } from "@/data/seed";
import {
  staggerContainer,
  staggerItem,
  fadeUp,
  springs,
} from "@/lib/motion";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";

// ---- Config ----
const statusConfig = {
  draft: {
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    text: "text-amber-400",
    label: "Draft",
    icon: Edit,
    color: "#f59e0b",
  },
  sent: {
    bg: "rgba(0,212,255,0.1)",
    border: "rgba(0,212,255,0.3)",
    text: "text-cyan-400",
    label: "Sent",
    icon: Send,
    color: "#00D4FF",
  },
  accepted: {
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
    text: "text-emerald-400",
    label: "Accepted",
    icon: Check,
    color: "#10b981",
  },
};

const pipelineStages = [
  { key: "draft",    label: "Draft",    color: "#f59e0b", glow: "rgba(245,158,11,0.3)"  },
  { key: "sent",     label: "Sent",     color: "#00D4FF", glow: "rgba(0,212,255,0.3)"   },
  { key: "accepted", label: "Accepted", color: "#10b981", glow: "rgba(16,185,129,0.3)"  },
];

// ---- Proposal Card ----
interface ProposalCardProps {
  proposal: (typeof demoProposals)[0];
}

function ProposalCard({ proposal }: ProposalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const sc = statusConfig[proposal.status as keyof typeof statusConfig];
  const StatusIcon = sc.icon;
  const initials = getInitials(proposal.contact);

  const total = proposal.services.reduce((sum, s) => sum + s.price, 0);

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={springs.snappy}
      className="glass rounded-xl p-5 relative overflow-hidden"
      style={{ borderColor: sc.border }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${sc.border}, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Client avatar */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: `${sc.color}22`, border: `1px solid ${sc.color}33` }}
          >
            {initials}
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">{proposal.client}</p>
            <p className="text-white/40 text-xs">{proposal.contact} · {proposal.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Proposal ID */}
          <span className="font-mono text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded">
            {proposal.id}
          </span>
          {/* Status badge */}
          <span
            className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${sc.text}`}
            style={{ background: sc.bg, border: `1px solid ${sc.border}` }}
          >
            <StatusIcon size={10} />
            {sc.label}
          </span>
        </div>
      </div>

      {/* Project title + value */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/60 text-xs mb-0.5">Project</p>
          <p className="text-white font-semibold text-sm">{proposal.title}</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-xs mb-0.5">Total Value</p>
          <p className="text-2xl font-bold" style={{ color: sc.color }}>
            {formatCurrency(proposal.value)}
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/30">Created:</span>
          <span className="text-[10px] text-white/60 font-medium">{formatDate(proposal.created)}</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/30">Expires:</span>
          <span className="text-[10px] text-white/60 font-medium">{formatDate(proposal.expires)}</span>
        </div>
      </div>

      {/* Services toggle */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-white/30 uppercase tracking-wider font-semibold">
          {proposal.services.length} Service{proposal.services.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
        >
          {expanded ? "Hide Services" : "View Services"}
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Services expandable */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.smooth}
            className="overflow-hidden"
          >
            <div
              className="rounded-xl overflow-hidden mb-3"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Header row */}
              <div
                className="grid grid-cols-12 gap-2 px-3 py-2"
                style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span className="col-span-4 text-[10px] text-white/30 uppercase tracking-wider font-semibold">Service</span>
                <span className="col-span-6 text-[10px] text-white/30 uppercase tracking-wider font-semibold">Description</span>
                <span className="col-span-2 text-[10px] text-white/30 uppercase tracking-wider font-semibold text-right">Price</span>
              </div>

              {/* Service rows */}
              {proposal.services.map((svc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, ...springs.snappy }}
                  className="grid grid-cols-12 gap-2 px-3 py-2.5"
                  style={{
                    borderBottom: i < proposal.services.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <span className="col-span-4 text-xs font-medium text-white leading-snug">{svc.name}</span>
                  <span className="col-span-6 text-xs text-white/40 truncate leading-snug">{svc.desc}</span>
                  <span className="col-span-2 text-xs font-semibold text-white/80 text-right">
                    {formatCurrency(svc.price)}
                  </span>
                </motion.div>
              ))}

              {/* Total row */}
              <div
                className="grid grid-cols-12 gap-2 px-3 py-2.5"
                style={{ background: `${sc.color}08`, borderTop: `1px solid ${sc.color}20` }}
              >
                <span className="col-span-10 text-xs font-bold text-white/60 uppercase tracking-widest">TOTAL</span>
                <span className="col-span-2 text-sm font-bold text-right" style={{ color: sc.color }}>
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
        {proposal.status === "draft" && (
          <>
            <GlassButton variant="secondary" size="sm" icon={Edit}>Edit</GlassButton>
            <GlassButton variant="primary" size="sm" icon={Send}>Send</GlassButton>
          </>
        )}
        {proposal.status === "sent" && (
          <>
            <GlassButton variant="primary" size="sm" icon={Check}>Mark Accepted</GlassButton>
            <GlassButton variant="secondary" size="sm" icon={Bell}>Send Reminder</GlassButton>
          </>
        )}
        {proposal.status === "accepted" && (
          <GlassButton variant="primary" size="sm" icon={Receipt}>Create Invoice</GlassButton>
        )}
      </div>
    </motion.div>
  );
}

// ---- Pipeline Sidebar ----
function PipelineSidebar() {
  const counts = {
    draft:    demoProposals.filter((p) => p.status === "draft").length,
    sent:     demoProposals.filter((p) => p.status === "sent").length,
    accepted: demoProposals.filter((p) => p.status === "accepted").length,
  };

  const values = {
    draft:    demoProposals.filter((p) => p.status === "draft").reduce((s, p) => s + p.value, 0),
    sent:     demoProposals.filter((p) => p.status === "sent").reduce((s, p) => s + p.value, 0),
    accepted: demoProposals.filter((p) => p.status === "accepted").reduce((s, p) => s + p.value, 0),
  };

  const maxValue = Math.max(...Object.values(values));

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass rounded-xl p-4">
      <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4">Pipeline Summary</p>

      {/* Stage rows */}
      <div className="space-y-3 mb-6">
        {pipelineStages.map((stage) => {
          const sc = statusConfig[stage.key as keyof typeof statusConfig];
          const count = counts[stage.key as keyof typeof counts];
          return (
            <div key={stage.key} className="flex items-center gap-3">
              {/* Dot */}
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: stage.color, boxShadow: `0 0 8px ${stage.glow}` }}
              />
              {/* Label */}
              <span className={`text-sm font-semibold flex-1 ${sc.text}`}>{stage.label}</span>
              {/* Count badge */}
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${sc.text}`}
                style={{ background: sc.bg }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      <p className="text-[10px] text-white/20 uppercase tracking-wider font-semibold mb-3">Value by Stage</p>
      <div className="space-y-2.5">
        {pipelineStages.map((stage) => {
          const val = values[stage.key as keyof typeof values];
          const widthPct = maxValue > 0 ? (val / maxValue) * 100 : 0;
          return (
            <div key={stage.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-white/40">{stage.label}</span>
                <span className="text-[10px] font-semibold" style={{ color: stage.color }}>
                  {formatCurrency(val)}
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  className="h-full rounded-full"
                  style={{
                    background: stage.color,
                    boxShadow: `0 0 6px ${stage.glow}`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div
        className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between"
      >
        <span className="text-xs text-white/40">Total Pipeline</span>
        <span className="text-sm font-bold text-emerald-400">
          {formatCurrency(Object.values(values).reduce((a, b) => a + b, 0))}
        </span>
      </div>
    </motion.div>
  );
}

// ---- Page ----
export default function ProposalsPage() {
  const accepted = demoProposals.filter((p) => p.status === "accepted");
  const acceptedValue = accepted.reduce((s, p) => s + p.value, 0);

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Proposals"
        subtitle="Manage and track client proposals through your pipeline"
        icon={FileText}
        color="emerald"
        action={
          <GlassButton variant="primary" icon={FilePlus}>
            New Proposal
          </GlassButton>
        }
      />

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      >
        <StatCard label="Total Proposals"  value={demoProposals.length}           icon={FileText} color="emerald" />
        <StatCard label="Sent & Pending"   value={1}                              icon={Send}     color="cyan" />
        <StatCard label="Accepted Value"   value={formatCurrency(acceptedValue)}  icon={DollarSign} color="violet" />
        <StatCard label="Draft"            value={1}                              icon={Edit}     color="amber" />
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">

        {/* Main — proposal cards */}
        <div className="lg:col-span-7">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4"
          >
            All Proposals
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {demoProposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </motion.div>
        </div>

        {/* Sidebar — pipeline */}
        <div className="lg:col-span-3">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4"
          >
            Pipeline
          </motion.p>
          <PipelineSidebar />
        </div>
      </div>
    </PageWrapper>
  );
}
