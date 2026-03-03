"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Star,
  DollarSign,
  XCircle,
  Mail,
  MapPin,
  Phone,
  User,
  Plus,
  X,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import GlassButton from "@/components/shared/GlassButton";
import SearchBar from "@/components/shared/SearchBar";
import { staggerContainer, staggerItem, springs, fadeUp, scalePop } from "@/lib/motion";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { vendors } from "@/data/seed";

const CATEGORY_OPTIONS = [
  "Electronics", "Facilities", "Furniture", "Cloud Services",
  "Office Supplies", "Electrical", "Print & Marketing",
];

const CATEGORIES = ["All", ...CATEGORY_OPTIONS];

const categoryColors: Record<string, string> = {
  Electronics: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  Facilities: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  Furniture: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Cloud Services": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Office Supplies": "text-rose-400 bg-rose-400/10 border-rose-400/20",
  Electrical: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  "Print & Marketing": "text-pink-400 bg-pink-400/10 border-pink-400/20",
};

const STATUS_OPTIONS = ["active", "preferred"] as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={cn(
            "text-sm",
            star <= Math.round(rating) ? "text-amber-400" : "text-white/15"
          )}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-white/40 ml-1">{rating}/5</span>
    </div>
  );
}

interface AddVendorForm {
  name: string; category: string; contact: string;
  email: string; phone: string; city: string;
  status: "active" | "preferred";
}
const EMPTY_FORM: AddVendorForm = {
  name: "", category: "Electronics", contact: "",
  email: "", phone: "", city: "", status: "active",
};

