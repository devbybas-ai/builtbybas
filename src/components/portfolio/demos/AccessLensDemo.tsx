"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Users, Shield, BookOpen, CheckCircle,
  ChevronDown, ChevronUp, Sparkles,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoCardHover } from "@/lib/demo-motion";
import { cn } from "@/lib/utils";

/* ─── types ─── */
interface LearnerProfile {
  id: string;
  name: string;
  grade: string;
  planType: "IEP" | "504" | "informal";
  accommodations: string[];
  strengths: string[];
  interests: string[];
  teachers: string[];
  udlStrategies: { representation: string[]; engagement: string[]; action: string[] };
}

interface TeacherRecord {
  id: string;
  name: string;
  subject: string;
  studentsWithAccommodations: string[];
  implementationLog: { learnerId: string; accommodation: string; documented: boolean; date: string }[];
}

interface UDLStrategy {
  id: string;
  principle: "representation" | "engagement" | "action";
  name: string;
  description: string;
  applicableTo: string[];
}

/* ─── seed data ─── */
const learners: LearnerProfile[] = [
  { id: "LP-01", name: "Jaylen Carter", grade: "7th", planType: "IEP", accommodations: ["Extended time (1.5x)", "Preferential seating", "Text-to-speech", "Chunked instructions"], strengths: ["Visual learner", "Strong verbal reasoning"], interests: ["Science", "Basketball"], teachers: ["T-01", "T-02", "T-03"], udlStrategies: { representation: ["Graphic organizers", "Audio text"], engagement: ["Choice boards", "Goal setting"], action: ["Verbal response option"] } },
  { id: "LP-02", name: "Maya Rodriguez", grade: "6th", planType: "504", accommodations: ["Preferential seating", "Movement breaks (every 20 min)", "Flexible deadline"], strengths: ["Kinesthetic learner", "Creative thinker"], interests: ["Art", "Dance"], teachers: ["T-02", "T-04"], udlStrategies: { representation: ["Hands-on materials"], engagement: ["Movement integration", "Interest-based projects"], action: ["Drawing instead of writing"] } },
  { id: "LP-03", name: "Aiden Walsh", grade: "8th", planType: "IEP", accommodations: ["Reduced assignment length", "Simplified text", "Extended time"], strengths: ["Strong in math", "Logical thinker"], interests: ["Video games", "Coding"], teachers: ["T-01", "T-03"], udlStrategies: { representation: ["Simplified vocabulary", "Visual aids"], engagement: ["Technology integration"], action: ["Multiple choice option"] } },
  { id: "LP-04", name: "Sofia Chen", grade: "7th", planType: "informal", accommodations: ["Chunked instructions", "Visual aids", "Bilingual glossary"], strengths: ["Strong work ethic", "Detail-oriented"], interests: ["Reading", "Cooking"], teachers: ["T-02", "T-03", "T-04"], udlStrategies: { representation: ["Visual aids", "Translated key terms"], engagement: ["Peer collaboration"], action: ["Written or visual response"] } },
  { id: "LP-05", name: "Marcus Thompson", grade: "6th", planType: "IEP", accommodations: ["Behavior support plan", "Check-in/check-out", "Preferential seating", "Break card", "Positive reinforcement schedule"], strengths: ["Social leader", "Musical talent"], interests: ["Music", "Sports"], teachers: ["T-01", "T-02", "T-04"], udlStrategies: { representation: ["Multimedia content"], engagement: ["Leadership roles", "Music integration"], action: ["Oral presentation option"] } },
  { id: "LP-06", name: "Lily Nakamura", grade: "8th", planType: "504", accommodations: ["Extended time (1.5x)", "Testing in separate room", "Reduced test anxiety accommodations", "Noise-canceling headphones"], strengths: ["High achiever", "Self-motivated"], interests: ["Writing", "Photography"], teachers: ["T-01", "T-03"], udlStrategies: { representation: ["Clear rubrics in advance"], engagement: ["Self-pacing", "Goal tracking"], action: ["Portfolio assessment"] } },
  { id: "LP-07", name: "DeShawn Harris", grade: "7th", planType: "IEP", accommodations: ["Text-to-speech", "Speech-to-text", "Graphic organizers", "Extended time"], strengths: ["Creative thinker", "Strong storytelling"], interests: ["Storytelling", "Drawing"], teachers: ["T-02", "T-03", "T-04"], udlStrategies: { representation: ["Audio books", "Graphic organizers"], engagement: ["Creative projects"], action: ["Recorded verbal response", "Drawing"] } },
  { id: "LP-08", name: "Emma Kowalski", grade: "6th", planType: "informal", accommodations: ["Flexible seating", "Fidget tools", "Movement breaks"], strengths: ["Strong verbal skills", "Enthusiastic"], interests: ["Animals", "Outdoors"], teachers: ["T-01", "T-04"], udlStrategies: { representation: ["Multi-sensory input"], engagement: ["Nature connections", "Hands-on"], action: ["Physical demonstration"] } },
];

