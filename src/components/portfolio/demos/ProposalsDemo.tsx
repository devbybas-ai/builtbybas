"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Send,
  DollarSign,
  Edit,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  FilePlus,
  Bell,
  Receipt,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoProposals } from "@/data/demo-seed";
import {
  demoStaggerContainer,
  demoStaggerItem,
  demoFadeUp,
  demoSprings,
} from "@/lib/demo-motion";
import { demoFormatDate, demoFormatCurrency, demoGetInitials } from "@/lib/demo-utils";

// ---- Config ----
const statusConfig: Record<string, { bg: string; border: string; text: string; label: string; icon: typeof Edit; color: string }> = {
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
  declined: {
    bg: "rgba(244,63,94,0.1)",
    border: "rgba(244,63,94,0.3)",
    text: "text-rose-400",
    label: "Declined",
    icon: X,
    color: "#f43f5e",
  },
};

const pipelineStages = [
  { key: "draft",    label: "Draft",    color: "#f59e0b", glow: "rgba(245,158,11,0.3)"  },
  { key: "sent",     label: "Sent",     color: "#00D4FF", glow: "rgba(0,212,255,0.3)"   },
  { key: "accepted", label: "Accepted", color: "#10b981", glow: "rgba(16,185,129,0.3)"  },
  { key: "declined", label: "Declined", color: "#f43f5e", glow: "rgba(244,63,94,0.3)"   },
];

// Proposal type
interface Proposal {
  id: string;
  client: string;
  contact: string;
  email: string;
  title: string;
  value: number;
  status: string;
  created: string;
  expires: string;
  services: { name: string; desc: string; price: number }[];
}

// ---- Proposal Card ----
interface ProposalCardProps {
  proposal: Proposal;
  onStatusChange: (id: string, status: string) => void;
}

function ProposalCard({ proposal, onStatusChange }: ProposalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const sc = statusConfig[proposal.status] ?? statusConfig.draft;
  const StatusIcon = sc.icon;
  const initials = demoGetInitials(proposal.contact);

  const total = proposal.services.reduce((sum, s) => sum + s.price, 0);

  return (
    <motion.div
      variants={demoStaggerItem}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={demoSprings.snappy}
      className="demo-glass rounded-xl p-5 relative overflow-hidden"
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
            {demoFormatCurrency(proposal.value)}
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/30">Created:</span>
          <span className="text-[10px] text-white/60 font-medium">{demoFormatDate(proposal.created)}</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/30">Expires:</span>
          <span className="text-[10px] text-white/60 font-medium">{demoFormatDate(proposal.expires)}</span>
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
            transition={demoSprings.smooth}
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
                  transition={{ delay: i * 0.06, ...demoSprings.snappy }}
                  className="grid grid-cols-12 gap-2 px-3 py-2.5"
                  style={{
                    borderBottom: i < proposal.services.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <span className="col-span-4 text-xs font-medium text-white leading-snug">{svc.name}</span>
                  <span className="col-span-6 text-xs text-white/40 truncate leading-snug">{svc.desc}</span>
                  <span className="col-span-2 text-xs font-semibold text-white/80 text-right">
                    {demoFormatCurrency(svc.price)}
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
                  {demoFormatCurrency(total)}
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
            <DemoGlassButton variant="secondary" size="sm" icon={Edit}>Edit</DemoGlassButton>
            <DemoGlassButton variant="primary" size="sm" icon={Send} onClick={() => onStatusChange(proposal.id, "sent")}>Send</DemoGlassButton>
          </>
        )}
        {proposal.status === "sent" && (
          <>
            <DemoGlassButton variant="primary" size="sm" icon={Check} onClick={() => onStatusChange(proposal.id, "accepted")}>Accept</DemoGlassButton>
            <DemoGlassButton variant="danger" size="sm" icon={X} onClick={() => onStatusChange(proposal.id, "declined")}>Decline</DemoGlassButton>
            <DemoGlassButton variant="secondary" size="sm" icon={Bell}>Send Reminder</DemoGlassButton>
          </>
        )}
        {proposal.status === "accepted" && (
          <DemoGlassButton variant="primary" size="sm" icon={Receipt}>Create Invoice</DemoGlassButton>
        )}
        {proposal.status === "declined" && (
          <DemoGlassButton variant="secondary" size="sm" icon={Edit} onClick={() => onStatusChange(proposal.id, "draft")}>Revise</DemoGlassButton>
        )}
      </div>
    </motion.div>
  );
}