const INPUT_CLS = "w-full glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/30 transition-colors";
const INPUT_STYLE = { border: "1px solid rgba(255,255,255,0.08)" };
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<AddVendorForm>(EMPTY_FORM);

  const filtered = vendors.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.contact.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || v.category === activeCategory;
    return matchSearch && matchCat;
  });

  const preferredCount = vendors.filter((v) => v.status === "preferred").length;
  const inactiveCount = vendors.filter((v) => v.status === "inactive").length;
  const totalSpend = vendors.reduce((s, v) => s + v.totalSpend, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowAddModal(false);
    setForm(EMPTY_FORM);
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Vendor Management"
        subtitle="Preferred suppliers, contacts, and spend tracking"
        icon={Truck}
        color="amber"
        action={
          <GlassButton
            variant="primary"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
          >
            Add Vendor
          </GlassButton>
        }
      />

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <StatCard label="Total Vendors" value={7} icon={Truck} color="amber" />
        <StatCard label="Preferred" value={preferredCount} icon={Star} color="cyan" />
        <StatCard
          label="Total Spend"
          value="$203,800"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard label="Inactive" value={inactiveCount} icon={XCircle} color="rose" />
      </motion.div>

      {/* Search + Category Filter */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search vendors, contacts, cities..."
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={springs.snappy}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                activeCategory === cat
                  ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                  : "bg-white/5 text-white/40 border-white/10 hover:text-white/70 hover:bg-white/8"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Vendor Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((vendor) => {
            const isPreferred = vendor.status === "preferred";
            const isInactive = vendor.status === "inactive";

            return (
              <motion.div
                key={vendor.id}
                variants={staggerItem}
                layout
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={springs.snappy}
                className={cn(
                  "glass rounded-xl p-5 relative overflow-hidden",
                  isInactive && "opacity-60"
                )}
                style={
                  isPreferred
                    ? { borderTop: "2px solid rgba(0,212,255,0.4)" }
                    : undefined
                }
              >
                {/* Inactive overlay chip */}
                {isInactive && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-400/15 text-rose-400 border border-rose-400/20">
                      Inactive
                    </span>
                  </div>
                )}

                {/* Header: Name + Status badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 pr-3">
                    <h3 className="text-lg font-bold text-white truncate">{vendor.name}</h3>
                  </div>
                  {!isInactive && (
                    <div className="flex-shrink-0">
                      {isPreferred ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-400/15 text-cyan-400 border border-cyan-400/30">
                          <Star size={10} className="fill-cyan-400" />
                          Preferred
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                          Active
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Category chip */}
                <div className="mb-4">
                  <span
                    className={cn(
                      "inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      categoryColors[vendor.category] ?? "text-white/50 bg-white/8 border-white/10"
                    )}
                  >
                    {vendor.category}
                  </span>
                </div>

                {/* Contact info */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <User size={11} className="text-white/30 flex-shrink-0" />
                    <span className="font-medium text-white/70">{vendor.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Mail size={11} className="text-white/30 flex-shrink-0" />
                    <span>{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Phone size={11} className="text-white/30 flex-shrink-0" />
                    <span>{vendor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <MapPin size={11} className="text-white/30 flex-shrink-0" />
                    <span>{vendor.city}</span>
                  </div>
                </div>

                {/* Star rating */}
                <div className="mb-4">
                  <StarRating rating={vendor.rating} />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="glass rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <p className="text-xs text-white/30 mb-0.5">Total Spend</p>
                    <p className="text-sm font-bold text-white">
                      {formatCurrency(vendor.totalSpend)}
                    </p>
                  </div>
                  <div className="glass rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <p className="text-xs text-white/30 mb-0.5">Last Order</p>
                    <p className="text-sm font-medium text-white/70">
                      {formatDate(vendor.lastOrder)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <GlassButton variant="ghost" size="sm" icon={Mail}>
                    Contact
                  </GlassButton>
                  <GlassButton variant="secondary" size="sm">
                    View Orders
                  </GlassButton>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-2 text-center py-16 text-white/30 text-sm"
          >
            No vendors match your search.
          </motion.div>
        )}
      </motion.div>

      {/* Add Vendor Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springs.snappy}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddModal(false);
            }}
          >
            <motion.div
              key="modal-panel"
              variants={scalePop}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.92 }}
              className="glass rounded-2xl p-6 w-full max-w-lg"
              style={{ border: "1px solid rgba(245,158,11,0.2)" }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-white">Add Vendor</h2>
                  <p className="text-xs text-white/40 mt-0.5">
                    Add a new supplier to your vendor network
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springs.snappy}
                  onClick={() => setShowAddModal(false)}
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <X size={18} />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Vendor Name">
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Acme Supplies Co." required className={INPUT_CLS} style={INPUT_STYLE} />
                </FormField>
                <FormField label="Category">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={cn(INPUT_CLS, "appearance-none")} style={{ ...INPUT_STYLE, background: "rgba(255,255,255,0.04)" }}>
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c} style={{ background: "#0A0A0F" }}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Contact Name">
                  <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Primary contact" required className={INPUT_CLS} style={INPUT_STYLE} />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Email">
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contact@vendor.com" required className={INPUT_CLS} style={INPUT_STYLE} />
                  </FormField>
                  <FormField label="Phone">
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="555-0000" className={INPUT_CLS} style={INPUT_STYLE} />
                  </FormField>
                </div>
                <FormField label="City">
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Chicago, IL" className={INPUT_CLS} style={INPUT_STYLE} />
                </FormField>
                <FormField label="Status">
                  <div className="flex gap-3">
                    {STATUS_OPTIONS.map((s) => (
                      <label key={s} className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm", form.status === s ? s === "preferred" ? "bg-cyan-400/15 border-cyan-400/30 text-cyan-400" : "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-white/5 border-white/10 text-white/40 hover:text-white/60")}>
                        <input type="radio" name="status" value={s} checked={form.status === s} onChange={() => setForm({ ...form, status: s })} className="hidden" />
                        <span className={cn("w-3 h-3 rounded-full border-2", form.status === s ? s === "preferred" ? "border-cyan-400 bg-cyan-400" : "border-emerald-400 bg-emerald-400" : "border-white/20")} />
                        <span className="capitalize font-medium">{s}</span>
                      </label>
                    ))}
                  </div>
                </FormField>
                <div className="flex gap-3 pt-2">
                  <GlassButton variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1 justify-center">Cancel</GlassButton>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springs.snappy} className="flex-1 py-2 text-sm font-semibold rounded-lg text-amber-950 bg-amber-400 hover:bg-amber-300 transition-colors">
                    Add Vendor
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
