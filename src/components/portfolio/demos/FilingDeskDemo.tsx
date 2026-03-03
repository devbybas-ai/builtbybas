"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Users, AlertTriangle, CheckCircle, ChevronRight, Calendar, DollarSign, Calculator,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoCardHover } from "@/lib/demo-motion";

/* ─── types ─── */
interface TaxClient {
  id: string; name: string;
  returnType: "1040" | "1065" | "1120-S" | "payroll";
  status: "docs-requested" | "docs-received" | "in-prep" | "in-review" | "filed" | "refund-issued";
  preparer: "Ron" | "Joyce"; fee: number;
  documents: { name: string; received: boolean }[];
  filingDate: string | null; refundAmount: number | null;
  priorYear: { agi: number; refund: number; filingDate: string } | null;
}

/* ─── constants ─── */
const STAGES: TaxClient["status"][] = ["docs-requested", "docs-received", "in-prep", "in-review", "filed", "refund-issued"];
const STAGE_LABELS: Record<string, string> = {
  "docs-requested": "Docs Requested", "docs-received": "Docs Received", "in-prep": "In Prep",
  "in-review": "In Review", "filed": "Filed", "refund-issued": "Refund Issued",
};
const STAGE_COLORS: Record<string, string> = {
  "docs-requested": "bg-red-500/20 text-red-400", "docs-received": "bg-amber-500/20 text-amber-400",
  "in-prep": "bg-blue-500/20 text-blue-400", "in-review": "bg-violet-500/20 text-violet-400",
  "filed": "bg-emerald-500/20 text-emerald-400", "refund-issued": "bg-green-500/20 text-green-400",
};
const TYPE_COLORS: Record<string, string> = {
  "1040": "bg-blue-900/30 text-blue-300", "1065": "bg-amber-900/30 text-amber-300",
  "1120-S": "bg-emerald-900/30 text-emerald-300", payroll: "bg-violet-900/30 text-violet-300",
};
const DAYS_TO_APRIL15 = 43;
const FEE_RANGES: Record<string, string> = {
  "1040": "$275 – $400", "1065": "$800 – $900", "1120-S": "$1,200", payroll: "$600",
};

type Tab = "pipeline" | "docs" | "deadline" | "calculator";

/* ─── seed data ─── */
const initialClients: TaxClient[] = [
  { id: "TC-001", name: "Margaret Chen", returnType: "1040", status: "filed", preparer: "Ron", fee: 350, documents: [{ name: "W-2", received: true }, { name: "1099-INT", received: true }, { name: "1098", received: true }], filingDate: "2026-02-15", refundAmount: 2847, priorYear: { agi: 62000, refund: 2340, filingDate: "2025-03-01" } },
  { id: "TC-002", name: "James & Diane Foster", returnType: "1040", status: "in-review", preparer: "Ron", fee: 400, documents: [{ name: "W-2", received: true }, { name: "1099-INT", received: true }, { name: "1098", received: true }], filingDate: null, refundAmount: null, priorYear: { agi: 95000, refund: 1890, filingDate: "2025-02-28" } },
  { id: "TC-003", name: "Eastside Bakery LLC", returnType: "1065", status: "in-prep", preparer: "Joyce", fee: 800, documents: [{ name: "K-1s", received: false }, { name: "Income Statement", received: true }, { name: "Balance Sheet", received: true }, { name: "Bank Statements", received: true }], filingDate: null, refundAmount: null, priorYear: null },
  { id: "TC-004", name: "Robert Washington", returnType: "1040", status: "docs-requested", preparer: "Ron", fee: 300, documents: [{ name: "W-2", received: false }, { name: "1099-NEC", received: false }, { name: "1098", received: true }], filingDate: null, refundAmount: null, priorYear: null },
  { id: "TC-005", name: "Lakewood Dental PC", returnType: "1120-S", status: "docs-received", preparer: "Joyce", fee: 1200, documents: [{ name: "K-1s", received: true }, { name: "Income Statement", received: true }, { name: "Balance Sheet", received: true }, { name: "Bank Statements", received: true }, { name: "Officer Compensation", received: true }], filingDate: null, refundAmount: null, priorYear: null },
  { id: "TC-006", name: "Patricia Gomez", returnType: "1040", status: "filed", preparer: "Ron", fee: 275, documents: [{ name: "W-2", received: true }, { name: "1099-DIV", received: true }], filingDate: "2026-02-20", refundAmount: 1103, priorYear: { agi: 48000, refund: 980, filingDate: "2025-03-15" } },
  { id: "TC-007", name: "Michael Torres", returnType: "payroll", status: "in-prep", preparer: "Joyce", fee: 600, documents: [{ name: "941 Worksheet", received: true }, { name: "Employee Roster", received: true }, { name: "Wage Summary", received: false }], filingDate: null, refundAmount: null, priorYear: null },
  { id: "TC-008", name: "Dawn & Eric Krueger", returnType: "1040", status: "docs-requested", preparer: "Ron", fee: 350, documents: [{ name: "W-2", received: false }, { name: "1099-DIV", received: true }, { name: "1099-INT", received: false }, { name: "1098", received: false }], filingDate: null, refundAmount: null, priorYear: null },
  { id: "TC-009", name: "Bright Horizons Daycare", returnType: "1065", status: "docs-requested", preparer: "Joyce", fee: 900, documents: [{ name: "K-1s", received: false }, { name: "Income Statement", received: false }, { name: "Balance Sheet", received: false }, { name: "Bank Statements", received: false }], filingDate: null, refundAmount: null, priorYear: null },
  { id: "TC-010", name: "Sandra Liu", returnType: "1040", status: "in-review", preparer: "Ron", fee: 325, documents: [{ name: "W-2", received: true }, { name: "1099-NEC", received: true }, { name: "1099-INT", received: true }, { name: "Schedule C Receipts", received: true }], filingDate: null, refundAmount: null, priorYear: { agi: 72000, refund: 1650, filingDate: "2025-04-10" } },
];

