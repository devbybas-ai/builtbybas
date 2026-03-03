"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CalendarDays,
  DollarSign,
  Clock,
  Check,
  X,
  RefreshCw,
  ChevronRight,
  User,
  Mail,
  AlignLeft,
  CheckCircle,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { services, appointments } from "@/data/demo-seed";
import {
  demoStaggerContainer,
  demoStaggerItem,
  demoFadeUp,
  demoSprings,
  demoScalePop,
} from "@/lib/demo-motion";
import { cn } from "@/lib/utils";
import { demoFormatDate } from "@/lib/demo-utils";

// ---- Config ----
const serviceColorMap: Record<string, { bg: string; border: string; text: string; chip: string }> = {
  cyan:    { bg: "rgba(0,212,255,0.08)",   border: "rgba(0,212,255,0.3)",   text: "text-cyan-400",    chip: "#00D4FF" },
  violet:  { bg: "rgba(139,92,246,0.08)",  border: "rgba(139,92,246,0.3)",  text: "text-violet-400",  chip: "#8b5cf6" },
  emerald: { bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.3)",  text: "text-emerald-400", chip: "#10b981" },
  amber:   { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.3)",  text: "text-amber-400",   chip: "#f59e0b" },
};

const statusConfig = {
  confirmed: { bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)",  text: "text-emerald-400", label: "Confirmed" },
  pending:   { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  text: "text-amber-400",   label: "Pending" },
  cancelled: { bg: "rgba(244,63,94,0.1)",   border: "rgba(244,63,94,0.3)",   text: "text-rose-400",    label: "Cancelled" },
};

type FilterTab = "All" | "Confirmed" | "Pending" | "Cancelled";
const TABS: FilterTab[] = ["All", "Confirmed", "Pending", "Cancelled"];

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

// Week days for strip (relative to current week from demo date)
const WEEK_DAYS = [
  { label: "Mon", short: "M", dateKey: "2026-03-11" },
  { label: "Tue", short: "T", dateKey: "2026-03-12" },
  { label: "Wed", short: "W", dateKey: "2026-03-13" },
  { label: "Thu", short: "T", dateKey: "2026-03-14" },
  { label: "Fri", short: "F", dateKey: "2026-03-15" },
  { label: "Sat", short: "S", dateKey: "2026-03-16" },
  { label: "Sun", short: "S", dateKey: "2026-03-17" },
];

// ---- Types ----
interface Appointment {
  id: string;
  service: string;
  client: string;
  email: string;
  date: string;
  time: string;
  status: string;
  notes: string;
}

// ---- Appointment Card ----
interface AptCardProps {
  apt: Appointment;
  onChangeStatus: (id: string, status: string) => void;
}