// ---- Pipeline Sidebar ----
function PipelineSidebar({ proposals }: { proposals: Proposal[] }) {
  const counts: Record<string, number> = {};
  const values: Record<string, number> = {};
  for (const stage of pipelineStages) {
    counts[stage.key] = proposals.filter((p) => p.status === stage.key).length;
    values[stage.key] = proposals.filter((p) => p.status === stage.key).reduce((s, p) => s + p.value, 0);
  }

  const maxValue = Math.max(...Object.values(values), 1);

  return (
    <motion.div variants={demoFadeUp} initial="hidden" animate="visible" className="demo-glass rounded-xl p-4">
      <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4">Pipeline Summary</p>

      {/* Stage rows */}
      <div className="space-y-3 mb-6">
        {pipelineStages.map((stage) => {
          const sc = statusConfig[stage.key] ?? statusConfig.draft;
          const count = counts[stage.key] ?? 0;
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
          const val = values[stage.key] ?? 0;
          const widthPct = maxValue > 0 ? (val / maxValue) * 100 : 0;
          return (
            <div key={stage.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-white/40">{stage.label}</span>
                <span className="text-[10px] font-semibold" style={{ color: stage.color }}>
                  {demoFormatCurrency(val)}
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
          {demoFormatCurrency(Object.values(values).reduce((a, b) => a + b, 0))}
        </span>
      </div>
    </motion.div>
  );
}

// ---- Page ----
export function ProposalsDemo() {
  const [proposals, setProposals] = useState<Proposal[]>(demoProposals as Proposal[]);

  const accepted = proposals.filter((p) => p.status === "accepted");
  const acceptedValue = accepted.reduce((s, p) => s + p.value, 0);
  const sentCount = proposals.filter((p) => p.status === "sent").length;
  const draftCount = proposals.filter((p) => p.status === "draft").length;

  function handleStatusChange(id: string, newStatus: string) {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  }

  return (
    <DemoPageWrapper>
      {/* Header */}
      <DemoPageHeader
        title="Proposals"
        subtitle="Manage and track client proposals through your pipeline"
        icon={FileText}
        color="emerald"
        action={
          <DemoGlassButton variant="primary" icon={FilePlus}>
            New Proposal
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
        <DemoStatCard label="Total Proposals"  value={proposals.length}           icon={FileText} color="emerald" />
        <DemoStatCard label="Sent & Pending"   value={sentCount}                     icon={Send}     color="cyan" />
        <DemoStatCard label="Accepted Value"   value={demoFormatCurrency(acceptedValue)}  icon={DollarSign} color="violet" />
        <DemoStatCard label="Draft"            value={draftCount}                    icon={Edit}     color="amber" />
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">

        {/* Main — proposal cards */}
        <div className="lg:col-span-7">
          <motion.p
            variants={demoFadeUp}
            initial="hidden"
            animate="visible"
            className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4"
          >
            All Proposals
          </motion.p>

          <motion.div
            variants={demoStaggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {proposals.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} onStatusChange={handleStatusChange} />
            ))}
          </motion.div>
        </div>

        {/* Sidebar — pipeline */}
        <div className="lg:col-span-3">
          <motion.p
            variants={demoFadeUp}
            initial="hidden"
            animate="visible"
            className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-4"
          >
            Pipeline
          </motion.p>
          <PipelineSidebar proposals={proposals} />
        </div>
      </div>
    </DemoPageWrapper>
  );
}