type LogEntry = { learnerId: string; accommodation: string; documented: boolean; date: string };
const L = (learnerId: string, accommodation: string, documented: boolean, date: string): LogEntry => ({ learnerId, accommodation, documented, date });

const initialTeachers: TeacherRecord[] = [
  { id: "T-01", name: "Mr. Park", subject: "Science", studentsWithAccommodations: ["LP-01", "LP-03", "LP-05", "LP-06", "LP-08"], implementationLog: [
    L("LP-01","Extended time (1.5x)",true,"2026-02-03"), L("LP-01","Text-to-speech",true,"2026-02-10"), L("LP-01","Preferential seating",true,"2026-02-17"),
    L("LP-03","Reduced assignment length",false,"2026-02-05"), L("LP-03","Simplified text",true,"2026-02-12"), L("LP-03","Extended time",true,"2026-02-19"),
    L("LP-05","Behavior support plan",true,"2026-02-07"), L("LP-05","Check-in/check-out",true,"2026-02-14"), L("LP-05","Preferential seating",true,"2026-02-21"),
    L("LP-06","Extended time (1.5x)",true,"2026-02-06"), L("LP-06","Testing in separate room",true,"2026-02-13"), L("LP-06","Reduced test anxiety accommodations",false,"2026-02-20"),
    L("LP-08","Flexible seating",true,"2026-03-01"), L("LP-08","Fidget tools",true,"2026-03-03"), L("LP-08","Movement breaks",false,"2026-02-28"),
  ] },
  { id: "T-02", name: "Ms. DiNardo", subject: "English", studentsWithAccommodations: ["LP-01", "LP-02", "LP-04", "LP-05", "LP-07"], implementationLog: [
    L("LP-01","Extended time (1.5x)",true,"2026-02-04"), L("LP-01","Chunked instructions",true,"2026-02-11"), L("LP-01","Text-to-speech",true,"2026-02-18"), L("LP-01","Preferential seating",true,"2026-02-25"),
    L("LP-02","Preferential seating",true,"2026-02-05"), L("LP-02","Movement breaks (every 20 min)",true,"2026-02-12"), L("LP-02","Flexible deadline",true,"2026-02-19"),
    L("LP-04","Chunked instructions",true,"2026-02-06"), L("LP-04","Visual aids",true,"2026-02-13"), L("LP-04","Bilingual glossary",false,"2026-02-20"),
    L("LP-05","Behavior support plan",true,"2026-02-07"), L("LP-05","Check-in/check-out",true,"2026-02-14"), L("LP-05","Preferential seating",true,"2026-02-21"), L("LP-05","Break card",true,"2026-02-28"),
    L("LP-07","Text-to-speech",true,"2026-02-08"), L("LP-07","Speech-to-text",true,"2026-02-15"), L("LP-07","Graphic organizers",true,"2026-02-22"), L("LP-07","Extended time",false,"2026-03-01"),
    L("LP-04","Visual aids",true,"2026-03-02"), L("LP-02","Movement breaks (every 20 min)",true,"2026-03-03"),
  ] },
  { id: "T-03", name: "Mr. Lee", subject: "Math", studentsWithAccommodations: ["LP-01", "LP-03", "LP-04", "LP-06", "LP-07"], implementationLog: [
    L("LP-01","Extended time (1.5x)",true,"2026-02-03"), L("LP-01","Preferential seating",true,"2026-02-10"),
    L("LP-03","Reduced assignment length",true,"2026-02-05"), L("LP-03","Extended time",true,"2026-02-12"),
    L("LP-04","Chunked instructions",true,"2026-02-06"), L("LP-04","Bilingual glossary",true,"2026-02-13"),
    L("LP-06","Extended time (1.5x)",true,"2026-02-07"), L("LP-06","Testing in separate room",true,"2026-02-14"),
    L("LP-07","Graphic organizers",true,"2026-02-08"), L("LP-07","Extended time",true,"2026-02-15"),
  ] },
  { id: "T-04", name: "Mrs. Alvarez", subject: "Social Studies", studentsWithAccommodations: ["LP-02", "LP-04", "LP-05", "LP-07", "LP-08"], implementationLog: [
    L("LP-02","Preferential seating",true,"2026-02-04"), L("LP-02","Movement breaks (every 20 min)",true,"2026-02-11"), L("LP-02","Flexible deadline",false,"2026-02-18"),
    L("LP-04","Chunked instructions",true,"2026-02-05"), L("LP-04","Visual aids",true,"2026-02-12"), L("LP-04","Bilingual glossary",true,"2026-02-19"),
    L("LP-05","Behavior support plan",true,"2026-02-06"), L("LP-05","Check-in/check-out",true,"2026-02-13"), L("LP-05","Break card",true,"2026-02-20"),
    L("LP-07","Text-to-speech",true,"2026-02-07"), L("LP-07","Speech-to-text",true,"2026-02-14"), L("LP-07","Graphic organizers",false,"2026-02-21"), L("LP-07","Extended time",true,"2026-02-28"),
    L("LP-08","Flexible seating",true,"2026-03-01"), L("LP-08","Fidget tools",true,"2026-03-02"), L("LP-08","Movement breaks",true,"2026-03-03"),
    L("LP-05","Preferential seating",false,"2026-02-27"),
  ] },
];

