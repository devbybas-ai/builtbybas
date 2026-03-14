"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store, ShoppingCart, AlertTriangle, DollarSign, Search, X, Truck, Users, CheckCircle,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoCardHover } from "@/lib/demo-motion";

/* ─── types ─── */
interface StoreItem {
  id: string;
  name: string;
  aisle: "1-produce" | "2-dairy" | "3-pantry" | "4-household" | "5-prepared";
  price: number;
  cost: number;
  stock: number;
  expiresOn: string | null;
  reorderDay: string;
}

interface CustomerTab {
  id: string;
  name: string;
  balance: number;
  items: { name: string; amount: number; date: string }[];
  notes: string;
}

interface DeliveryLog {
  id: string;
  vendor: string;
  date: string;
  items: { name: string; qty: number; cost: number }[];
}

/* ─── constants ─── */
const TODAY = "2026-03-03";
const AISLES = ["all", "1-produce", "2-dairy", "3-pantry", "4-household", "5-prepared"] as const;
const AISLE_LABELS: Record<string, string> = { "all": "All", "1-produce": "Produce", "2-dairy": "Dairy", "3-pantry": "Pantry", "4-household": "Household", "5-prepared": "Prepared" };

function isExpiring(date: string | null): boolean {
  if (!date) return false;
  const d = new Date(date);
  const t = new Date(TODAY);
  const diff = (d.getTime() - t.getTime()) / 86400000;
  return diff <= 3;
}

/* ─── seed data ─── */
const initialItems: StoreItem[] = [
  { id: "SI-01", name: "Tortillas", aisle: "3-pantry", price: 2.49, cost: 1.20, stock: 45, expiresOn: "2026-03-10", reorderDay: "Tuesday" },
  { id: "SI-02", name: "Eggs (dozen)", aisle: "2-dairy", price: 3.99, cost: 2.50, stock: 18, expiresOn: "2026-03-12", reorderDay: "Monday" },
  { id: "SI-03", name: "Milk (gallon)", aisle: "2-dairy", price: 4.49, cost: 3.00, stock: 12, expiresOn: "2026-03-08", reorderDay: "Monday" },
  { id: "SI-04", name: "Bread", aisle: "3-pantry", price: 3.29, cost: 1.80, stock: 20, expiresOn: "2026-03-07", reorderDay: "Wednesday" },
  { id: "SI-05", name: "Rice (5lb)", aisle: "3-pantry", price: 5.99, cost: 3.50, stock: 30, expiresOn: null, reorderDay: "Tuesday" },
  { id: "SI-06", name: "Beans (can)", aisle: "3-pantry", price: 1.29, cost: 0.65, stock: 60, expiresOn: null, reorderDay: "Tuesday" },
  { id: "SI-07", name: "Ground Beef (lb)", aisle: "2-dairy", price: 6.99, cost: 4.50, stock: 8, expiresOn: "2026-03-06", reorderDay: "Monday" },
  { id: "SI-08", name: "Avocados (each)", aisle: "1-produce", price: 1.49, cost: 0.80, stock: 25, expiresOn: "2026-03-05", reorderDay: "Wednesday" },
  { id: "SI-09", name: "Tomatoes (lb)", aisle: "1-produce", price: 2.99, cost: 1.50, stock: 15, expiresOn: "2026-03-09", reorderDay: "Wednesday" },
  { id: "SI-10", name: "Dish Soap", aisle: "4-household", price: 3.49, cost: 1.75, stock: 22, expiresOn: null, reorderDay: "Friday" },
  { id: "SI-11", name: "Paper Towels", aisle: "4-household", price: 4.99, cost: 2.50, stock: 18, expiresOn: null, reorderDay: "Friday" },
  { id: "SI-12", name: "Breakfast Tacos (3-pack)", aisle: "5-prepared", price: 4.99, cost: 2.00, stock: 8, expiresOn: "2026-03-04", reorderDay: "Daily" },
  { id: "SI-13", name: "Tamales (dozen)", aisle: "5-prepared", price: 12.99, cost: 6.00, stock: 4, expiresOn: "2026-03-05", reorderDay: "Daily" },
  { id: "SI-14", name: "Hot Sauce", aisle: "3-pantry", price: 2.99, cost: 1.25, stock: 35, expiresOn: null, reorderDay: "Tuesday" },
  { id: "SI-15", name: "Coffee (bag)", aisle: "3-pantry", price: 8.99, cost: 5.00, stock: 10, expiresOn: null, reorderDay: "Tuesday" },
];

