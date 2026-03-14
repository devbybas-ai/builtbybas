"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, DollarSign, Package, AlertTriangle, TrendingUp,
  X, Search, Gift, Users, CheckCircle,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoCardHover } from "@/lib/demo-motion";

/* ─── types ─── */
interface CandyProduct {
  id: string;
  name: string;
  category: "fudge" | "taffy" | "truffles" | "gummy" | "seasonal" | "bulk";
  priceType: "per-piece" | "per-pound";
  price: number;
  stock: number;
  reorderAt: number;
  emoji: string;
}

interface CartItem {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

interface CandyCustomer {
  id: string;
  name: string;
  frequency: "weekly" | "monthly" | "seasonal";
  favorites: string;
  lastVisit: string;
}

/* ─── constants ─── */
const TAX_RATE = 0.0975;
const CATEGORIES: CandyProduct["category"][] = ["fudge", "taffy", "truffles", "gummy", "seasonal", "bulk"];

/* ─── seed data ─── */
const initialProducts: CandyProduct[] = [
  { id: "CP-001", name: "Fudge Slice", category: "fudge", priceType: "per-piece", price: 3.99, stock: 48, reorderAt: 10, emoji: "\uD83C\uDF6B" },
  { id: "CP-002", name: "Salt Water Taffy (bag)", category: "taffy", priceType: "per-piece", price: 2.49, stock: 85, reorderAt: 20, emoji: "\uD83C\uDF6C" },
  { id: "CP-003", name: "Dark Choc Truffles", category: "truffles", priceType: "per-pound", price: 12.99, stock: 15, reorderAt: 5, emoji: "\uD83C\uDF6B" },
  { id: "CP-004", name: "Gummy Bears (bag)", category: "gummy", priceType: "per-piece", price: 4.49, stock: 62, reorderAt: 15, emoji: "\uD83D\uDC3B" },
  { id: "CP-005", name: "Peanut Brittle", category: "bulk", priceType: "per-pound", price: 8.99, stock: 8, reorderAt: 10, emoji: "\uD83E\uDD5C" },
  { id: "CP-006", name: "Caramel Apples", category: "seasonal", priceType: "per-piece", price: 5.99, stock: 12, reorderAt: 5, emoji: "\uD83C\uDF4E" },
  { id: "CP-007", name: "Rock Candy Sticks", category: "bulk", priceType: "per-piece", price: 1.99, stock: 120, reorderAt: 25, emoji: "\uD83D\uDC8E" },
  { id: "CP-008", name: "Lollipop Bouquet", category: "seasonal", priceType: "per-piece", price: 14.99, stock: 6, reorderAt: 3, emoji: "\uD83C\uDF6D" },
  { id: "CP-009", name: "Sour Worms (bag)", category: "gummy", priceType: "per-piece", price: 3.99, stock: 45, reorderAt: 10, emoji: "\uD83D\uDC1B" },
  { id: "CP-010", name: "Chocolate Bark", category: "truffles", priceType: "per-pound", price: 10.99, stock: 4, reorderAt: 5, emoji: "\uD83C\uDF6B" },
  { id: "CP-011", name: "Jelly Beans (bag)", category: "bulk", priceType: "per-piece", price: 3.49, stock: 55, reorderAt: 15, emoji: "\uD83E\uDED8" },
  { id: "CP-012", name: "Seasonal Sampler Box", category: "seasonal", priceType: "per-piece", price: 24.99, stock: 3, reorderAt: 5, emoji: "\uD83C\uDF81" },
];

const initialCustomers: CandyCustomer[] = [
  { id: "CC-001", name: "Mrs. Patterson", frequency: "monthly", favorites: "2 lbs dark chocolate truffles for bridge club. Always pays cash. Likes pink box.", lastVisit: "2026-02-15" },
  { id: "CC-002", name: "The Webber Kids", frequency: "weekly", favorites: "Gummy bears and sour worms. Dad pays. Max $10.", lastVisit: "2026-03-01" },
  { id: "CC-003", name: "Coach Rodriguez", frequency: "seasonal", favorites: "Team candy bags for end-of-season. ~30 bags mixed.", lastVisit: "2026-02-01" },
  { id: "CC-004", name: "Linda & Earl Hoffman", frequency: "monthly", favorites: "Fudge gift box for their daughter in Seattle. Ships priority.", lastVisit: "2026-02-20" },
];

const FREQ_COLORS: Record<string, string> = {
  weekly: "bg-emerald-500/20 text-emerald-300",
  monthly: "bg-pink-500/20 text-pink-300",
  seasonal: "bg-amber-500/20 text-amber-300",
};

type Tab = "sale" | "catalog" | "gifts" | "customers";

/* ─── component ─── */
export function SweetCounterDemo() {
  const [products, setProducts] = useState<CandyProduct[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("sale");
  const [catFilter, setCatFilter] = useState<CandyProduct["category"] | "all">("all");
  const [giftBox, setGiftBox] = useState<CartItem[]>([]);
  const [custSearch, setCustSearch] = useState("");
  const [dailySales, setDailySales] = useState(847);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const addToCart = useCallback((product: CandyProduct) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + 1, lineTotal: (i.qty + 1) * i.unitPrice } : i);
      return [...prev, { productId: product.id, name: product.name, qty: 1, unitPrice: product.price, lineTotal: product.price }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const completeSale = useCallback(() => {
    if (cart.length === 0) return;
    const sub = cart.reduce((s, i) => s + i.lineTotal, 0);
    const total = sub + sub * TAX_RATE;
    setProducts(prev => prev.map(p => {
      const item = cart.find(i => i.productId === p.id);
      return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
    }));
    setDailySales(prev => prev + Math.round(total * 100) / 100);
    setCart([]);
    showToast(`Sale complete — $${total.toFixed(2)}`);
  }, [cart, showToast]);

  const addToGiftBox = useCallback((product: CandyProduct) => {
    setGiftBox(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + 1, lineTotal: (i.qty + 1) * i.unitPrice } : i);
      return [...prev, { productId: product.id, name: product.name, qty: 1, unitPrice: product.price, lineTotal: product.price }];
    });
  }, []);

  const createGiftBox = useCallback(() => {
    if (giftBox.length === 0) return;
    const itemsTotal = giftBox.reduce((s, i) => s + i.lineTotal, 0);
    setGiftBox([]);
    showToast(`Gift box created — $${(itemsTotal + 5).toFixed(2)}`);
  }, [giftBox, showToast]);

  /* derived */
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock < p.reorderAt).length;
  const subtotal = cart.reduce((s, i) => s + i.lineTotal, 0);
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;
  const filteredProducts = catFilter === "all" ? products : products.filter(p => p.category === catFilter);
  const filteredCustomers = custSearch ? initialCustomers.filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase())) : initialCustomers;
  const giftBoxTotal = giftBox.reduce((s, i) => s + i.lineTotal, 0) + (giftBox.length > 0 ? 5 : 0);

  const tabs: { id: Tab; label: string }[] = [
    { id: "sale", label: "Quick Sale" }, { id: "catalog", label: "Catalog" },
    { id: "gifts", label: "Gift Boxes" }, { id: "customers", label: "Customers" },
  ];

  return (
    <DemoPageWrapper>
      <DemoPageHeader title="Sugar & Spark Candy Co." subtitle="Point of Sale & Inventory" icon={ShoppingBag} color="rose" />

      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="Sales Today" value={`$${dailySales.toLocaleString()}`} icon={DollarSign} color="rose" />
        <DemoStatCard label="Items In Stock" value={totalStock} icon={Package} color="emerald" />
        <DemoStatCard label="Low Stock" value={lowStockCount} icon={AlertTriangle} color="amber" />
        <DemoStatCard label="Top Seller" value="Fudge" icon={TrendingUp} color="rose" />
      </motion.div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${activeTab === tab.id ? "bg-pink-600/30 text-pink-300" : "text-white/40 hover:text-white/60"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "sale" && (
          <motion.div key="sale" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4">
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {products.map(p => {
                const isLow = p.stock < p.reorderAt;
                return (
                  <motion.button key={p.id} variants={demoStaggerItem} whileHover={demoCardHover.hover} whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(p)} className="demo-glass rounded-lg p-3 text-left relative"
                    style={{ border: isLow ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
                    {isLow && <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">Low</motion.span>}
                    <span className="text-xl">{p.emoji}</span>
                    <p className="text-xs font-semibold text-white mt-1">{p.name}</p>
                    <p className="text-[10px] text-white/40">${p.price.toFixed(2)} / {p.priceType === "per-pound" ? "lb" : "ea"}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{p.stock} in stock</p>
                  </motion.button>
                );
              })}
            </motion.div>
            <div className="demo-glass rounded-lg p-4 space-y-3 h-fit" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><ShoppingBag size={14} className="text-pink-400" /> Cart {cart.length > 0 && <span className="text-[10px] text-white/30">({cart.length})</span>}</h3>
              {cart.length === 0 ? <p className="text-xs text-white/30 text-center py-6">Tap a product to add it</p> : (
                <AnimatePresence mode="popLayout">
                  {cart.map(item => (
                    <motion.div key={item.productId} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-none">
                      <div className="flex-1"><p className="text-xs text-white">{item.name}</p><p className="text-[10px] text-white/30">{item.qty} x ${item.unitPrice.toFixed(2)}</p></div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/70">${item.lineTotal.toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.productId)} className="text-white/20 hover:text-rose-400"><X size={12} /></button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              {cart.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-white/10">
                  <div className="flex justify-between text-xs text-white/50"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-xs text-white/50"><span>Tax (9.75%)</span><span>${tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
                  <DemoGlassButton variant="primary" icon={CheckCircle} onClick={completeSale}>Complete Sale</DemoGlassButton>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "catalog" && (
          <motion.div key="catalog" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCatFilter("all")} className={`px-3 py-1 text-[10px] font-medium rounded-full border transition-colors ${catFilter === "all" ? "bg-pink-600/30 text-pink-300 border-pink-500/30" : "text-white/40 border-white/10 hover:text-white/60"}`}>All</button>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCatFilter(cat)} className={`px-3 py-1 text-[10px] font-medium rounded-full border transition-colors capitalize ${catFilter === cat ? "bg-pink-600/30 text-pink-300 border-pink-500/30" : "text-white/40 border-white/10 hover:text-white/60"}`}>{cat}</button>
              ))}
            </div>
            <div className="demo-glass rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-white/5">
                  <th scope="col" className="text-left p-3 text-white/40 font-medium">Product</th><th scope="col" className="text-left p-3 text-white/40 font-medium">Category</th>
                  <th scope="col" className="text-right p-3 text-white/40 font-medium">Price</th><th scope="col" className="text-right p-3 text-white/40 font-medium">Stock</th>
                  <th scope="col" className="text-center p-3 text-white/40 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {filteredProducts.map(p => {
                    const isLow = p.stock < p.reorderAt;
                    return (
                      <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                        <td className="p-3 text-white/80"><span className="mr-2">{p.emoji}</span>{p.name}</td>
                        <td className="p-3 text-white/50 capitalize">{p.category}</td>
                        <td className="p-3 text-right text-white/70">${p.price.toFixed(2)}{p.priceType === "per-pound" ? "/lb" : "/ea"}</td>
                        <td className={`p-3 text-right ${isLow ? "text-amber-400 font-bold" : "text-white/70"}`}>{p.stock}</td>
                        <td className="p-3 text-center">{isLow ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">Low</span> : <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">OK</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "gifts" && (
          <motion.div key="gifts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            <p className="text-xs text-white/40">Select items for the gift box. A $5.00 box fee is added automatically.</p>
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4">
              <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {products.map(p => (
                  <motion.button key={p.id} variants={demoStaggerItem} whileHover={demoCardHover.hover} whileTap={{ scale: 0.95 }}
                    onClick={() => addToGiftBox(p)} className="demo-glass rounded-lg p-3 text-left" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-xl">{p.emoji}</span>
                    <p className="text-xs font-semibold text-white mt-1">{p.name}</p>
                    <p className="text-[10px] text-white/40">${p.price.toFixed(2)}</p>
                  </motion.button>
                ))}
              </motion.div>
              <div className="demo-glass rounded-lg p-4 space-y-3 h-fit" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Gift size={14} className="text-emerald-400" /> Gift Box</h3>
                {giftBox.length === 0 ? <p className="text-xs text-white/30 text-center py-6">Add items to build a gift box</p> : (
                  <>
                    {giftBox.map(item => (
                      <div key={item.productId} className="flex items-center justify-between py-1 border-b border-white/5 last:border-none">
                        <div><p className="text-xs text-white">{item.name}</p><p className="text-[10px] text-white/30">x{item.qty}</p></div>
                        <span className="text-xs text-white/70">${item.lineTotal.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="space-y-1 pt-2 border-t border-white/10">
                      <div className="flex justify-between text-xs text-white/50"><span>Box Fee</span><span>$5.00</span></div>
                      <div className="flex justify-between text-sm font-bold text-white"><span>Total</span><span>${giftBoxTotal.toFixed(2)}</span></div>
                    </div>
                    <DemoGlassButton variant="primary" icon={Gift} onClick={createGiftBox}>Create Gift Box</DemoGlassButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "customers" && (
          <motion.div key="customers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input type="text" value={custSearch} onChange={e => setCustSearch(e.target.value)} placeholder="Search customers..."
                className="w-full demo-glass rounded-lg pl-8 pr-8 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-pink-500/30 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
              {custSearch && <button onClick={() => setCustSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><X size={12} /></button>}
            </div>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
              {filteredCustomers.map(cust => (
                <motion.div key={cust.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                  className="demo-glass rounded-lg p-4" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-500/15 flex items-center justify-center"><Users size={14} className="text-pink-400" /></div>
                      <div><p className="text-sm font-semibold text-white">{cust.name}</p><p className="text-[10px] text-white/40">Last visit: {cust.lastVisit}</p></div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${FREQ_COLORS[cust.frequency]}`}>{cust.frequency}</span>
                  </div>
                  <div className="bg-white/[0.03] rounded-md p-2">
                    <p className="text-[10px] text-white/30 uppercase tracking-wide mb-0.5">Favorites & Notes</p>
                    <p className="text-xs text-white/60">{cust.favorites}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-pink-600/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
