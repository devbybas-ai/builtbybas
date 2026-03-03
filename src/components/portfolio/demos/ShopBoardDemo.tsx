"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Clock, Car, ArrowRight, Plus, Search, X, User, MapPin,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoCardHover } from "@/lib/demo-motion";

/* ─── seed data ─── */
interface WorkOrder {
  id: string;
  vehicle: string;
  plate: string;
  customer: string;
  phone: string;
  status: "checked-in" | "diagnosing" | "parts-ordered" | "in-progress" | "ready";
  bay: number | null;
  tech: string | null;
  customerSaid: string;
  techFound: string;
  parts: { name: string; status: "needed" | "ordered" | "arrived"; cost: number }[];
  laborMinutes: number;
  shopRate: number;
  created: string;
}

const TECHS = ["Mike", "Marco", "Devon"];
const STATUSES: WorkOrder["status"][] = ["checked-in", "diagnosing", "parts-ordered", "in-progress", "ready"];
const STATUS_LABELS: Record<WorkOrder["status"], string> = {
  "checked-in": "Checked In",
  "diagnosing": "Diagnosing",
  "parts-ordered": "Parts Ordered",
  "in-progress": "In Progress",
  "ready": "Ready",
};
const STATUS_COLORS: Record<WorkOrder["status"], string> = {
  "checked-in": "bg-zinc-500/20 text-zinc-300",
  "diagnosing": "bg-amber-500/20 text-amber-300",
  "parts-ordered": "bg-orange-500/20 text-orange-300",
  "in-progress": "bg-blue-500/20 text-blue-300",
  "ready": "bg-emerald-500/20 text-emerald-300",
};

const initialOrders: WorkOrder[] = [
  { id: "WO-001", vehicle: "2018 Ford F-150", plate: "8ABC123", customer: "Dave Kowalski", phone: "(951) 555-0142", status: "checked-in", bay: null, tech: null, customerSaid: "Grinding noise when braking", techFound: "", parts: [{ name: "Front Rotors", status: "needed", cost: 189 }, { name: "Brake Pads", status: "needed", cost: 65 }], laborMinutes: 0, shopRate: 125, created: "2026-03-03" },
  { id: "WO-002", vehicle: "2021 Toyota Camry", plate: "7XYZ789", customer: "Linda Marsh", phone: "(951) 555-0198", status: "diagnosing", bay: 2, tech: "Marco", customerSaid: "AC blowing warm air", techFound: "Compressor clutch not engaging — likely failed clutch", parts: [{ name: "AC Compressor Clutch", status: "ordered", cost: 245 }], laborMinutes: 105, shopRate: 125, created: "2026-03-02" },
  { id: "WO-003", vehicle: "2019 Honda Civic", plate: "6DEF456", customer: "Ray Templeton", phone: "(951) 555-0211", status: "in-progress", bay: 1, tech: "Mike", customerSaid: "Oil change and tire rotation", techFound: "Oil change + rotation. Noted worn wiper blades.", parts: [], laborMinutes: 200, shopRate: 125, created: "2026-03-03" },
  { id: "WO-004", vehicle: "2016 Chevy Silverado", plate: "5GHI012", customer: "Ana Gutierrez", phone: "(951) 555-0234", status: "parts-ordered", bay: null, tech: null, customerSaid: "Engine misfiring at idle", techFound: "Cylinder 3 misfire — ignition coil pack failed", parts: [{ name: "Ignition Coil Pack", status: "ordered", cost: 78 }, { name: "Spark Plugs (set)", status: "arrived", cost: 42 }], laborMinutes: 0, shopRate: 125, created: "2026-03-01" },
  { id: "WO-005", vehicle: "2022 Hyundai Tucson", plate: "4JKL345", customer: "James Whitfield", phone: "(951) 555-0256", status: "ready", bay: 3, tech: "Devon", customerSaid: "Alignment feels off, need new tires", techFound: "Alignment corrected. 4 new tires mounted & balanced.", parts: [{ name: "Tires x4", status: "arrived", cost: 480 }], laborMinutes: 180, shopRate: 125, created: "2026-03-01" },
  { id: "WO-006", vehicle: "2020 Subaru Outback", plate: "3MNO678", customer: "Priya Nair", phone: "(951) 555-0278", status: "checked-in", bay: null, tech: null, customerSaid: "Check engine light is on", techFound: "", parts: [], laborMinutes: 0, shopRate: 125, created: "2026-03-03" },
  { id: "WO-007", vehicle: "2017 BMW 328i", plate: "2PQR901", customer: "Carlos Reyes", phone: "(951) 555-0301", status: "in-progress", bay: 4, tech: "Devon", customerSaid: "Transmission fluid flush", techFound: "Flushing transmission. Fluid was dark — recommend filter replacement.", parts: [{ name: "Trans Filter Kit", status: "arrived", cost: 95 }], laborMinutes: 45, shopRate: 125, created: "2026-03-02" },
];