const initialTabs: CustomerTab[] = [
  { id: "CT-01", name: "Maria Salinas", balance: 14.50, items: [{ name: "Bread", amount: 3.29, date: "Mar 1" }, { name: "Eggs", amount: 3.99, date: "Mar 1" }, { name: "Milk", amount: 4.49, date: "Mar 2" }, { name: "Tortillas", amount: 2.73, date: "Mar 2" }], notes: "Picks up bread every Tuesday" },
  { id: "CT-02", name: "Old Mr. Chen", balance: 8.00, items: [{ name: "Rice", amount: 5.99, date: "Feb 28" }, { name: "Hot Sauce", amount: 2.01, date: "Feb 28" }], notes: "Always pays on the 1st" },
  { id: "CT-03", name: "The Ruiz Family", balance: 32.75, items: [{ name: "Tamales", amount: 12.99, date: "Mar 1" }, { name: "Ground Beef", amount: 6.99, date: "Mar 1" }, { name: "Eggs", amount: 3.99, date: "Mar 1" }, { name: "Misc items", amount: 8.78, date: "Mar 2" }], notes: "Big family, settle weekly" },
  { id: "CT-04", name: "Pastor Williams", balance: 0, items: [], notes: "Paid up — buys coffee every Sunday" },
];

const deliveries: DeliveryLog[] = [
  { id: "DL-01", vendor: "Sysco", date: "Mar 5 (Wed)", items: [{ name: "Eggs", qty: 5, cost: 12.50 }, { name: "Milk", qty: 8, cost: 24.00 }, { name: "Ground Beef", qty: 10, cost: 45.00 }] },
  { id: "DL-02", vendor: "Local Bakery", date: "Mar 3 (Mon)", items: [{ name: "Bread", qty: 20, cost: 36.00 }, { name: "Tortillas", qty: 30, cost: 36.00 }] },
  { id: "DL-03", vendor: "Produce Co-op", date: "Mar 7 (Fri)", items: [{ name: "Avocados", qty: 40, cost: 32.00 }, { name: "Tomatoes", qty: 20, cost: 30.00 }] },
];

type Tab = "register" | "inventory" | "tabs" | "deliveries";