const udlStrategies: UDLStrategy[] = [
  { id: "UDL-R1", principle: "representation", name: "Graphic Organizers", description: "Visual frameworks for organizing information and showing relationships between concepts", applicableTo: ["Chunked instructions", "Simplified text"] },
  { id: "UDL-R2", principle: "representation", name: "Audio Text", description: "Text-to-speech or recorded readings of content materials", applicableTo: ["Text-to-speech", "Reduced assignment length"] },
  { id: "UDL-R3", principle: "representation", name: "Visual Aids", description: "Diagrams, charts, images, and visual supports alongside text", applicableTo: ["Visual aids", "Chunked instructions", "Bilingual glossary"] },
  { id: "UDL-R4", principle: "representation", name: "Simplified Vocabulary", description: "Key terms defined at accessible reading level with examples", applicableTo: ["Simplified text", "Bilingual glossary"] },
  { id: "UDL-E1", principle: "engagement", name: "Choice Boards", description: "Student-selected activities to demonstrate understanding", applicableTo: ["Flexible deadline", "Break card"] },
  { id: "UDL-E2", principle: "engagement", name: "Goal Setting", description: "Student-driven goal tracking with visual progress indicators", applicableTo: ["Check-in/check-out", "Behavior support plan"] },
  { id: "UDL-E3", principle: "engagement", name: "Interest-Based Projects", description: "Connecting curriculum to student interests and passions", applicableTo: ["Movement breaks", "Flexible seating"] },
  { id: "UDL-E4", principle: "engagement", name: "Peer Collaboration", description: "Structured partner and small group learning activities", applicableTo: ["Preferential seating", "Movement breaks"] },
  { id: "UDL-A1", principle: "action", name: "Verbal Response", description: "Oral answers, recorded responses, or verbal demonstrations", applicableTo: ["Speech-to-text", "Extended time"] },
  { id: "UDL-A2", principle: "action", name: "Visual Expression", description: "Drawing, diagrams, or visual projects as assessment alternatives", applicableTo: ["Reduced assignment length", "Graphic organizers"] },
  { id: "UDL-A3", principle: "action", name: "Portfolio Assessment", description: "Collection of work over time showing growth and mastery", applicableTo: ["Extended time", "Testing in separate room"] },
  { id: "UDL-A4", principle: "action", name: "Technology Tools", description: "Digital tools for creation, communication, and demonstration", applicableTo: ["Text-to-speech", "Speech-to-text", "Fidget tools"] },
];

const PLAN_BADGES: Record<string, string> = {
  IEP: "bg-sky-400/15 text-sky-400 border-sky-400/20",
  "504": "bg-amber-400/15 text-amber-400 border-amber-400/20",
  informal: "bg-white/10 text-white/50 border-white/10",
};

