"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Calendar, AlertTriangle, DollarSign,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoCardHover } from "@/lib/demo-motion";

/* ─── types ─── */
interface PetProfile {
  id: string; name: string; breed: string; weight: number;
  size: "small" | "medium" | "large"; owner: string; ownerPhone: string;
  temperament: string[];
  vaccinations: { name: string; date: string; expires: string }[];
  notes: string;
}

interface GroomingAppt {
  id: string; petId: string; petName: string; groomer: string;
  time: string; service: string; price: number; duration: number;
  status: "scheduled" | "in-progress" | "complete";
}

interface BoardingRes {
  id: string; petId: string; petName: string; kennel: number;
  checkIn: string; checkOut: string;
  status: "reserved" | "checked-in" | "checked-out";
}

/* ─── constants ─── */
const TODAY = "2026-03-03";
const GROOMERS = ["Ava", "Jess", "Sam"];

function vaccineStatus(expires: string): "current" | "expiring" | "expired" {
  const exp = new Date(expires);
  const now = new Date(TODAY);
  const diff = (exp.getTime() - now.getTime()) / 86400000;
  if (diff < 0) return "expired";
  if (diff <= 30) return "expiring";
  return "current";
}

const VAX_COLORS: Record<string, string> = {
  current: "bg-emerald-500/20 text-emerald-400",
  expiring: "bg-amber-500/20 text-amber-400",
  expired: "bg-red-500/20 text-red-400",
};

type Tab = "schedule" | "pets" | "boarding" | "vaccines";

/* ─── seed data ─── */
const pets: PetProfile[] = [
  { id: "PET-001", name: "Biscuit", breed: "Golden Retriever", weight: 65, size: "large", owner: "Sarah Palmer", ownerPhone: "(503) 555-0101", temperament: ["friendly", "loves water"], vaccinations: [{ name: "Rabies", date: "2025-06-15", expires: "2026-06-15" }, { name: "DHPP", date: "2025-08-01", expires: "2026-08-01" }], notes: "Gets excited, needs gentle handler" },
  { id: "PET-002", name: "Luna", breed: "Chihuahua", weight: 6, size: "small", owner: "Carlos Mendez", ownerPhone: "(503) 555-0102", temperament: ["nervous", "snaps when scared"], vaccinations: [{ name: "Rabies", date: "2025-04-10", expires: "2026-04-10" }, { name: "DHPP", date: "2025-04-10", expires: "2026-04-10" }], notes: "Must be muzzled for nail trims" },
  { id: "PET-003", name: "Bear", breed: "Husky", weight: 70, size: "large", owner: "Tom & Amy Fischer", ownerPhone: "(503) 555-0103", temperament: ["pulls on leash", "vocal"], vaccinations: [{ name: "Rabies", date: "2025-01-20", expires: "2026-01-20" }], notes: "Double coat — extra brush time" },
  { id: "PET-004", name: "Mochi", breed: "Shih Tzu", weight: 12, size: "small", owner: "Yuki Tanaka", ownerPhone: "(503) 555-0104", temperament: ["anxious around dryers", "sweet"], vaccinations: [{ name: "Rabies", date: "2025-09-01", expires: "2026-09-01" }, { name: "DHPP", date: "2025-09-01", expires: "2026-09-01" }], notes: "Air dry only — no cage dryer" },
  { id: "PET-005", name: "Diesel", breed: "Pit Bull", weight: 55, size: "medium", owner: "Marcus Greene", ownerPhone: "(503) 555-0105", temperament: ["gentle", "good with other dogs"], vaccinations: [{ name: "Rabies", date: "2025-07-15", expires: "2026-07-15" }, { name: "DHPP", date: "2025-07-15", expires: "2026-07-15" }, { name: "Bordetella", date: "2025-07-15", expires: "2026-01-15" }], notes: "Sensitive skin — oatmeal shampoo" },
  { id: "PET-006", name: "Whiskers", breed: "Persian Cat", weight: 10, size: "small", owner: "Diana Ross", ownerPhone: "(503) 555-0106", temperament: ["hisses at nail trims", "calm otherwise"], vaccinations: [{ name: "Rabies", date: "2025-11-01", expires: "2026-11-01" }, { name: "FVRCP", date: "2025-11-01", expires: "2026-11-01" }], notes: "Cat — separate from dogs" },
  { id: "PET-007", name: "Daisy", breed: "Beagle", weight: 25, size: "medium", owner: "Kevin O'Brien", ownerPhone: "(503) 555-0107", temperament: ["friendly", "food motivated"], vaccinations: [{ name: "Rabies", date: "2025-05-20", expires: "2026-05-20" }, { name: "DHPP", date: "2025-05-20", expires: "2026-05-20" }], notes: "Loves treats — use for cooperation" },
  { id: "PET-008", name: "Tank", breed: "Great Dane", weight: 130, size: "large", owner: "Jennifer & Mike Walsh", ownerPhone: "(503) 555-0108", temperament: ["calm", "gentle giant"], vaccinations: [{ name: "Rabies", date: "2025-03-01", expires: "2026-03-01" }], notes: "Needs large tub" },
];

