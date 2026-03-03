"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Phone, MapPin, Clock, Truck, User, CheckCircle, AlertTriangle,
  ChevronRight, DollarSign, Search, History,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoCardHover } from "@/lib/demo-motion";

/* ─── types ─── */
type Urgency = "emergency" | "scheduled" | "callback";
type CallStatus = "queued" | "en-route" | "on-site" | "complete";
type TechStatus = "available" | "on-job" | "off-duty";

interface ServiceCall {
  id: string; address: string; customer: string; phone: string; issue: string;
  urgency: Urgency; assignedTech: string | null; truck: string | null;
  status: CallStatus; scheduledTime: string; estimatedHours: number;
}

interface Technician {
  id: string; name: string; truck: string; status: TechStatus;
  currentCall: string | null; todaysCalls: number;
}

interface AddressHist {
  address: string;
  visits: { date: string; issue: string; tech: string; cost: number }[];
}

/* ─── config ─── */
const URGENCY_CFG: Record<Urgency, { label: string; cls: string }> = {
  emergency: { label: "Emergency", cls: "bg-orange-600/20 text-orange-400" },
  scheduled: { label: "Scheduled", cls: "bg-blue-600/20 text-blue-400" },
  callback: { label: "Callback", cls: "bg-yellow-500/20 text-yellow-400" },
};
const STATUS_STEPS: CallStatus[] = ["queued", "en-route", "on-site", "complete"];
const STATUS_LABELS: Record<CallStatus, string> = { queued: "Queued", "en-route": "En Route", "on-site": "On Site", complete: "Complete" };
const TECH_STATUS_CLS: Record<TechStatus, string> = {
  available: "bg-emerald-400/20 text-emerald-400",
  "on-job": "bg-blue-400/20 text-blue-400",
  "off-duty": "bg-zinc-500/20 text-zinc-400",
};
type Tab = "dispatch" | "techs" | "history";

/* ─── seed data ─── */
const initialCalls: ServiceCall[] = [
  { id: "SC-047", address: "123 Oak St", customer: "Helen Crawford", phone: "(555) 234-8901", issue: "Pipe burst in basement — water everywhere", urgency: "emergency", assignedTech: "Devon", truck: "Truck 1", status: "en-route", scheduledTime: "8:00 AM", estimatedHours: 3 },
  { id: "SC-048", address: "456 Maple Dr", customer: "George Kim", phone: "(555) 345-6789", issue: "Water heater not heating — no hot water", urgency: "scheduled", assignedTech: "Lisa M.", truck: "Truck 3", status: "on-site", scheduledTime: "9:00 AM", estimatedHours: 2 },
  { id: "SC-049", address: "789 Pine Rd", customer: "Amara Obi", phone: "(555) 456-0123", issue: "Garbage disposal jammed", urgency: "scheduled", assignedTech: null, truck: null, status: "queued", scheduledTime: "10:30 AM", estimatedHours: 1 },
  { id: "SC-050", address: "321 Elm Ave", customer: "Frank DiNardo", phone: "(555) 567-2345", issue: "Frozen pipe in crawl space", urgency: "emergency", assignedTech: null, truck: null, status: "queued", scheduledTime: "8:15 AM", estimatedHours: 2 },
  { id: "SC-051", address: "654 Birch Ln", customer: "Sarah Johansson", phone: "(555) 678-3456", issue: "Annual furnace maintenance", urgency: "scheduled", assignedTech: "Marco", truck: "Truck 2", status: "on-site", scheduledTime: "8:30 AM", estimatedHours: 1.5 },
  { id: "SC-052", address: "987 Cedar Ct", customer: "David Patel", phone: "(555) 789-4567", issue: "Toilet running constantly", urgency: "callback", assignedTech: null, truck: null, status: "queued", scheduledTime: "11:00 AM", estimatedHours: 1 },
  { id: "SC-053", address: "147 Spruce Way", customer: "Nancy Wright", phone: "(555) 890-5678", issue: "Kitchen faucet dripping", urgency: "scheduled", assignedTech: null, truck: null, status: "queued", scheduledTime: "1:00 PM", estimatedHours: 1 },
  { id: "SC-054", address: "258 Willow Dr", customer: "Tom & Maria Santos", phone: "(555) 901-6789", issue: "Sewer backup — bad smell", urgency: "emergency", assignedTech: null, truck: null, status: "queued", scheduledTime: "7:45 AM", estimatedHours: 3 },
];

const initialTechs: Technician[] = [
  { id: "T1", name: "Devon", truck: "Truck 1", status: "on-job", currentCall: "SC-047", todaysCalls: 1 },
  { id: "T2", name: "Marco", truck: "Truck 2", status: "on-job", currentCall: "SC-051", todaysCalls: 2 },
  { id: "T3", name: "Lisa M.", truck: "Truck 3", status: "on-job", currentCall: "SC-048", todaysCalls: 1 },
  { id: "T4", name: "Ray", truck: "Truck 4", status: "available", currentCall: null, todaysCalls: 0 },
];