/* ─── helpers ─── */
function formatMinutes(m: number) {
  const hrs = Math.floor(m / 60);
  const mins = m % 60;
  return `${hrs}:${String(mins).padStart(2, "0")}`;
}

function orderTotal(o: WorkOrder) {
  const partsTotal = o.parts.reduce((s, p) => s + p.cost, 0);
  const laborTotal = (o.laborMinutes / 60) * o.shopRate;
  return partsTotal + laborTotal;
}

/* ─── component ─── */
export function ShopBoardDemo() {
  const [orders, setOrders] = useState<WorkOrder[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeView, setActiveView] = useState<"board" | "bays">("board");
  const [toast, setToast] = useState<string | null>(null);

  /* live timer for in-progress orders */
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.status === "in-progress" || o.status === "diagnosing"
            ? { ...o, laborMinutes: o.laborMinutes + 1 }
            : o,
        ),
      );
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const advanceStatus = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = STATUSES.indexOf(o.status);
        if (idx >= STATUSES.length - 1) return o;
        const next = STATUSES[idx + 1];
        return { ...o, status: next };
      }),
    );
    showToast("Status updated");
  }, [showToast]);

  const assignBay = useCallback((id: string, bay: number) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, bay } : o)));
    showToast(`Assigned to Bay ${bay}`);
  }, [showToast]);

  const assignTech = useCallback((id: string, tech: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, tech } : o)));
    showToast(`Assigned to ${tech}`);
  }, [showToast]);

  /* derived */
  const filtered = search
    ? orders.filter(
        (o) =>
          o.customer.toLowerCase().includes(search.toLowerCase()) ||
          o.vehicle.toLowerCase().includes(search.toLowerCase()) ||
          o.plate.toLowerCase().includes(search.toLowerCase()),
      )
    : orders;

  const inShop = orders.filter((o) => o.status !== "ready").length;
  const partsWaiting = orders.filter((o) => o.status === "parts-ordered").length;
  const readyToday = orders.filter((o) => o.status === "ready").length;
  const revenueToday = orders.filter((o) => o.status === "ready").reduce((s, o) => s + orderTotal(o), 0);

  const bays = [1, 2, 3, 4].map((n) => ({
    number: n,
    order: orders.find((o) => o.bay === n && o.status !== "ready"),
  }));

  return (
    <DemoPageWrapper>
      <DemoPageHeader title="Ironside Motors" subtitle="4-Bay Work Order Board" icon={Wrench} color="amber" action={
        <DemoGlassButton icon={Plus} variant="primary" onClick={() => setShowModal(true)}>New Work Order</DemoGlassButton>
      } />

      {/* Stats */}
      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="In Shop" value={inShop} icon={Car} color="amber" />
        <DemoStatCard label="Parts Waiting" value={partsWaiting} icon={Clock} color="amber" />
        <DemoStatCard label="Ready Today" value={readyToday} icon={Wrench} color="emerald" />
        <DemoStatCard label="Revenue Today" value={`$${revenueToday.toLocaleString()}`} icon={ArrowRight} color="blue" />
      </motion.div>

      {/* Search + View Toggle */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by plate, name, or vehicle..."
            className="w-full demo-glass rounded-lg pl-8 pr-8 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-sky-500/30 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              <X size={12} />
            </button>
          )}
        </div>
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          <button onClick={() => setActiveView("board")} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${activeView === "board" ? "bg-amber-600/30 text-amber-300" : "text-white/40 hover:text-white/60"}`}>Board</button>
          <button onClick={() => setActiveView("bays")} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${activeView === "bays" ? "bg-amber-600/30 text-amber-300" : "text-white/40 hover:text-white/60"}`}>Bays</button>
        </div>
      </div>

      {/* Kanban Board */}
      {activeView === "board" && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {STATUSES.map((status) => {
            const col = filtered.filter((o) => o.status === status);
            return (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}>
                    {STATUS_LABELS[status]}
                  </span>
                  <span className="text-xs text-white/30">{col.length}</span>
                </div>
                <AnimatePresence mode="popLayout">
                  {col.map((order) => (
                    <motion.div
                      key={order.id}
                      layout
                      variants={demoStaggerItem}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={demoCardHover.hover}
                      className="demo-glass rounded-lg p-3 space-y-2 cursor-default"
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{order.vehicle}</p>
                          <p className="text-[10px] text-white/40">{order.plate} · {order.customer}</p>
                        </div>
                        <span className="text-[10px] text-white/20">{order.id}</span>
                      </div>

                      <p className="text-[10px] text-white/50 italic line-clamp-2">
                        {order.techFound || order.customerSaid}
                      </p>

                      {/* Bay + Tech */}
                      <div className="flex items-center gap-2 text-[10px]">
                        {order.bay ? (
                          <span className="flex items-center gap-1 text-amber-400"><MapPin size={8} /> Bay {order.bay}</span>
                        ) : (
                          <select
                            className="bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[10px] text-white/50"
                            value=""
                            onChange={(e) => assignBay(order.id, Number(e.target.value))}
                          >
                            <option value="">Bay?</option>
                            {[1, 2, 3, 4].map((b) => <option key={b} value={b}>Bay {b}</option>)}
                          </select>
                        )}
                        {order.tech ? (
                          <span className="flex items-center gap-1 text-blue-400"><User size={8} /> {order.tech}</span>
                        ) : (
                          <select
                            className="bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[10px] text-white/50"
                            value=""
                            onChange={(e) => assignTech(order.id, e.target.value)}
                          >
                            <option value="">Tech?</option>
                            {TECHS.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        )}
                      </div>

                      {/* Timer + Parts */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] flex items-center gap-1 ${order.laborMinutes > 180 ? "text-red-400 animate-pulse" : "text-white/30"}`}>
                          <Clock size={8} /> {formatMinutes(order.laborMinutes)}
                        </span>
                        {order.parts.length > 0 && (
                          <span className="text-[10px] text-orange-400">
                            {order.parts.filter((p) => p.status === "arrived").length}/{order.parts.length} parts
                          </span>
                        )}
                      </div>

                      {/* Advance */}
                      {status !== "ready" && (
                        <DemoGlassButton size="sm" variant="ghost" icon={ArrowRight} onClick={() => advanceStatus(order.id)}>
                          {status === "in-progress" ? "Mark Ready" : "Next"}
                        </DemoGlassButton>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Bay Grid View */}
      {activeView === "bays" && (
        <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {bays.map((bay) => (
            <motion.div
              key={bay.number}
              variants={demoStaggerItem}
              className={`demo-glass rounded-xl p-4 text-center space-y-2 ${bay.order ? "border border-amber-500/20" : "border border-white/5 opacity-50"}`}
            >
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${bay.order ? "bg-amber-600/30 text-amber-300" : "bg-white/5 text-white/30"}`}>
                {bay.number}
              </div>
              <p className="text-xs font-semibold text-white">Bay {bay.number}</p>
              {bay.order ? (
                <>
                  <p className="text-[10px] text-amber-300">{bay.order.vehicle}</p>
                  <p className="text-[10px] text-white/40">{bay.order.tech || "Unassigned"}</p>
                  <p className="text-[10px] text-white/30">
                    <Clock size={8} className="inline mr-1" />
                    {formatMinutes(bay.order.laborMinutes)}
                  </p>
                </>
              ) : (
                <p className="text-[10px] text-white/30">Empty</p>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* New Work Order Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={demoSprings.smooth}
              className="demo-glass rounded-2xl p-6 w-full max-w-md space-y-4"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-white">New Work Order</h3>
              <div className="space-y-3">
                {["Vehicle (Year Make Model)", "License Plate", "Customer Name", "Phone", "Customer Complaint"].map((label) => (
                  <div key={label}>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider">{label}</label>
                    <input className="w-full demo-glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none mt-1" style={{ border: "1px solid rgba(255,255,255,0.08)" }} placeholder={label} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <DemoGlassButton variant="ghost" onClick={() => setShowModal(false)}>Cancel</DemoGlassButton>
                <DemoGlassButton variant="primary" icon={Plus} onClick={() => { setShowModal(false); showToast("Work order created"); }}>Create</DemoGlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-amber-600/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