const initialAppts: GroomingAppt[] = [
  { id: "APT-001", petId: "PET-001", petName: "Biscuit", groomer: "Ava", time: "9:00 AM", service: "Full Groom", price: 75, duration: 90, status: "scheduled" },
  { id: "APT-002", petId: "PET-004", petName: "Mochi", groomer: "Jess", time: "9:30 AM", service: "Bath & Brush", price: 45, duration: 60, status: "in-progress" },
  { id: "APT-003", petId: "PET-005", petName: "Diesel", groomer: "Sam", time: "10:00 AM", service: "Full Groom", price: 65, duration: 75, status: "scheduled" },
  { id: "APT-004", petId: "PET-006", petName: "Whiskers", groomer: "Ava", time: "11:00 AM", service: "Nail Trim", price: 20, duration: 20, status: "scheduled" },
  { id: "APT-005", petId: "PET-007", petName: "Daisy", groomer: "Jess", time: "11:30 AM", service: "Bath & Brush", price: 40, duration: 45, status: "scheduled" },
  { id: "APT-006", petId: "PET-002", petName: "Luna", groomer: "Sam", time: "1:00 PM", service: "Full Groom", price: 35, duration: 60, status: "scheduled" },
];

const initialBoarding: BoardingRes[] = [
  { id: "BRD-001", petId: "PET-001", petName: "Biscuit", kennel: 1, checkIn: "Mar 3", checkOut: "Mar 5", status: "checked-in" },
  { id: "BRD-002", petId: "PET-003", petName: "Bear", kennel: 3, checkIn: "Mar 2", checkOut: "Mar 6", status: "checked-in" },
  { id: "BRD-003", petId: "PET-008", petName: "Tank", kennel: 7, checkIn: "Mar 1", checkOut: "Mar 4", status: "checked-in" },
  { id: "BRD-004", petId: "PET-007", petName: "Daisy", kennel: 5, checkIn: "Mar 4", checkOut: "Mar 7", status: "reserved" },
  { id: "BRD-005", petId: "PET-005", petName: "Diesel", kennel: 9, checkIn: "Mar 5", checkOut: "Mar 8", status: "reserved" },
];

const SIZE_COLORS: Record<string, string> = { small: "bg-violet-400/20 text-violet-300", medium: "bg-amber-500/20 text-amber-300", large: "bg-emerald-500/20 text-emerald-300" };
const BRD_COLORS: Record<string, string> = { reserved: "bg-amber-500/20 text-amber-300", "checked-in": "bg-emerald-500/20 text-emerald-300", "checked-out": "bg-zinc-500/20 text-zinc-400" };

