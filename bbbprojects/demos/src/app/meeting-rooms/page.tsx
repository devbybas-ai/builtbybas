"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  CalendarDays,
  CheckCircle,
  Users,
  X,
  Clock,
  MapPin,
  Wifi,
  Monitor,
  Tv,
  Phone,
  Maximize,
  CalendarPlus,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import GlassButton from "@/components/shared/GlassButton";
import { rooms, bookings } from "@/data/seed";
import { staggerContainer, staggerItem, springs, fadeUp, scalePop } from "@/lib/motion";
import { formatDate } from "@/lib/utils";

// ---- Color config ----
const colorMap: Record<string, { bg: string; border: string; glow: string; text: string; pill: string }> = {
  cyan:    { bg: "rgba(0,212,255,0.08)",  border: "rgba(0,212,255,0.2)",  glow: "rgba(0,212,255,0.15)",  text: "text-cyan-400",    pill: "bg-cyan-400/10 text-cyan-400" },
  violet:  { bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)", glow: "rgba(139,92,246,0.15)", text: "text-violet-400",  pill: "bg-violet-400/10 text-violet-400" },
  emerald: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", glow: "rgba(16,185,129,0.15)", text: "text-emerald-400", pill: "bg-emerald-400/10 text-emerald-400" },
  amber:   { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", glow: "rgba(245,158,11,0.15)", text: "text-amber-400",   pill: "bg-amber-400/10 text-amber-400" },
  rose:    { bg: "rgba(244,63,94,0.08)",  border: "rgba(244,63,94,0.2)",  glow: "rgba(244,63,94,0.15)",  text: "text-rose-400",    pill: "bg-rose-400/10 text-rose-400" },
};

// Demo time: 11:00 AM. Rooms 2 and 5 are "In Use" per spec.
// Booking 2 => roomId "2" (Innovation Lab): 09:00–11:00 → in use at 11:00
// Booking 3 => roomId "3" (Focus Room A): 14:00–15:00 → not in use at 11:00
// Per spec: "Innovation Lab" and "Focus Room A" show In Use.
// We'll treat roomId 2 and 3 as in-use per spec instructions.
const IN_USE_ROOMS = new Set(["2", "3"]);

// Map amenity labels to icons
function AmenityIcon({ label }: { label: string }) {
  const lower = label.toLowerCase();
  if (lower.includes("video") || lower.includes("conf"))  return <Wifi size={10} />;
  if (lower.includes("screen") || lower.includes("display") || lower.includes("4k")) return <Monitor size={10} />;
  if (lower.includes("tv"))       return <Tv size={10} />;
  if (lower.includes("phone"))    return <Phone size={10} />;
  if (lower.includes("light") || lower.includes("premium") || lower.includes("av")) return <Maximize size={10} />;
  return null;
}

interface BookFormData {
  eventName: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string;
  notes: string;
}

const emptyForm: BookFormData = {
  eventName: "",
  date: "",
  startTime: "09:00",
  endTime: "10:00",
  attendees: "",
  notes: "",
};

export default function MeetingRoomsPage() {
  const [bookingRoomId, setBookingRoomId] = useState<string | null>(null);
  const [form, setForm] = useState<BookFormData>(emptyForm);

  const selectedRoom = rooms.find((r) => r.id === bookingRoomId);

  function openModal(roomId: string) {
    setBookingRoomId(roomId);
    setForm(emptyForm);
  }

  function closeModal() {
    setBookingRoomId(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    closeModal();
  }

  // Sort bookings by date then start time
  const sortedBookings = [...bookings].sort((a, b) => {
    const d = a.date.localeCompare(b.date);
    return d !== 0 ? d : a.start.localeCompare(b.start);
  });

  return (
    <PageWrapper>
      {/* Header */}
      <PageHeader
        title="Meeting Rooms"
        subtitle="Book rooms, view availability, manage your space"
        icon={CalendarDays}
        color="violet"
        action={
          <GlassButton variant="primary" icon={CalendarPlus}>
            Book a Room
          </GlassButton>
        }
      />

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      >
        <StatCard label="Total Rooms"     value={6}  icon={Building2}   color="cyan" />
        <StatCard label="Booked Today"    value={3}  icon={CalendarDays} color="violet" />
        <StatCard label="Available Now"   value={3}  icon={CheckCircle} color="emerald" />
        <StatCard label="Total Attendees" value={37} icon={Users}       color="amber" />
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* LEFT: Rooms grid (60%) */}
        <div className="lg:col-span-3">
          <motion.p variants={fadeUp} className="text-xs text-white/30 uppercase tracking-widest mb-3 font-semibold">
            All Rooms
          </motion.p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {rooms.map((room) => {
              const c = colorMap[room.color] ?? colorMap.cyan;
              const inUse = IN_USE_ROOMS.has(room.id);
              return (
                <motion.div
                  key={room.id}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={springs.snappy}
                  className="glass rounded-xl p-4 relative overflow-hidden"
                  style={{ borderColor: c.border }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${c.glow} 0%, transparent 70%)` }}
                  />

                  <div className="relative">
                    {/* Top row: name + status */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-sm font-bold ${c.text}`}>{room.name}</h3>
                      {inUse ? (
                        <span className="badge priority-high text-[9px]">In Use</span>
                      ) : (
                        <span className="badge status-active text-[9px]">Available</span>
                      )}
                    </div>

                    {/* Capacity + floor */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 text-xs text-white/50">
                        <Users size={11} />
                        <span>{room.capacity} people</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/50">
                        <MapPin size={11} />
                        <span>{room.floor}</span>
                      </div>
                    </div>

                    {/* Amenity pills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {room.amenities.map((a) => (
                        <span
                          key={a}
                          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/8"
                        >
                          <AmenityIcon label={a} />
                          {a}
                        </span>
                      ))}
                    </div>

                    {/* Book Now button */}
                    <GlassButton
                      variant={inUse ? "secondary" : "primary"}
                      size="sm"
                      icon={CalendarPlus}
                      onClick={() => openModal(room.id)}
                    >
                      {inUse ? "Schedule" : "Book Now"}
                    </GlassButton>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* RIGHT: Upcoming bookings (40%) */}
        <div className="lg:col-span-2">
          <motion.p variants={fadeUp} className="text-xs text-white/30 uppercase tracking-widest mb-3 font-semibold">
            Upcoming Bookings
          </motion.p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {sortedBookings.map((booking) => {
              const room = rooms.find((r) => r.id === booking.roomId);
              const c = colorMap[room?.color ?? "cyan"];
              return (
                <motion.div
                  key={booking.id}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02, y: -1 }}
                  transition={springs.snappy}
                  className="glass rounded-xl p-3 pl-4 relative overflow-hidden cursor-default"
                  style={{ borderColor: c.border }}
                >
                  {/* Left color bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl"
                    style={{ background: c.border }}
                  />

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{booking.title}</p>
                      <p className={`text-[10px] font-medium mb-1 ${c.text}`}>{booking.roomName}</p>
                      <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <CalendarDays size={9} />
                        <span>{formatDate(booking.date)}</span>
                        <span className="text-white/20">·</span>
                        <Clock size={9} />
                        <span>{booking.start}–{booking.end}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1 text-[10px] text-white/40">
                        <Users size={9} />
                        <span>{booking.attendees}</span>
                      </div>
                      <p className="text-[10px] text-white/30 mt-1">{booking.organizer}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Demo time hint */}
          <motion.div
            variants={fadeUp}
            className="mt-4 glass rounded-xl p-3 flex items-center gap-2"
          >
            <Clock size={12} className="text-cyan-400 flex-shrink-0" />
            <p className="text-[10px] text-white/30">
              Demo time: <span className="text-white/50 font-semibold">11:00 AM</span> — Innovation Lab &amp; Focus Room A show as In Use
            </p>
          </motion.div>
        </div>
      </div>

      {/* ---- Book a Room Modal ---- */}
      <AnimatePresence>
        {bookingRoomId && selectedRoom && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              key="modal"
              variants={scalePop}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={springs.smooth}
              className="fixed bottom-0 left-0 right-0 z-50 md:relative md:inset-auto md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md"
            >
              <div
                className="glass rounded-t-2xl md:rounded-2xl p-6 mx-auto max-w-md w-full"
                style={{ borderColor: colorMap[selectedRoom.color]?.border }}
              >
                {/* Modal header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold text-white">Book a Room</h2>
                    <p className={`text-xs mt-0.5 ${colorMap[selectedRoom.color]?.text}`}>
                      {selectedRoom.name} · {selectedRoom.floor}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Event Name */}
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 font-medium">Event Name</label>
                    <input
                      type="text"
                      required
                      value={form.eventName}
                      onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                      placeholder="e.g. Sprint Planning"
                      className="w-full glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-400/30 transition-colors"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 font-medium">Date</label>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full glass rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/30 transition-colors"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>

                  {/* Time range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-white/40 mb-1.5 font-medium">Start Time</label>
                      <input
                        type="time"
                        required
                        value={form.startTime}
                        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                        className="w-full glass rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/30 transition-colors"
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1.5 font-medium">End Time</label>
                      <input
                        type="time"
                        required
                        value={form.endTime}
                        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                        className="w-full glass rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/30 transition-colors"
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                  </div>

                  {/* Attendees */}
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 font-medium">
                      Attendees <span className="text-white/20">(max {selectedRoom.capacity})</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={selectedRoom.capacity}
                      value={form.attendees}
                      onChange={(e) => setForm({ ...form, attendees: e.target.value })}
                      placeholder={`1–${selectedRoom.capacity}`}
                      className="w-full glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-400/30 transition-colors"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5 font-medium">Notes (optional)</label>
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Any special requirements…"
                      className="w-full glass rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-400/30 transition-colors resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <GlassButton variant="secondary" size="md" onClick={closeModal}>
                      Cancel
                    </GlassButton>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={springs.snappy}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold text-[#0A0A0F] bg-cyan-400 hover:bg-cyan-300 transition-colors"
                    >
                      Confirm Booking
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