function AptCard({ apt, onChangeStatus }: AptCardProps) {
  const svc = services.find((s) => s.name === apt.service);
  const sc = serviceColorMap[svc?.color ?? "cyan"];
  const st = statusConfig[apt.status as keyof typeof statusConfig];

  return (
    <motion.div
      variants={demoStaggerItem}
      whileHover={{ scale: 1.01, y: -1 }}
      transition={demoSprings.snappy}
      className="demo-glass rounded-xl p-4"
      style={{ borderColor: sc.border }}
    >
      <div className="flex items-start gap-3">
        {/* Time chip */}
        <div
          className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold"
          style={{ background: sc.bg, color: sc.chip }}
        >
          {apt.time}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-white">{apt.service}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.text}`}
              style={{ background: st.bg, border: `1px solid ${st.border}` }}
            >
              {st.label}
            </span>
          </div>
          <p className="text-xs text-white/50">{apt.client} · {apt.email}</p>
          {apt.notes && (
            <p className="text-[10px] text-white/30 mt-1 truncate">{apt.notes}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-white/30">{svc?.duration ?? 60} min</span>
            <span className="text-white/20">·</span>
            <span className="text-[10px] text-white/30">{demoFormatDate(apt.date)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex flex-col gap-1">
          {apt.status === "confirmed" && (
            <DemoGlassButton variant="secondary" size="sm" icon={RefreshCw} onClick={() => onChangeStatus(apt.id, "pending")}>
              Reschedule
            </DemoGlassButton>
          )}
          {apt.status === "pending" && (
            <>
              <DemoGlassButton variant="primary" size="sm" icon={Check} onClick={() => onChangeStatus(apt.id, "confirmed")}>
                Confirm
              </DemoGlassButton>
              <DemoGlassButton variant="danger" size="sm" icon={X} onClick={() => onChangeStatus(apt.id, "cancelled")}>
                Cancel
              </DemoGlassButton>
            </>
          )}
          {apt.status === "cancelled" && (
            <DemoGlassButton variant="ghost" size="sm" icon={RefreshCw} onClick={() => onChangeStatus(apt.id, "pending")}>
              Rebook
            </DemoGlassButton>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---- Page ----
export function BookingDemo() {
  const [allAppointments, setAllAppointments] = useState<Appointment[]>(appointments as Appointment[]);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [activeDay, setActiveDay] = useState("2026-03-11");
  const [selectedService, setSelectedService] = useState(services[0].id);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Appointments count per day
  const aptsPerDay = (dateKey: string) =>
    allAppointments.filter((a) => a.date === dateKey).length;

  // Filter appointments by day and status tab
  const filtered = allAppointments.filter((a) => {
    const dayMatch = a.date === activeDay;
    if (!dayMatch) return false;
    if (activeTab === "All") return true;
    return a.status === activeTab.toLowerCase();
  });

  // Reactive stat values
  const todayCount = allAppointments.filter((a) => a.date === activeDay).length;
  const weekCount = allAppointments.length;
  const pendingCount = allAppointments.filter((a) => a.status === "pending").length;
  const revenueScheduled = allAppointments
    .filter((a) => a.status !== "cancelled")
    .reduce((sum, a) => {
      const svc = services.find((s) => s.name === a.service);
      return sum + (svc?.price ?? 0);
    }, 0);

  function handleChangeStatus(id: string, newStatus: string) {
    setAllAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.time) return;

    const selectedSvcObj = services.find((s) => s.id === selectedService);
    const newApt: Appointment = {
      id: `APT-${String(allAppointments.length + 1).padStart(3, "0")}`,
      service: selectedSvcObj?.name ?? "Strategy Consultation",
      client: formData.name,
      email: formData.email,
      date: formData.date || activeDay,
      time: formData.time,
      status: "pending",
      notes: formData.notes,
    };

    setAllAppointments((prev) => [...prev, newApt]);
    setSubmitted(true);
  };

  const selectedSvc = services.find((s) => s.id === selectedService);

  return (
    <DemoPageWrapper>
      {/* Header */}
      <DemoPageHeader
        title="Booking"
        subtitle="Schedule and manage client appointments"
        icon={Calendar}
        color="emerald"
        action={
          <DemoGlassButton variant="primary" icon={CalendarDays}>
            New Appointment
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
        <DemoStatCard label="Today's Appointments" value={todayCount} icon={Calendar}    color="emerald" />
        <DemoStatCard label="This Week"             value={weekCount} icon={CalendarDays} color="cyan" />
        <DemoStatCard label="Revenue Scheduled"     value={`$${revenueScheduled.toLocaleString()}`} icon={DollarSign} color="violet" />
        <DemoStatCard label="Pending Confirm"       value={pendingCount} icon={Clock}       color="amber" />
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* LEFT — 60% */}
        <div className="lg:col-span-3 space-y-4">

          {/* Week calendar strip */}
          <motion.div variants={demoFadeUp} initial="hidden" animate="visible" className="demo-glass rounded-xl p-4">
            <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-3">Week of Mar 11–17</p>
            <div className="flex gap-2">
              {WEEK_DAYS.map((day) => {
                const count = aptsPerDay(day.dateKey);
                const isActive = activeDay === day.dateKey;
                return (
                  <button
                    key={day.dateKey}
                    onClick={() => setActiveDay(day.dateKey)}
                    className="relative flex-1 flex flex-col items-center py-2.5 rounded-xl transition-colors"
                    style={{
                      background: isActive ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.02)",
                      border: isActive ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent",
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="day-indicator"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: "rgba(16,185,129,0.08)" }}
                        transition={demoSprings.snappy}
                      />
                    )}
                    <span className={cn("relative text-[10px] font-bold uppercase tracking-wider", isActive ? "text-emerald-400" : "text-white/30")}>
                      {day.label}
                    </span>
                    <span className={cn("relative text-base font-bold mt-0.5", isActive ? "text-white" : "text-white/50")}>
                      {parseInt(day.dateKey.split("-")[2])}
                    </span>
                    {/* Dots */}
                    <div className="relative flex gap-0.5 mt-1.5">
                      {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 rounded-full"
                          style={{ background: isActive ? "#10b981" : "rgba(255,255,255,0.2)" }}
                        />
                      ))}
                      {count === 0 && <div className="w-1 h-1" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Filter tabs */}
          <motion.div variants={demoFadeUp} initial="hidden" animate="visible" className="demo-glass rounded-xl p-1 flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative flex-1 text-[10px] font-bold uppercase tracking-wide py-1.5 rounded-lg transition-colors"
                style={{ color: activeTab === tab ? "#10b981" : "rgba(255,255,255,0.3)" }}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="booking-tab"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}
                    transition={demoSprings.snappy}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </motion.div>

          {/* Appointment list */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`${activeTab}-${activeDay}`}
              variants={demoStaggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -4 }}
              className="space-y-3"
            >
              {filtered.length === 0 ? (
                <motion.div variants={demoStaggerItem} className="demo-glass rounded-xl p-8 text-center">
                  <p className="text-white/30 text-sm">No appointments in this category.</p>
                </motion.div>
              ) : (
                filtered.map((apt) => <AptCard key={apt.id} apt={apt} onChangeStatus={handleChangeStatus} />)
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT — 40% */}
        <div className="lg:col-span-2 space-y-4">

          {/* Services panel */}
          <motion.div variants={demoFadeUp} initial="hidden" animate="visible" className="demo-glass rounded-xl p-4">
            <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-3">Services Offered</p>
            <div className="space-y-2">
              {services.map((svc) => {
                const sc = serviceColorMap[svc.color];
                const isSelected = selectedService === svc.id;
                return (
                  <motion.button
                    key={svc.id}
                    whileHover={{ scale: 1.01 }}
                    transition={demoSprings.snappy}
                    onClick={() => setSelectedService(svc.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors"
                    style={{
                      background: isSelected ? sc.bg : "rgba(255,255,255,0.02)",
                      border: isSelected ? `1px solid ${sc.border}` : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: sc.bg }}
                    >
                      <ChevronRight size={14} className={sc.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-semibold", isSelected ? sc.text : "text-white/70")}>{svc.name}</p>
                      <p className="text-[10px] text-white/30">{svc.duration} min</p>
                    </div>
                    <span className="text-sm font-bold text-white/80">${svc.price}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Book form */}
          <motion.div variants={demoFadeUp} initial="hidden" animate="visible" className="demo-glass rounded-xl p-4">
            <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-3">Quick Book</p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  variants={demoScalePop}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center py-8 gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...demoSprings.bouncy, delay: 0.1 }}
                    className="w-14 h-14 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center"
                  >
                    <CheckCircle className="text-emerald-400" size={28} />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-white font-bold">Appointment Requested!</p>
                    <p className="text-white/40 text-xs mt-1">We&apos;ll confirm within 1 business day.</p>
                  </div>
                  <DemoGlassButton variant="secondary" size="sm" onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", date: "", time: "", notes: "" }); }}>
                    Book Another
                  </DemoGlassButton>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {/* Name */}
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
                      <User size={10} /> Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full demo-glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-400/30 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
                      <Mail size={10} /> Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full demo-glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-400/30 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  </div>

                  {/* Service (pre-selected) */}
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mb-1 block">Service</label>
                    <div
                      className="w-full demo-glass rounded-lg px-3 py-2 text-sm text-emerald-400 font-medium"
                      style={{ border: "1px solid rgba(16,185,129,0.2)" }}
                    >
                      {selectedSvc?.name ?? "Select a service"}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
                      <Calendar size={10} /> Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full demo-glass rounded-lg px-3 py-2 text-sm text-white/70 outline-none focus:border-emerald-400/30 transition-colors"
                      style={{ border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
                      <Clock size={10} /> Time
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full demo-glass rounded-lg px-3 py-2 text-sm text-white/70 outline-none focus:border-emerald-400/30 transition-colors bg-transparent"
                      style={{ border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
                    >
                      <option value="" style={{ background: "#0A0A0F" }}>Select a time slot</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t} style={{ background: "#0A0A0F" }}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
                      <AlignLeft size={10} /> Notes (optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any context or questions..."
                      rows={2}
                      className="w-full demo-glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-400/30 transition-colors resize-none"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={demoSprings.snappy}
                    onClick={handleSubmit}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-emerald-900 flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      boxShadow: "0 0 20px rgba(16,185,129,0.3)",
                    }}
                  >
                    <Calendar size={15} />
                    Book Appointment
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </DemoPageWrapper>
  );
}