const addressHistories: AddressHist[] = [
  { address: "123 Oak St", visits: [{ date: "2025-03-15", issue: "Water heater install", tech: "Devon", cost: 1800 }, { date: "2025-09-22", issue: "Leaky faucet", tech: "Marco", cost: 250 }] },
  { address: "456 Maple Dr", visits: [{ date: "2025-11-10", issue: "Furnace tune-up", tech: "Lisa M.", cost: 175 }] },
  { address: "654 Birch Ln", visits: [{ date: "2026-01-05", issue: "Frozen pipe repair", tech: "Devon", cost: 450 }] },
];

/* ─── component ─── */
export function DispatchProDemo() {
  const [calls, setCalls] = useState<ServiceCall[]>(initialCalls);
  const [techs, setTechs] = useState<Technician[]>(initialTechs);
  const [activeTab, setActiveTab] = useState<Tab>("dispatch");
  const [toast, setToast] = useState<string | null>(null);
  const [expandedCall, setExpandedCall] = useState<string | null>(null);
  const [addrSearch, setAddrSearch] = useState("");

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); }, []);

  const assignTech = useCallback((callId: string, techName: string) => {
    const tech = techs.find(t => t.name === techName);
    if (!tech) return;
    setCalls(prev => prev.map(c => c.id === callId ? { ...c, assignedTech: techName, truck: tech.truck, status: "en-route" as const } : c));
    setTechs(prev => prev.map(t => t.name === techName ? { ...t, status: "on-job" as const, currentCall: callId, todaysCalls: t.todaysCalls + 1 } : t));
    showToast(`${techName} assigned`);
  }, [techs, showToast]);

  const advanceStatus = useCallback((callId: string) => {
    setCalls(prev => prev.map(c => {
      if (c.id !== callId) return c;
      const idx = STATUS_STEPS.indexOf(c.status);
      if (idx >= STATUS_STEPS.length - 1) return c;
      const next = STATUS_STEPS[idx + 1];
      if (next === "complete") {
        setTechs(pt => pt.map(t => t.currentCall === callId ? { ...t, status: "available" as const, currentCall: null } : t));
        showToast(`${c.id} complete — ${c.assignedTech} available`);
      } else {
        showToast(`${c.id} → ${STATUS_LABELS[next]}`);
      }
      return { ...c, status: next };
    }));
  }, [showToast]);

  const activeCalls = calls.filter(c => c.status !== "complete").length;
  const emergencyCount = calls.filter(c => c.urgency === "emergency" && c.status !== "complete").length;
  const availTechs = techs.filter(t => t.status === "available");
  const filteredHist = addressHistories.filter(h => h.address.toLowerCase().includes(addrSearch.toLowerCase()));

  const tabs: { id: Tab; label: string }[] = [
    { id: "dispatch", label: "Dispatch Board" }, { id: "techs", label: "Tech Status" }, { id: "history", label: "Address History" },
  ];

  return (
    <DemoPageWrapper>
      <DemoPageHeader title="Summit Plumbing & Heating" subtitle="Service Dispatch Board" icon={Wrench} color="blue" />

      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="Active Calls" value={activeCalls} icon={Phone} color="blue" />
        <DemoStatCard label="Emergency" value={emergencyCount} icon={AlertTriangle} color="rose" />
        <DemoStatCard label="Techs Available" value={`${availTechs.length}/${techs.length}`} icon={User} color="emerald" />
        <DemoStatCard label="Revenue Today" value="$2,180" icon={DollarSign} color="amber" />
      </motion.div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${activeTab === tab.id ? "bg-blue-600/30 text-blue-300" : "text-white/40 hover:text-white/60"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "dispatch" && (
          <motion.div key="dispatch" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {STATUS_STEPS.map(status => {
                const col = calls.filter(c => c.status === status);
                const colColor = status === "queued" ? "text-zinc-400" : status === "en-route" ? "text-yellow-400" : status === "on-site" ? "text-blue-400" : "text-emerald-400";
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className={`text-xs font-semibold ${colColor}`}>{STATUS_LABELS[status]}</span>
                      <span className="text-[10px] text-white/30">{col.length}</span>
                    </div>
                    <AnimatePresence mode="popLayout">
                      {col.map(call => {
                        const isEmerg = call.urgency === "emergency" && call.status !== "complete";
                        const hist = addressHistories.find(h => h.address === call.address);
                        const expanded = expandedCall === call.id;
                        return (
                          <motion.div key={call.id} layout variants={demoStaggerItem} initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.9 }}
                            className="demo-glass rounded-lg p-3 space-y-2 cursor-pointer"
                            style={{ border: isEmerg ? "1px solid rgba(234,88,12,0.4)" : "1px solid rgba(255,255,255,0.06)" }}
                            onClick={() => setExpandedCall(expanded ? null : call.id)}>
                            {isEmerg && <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-lg border border-orange-500/40 pointer-events-none" />}
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-white/25">{call.id}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${URGENCY_CFG[call.urgency].cls}`}>{URGENCY_CFG[call.urgency].label}</span>
                            </div>
                            <p className="text-xs font-semibold text-white">{call.customer}</p>
                            <p className="text-[10px] text-white/40 flex items-center gap-1"><MapPin size={9} />{call.address}</p>
                            <p className="text-[10px] text-white/50 leading-snug">{call.issue}</p>
                            <div className="flex items-center gap-2 text-[10px] text-white/30">
                              <span className="flex items-center gap-1"><Clock size={9} />{call.scheduledTime}</span>
                              <span>~{call.estimatedHours}h</span>
                            </div>
                            {call.assignedTech ? (
                              <div className="flex items-center gap-1.5 text-[10px] text-blue-400"><Truck size={9} />{call.truck} — {call.assignedTech}</div>
                            ) : <p className="text-[10px] text-orange-400 font-medium">Unassigned</p>}
                            <div className="flex items-center gap-1.5 pt-1" onClick={e => e.stopPropagation()}>
                              {!call.assignedTech && availTechs.length > 0 && (
                                <select className="demo-glass rounded px-2 py-1 text-[10px] text-white outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                                  defaultValue="" onChange={e => { if (e.target.value) assignTech(call.id, e.target.value); e.target.value = ""; }}>
                                  <option value="" disabled style={{ background: "#0A0A0F" }}>Assign</option>
                                  {availTechs.map(t => <option key={t.id} value={t.name} style={{ background: "#0A0A0F" }}>{t.name} ({t.truck})</option>)}
                                </select>
                              )}
                              {call.assignedTech && call.status !== "complete" && (
                                <DemoGlassButton size="sm" variant="primary" icon={ChevronRight} onClick={() => advanceStatus(call.id)}>
                                  {STATUS_LABELS[STATUS_STEPS[STATUS_STEPS.indexOf(call.status) + 1] ?? "complete"]}
                                </DemoGlassButton>
                              )}
                            </div>
                            <AnimatePresence>
                              {expanded && hist && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                  className="border-t border-white/10 pt-2 mt-1">
                                  <p className="text-[9px] font-semibold text-white/40 uppercase tracking-wide mb-1 flex items-center gap-1"><History size={8} />Address History</p>
                                  {hist.visits.map((v, i) => (
                                    <div key={i} className="flex items-center justify-between text-[10px] text-white/35 py-0.5">
                                      <span>{v.date} — {v.issue}</span><span className="text-white/25">{v.tech} · ${v.cost}</span>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                      {col.length === 0 && <div className="demo-glass rounded-lg p-4 text-center"><p className="text-[10px] text-white/20">No calls</p></div>}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === "techs" && (
          <motion.div key="techs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth}>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {techs.map(tech => {
                const current = tech.currentCall ? calls.find(c => c.id === tech.currentCall) : null;
                return (
                  <motion.div key={tech.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                    className="demo-glass rounded-xl p-4" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/15 flex items-center justify-center"><User size={14} className="text-blue-400" /></div>
                        <div><p className="text-sm font-semibold text-white">{tech.name}</p><p className="text-[10px] text-white/40 flex items-center gap-1"><Truck size={9} />{tech.truck}</p></div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${TECH_STATUS_CLS[tech.status]}`}>{tech.status === "on-job" ? "On Job" : tech.status === "off-duty" ? "Off Duty" : "Available"}</span>
                    </div>
                    {current && (
                      <div className="demo-glass rounded-lg p-2.5 mb-2" style={{ border: "1px solid rgba(37,99,235,0.15)" }}>
                        <p className="text-[10px] text-white/30 mb-0.5">Current Call</p>
                        <p className="text-xs font-medium text-white">{current.customer}</p>
                        <p className="text-[10px] text-white/40">{current.address}</p>
                        <p className="text-[10px] text-blue-400 mt-1">{STATUS_LABELS[current.status]}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-white/30">
                      <span>Today: {tech.todaysCalls} calls</span>
                      {tech.status === "available" && <span className="text-emerald-400 font-medium">Ready</span>}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div key="history" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input type="text" value={addrSearch} onChange={e => setAddrSearch(e.target.value)} placeholder="Search by address..."
                className="w-full demo-glass rounded-lg pl-8 pr-4 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-blue-500/30 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-3">
              {filteredHist.map(hist => (
                <motion.div key={hist.address} variants={demoStaggerItem} className="demo-glass rounded-xl p-4" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2 mb-3"><MapPin size={14} className="text-blue-400" /><p className="text-sm font-semibold text-white">{hist.address}</p></div>
                  {hist.visits.map((v, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="flex items-center gap-3"><span className="text-white/25 font-mono text-[10px]">{v.date}</span><span className="text-white/60">{v.issue}</span></div>
                      <div className="flex items-center gap-3 text-white/30"><span>{v.tech}</span><span className="text-emerald-400">${v.cost.toLocaleString()}</span></div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-blue-600/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">{toast}</motion.div>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
