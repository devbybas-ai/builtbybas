"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Users, Calendar, AlertTriangle, CheckCircle, Plus, ChevronDown, ChevronUp,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoCardHover } from "@/lib/demo-motion";

/* ─── types ─── */
interface BkClient {
  id: string;
  name: string;
  contact: string;
  monthlyFee: number;
  lastReconciled: string;
  status: "current" | "overdue" | "new";
}

interface JournalEntry {
  id: string;
  clientId: string;
  date: string;
  account: string;
  description: string;
  debit: number | null;
  credit: number | null;
}

interface Deadline {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  dueDate: string;
  urgency: "overdue" | "this-week" | "upcoming";
  completed: boolean;
}

/* ─── seed data ─── */
const initialClients: BkClient[] = [
  { id: "BK-001", name: "Bloom Botanicals", contact: "Nina Patel", monthlyFee: 400, lastReconciled: "2026-02-28", status: "current" },
  { id: "BK-002", name: "Summit Fitness", contact: "Jorge Morales", monthlyFee: 350, lastReconciled: "2026-01-15", status: "overdue" },
  { id: "BK-003", name: "Atlas Consulting", contact: "Diane Cho", monthlyFee: 200, lastReconciled: "2026-03-01", status: "current" },
  { id: "BK-004", name: "Redwood Dental", contact: "Dr. Amit Shah", monthlyFee: 600, lastReconciled: "2026-02-25", status: "current" },
  { id: "BK-005", name: "Pine & Vine Catering", contact: "Marcus Johnson", monthlyFee: 300, lastReconciled: "", status: "new" },
  { id: "BK-006", name: "Keystone Electric", contact: "Frank DeLuca", monthlyFee: 500, lastReconciled: "2025-12-20", status: "overdue" },
];

const initialEntries: JournalEntry[] = [
  { id: "JE-001", clientId: "BK-001", date: "2026-03-01", account: "Cash", description: "Client payment received", debit: 5000, credit: null },
  { id: "JE-002", clientId: "BK-001", date: "2026-03-01", account: "Revenue", description: "Client payment received", debit: null, credit: 5000 },
  { id: "JE-003", clientId: "BK-001", date: "2026-03-03", account: "Rent Expense", description: "Office rent - March", debit: 1200, credit: null },
  { id: "JE-004", clientId: "BK-001", date: "2026-03-03", account: "Cash", description: "Office rent - March", debit: null, credit: 1200 },
  { id: "JE-005", clientId: "BK-001", date: "2026-03-05", account: "Supplies", description: "Soil & planter supplies", debit: 340, credit: null },
  { id: "JE-006", clientId: "BK-001", date: "2026-03-05", account: "Accounts Payable", description: "Soil & planter supplies", debit: null, credit: 340 },
  { id: "JE-007", clientId: "BK-001", date: "2026-03-08", account: "Accounts Payable", description: "Paid supplier invoice", debit: 340, credit: null },
  { id: "JE-008", clientId: "BK-001", date: "2026-03-08", account: "Cash", description: "Paid supplier invoice", debit: null, credit: 340 },
];

const initialDeadlines: Deadline[] = [
  { id: "DL-001", clientId: "BK-002", clientName: "Summit Fitness", type: "Payroll Tax (941)", dueDate: "2026-03-07", urgency: "overdue", completed: false },
  { id: "DL-002", clientId: "BK-001", clientName: "Bloom Botanicals", type: "Sales Tax Filing", dueDate: "2026-03-15", urgency: "this-week", completed: false },
  { id: "DL-003", clientId: "BK-006", clientName: "Keystone Electric", type: "Quarterly 941", dueDate: "2026-03-15", urgency: "this-week", completed: false },
  { id: "DL-004", clientId: "BK-003", clientName: "Atlas Consulting", type: "Quarterly Filing", dueDate: "2026-03-31", urgency: "upcoming", completed: false },
  { id: "DL-005", clientId: "BK-004", clientName: "Redwood Dental", type: "Payroll Tax (941)", dueDate: "2026-04-30", urgency: "upcoming", completed: false },
];

const URGENCY_COLORS: Record<string, string> = {
  overdue: "bg-red-500/20 text-red-400 border-red-500/20",
  "this-week": "bg-amber-500/20 text-amber-300 border-amber-500/20",
  upcoming: "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
};

