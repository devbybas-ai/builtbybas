"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed, Clock, Flame, CheckCircle, XCircle, Plus, Ban,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoCardHover } from "@/lib/demo-motion";

/* ─── types ─── */
interface DinerTicket {
  id: string;
  table: number;
  server: string;
  items: { name: string; qty: number; mods: string }[];
  status: "new" | "cooking" | "ready";
  timerSeconds: number;
  total: number;
}

interface TableStatus {
  number: number;
  status: "empty" | "occupied" | "needs-busing";
}

interface EightySixItem {
  name: string;
  since: string;
  active: boolean;
}

/* ─── seed data ─── */
const initialTickets: DinerTicket[] = [
  { id: "TKT-001", table: 3, server: "Jenny", items: [{ name: "Eggs Benedict", qty: 2, mods: "" }, { name: "Bacon (extra crispy)", qty: 1, mods: "no onion" }], status: "new", timerSeconds: 135, total: 28.50 },
  { id: "TKT-002", table: 7, server: "Marco", items: [{ name: "Classic Burger", qty: 1, mods: "" }, { name: "Fries", qty: 1, mods: "" }, { name: "Coke", qty: 1, mods: "" }], status: "cooking", timerSeconds: 872, total: 18.75 },
  { id: "TKT-003", table: 12, server: "Jenny", items: [{ name: "Club Sandwich", qty: 1, mods: "" }, { name: "Tomato Soup", qty: 1, mods: "" }], status: "ready", timerSeconds: 720, total: 16.50 },
  { id: "TKT-004", table: 5, server: "Sofia", items: [{ name: "Pancake Stack", qty: 3, mods: "" }, { name: "Coffee", qty: 2, mods: "" }], status: "cooking", timerSeconds: 525, total: 31.00 },
  { id: "TKT-005", table: 2, server: "Marco", items: [{ name: "Caesar Salad", qty: 1, mods: "" }, { name: "Iced Tea", qty: 1, mods: "" }], status: "new", timerSeconds: 30, total: 13.25 },
  { id: "TKT-006", table: 11, server: "Jenny", items: [{ name: "Grilled Cheese", qty: 2, mods: "" }, { name: "Milkshake", qty: 1, mods: "chocolate" }], status: "cooking", timerSeconds: 1090, total: 22.00 },
  { id: "TKT-007", table: 8, server: "Sofia", items: [{ name: "BLT", qty: 1, mods: "" }, { name: "Onion Rings", qty: 1, mods: "" }], status: "new", timerSeconds: 65, total: 14.50 },
  { id: "TKT-008", table: 1, server: "Marco", items: [{ name: "Daily Special", qty: 1, mods: "" }, { name: "Iced Tea", qty: 1, mods: "" }], status: "ready", timerSeconds: 600, total: 15.00 },
];

const initialTables: TableStatus[] = Array.from({ length: 12 }, (_, i) => {
  const num = i + 1;
  const occupied = [2, 3, 5, 7, 8, 11].includes(num);
  const busing = [1, 4, 12].includes(num);
  return { number: num, status: occupied ? "occupied" : busing ? "needs-busing" : "empty" } as TableStatus;
});

const initialEightySixed: EightySixItem[] = [
  { name: "Meatloaf Special", since: "11:00 AM", active: true },
  { name: "Chocolate Cream Pie", since: "1:00 PM", active: true },
];