/* ─── component ─── */
export function CornerKeepDemo() {
  const [items] = useState<StoreItem[]>(initialItems);
  const [customerTabs, setCustomerTabs] = useState<CustomerTab[]>(initialTabs);
  const [activeTab, setActiveTab] = useState<Tab>("register");
  const [aisleFilter, setAisleFilter] = useState<string>("all");
  const [registerItems, setRegisterItems] = useState<{ name: string; price: number }[]>([]);
  const [search, setSearch] = useState("");
  const [dailySales, setDailySales] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const addToRegister = useCallback((item: StoreItem) => {
    setRegisterItems(prev => [...prev, { name: item.name, price: item.price }]);
  }, []);

  const ringUp = useCallback(() => {
    if (registerItems.length === 0) return;
    const total = registerItems.reduce((s, i) => s + i.price, 0);
    setDailySales(prev => prev + total);
    setRegisterItems([]);
    showToast(`Sale: $${total.toFixed(2)}`);
  }, [registerItems, showToast]);

  const payTab = useCallback((tabId: string) => {
    setCustomerTabs(prev => prev.map(t => t.id === tabId ? { ...t, balance: 0, items: [] } : t));
    showToast("Tab paid in full");
  }, [showToast]);

  /* derived */
  const expiringCount = items.filter(i => isExpiring(i.expiresOn)).length;
  const totalTabBalance = customerTabs.reduce((s, t) => s + t.balance, 0);
  const registerTotal = registerItems.reduce((s, i) => s + i.price, 0);

  const searchedItems = items.filter(i => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    const matchAisle = aisleFilter === "all" || i.aisle === aisleFilter;
    return matchSearch && matchAisle;
  });

  const tabsList: { id: Tab; label: string }[] = [
    { id: "register", label: "Register" }, { id: "inventory", label: "Inventory" },
    { id: "tabs", label: "Customer Tabs" }, { id: "deliveries", label: "Deliveries" },
  ];

  return (
    <DemoPageWrapper>
      <DemoPageHeader title="Hernandez Family Market" subtitle="Inventory & Register" icon={Store} color="amber" />

      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="Total Items" value={items.length} icon={Store} color="amber" />
        <DemoStatCard label="Expiring Soon" value={expiringCount} icon={AlertTriangle} color="rose" />
        <DemoStatCard label="Tab Balance" value={`$${totalTabBalance.toFixed(2)}`} icon={Users} color="amber" />
        <DemoStatCard label="Today's Sales" value={`$${dailySales.toFixed(2)}`} icon={DollarSign} color="emerald" />
      </motion.div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6">
        {tabsList.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${activeTab === tab.id ? "bg-orange-700/30 text-orange-300" : "text-white/40 hover:text-white/60"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "register" && (
          <motion.div key="register" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..."
                  className="w-full demo-glass rounded-lg pl-8 pr-8 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-sky-500/30 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
                {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><X size={12} /></button>}
              </div>
              <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {searchedItems.map(item => (
                  <motion.button key={item.id} variants={demoStaggerItem} whileHover={demoCardHover.hover} whileTap={{ scale: 0.95 }}
                    onClick={() => addToRegister(item)} className="demo-glass rounded-lg p-3 text-left" style={{ border: isExpiring(item.expiresOn) ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-xs font-semibold text-white">{item.name}</p>
                    <p className="text-[10px] text-white/40">${item.price.toFixed(2)}</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30">{AISLE_LABELS[item.aisle]}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
            <div className="demo-glass rounded-lg p-4 space-y-3 h-fit" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><ShoppingCart size={14} className="text-orange-400" /> Register</h3>
              {registerItems.length === 0 ? <p className="text-xs text-white/30 text-center py-6">Click items to add</p> : (
                <>
                  {registerItems.map((item, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-white/5 text-xs">
                      <span className="text-white/70">{item.name}</span>
                      <span className="text-white/50">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                    <span>Total</span><span>${registerTotal.toFixed(2)}</span>
                  </div>
                  <DemoGlassButton variant="primary" icon={CheckCircle} onClick={ringUp}>Ring Up (Cash)</DemoGlassButton>
                </>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "inventory" && (
          <motion.div key="inventory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {AISLES.map(a => (
                <button key={a} onClick={() => setAisleFilter(a)} className={`px-3 py-1 text-[10px] font-medium rounded-full border transition-colors ${aisleFilter === a ? "bg-orange-700/30 text-orange-300 border-orange-700/40" : "text-white/40 border-white/10 hover:text-white/60"}`}>
                  {AISLE_LABELS[a]}
                </button>
              ))}
            </div>
            <div className="demo-glass rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-white/5">
                  <th scope="col" className="text-left p-3 text-white/40 font-medium">Item</th><th scope="col" className="text-left p-3 text-white/40 font-medium">Aisle</th>
                  <th scope="col" className="text-right p-3 text-white/40 font-medium">Price</th><th scope="col" className="text-right p-3 text-white/40 font-medium">Margin</th>
                  <th scope="col" className="text-right p-3 text-white/40 font-medium">Stock</th><th scope="col" className="text-right p-3 text-white/40 font-medium">Expires</th>
                </tr></thead>
                <tbody>
                  {searchedItems.map(item => {
                    const margin = ((item.price - item.cost) / item.price * 100).toFixed(1);
                    const expiring = isExpiring(item.expiresOn);
                    return (
                      <tr key={item.id} className={`border-b border-white/[0.03] ${expiring ? "bg-red-500/5" : "hover:bg-white/[0.02]"}`}>
                        <td className="p-3 text-white/80">{item.name}</td>
                        <td className="p-3"><span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/40">{AISLE_LABELS[item.aisle]}</span></td>
                        <td className="p-3 text-right text-white/70">${item.price.toFixed(2)}</td>
                        <td className="p-3 text-right text-emerald-400">{margin}%</td>
                        <td className="p-3 text-right text-white/70">{item.stock}</td>
                        <td className={`p-3 text-right ${expiring ? "text-red-400 font-bold" : "text-white/40"}`}>{item.expiresOn || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "tabs" && (
          <motion.div key="tabs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth}>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-3">
              {customerTabs.map(tab => (
                <motion.div key={tab.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                  className="demo-glass rounded-lg p-4 space-y-2" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm font-bold text-white">{tab.name}</p><p className="text-[10px] text-white/40 italic">{tab.notes}</p></div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${tab.balance > 0 ? "text-orange-400" : "text-emerald-400"}`}>${tab.balance.toFixed(2)}</span>
                      {tab.balance > 0 && <DemoGlassButton size="sm" variant="primary" onClick={() => payTab(tab.id)}>Pay</DemoGlassButton>}
                    </div>
                  </div>
                  {tab.items.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-white/5">
                      {tab.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-[11px]">
                          <span className="text-white/50">{item.name} · {item.date}</span>
                          <span className="text-white/40">${item.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {activeTab === "deliveries" && (
          <motion.div key="deliveries" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth}>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-3">
              {deliveries.map(del => {
                const total = del.items.reduce((s, i) => s + i.cost, 0);
                return (
                  <motion.div key={del.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                    className="demo-glass rounded-lg p-4 space-y-2" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><Truck size={14} className="text-orange-400" /><p className="text-sm font-bold text-white">{del.vendor}</p></div>
                      <span className="text-[10px] text-white/40">{del.date}</span>
                    </div>
                    <div className="space-y-1">
                      {del.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-[11px]">
                          <span className="text-white/50">{item.name} x{item.qty}</span>
                          <span className="text-white/40">${item.cost.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end text-xs font-bold text-white pt-1 border-t border-white/5">Total: ${total.toFixed(2)}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-orange-700/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