/* ─── component ─── */
export function FilingDeskDemo() {
  const [clients, setClients] = useState<TaxClient[]>(initialClients);
  const [activeTab, setActiveTab] = useState<Tab>("pipeline");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [compareId, setCompareId] = useState<string | null>(null);
  const [calcType, setCalcType] = useState<string>("1040");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); }, []);

  const advanceStage = useCallback((id: string) => {
    setClients(prev => prev.map(c => {
      if (c.id !== id) return c;
      const idx = STAGES.indexOf(c.status);
      if (idx >= STAGES.length - 1) return c;
      showToast(`${c.name} → ${STAGE_LABELS[STAGES[idx + 1]]}`);
      return { ...c, status: STAGES[idx + 1] };
    }));
  }, [showToast]);

  const toggleDoc = useCallback((clientId: string, docName: string) => {
    setClients(prev => prev.map(c => c.id !== clientId ? c : {
      ...c, documents: c.documents.map(d => d.name === docName ? { ...d, received: !d.received } : d),
    }));
  }, []);

  /* derived */
  const docsPending = clients.filter(c => c.status === "docs-requested").length;
  const filedCount = clients.filter(c => c.status === "filed" || c.status === "refund-issued").length;
  const filteredClients = stageFilter === "all" ? clients : clients.filter(c => c.status === stageFilter);

  const totalEarned = clients.filter(c => c.status === "filed" || c.status === "refund-issued").reduce((s, c) => s + c.fee, 0);
  const totalPending = clients.filter(c => c.status !== "filed" && c.status !== "refund-issued").reduce((s, c) => s + c.fee, 0);
  const avgFee = Math.round(clients.reduce((s, c) => s + c.fee, 0) / clients.length);

  const tabs: { id: Tab; label: string }[] = [
    { id: "pipeline", label: "Pipeline" }, { id: "docs", label: "Document Tracker" },
    { id: "deadline", label: "Deadline" }, { id: "calculator", label: "Calculator" },
  ];

  return (
    <DemoPageWrapper>
      <DemoPageHeader title="Bridgewater Tax Services" subtitle="Tax Season Client Tracker" icon={FileText} color="blue" />

      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="Total Clients" value={clients.length} icon={Users} color="blue" />
        <DemoStatCard label="Docs Pending" value={docsPending} icon={AlertTriangle} color="rose" />
        <DemoStatCard label="Filed" value={filedCount} icon={CheckCircle} color="emerald" />
        <DemoStatCard label="Days to Apr 15" value={DAYS_TO_APRIL15} icon={Calendar} color={DAYS_TO_APRIL15 < 7 ? "rose" : "amber"} />
      </motion.div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${activeTab === tab.id ? "bg-blue-800/40 text-blue-300" : "text-white/40 hover:text-white/60"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "pipeline" && (
          <motion.div key="pipeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setStageFilter("all")} className={`px-3 py-1 text-[10px] font-medium rounded-full border transition-colors ${stageFilter === "all" ? "bg-blue-800/30 text-blue-300 border-blue-700/40" : "text-white/40 border-white/10"}`}>All ({clients.length})</button>
              {STAGES.map(s => {
                const count = clients.filter(c => c.status === s).length;
                return <button key={s} onClick={() => setStageFilter(s)} className={`px-3 py-1 text-[10px] font-medium rounded-full border transition-colors ${stageFilter === s ? "bg-blue-800/30 text-blue-300 border-blue-700/40" : "text-white/40 border-white/10"}`}>{STAGE_LABELS[s]} ({count})</button>;
              })}
            </div>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
              {filteredClients.map(client => (
                <motion.div key={client.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                  className="demo-glass rounded-lg p-3 flex items-center justify-between" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-white">{client.name}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${TYPE_COLORS[client.returnType]}`}>{client.returnType}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${STAGE_COLORS[client.status]}`}>{STAGE_LABELS[client.status]}</span>
                    </div>
                    <p className="text-[10px] text-white/40">{client.preparer} · ${client.fee}</p>
                    {client.refundAmount && <p className="text-[10px] text-emerald-400">Refund: ${client.refundAmount.toLocaleString()}</p>}
                    {compareId === client.id && client.priorYear && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px]">
                        <div><p className="text-white/30">This Year</p><p className="text-white/60">AGI: ${client.priorYear.agi.toLocaleString()}</p>{client.refundAmount && <p className="text-emerald-400">Refund: ${client.refundAmount.toLocaleString()}</p>}</div>
                        <div><p className="text-white/30">Prior Year</p><p className="text-white/60">AGI: ${client.priorYear.agi.toLocaleString()}</p><p className="text-amber-400">Refund: ${client.priorYear.refund.toLocaleString()}</p></div>
                      </motion.div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {client.priorYear && (client.status === "filed" || client.status === "refund-issued") && (
                      <DemoGlassButton size="sm" variant="ghost" onClick={() => setCompareId(compareId === client.id ? null : client.id)}>YoY</DemoGlassButton>
                    )}
                    {client.status !== "refund-issued" && (
                      <DemoGlassButton size="sm" variant="primary" icon={ChevronRight} onClick={() => advanceStage(client.id)}>Next</DemoGlassButton>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {activeTab === "docs" && (
          <motion.div key="docs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth}>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-3">
              {clients.map(client => {
                const received = client.documents.filter(d => d.received).length;
                const total = client.documents.length;
                const pct = total > 0 ? Math.round((received / total) * 100) : 0;
                return (
                  <motion.div key={client.id} variants={demoStaggerItem} className="demo-glass rounded-lg p-4" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{client.name}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${TYPE_COLORS[client.returnType]}`}>{client.returnType}</span>
                      </div>
                      <span className="text-xs text-white/50">{received}/{total} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 mb-3">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full rounded-full bg-emerald-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {client.documents.map(doc => (
                        <button key={doc.name} onClick={() => toggleDoc(client.id, doc.name)}
                          className={`flex items-center gap-2 text-[10px] p-1.5 rounded ${doc.received ? "text-emerald-400" : "text-red-400"}`}>
                          {doc.received ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                          {doc.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {activeTab === "deadline" && (
          <motion.div key="deadline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className={`demo-glass rounded-xl p-6 text-center ${DAYS_TO_APRIL15 < 7 ? "border border-red-500/30" : "border border-amber-500/20"}`}>
              <p className="text-4xl font-bold text-white">{DAYS_TO_APRIL15}</p>
              <p className={`text-sm font-medium ${DAYS_TO_APRIL15 < 7 ? "text-red-400" : "text-amber-400"}`}>days until April 15, 2026</p>
              <p className="text-xs text-white/40 mt-2">{filedCount}/{clients.length} returns filed</p>
            </motion.div>
            <p className="text-xs text-white/40 font-medium">Unfiled clients (sorted by urgency):</p>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
              {clients.filter(c => c.status !== "filed" && c.status !== "refund-issued")
                .sort((a, b) => STAGES.indexOf(a.status) - STAGES.indexOf(b.status))
                .map(client => (
                  <motion.div key={client.id} variants={demoStaggerItem}
                    className={`demo-glass rounded-lg p-3 flex items-center justify-between ${client.status === "docs-requested" ? "border border-red-500/20" : ""}`}
                    style={{ border: client.status !== "docs-requested" ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                    <div>
                      <p className="text-sm font-bold text-white">{client.name}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${STAGE_COLORS[client.status]}`}>{STAGE_LABELS[client.status]}</span>
                    </div>
                    {client.status === "docs-requested" && <AlertTriangle size={14} className="text-red-400" />}
                  </motion.div>
                ))}
            </motion.div>
          </motion.div>
        )}

        {activeTab === "calculator" && (
          <motion.div key="calc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            <div className="demo-glass rounded-lg p-4 space-y-3" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><Calculator size={14} className="text-blue-400" /> Fee Calculator</h3>
              <div className="flex gap-2">
                {(["1040", "1065", "1120-S", "payroll"] as const).map(t => (
                  <button key={t} onClick={() => setCalcType(t)} className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${calcType === t ? "bg-blue-800/30 text-blue-300 border border-blue-700/40" : "bg-white/5 text-white/40 border border-white/5"}`}>{t}</button>
                ))}
              </div>
              <div className="demo-glass rounded-lg p-4 text-center" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-2xl font-bold text-white">{FEE_RANGES[calcType]}</p>
                <p className="text-xs text-white/40 mt-1">Standard fee for {calcType} returns</p>
              </div>
            </div>
            <div className="demo-glass rounded-lg p-4 space-y-2" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-sm font-bold text-white">Season Totals</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center"><p className="text-lg font-bold text-emerald-400">${totalEarned.toLocaleString()}</p><p className="text-[10px] text-white/40">Earned</p></div>
                <div className="text-center"><p className="text-lg font-bold text-amber-400">${totalPending.toLocaleString()}</p><p className="text-[10px] text-white/40">Pending</p></div>
                <div className="text-center"><p className="text-lg font-bold text-blue-400">${avgFee}</p><p className="text-[10px] text-white/40">Avg Fee</p></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-blue-800/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">{toast}</motion.div>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