const PRINCIPLE_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  representation: { bg: "bg-teal-500/15", text: "text-teal-400", border: "border-teal-500/20", label: "Representation" },
  engagement: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/20", label: "Engagement" },
  action: { bg: "bg-sky-500/15", text: "text-sky-400", border: "border-sky-500/20", label: "Action & Expression" },
};

type TabId = "profiles" | "accommodation" | "strategies" | "compliance";

/* ─── helpers ─── */
function getLearnerName(id: string): string {
  return learners.find((l) => l.id === id)?.name ?? id;
}

function getTeacherCompliance(t: TeacherRecord): { documented: number; total: number; rate: number } {
  const total = t.implementationLog.length;
  const documented = t.implementationLog.filter((e) => e.documented).length;
  return { documented, total, rate: total > 0 ? Math.round((documented / total) * 100) : 0 };
}

function rateColor(rate: number): string {
  if (rate >= 90) return "text-emerald-400";
  if (rate >= 70) return "text-amber-400";
  return "text-rose-400";
}

function rateBg(rate: number): string {
  if (rate >= 90) return "bg-emerald-400";
  if (rate >= 70) return "bg-amber-400";
  return "bg-rose-400";
}

/* ─── component ─── */
export function AccessLensDemo() {
  const [activeTab, setActiveTab] = useState<TabId>("profiles");
  const [expandedLearner, setExpandedLearner] = useState<string | null>(null);
  const [teacherFilter, setTeacherFilter] = useState<string>("all");
  const [udlPrinciple, setUdlPrinciple] = useState<"representation" | "engagement" | "action">("representation");
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<TeacherRecord[]>(initialTeachers);
  const [toast, setToast] = useState<string | null>(null);
  const [suggestFor, setSuggestFor] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  /* derived stats */
  const allAccommodations = new Set(learners.flatMap((l) => l.accommodations));
  const totalDocumented = teachers.reduce((s, t) => s + t.implementationLog.filter((e) => e.documented).length, 0);
  const totalEntries = teachers.reduce((s, t) => s + t.implementationLog.length, 0);
  const overallRate = totalEntries > 0 ? Math.round((totalDocumented / totalEntries) * 100) : 0;

  const tabs: { id: TabId; label: string }[] = [
    { id: "profiles", label: "Learner Profiles" },
    { id: "accommodation", label: "Accommodation Map" },
    { id: "strategies", label: "UDL Strategies" },
    { id: "compliance", label: "Compliance" },
  ];

  /* toggle documentation */
  const toggleDocumented = useCallback((teacherId: string, logIndex: number) => {
    setTeachers((prev) => prev.map((t) => {
      if (t.id !== teacherId) return t;
      const updated = [...t.implementationLog];
      updated[logIndex] = { ...updated[logIndex], documented: !updated[logIndex].documented };
      return { ...t, implementationLog: updated };
    }));
    showToast("Documentation updated");
  }, [showToast]);

  /* strategy suggestion */
  const suggestedStrategies = suggestFor
    ? udlStrategies.filter((s) => {
        const learner = learners.find((l) => l.id === suggestFor);
        if (!learner) return false;
        return s.applicableTo.some((a) => learner.accommodations.some((acc) => acc.toLowerCase().includes(a.toLowerCase())));
      })
    : [];

  /* filtered learners for accommodation map */
  const filteredLearners = teacherFilter === "all"
    ? learners
    : learners.filter((l) => l.teachers.includes(teacherFilter));

  return (
    <DemoPageWrapper>
      <DemoPageHeader title="AccessLens" subtitle="Universal Design for Learning Toolkit" icon={Eye} color="cyan" />

      {/* Stats */}
      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="Active Profiles" value={learners.length} icon={Users} color="cyan" />
        <DemoStatCard label="Accommodation Types" value={allAccommodations.size} icon={BookOpen} color="amber" />
        <DemoStatCard label="UDL Strategies" value={udlStrategies.length} icon={Sparkles} color="emerald" />
        <DemoStatCard label="Compliance Rate" value={`${overallRate}%`} icon={Shield} color="blue" />
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex-1 px-2 py-2 text-xs font-medium rounded-md transition-colors", activeTab === tab.id ? "bg-teal-600/30 text-teal-300" : "text-white/40 hover:text-white/60")}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── LEARNER PROFILES ── */}
        {activeTab === "profiles" && (
          <motion.div key="profiles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {/* Suggestion overlay */}
            <AnimatePresence>
              {suggestFor && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="demo-glass rounded-xl p-4 mb-3 border border-teal-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      Suggested Strategies for {getLearnerName(suggestFor)}
                    </p>
                    <DemoGlassButton size="sm" variant="ghost" onClick={() => setSuggestFor(null)}>Close</DemoGlassButton>
                  </div>
                  {suggestedStrategies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suggestedStrategies.map((s) => (
                        <div key={s.id} className={cn("rounded-lg px-3 py-2 border", PRINCIPLE_COLORS[s.principle].bg, PRINCIPLE_COLORS[s.principle].border)}>
                          <p className={cn("text-xs font-semibold", PRINCIPLE_COLORS[s.principle].text)}>{s.name}</p>
                          <p className="text-[10px] text-white/40 mt-0.5">{PRINCIPLE_COLORS[s.principle].label}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/40">No matching strategies found.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {learners.map((learner) => (
              <motion.div key={learner.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                className="demo-glass rounded-lg p-4 cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                onClick={() => setExpandedLearner(expandedLearner === learner.id ? null : learner.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-900/50 flex items-center justify-center text-xs font-bold text-teal-300">
                      {learner.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{learner.name}</p>
                      <p className="text-[10px] text-white/40">{learner.grade} Grade</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/30">{learner.accommodations.length} accommodations</span>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", PLAN_BADGES[learner.planType])}>
                      {learner.planType}
                    </span>
                    {expandedLearner === learner.id ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedLearner === learner.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={demoSprings.smooth} className="overflow-hidden">
                      <div className="pt-3 mt-3 border-t border-white/5 space-y-3">
                        {/* Accommodations */}
                        <div>
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Accommodations</p>
                          <div className="flex flex-wrap gap-1">
                            {learner.accommodations.map((a) => (
                              <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">{a}</span>
                            ))}
                          </div>
                        </div>
                        {/* Strengths + Interests */}
                        <div className="grid grid-cols-2 gap-3 text-[10px]">
                          <div>
                            <span className="text-white/30 font-bold uppercase tracking-wider">Strengths</span>
                            <p className="text-white/60 mt-0.5">{learner.strengths.join(", ")}</p>
                          </div>
                          <div>
                            <span className="text-white/30 font-bold uppercase tracking-wider">Interests</span>
                            <p className="text-white/60 mt-0.5">{learner.interests.join(", ")}</p>
                          </div>
                        </div>
                        {/* UDL Strategies */}
                        <div>
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">UDL Strategies</p>
                          <div className="grid grid-cols-3 gap-2">
                            {(["representation", "engagement", "action"] as const).map((p) => (
                              <div key={p} className={cn("rounded-lg px-2 py-1.5 border", PRINCIPLE_COLORS[p].bg, PRINCIPLE_COLORS[p].border)}>
                                <p className={cn("text-[9px] font-bold uppercase tracking-wider mb-0.5", PRINCIPLE_COLORS[p].text)}>{PRINCIPLE_COLORS[p].label}</p>
                                {learner.udlStrategies[p].map((s) => (
                                  <p key={s} className="text-[10px] text-white/50">{s}</p>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Teachers */}
                        <div className="text-[10px]">
                          <span className="text-white/30 font-bold uppercase tracking-wider">Teachers: </span>
                          <span className="text-white/60">{learner.teachers.map((tid) => teachers.find((t) => t.id === tid)?.name ?? tid).join(", ")}</span>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <DemoGlassButton size="sm" variant="primary" icon={Sparkles}
                            onClick={() => setSuggestFor(suggestFor === learner.id ? null : learner.id)}>
                            Suggest Strategies
                          </DemoGlassButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── ACCOMMODATION MAP ── */}
        {activeTab === "accommodation" && (
          <motion.div key="accommodation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Teacher filter */}
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setTeacherFilter("all")} className={cn("text-[10px] px-3 py-1 rounded-full border transition-colors", teacherFilter === "all" ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "text-white/40 border-white/10 hover:text-white/60")}>
                All Teachers
              </button>
              {teachers.map((t) => (
                <button key={t.id} onClick={() => setTeacherFilter(t.id)} className={cn("text-[10px] px-3 py-1 rounded-full border transition-colors", teacherFilter === t.id ? "bg-teal-500/20 text-teal-300 border-teal-500/30" : "text-white/40 border-white/10 hover:text-white/60")}>
                  {t.name} ({t.subject})
                </button>
              ))}
            </div>

            {/* Student rows */}
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
              {filteredLearners.map((learner) => (
                <motion.div key={learner.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                  className="demo-glass rounded-lg p-4" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 rounded-full bg-teal-900/50 flex items-center justify-center text-[10px] font-bold text-teal-300">
                      {learner.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{learner.name}</p>
                      <p className="text-[10px] text-white/40">{learner.grade} Grade &middot; {learner.planType}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {learner.accommodations.map((a) => (
                      <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/8">{a}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── UDL STRATEGIES ── */}
        {activeTab === "strategies" && (
          <motion.div key="strategies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Principle tabs */}
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              {(["representation", "engagement", "action"] as const).map((p) => (
                <button key={p} onClick={() => setUdlPrinciple(p)} className={cn("flex-1 px-2 py-2 text-xs font-medium rounded-md transition-colors", udlPrinciple === p ? `${PRINCIPLE_COLORS[p].bg} ${PRINCIPLE_COLORS[p].text}` : "text-white/40 hover:text-white/60")}>
                  {PRINCIPLE_COLORS[p].label}
                </button>
              ))}
            </div>

            {/* Strategy cards */}
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {udlStrategies.filter((s) => s.principle === udlPrinciple).map((strategy) => {
                const colors = PRINCIPLE_COLORS[strategy.principle];
                return (
                  <motion.div key={strategy.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                    className={cn("demo-glass rounded-xl p-4 border", colors.border)} style={{ border: `1px solid rgba(255,255,255,0.06)` }}>
                    <div className="flex items-start gap-3 mb-2">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", colors.bg)}>
                        <BookOpen className={cn("w-4 h-4", colors.text)} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{strategy.name}</p>
                        <p className="text-[10px] text-white/40 mt-0.5">{strategy.description}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 mb-1">Applicable to:</p>
                      <div className="flex flex-wrap gap-1">
                        {strategy.applicableTo.map((a) => (
                          <span key={a} className={cn("text-[10px] px-2 py-0.5 rounded-full border", colors.bg, colors.border, colors.text)}>{a}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {/* ── COMPLIANCE ── */}
        {activeTab === "compliance" && (
          <motion.div key="compliance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {teachers.map((teacher) => {
              const { documented, total, rate } = getTeacherCompliance(teacher);
              return (
                <motion.div key={teacher.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                  className="demo-glass rounded-lg overflow-hidden cursor-pointer" style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  onClick={() => setExpandedTeacher(expandedTeacher === teacher.id ? null : teacher.id)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-xs font-bold text-teal-300">
                          {teacher.name.split(" ").pop()?.[0] ?? "?"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{teacher.name}</p>
                          <p className="text-[10px] text-white/40">{teacher.subject} &middot; {teacher.studentsWithAccommodations.length} students</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/40">{documented}/{total}</span>
                        <span className={cn("text-sm font-bold tabular-nums", rateColor(rate))}>{rate}%</span>
                        {expandedTeacher === teacher.id ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                      <motion.div className={cn("h-full rounded-full", rateBg(rate))} initial={{ width: "0%" }} animate={{ width: `${rate}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedTeacher === teacher.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={demoSprings.smooth} className="overflow-hidden">
                        <div className="border-t border-white/5 px-4 py-3 space-y-1.5">
                          {teacher.implementationLog.map((entry, idx) => (
                            <div key={`${entry.learnerId}-${entry.accommodation}-${entry.date}`} className="flex items-center justify-between text-[10px]">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleDocumented(teacher.id, idx); }}
                                  className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", entry.documented ? "bg-emerald-500/30 border-emerald-500/30" : "border-white/20 hover:border-white/40")}
                                >
                                  {entry.documented && <CheckCircle size={10} className="text-emerald-400" />}
                                </button>
                                <span className="text-white/60">{getLearnerName(entry.learnerId)}</span>
                                <span className="text-white/30">&mdash;</span>
                                <span className="text-white/40">{entry.accommodation}</span>
                              </div>
                              <span className="text-white/25">{entry.date}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-teal-600/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