/* ─── helpers ─── */
function formatTimer(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const STATUS_COLS: DinerTicket["status"][] = ["new", "cooking", "ready"];
const COL_LABELS: Record<string, { label: string; icon: typeof Flame; color: string }> = {
  new: { label: "New", icon: Plus, color: "text-yellow-400" },
  cooking: { label: "Cooking", icon: Flame, color: "text-orange-400" },
  ready: { label: "Ready", icon: CheckCircle, color: "text-emerald-400" },
};
const TABLE_COLORS: Record<string, string> = {
  empty: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  occupied: "bg-red-500/20 text-red-400 border-red-500/20",
  "needs-busing": "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
};

/* ─── component ─── */
export function TicketFlowDemo() {
  const [tickets, setTickets] = useState(initialTickets);
  const [tables, setTables] = useState(initialTables);
  const [eightySixed, setEightySixed] = useState(initialEightySixed);
  const [activeTab, setActiveTab] = useState<"tickets" | "tables" | "86" | "sales">("tickets");
  const [toast, setToast] = useState<string | null>(null);

  /* live timer */
  useEffect(() => {
    const interval = setInterval(() => {
      setTickets((prev) => prev.map((t) => t.status !== "ready" ? { ...t, timerSeconds: t.timerSeconds + 1 } : t));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const advanceTicket = useCallback((id: string) => {
    setTickets((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      if (t.status === "new") return { ...t, status: "cooking" as const };
      if (t.status === "cooking") return { ...t, status: "ready" as const };
      return t;
    }));
    showToast("Ticket updated");
  }, [showToast]);

  const clearTicket = useCallback((id: string) => {
    const ticket = tickets.find((t) => t.id === id);
    if (ticket) {
      setTables((prev) => prev.map((t) => t.number === ticket.table ? { ...t, status: "needs-busing" as const } : t));
    }
    setTickets((prev) => prev.filter((t) => t.id !== id));
    showToast("Ticket cleared");
  }, [tickets, showToast]);

  const busTable = useCallback((num: number) => {
    setTables((prev) => prev.map((t) => t.number === num ? { ...t, status: "empty" as const } : t));
    showToast(`Table ${num} bused`);
  }, [showToast]);

  const toggle86 = useCallback((name: string) => {
    setEightySixed((prev) => prev.map((item) => item.name === name ? { ...item, active: !item.active } : item));
    showToast("86 board updated");
  }, [showToast]);

  /* derived */
  const openTickets = tickets.filter((t) => t.status !== "ready").length;
  const avgTime = tickets.length > 0 ? Math.round(tickets.reduce((s, t) => s + t.timerSeconds, 0) / tickets.length / 60) : 0;
  const active86 = eightySixed.filter((e) => e.active).length;
  const revenueToday = tickets.filter((t) => t.status === "ready").reduce((s, t) => s + t.total, 0) + 1847;

  const viewTabs = [
    { id: "tickets" as const, label: "Ticket Board" },
    { id: "tables" as const, label: "Table Map" },
    { id: "86" as const, label: `86 Board (${active86})` },
    { id: "sales" as const, label: "Sales" },
  ];

  return (
    <DemoPageWrapper>
      <DemoPageHeader title="Rosie's Corner Diner" subtitle="Kitchen Display & Table Manager" icon={UtensilsCrossed} color="rose" />

      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="Open Tickets" value={openTickets} icon={UtensilsCrossed} color="amber" />
        <DemoStatCard label="Avg Time" value={`${avgTime} min`} icon={Clock} color="amber" />
        <DemoStatCard label="86'd Items" value={active86} icon={Ban} color="rose" />
        <DemoStatCard label="Revenue Today" value={`$${revenueToday.toLocaleString()}`} icon={CheckCircle} color="emerald" />
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6 overflow-x-auto">
        {viewTabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === tab.id ? "bg-red-600/30 text-red-300" : "text-white/40 hover:text-white/60"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* TICKET BOARD */}
        {activeTab === "tickets" && (
          <motion.div key="tickets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-3 gap-3">
            {STATUS_COLS.map((status) => {
              const col = tickets.filter((t) => t.status === status);
              const meta = COL_LABELS[status];
              const Icon = meta.icon;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center gap-2 px-1 mb-1">
                    <Icon size={12} className={meta.color} />
                    <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
                    <span className="text-[10px] text-white/30 ml-auto">{col.length}</span>
                  </div>
                  <AnimatePresence mode="popLayout">
                    {col.map((ticket) => {
                      const isLate = ticket.timerSeconds > 900 && ticket.status !== "ready";
                      return (
                        <motion.div key={ticket.id} layout variants={demoStaggerItem} initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.9 }}
                          className={`demo-glass rounded-lg p-3 space-y-2 ${isLate ? "border border-red-500/30" : ""}`}
                          style={!isLate ? { border: "1px solid rgba(255,255,255,0.06)" } : undefined}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-yellow-300">Tbl {ticket.table}</span>
                            <span className="text-[10px] text-white/30">{ticket.server}</span>
                          </div>
                          <div className="space-y-0.5">
                            {ticket.items.map((item, i) => (
                              <p key={i} className="text-[10px] text-white/60">
                                {item.qty}x {item.name} {item.mods && <span className="text-orange-300 italic">({item.mods})</span>}
                              </p>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] flex items-center gap-1 ${isLate ? "text-red-400 animate-pulse" : "text-white/30"}`}>
                              <Clock size={8} /> {formatTimer(ticket.timerSeconds)}
                            </span>
                            <span className="text-[10px] text-white/30">${ticket.total.toFixed(2)}</span>
                          </div>
                          {status === "new" && (
                            <DemoGlassButton size="sm" variant="ghost" icon={Flame} onClick={() => advanceTicket(ticket.id)}>Fire</DemoGlassButton>
                          )}
                          {status === "cooking" && (
                            <DemoGlassButton size="sm" variant="ghost" icon={CheckCircle} onClick={() => advanceTicket(ticket.id)}>Done</DemoGlassButton>
                          )}
                          {status === "ready" && (
                            <DemoGlassButton size="sm" variant="ghost" icon={XCircle} onClick={() => clearTicket(ticket.id)}>Clear</DemoGlassButton>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* TABLE MAP */}
        {activeTab === "tables" && (
          <motion.div key="tables" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {tables.map((table) => (
                <motion.button key={table.number} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => table.status === "needs-busing" ? busTable(table.number) : undefined}
                  className={`demo-glass rounded-xl p-4 text-center border ${TABLE_COLORS[table.status]} ${table.status === "needs-busing" ? "cursor-pointer" : "cursor-default"}`}
                >
                  <p className="text-lg font-bold">{table.number}</p>
                  <p className="text-[10px] capitalize">{table.status.replace("-", " ")}</p>
                </motion.button>
              ))}
            </div>
            <div className="flex gap-4 justify-center text-[10px] text-white/40">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Empty</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Occupied</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Needs Busing</span>
            </div>
          </motion.div>
        )}

        {/* 86 BOARD */}
        {activeTab === "86" && (
          <motion.div key="86" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <p className="text-xs text-white/40 mb-2">Items currently unavailable</p>
            {eightySixed.map((item) => (
              <motion.div key={item.name} variants={demoStaggerItem} className={`demo-glass rounded-lg p-4 flex items-center justify-between ${item.active ? "border border-red-500/20" : "border border-white/5 opacity-50"}`}>
                <div className="flex items-center gap-3">
                  <XCircle size={16} className={item.active ? "text-red-400" : "text-white/20"} />
                  <div>
                    <p className={`text-sm font-medium ${item.active ? "text-red-300 line-through" : "text-white/40"}`}>{item.name}</p>
                    <p className="text-[10px] text-white/30">Since {item.since}</p>
                  </div>
                </div>
                <DemoGlassButton size="sm" variant={item.active ? "primary" : "ghost"} onClick={() => toggle86(item.name)}>
                  {item.active ? "Restock" : "86 Again"}
                </DemoGlassButton>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* SALES SUMMARY */}
        {activeTab === "sales" && (
          <motion.div key="sales" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="demo-glass rounded-lg p-4 space-y-3" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs font-semibold text-white/60">Today&apos;s Top Sellers</p>
              {[
                { name: "Eggs Benedict", qty: 24, rev: 287 },
                { name: "Classic Burger", qty: 18, rev: 197 },
                { name: "Pancake Stack", qty: 15, rev: 134 },
                { name: "Club Sandwich", qty: 12, rev: 107 },
                { name: "Grilled Cheese", qty: 10, rev: 79 },
              ].map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/20 w-4">{i + 1}.</span>
                    <span className="text-xs text-white/70">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-white/40">{item.qty} sold</span>
                    <span className="text-xs text-emerald-400">${item.rev}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-red-600/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