/* ─── component ─── */
export function PawScheduleDemo() {
  const [appts, setAppts] = useState<GroomingAppt[]>(initialAppts);
  const [boarding, setBoarding] = useState<BoardingRes[]>(initialBoarding);
  const [activeTab, setActiveTab] = useState<Tab>("schedule");
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); }, []);

  const advanceAppt = useCallback((id: string) => {
    setAppts(prev => prev.map(a => {
      if (a.id !== id) return a;
      if (a.status === "scheduled") { showToast(`${a.petName} started`); return { ...a, status: "in-progress" as const }; }
      if (a.status === "in-progress") { showToast(`${a.petName} complete`); return { ...a, status: "complete" as const }; }
      return a;
    }));
  }, [showToast]);

  const toggleBoarding = useCallback((id: string) => {
    setBoarding(prev => prev.map(b => {
      if (b.id !== id) return b;
      if (b.status === "reserved") { showToast(`${b.petName} checked in`); return { ...b, status: "checked-in" as const }; }
      if (b.status === "checked-in") { showToast(`${b.petName} checked out`); return { ...b, status: "checked-out" as const }; }
      return b;
    }));
  }, [showToast]);

  const vaccineAlerts = pets.flatMap(p => p.vaccinations.filter(v => vaccineStatus(v.expires) !== "current")).length;
  const kennelsOccupied = boarding.filter(b => b.status === "checked-in").length;
  const revenueToday = appts.filter(a => a.status === "complete").reduce((s, a) => s + a.price, 0);
  const tabs: { id: Tab; label: string }[] = [
    { id: "schedule", label: "Today's Schedule" }, { id: "pets", label: "Pet Profiles" },
    { id: "boarding", label: "Boarding" }, { id: "vaccines", label: "Vaccinations" },
  ];

  return (
    <DemoPageWrapper>
      <DemoPageHeader title="Wagging Tails Pet Spa" subtitle="Grooming & Boarding Manager" icon={Heart} color="violet" />

      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="Today's Appts" value={appts.length} icon={Calendar} color="violet" />
        <DemoStatCard label="Kennels Occupied" value={`${kennelsOccupied}/12`} icon={Heart} color="emerald" />
        <DemoStatCard label="Vaccine Alerts" value={vaccineAlerts} icon={AlertTriangle} color="amber" />
        <DemoStatCard label="Revenue Today" value={`$${revenueToday}`} icon={DollarSign} color="violet" />
      </motion.div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === tab.id ? "bg-violet-500/30 text-violet-300" : "text-white/40 hover:text-white/60"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "schedule" && (
          <motion.div key="schedule" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            {GROOMERS.map(groomer => {
              const ga = appts.filter(a => a.groomer === groomer);
              return (
                <div key={groomer}>
                  <p className="text-xs font-semibold text-violet-300 mb-2">{groomer}</p>
                  <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
                    {ga.map(appt => {
                      const pet = pets.find(p => p.id === appt.petId);
                      return (
                        <motion.div key={appt.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                          className="demo-glass rounded-lg p-3 flex items-center justify-between" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-white">{appt.petName}</p>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${SIZE_COLORS[pet?.size || "medium"]}`}>{pet?.breed}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${appt.status === "complete" ? "bg-emerald-500/20 text-emerald-400" : appt.status === "in-progress" ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-white/40"}`}>{appt.status}</span>
                            </div>
                            <p className="text-[10px] text-white/40">{appt.time} · {appt.service} · ${appt.price} · {appt.duration}min</p>
                            {pet && pet.temperament.length > 0 && (
                              <div className="flex gap-1 mt-1">{pet.temperament.map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300">{t}</span>)}</div>
                            )}
                          </div>
                          {appt.status !== "complete" && (
                            <DemoGlassButton size="sm" variant="primary" onClick={() => advanceAppt(appt.id)}>
                              {appt.status === "scheduled" ? "Start" : "Complete"}
                            </DemoGlassButton>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === "pets" && (
          <motion.div key="pets" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth}>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pets.map(pet => (
                <motion.div key={pet.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                  className="demo-glass rounded-lg p-4 cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  onClick={() => setSelectedPet(selectedPet === pet.id ? null : pet.id)}>
                  <div className="flex items-center justify-between mb-2">
                    <div><p className="text-sm font-bold text-white">{pet.name}</p><p className="text-[10px] text-white/40">{pet.breed} · {pet.weight}lbs</p></div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${SIZE_COLORS[pet.size]}`}>{pet.size}</span>
                  </div>
                  <p className="text-[10px] text-white/40">Owner: {pet.owner}</p>
                  {pet.temperament.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{pet.temperament.map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300">{t}</span>)}</div>}
                  <AnimatePresence>
                    {selectedPet === pet.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <p className="text-[10px] text-white/50 italic">{pet.notes}</p>
                        <p className="text-[9px] text-white/30 uppercase font-semibold">Vaccinations</p>
                        {pet.vaccinations.map(v => {
                          const vs = vaccineStatus(v.expires);
                          return (
                            <div key={v.name} className="flex items-center justify-between text-[10px]">
                              <span className="text-white/60">{v.name}</span>
                              <span className={`px-1.5 py-0.5 rounded-full ${VAX_COLORS[vs]}`}>{vs === "current" ? `Exp ${v.expires}` : vs === "expiring" ? "Expiring Soon" : "EXPIRED"}</span>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {activeTab === "boarding" && (
          <motion.div key="boarding" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth}>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(k => {
                const res = boarding.find(b => b.kennel === k && b.status !== "checked-out");
                return (
                  <motion.div key={k} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                    className={`demo-glass rounded-lg p-3 text-center cursor-pointer ${res ? "border border-violet-500/20" : "border border-white/5 opacity-50"}`}
                    onClick={() => res && toggleBoarding(res.id)}>
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${res ? "bg-violet-500/30 text-violet-300" : "bg-white/5 text-white/30"}`}>{k}</div>
                    <p className="text-[10px] font-semibold text-white mt-1">Kennel {k}</p>
                    {res ? (
                      <>
                        <p className="text-[10px] text-violet-300">{res.petName}</p>
                        <p className="text-[9px] text-white/40">{res.checkIn} — {res.checkOut}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${BRD_COLORS[res.status]}`}>{res.status}</span>
                      </>
                    ) : <p className="text-[10px] text-white/30">Available</p>}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {activeTab === "vaccines" && (
          <motion.div key="vaccines" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth}>
            <div className="demo-glass rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-white/5">
                  <th scope="col" className="text-left p-3 text-white/40 font-medium">Pet</th><th scope="col" className="text-left p-3 text-white/40 font-medium">Vaccine</th>
                  <th scope="col" className="text-left p-3 text-white/40 font-medium">Given</th><th scope="col" className="text-left p-3 text-white/40 font-medium">Expires</th>
                  <th scope="col" className="text-center p-3 text-white/40 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {pets.flatMap(pet => pet.vaccinations.map(v => {
                    const vs = vaccineStatus(v.expires);
                    return (
                      <tr key={`${pet.id}-${v.name}`} className={`border-b border-white/[0.03] ${vs === "expired" ? "bg-red-500/5" : vs === "expiring" ? "bg-amber-500/5" : ""}`}>
                        <td className="p-3 text-white/80">{pet.name}</td><td className="p-3 text-white/60">{v.name}</td>
                        <td className="p-3 text-white/40">{v.date}</td><td className="p-3 text-white/40">{v.expires}</td>
                        <td className="p-3 text-center"><span className={`text-[10px] px-2 py-0.5 rounded-full ${VAX_COLORS[vs]}`}>{vs}</span></td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-violet-500/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">{toast}</motion.div>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