/* ─── component ─── */
export function LedgerDeskDemo() {
  const [clients] = useState<BkClient[]>(initialClients);
  const [entries] = useState<JournalEntry[]>(initialEntries);
  const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines);
  const [activeTab, setActiveTab] = useState<"roster" | "ledger" | "deadlines">("roster");
  const [selectedClient, setSelectedClient] = useState<string | null>("BK-001");
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const toggleDeadline = useCallback((id: string) => {
    setDeadlines((prev) => prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d)));
    showToast("Deadline updated");
  }, [showToast]);

  /* derived */
  const overdueRecs = clients.filter((c) => c.status === "overdue").length;
  const monthlyRevenue = clients.reduce((s, c) => s + c.monthlyFee, 0);
  const dueThisWeek = deadlines.filter((d) => !d.completed && (d.urgency === "overdue" || d.urgency === "this-week")).length;

  const clientEntries = entries.filter((e) => e.clientId === selectedClient);
  const totalDebits = clientEntries.reduce((s, e) => s + (e.debit ?? 0), 0);
  const totalCredits = clientEntries.reduce((s, e) => s + (e.credit ?? 0), 0);

  const tabs = [
    { id: "roster" as const, label: "Client Roster" },
    { id: "ledger" as const, label: "General Ledger" },
    { id: "deadlines" as const, label: "Deadlines" },
  ];

  return (
    <DemoPageWrapper>
      <DemoPageHeader title="Clearview Bookkeeping" subtitle="Client Ledger & Deadline Manager" icon={BookOpen} color="blue" />

      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="Active Clients" value={clients.length} icon={Users} color="blue" />
        <DemoStatCard label="Overdue Recs" value={overdueRecs} icon={AlertTriangle} color="rose" />
        <DemoStatCard label="Revenue/Month" value={`$${monthlyRevenue.toLocaleString()}`} icon={BookOpen} color="emerald" />
        <DemoStatCard label="Due This Week" value={dueThisWeek} icon={Calendar} color="amber" />
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${activeTab === tab.id ? "bg-blue-600/30 text-blue-300" : "text-white/40 hover:text-white/60"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* CLIENT ROSTER */}
        {activeTab === "roster" && (
          <motion.div key="roster" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {clients.map((client) => (
              <motion.div key={client.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                className="demo-glass rounded-lg p-4 cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-xs font-bold text-blue-300">
                      {client.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{client.name}</p>
                      <p className="text-[10px] text-white/40">{client.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/60">${client.monthlyFee}/mo</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      client.status === "current" ? "bg-emerald-500/20 text-emerald-300" :
                      client.status === "overdue" ? "bg-red-500/20 text-red-400" :
                      "bg-blue-500/20 text-blue-300"
                    }`}>{client.status}</span>
                    {expandedClient === client.id ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedClient === client.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={demoSprings.smooth} className="overflow-hidden">
                      <div className="pt-3 mt-3 border-t border-white/5 grid grid-cols-2 gap-3 text-[10px]">
                        <div><span className="text-white/30">Last Reconciled</span><p className="text-white/70">{client.lastReconciled || "Never"}</p></div>
                        <div><span className="text-white/30">Monthly Fee</span><p className="text-white/70">${client.monthlyFee}</p></div>
                      </div>
                      <DemoGlassButton size="sm" variant="primary" className="mt-3" onClick={() => { setSelectedClient(client.id); setActiveTab("ledger"); }}>
                        View Ledger
                      </DemoGlassButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* GENERAL LEDGER */}
        {activeTab === "ledger" && (
          <motion.div key="ledger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <select value={selectedClient ?? ""} onChange={(e) => setSelectedClient(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70">
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <DemoGlassButton size="sm" icon={Plus} variant="primary" onClick={() => showToast("Entry added")}>Add Entry</DemoGlassButton>
            </div>
            <div className="demo-glass rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-3 text-white/40 font-medium">Date</th>
                    <th className="text-left p-3 text-white/40 font-medium">Account</th>
                    <th className="text-left p-3 text-white/40 font-medium">Description</th>
                    <th className="text-right p-3 text-emerald-400/60 font-medium">Debit</th>
                    <th className="text-right p-3 text-rose-400/60 font-medium">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {clientEntries.map((entry) => (
                    <motion.tr key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="p-3 text-white/50">{entry.date}</td>
                      <td className="p-3 text-white/70">{entry.account}</td>
                      <td className="p-3 text-white/50">{entry.description}</td>
                      <td className="p-3 text-right text-emerald-400">{entry.debit ? `$${entry.debit.toLocaleString()}` : ""}</td>
                      <td className="p-3 text-right text-rose-400">{entry.credit ? `$${entry.credit.toLocaleString()}` : ""}</td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/10">
                    <td colSpan={3} className="p-3 text-right text-white/40 font-medium">Totals</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">${totalDebits.toLocaleString()}</td>
                    <td className="p-3 text-right text-rose-400 font-bold">${totalCredits.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="p-3 text-center">
                      {totalDebits === totalCredits ? (
                        <span className="text-emerald-400 text-[10px] flex items-center justify-center gap-1"><CheckCircle size={10} /> Balanced</span>
                      ) : (
                        <span className="text-red-400 text-[10px] flex items-center justify-center gap-1"><AlertTriangle size={10} /> Out of balance by ${Math.abs(totalDebits - totalCredits).toLocaleString()}</span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>
        )}

        {/* DEADLINES */}
        {activeTab === "deadlines" && (
          <motion.div key="deadlines" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {deadlines.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((dl) => (
              <motion.div key={dl.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                className={`demo-glass rounded-lg p-4 flex items-center justify-between ${dl.completed ? "opacity-50" : ""}`}
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleDeadline(dl.id)} className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${dl.completed ? "bg-emerald-500/30 border-emerald-500/30" : "border-white/20 hover:border-white/40"}`}>
                    {dl.completed && <CheckCircle size={12} className="text-emerald-400" />}
                  </button>
                  <div>
                    <p className={`text-sm font-medium ${dl.completed ? "line-through text-white/40" : "text-white"}`}>{dl.clientName}</p>
                    <p className="text-[10px] text-white/40">{dl.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50">{dl.dueDate}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${URGENCY_COLORS[dl.urgency]}`}>{dl.urgency}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-blue-600/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
