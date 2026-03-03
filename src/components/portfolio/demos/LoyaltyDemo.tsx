"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Star,
  Gift,
  Award,
  TrendingUp,
  TrendingDown,
  Crown,
  Lock,
  CheckCircle,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoFadeUp } from "@/lib/demo-motion";
import { cn } from "@/lib/utils";
import { demoFormatDate, demoGetInitials, demoGetRelativeTime } from "@/lib/demo-utils";
import {
  loyaltyMembers,
  rewards,
  loyaltyTransactions,
  tierConfig,
} from "@/data/demo-seed";

// ---- Tier styling helpers ----
type TierName = "Bronze" | "Silver" | "Gold" | "Platinum";

const TIER_STYLES: Record<
  TierName,
  { text: string; bg: string; border: string; avatar: string; bar: string }
> = {
  Bronze: {
    text: "text-amber-600",
    bg: "bg-amber-600/10",
    border: "border-amber-600/20",
    avatar: "bg-amber-600/20 text-amber-500",
    bar: "bg-amber-600",
  },
  Silver: {
    text: "text-slate-300",
    bg: "bg-slate-300/10",
    border: "border-slate-300/20",
    avatar: "bg-slate-400/20 text-slate-300",
    bar: "bg-slate-400",
  },
  Gold: {
    text: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    avatar: "bg-yellow-400/20 text-yellow-400",
    bar: "bg-yellow-400",
  },
  Platinum: {
    text: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    avatar: "bg-cyan-400/20 text-cyan-400",
    bar: "bg-cyan-400",
  },
};

const TIER_LEFT_BORDER: Record<string, string> = {
  amber: "3px solid rgba(217,119,6,0.5)",
  slate: "3px solid rgba(148,163,184,0.4)",
  yellow: "3px solid rgba(250,204,21,0.5)",
  cyan: "3px solid rgba(0,212,255,0.5)",
};

function getTierStyle(tier: string) {
  return TIER_STYLES[tier as TierName] ?? TIER_STYLES.Bronze;
}

function TierBadge({ tier }: { tier: string }) {
  const s = getTierStyle(tier);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border",
        s.text,
        s.bg,
        s.border
      )}
    >
      <Crown size={9} />
      {tier}
    </span>
  );
}

function PointsBar({
  points,
  nextTierPoints,
  tier,
}: {
  points: number;
  nextTierPoints: number | null;
  tier: string;
}) {
  const s = getTierStyle(tier);

  if (!nextTierPoints) {
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-white/30">Max Tier</span>
          <span className="text-[10px] text-cyan-400 font-semibold">Platinum</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/8 overflow-hidden">
          <div className="h-full rounded-full bg-cyan-400 w-full" />
        </div>
      </div>
    );
  }

  const pct = Math.min((points / nextTierPoints) * 100, 100);
  const remaining = nextTierPoints - points;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-white/30">
          {remaining.toLocaleString()} pts to next tier
        </span>
        <span className={cn("text-[10px] font-semibold", s.text)}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className={cn("h-full rounded-full", s.bar)}
        />
      </div>
    </div>
  );
}

type Member = (typeof loyaltyMembers)[0];
type Reward = (typeof rewards)[0];
type Transaction = (typeof loyaltyTransactions)[0];
type TabFilter = "Members" | "Rewards" | "Transactions";
const TAB_OPTIONS: TabFilter[] = ["Members", "Rewards", "Transactions"];

export function LoyaltyDemo() {
  const [members, setMembers] = useState<Member[]>([...loyaltyMembers]);
  const [rewardList] = useState<Reward[]>([...rewards]);
  const [transactions, setTransactions] = useState<Transaction[]>([...loyaltyTransactions]);
  const [activeTab, setActiveTab] = useState<TabFilter>("Members");
  const [selectedMember, setSelectedMember] = useState<string>(members[0]?.id ?? "");
  const [redeemFlash, setRedeemFlash] = useState<string | null>(null);

  // Derived lookup map from mutable state
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m.name]));

  const totalPoints = members.reduce((s, m) => s + m.lifetimePoints, 0);
  const redeemCount = transactions.filter((t) => t.type === "redeem").length;
  const availableRewards = rewardList.filter((r) => r.available).length;

  // Member count per tier
  const tierMemberCounts = Object.fromEntries(
    tierConfig.map((t) => [
      t.name,
      members.filter((m) => m.tier === t.name).length,
    ])
  );

  // Recent 6 transactions
  const recentTxns = transactions.slice(0, 6);

  const handleRedeem = (reward: Reward) => {
    if (!selectedMember) return;
    const member = members.find((m) => m.id === selectedMember);
    if (!member || member.points < reward.points) return;

    // Deduct points from member
    setMembers((prev) =>
      prev.map((m) =>
        m.id === selectedMember
          ? { ...m, points: m.points - reward.points, lastActivity: new Date().toISOString().split("T")[0] }
          : m
      )
    );

    // Add transaction to top
    const newTxn: Transaction = {
      id: `TXN-${String(Date.now()).slice(-3)}`,
      memberId: selectedMember,
      type: "redeem",
      description: `${reward.name} redeemed`,
      points: -reward.points,
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions((prev) => [newTxn, ...prev]);

    // Flash the reward card
    setRedeemFlash(reward.id);
    setTimeout(() => setRedeemFlash(null), 1500);
  };

  return (
    <DemoPageWrapper>
      <DemoPageHeader
        title="Loyalty Program"
        subtitle="Member tiers, points, and rewards catalog"
        icon={Award}
        color="amber"
      />

      {/* Stats */}
      <motion.div
        variants={demoStaggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <DemoStatCard label="Total Members" value={members.length} icon={Users} color="amber" />
        <DemoStatCard
          label="Points Awarded"
          value={totalPoints.toLocaleString()}
          icon={Star}
          color="cyan"
        />
        <DemoStatCard label="Redemptions" value={redeemCount} icon={Gift} color="violet" />
        <DemoStatCard label="Active Rewards" value={availableRewards} icon={Award} color="emerald" />
      </motion.div>

      {/* Tab navigation */}
      <motion.div variants={demoFadeUp} initial="hidden" animate="visible" className="mb-5">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="demo-glass rounded-xl p-1 flex gap-1">
            {TAB_OPTIONS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-4 text-[10px] font-bold uppercase tracking-wide py-1.5 rounded-lg transition-colors whitespace-nowrap"
                style={{ color: activeTab === tab ? "#f59e0b" : "rgba(255,255,255,0.3)" }}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="loyalty-tab"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}
                    transition={demoSprings.snappy}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          {/* Member selector for redeeming */}
          {activeTab === "Rewards" && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 uppercase tracking-wide font-semibold">Redeem for:</span>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="demo-glass rounded-lg px-3 py-1.5 text-xs text-white/70 outline-none bg-transparent"
                style={{ border: "1px solid rgba(255,255,255,0.08)", colorScheme: "dark" }}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id} style={{ background: "#0A0A0F" }}>
                    {m.name} ({m.points.toLocaleString()} pts)
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[65%_35%] gap-5">
        {/* LEFT: Tab content */}
        <div className="space-y-5">
          <AnimatePresence mode="popLayout">
            {/* Members Tab */}
            {activeTab === "Members" && (
              <motion.div key="members" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.snappy}>
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
                  Members
                </h2>
                <motion.div
                  variants={demoStaggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {members.map((member) => {
                    const s = getTierStyle(member.tier);
                    return (
                      <motion.div
                        key={member.id}
                        variants={demoStaggerItem}
                        whileHover={{ scale: 1.01, y: -2 }}
                        transition={demoSprings.snappy}
                        className={cn("demo-glass rounded-xl p-4", selectedMember === member.id && "ring-1 ring-amber-400/30")}
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <button
                            onClick={() => setSelectedMember(member.id)}
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all",
                              s.avatar,
                              selectedMember === member.id && "ring-2 ring-amber-400/50"
                            )}
                          >
                            {demoGetInitials(member.name)}
                          </button>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="text-sm font-bold text-white">
                                {member.name}
                              </span>
                              <TierBadge tier={member.tier} />
                            </div>
                            <p className="text-xs text-white/35 mb-2">{member.email}</p>

                            <div className="flex items-center justify-between">
                              {/* Points */}
                              <div>
                                <span className="text-2xl font-extrabold text-white leading-none">
                                  {member.points.toLocaleString()}
                                </span>
                                <span className="text-xs text-white/35 ml-1">pts</span>
                              </div>
                              {/* Last activity */}
                              <div className="text-right">
                                <p className="text-[10px] text-white/25 uppercase tracking-wide mb-0.5">
                                  Last active
                                </p>
                                <p className="text-xs text-white/50">
                                  {demoGetRelativeTime(member.lastActivity)}
                                </p>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <PointsBar
                              points={member.points}
                              nextTierPoints={member.nextTierPoints}
                              tier={member.tier}
                            />
                          </div>

                          {/* Select for redeem */}
                          <DemoGlassButton
                            variant={selectedMember === member.id ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => { setSelectedMember(member.id); setActiveTab("Rewards"); }}
                          >
                            Redeem
                          </DemoGlassButton>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}

            {/* Rewards Tab */}
            {activeTab === "Rewards" && (
              <motion.div key="rewards" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.snappy}>
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
                  Rewards Catalog
                </h2>
                <motion.div
                  variants={demoStaggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {rewardList.map((reward) => {
                    const currentMember = members.find((m) => m.id === selectedMember);
                    const canAfford = currentMember ? currentMember.points >= reward.points : false;
                    const isFlashing = redeemFlash === reward.id;

                    return (
                      <motion.div
                        key={reward.id}
                        variants={demoStaggerItem}
                        whileHover={reward.available ? { scale: 1.03, y: -2 } : undefined}
                        transition={demoSprings.snappy}
                        className={cn(
                          "demo-glass rounded-xl p-3 relative overflow-hidden",
                          isFlashing && "ring-1 ring-emerald-400/50 transition-all duration-700"
                        )}
                        style={!reward.available ? { opacity: 0.55 } : undefined}
                      >
                        {/* Unavailable overlay */}
                        {!reward.available && (
                          <div
                            className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1 z-10"
                            style={{ background: "rgba(10,10,15,0.6)", backdropFilter: "blur(2px)" }}
                          >
                            <Lock size={14} className="text-white/30" />
                            <span className="text-[10px] text-white/30 font-medium">Coming Soon</span>
                          </div>
                        )}

                        {/* Redeemed success overlay */}
                        {isFlashing && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1 z-20"
                            style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(4px)" }}
                          >
                            <CheckCircle size={24} className="text-emerald-400" />
                            <span className="text-xs text-emerald-400 font-bold">Redeemed!</span>
                          </motion.div>
                        )}

                        {/* Reward name */}
                        <p className="text-xs font-semibold text-white leading-tight mb-2">{reward.name}</p>

                        {/* Points cost */}
                        <div className="flex items-center gap-1 mb-2">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs text-amber-400 font-bold">{reward.points.toLocaleString()}</span>
                        </div>

                        {/* Category chip */}
                        <div className="mb-3">
                          <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-white/8 text-white/40 border border-white/10">
                            {reward.category}
                          </span>
                        </div>

                        {/* Redeem button */}
                        <motion.button
                          whileHover={reward.available && canAfford ? { scale: 1.03 } : undefined}
                          whileTap={reward.available && canAfford ? { scale: 0.97 } : undefined}
                          transition={demoSprings.snappy}
                          disabled={!reward.available || !canAfford}
                          onClick={() => handleRedeem(reward)}
                          className={cn(
                            "w-full py-1.5 text-[11px] font-semibold rounded-lg border transition-colors",
                            reward.available && canAfford
                              ? "bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 border-amber-400/30"
                              : reward.available && !canAfford
                              ? "bg-rose-400/10 text-rose-400/60 border-rose-400/20 cursor-not-allowed"
                              : "bg-white/5 text-white/25 border-white/10 cursor-not-allowed"
                          )}
                        >
                          {reward.available && !canAfford ? "Not Enough Points" : "Redeem"}
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}

            {/* Transactions Tab */}
            {activeTab === "Transactions" && (
              <motion.div key="transactions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.snappy}>
                <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
                  Recent Transactions
                </h2>
                <div className="demo-glass rounded-xl overflow-hidden">
                  <motion.div
                    variants={demoStaggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="divide-y divide-white/5"
                  >
                    {recentTxns.map((txn) => {
                      const isEarn = txn.type === "earn";
                      return (
                        <motion.div
                          key={txn.id}
                          variants={demoStaggerItem}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                        >
                          {/* Type icon */}
                          <div
                            className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                              isEarn
                                ? "bg-emerald-400/10 text-emerald-400"
                                : "bg-rose-400/10 text-rose-400"
                            )}
                          >
                            {isEarn ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          </div>

                          {/* Description + member */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/80 truncate">{txn.description}</p>
                            <p className="text-xs text-white/35">{memberMap[txn.memberId] ?? txn.memberId}</p>
                          </div>

                          {/* Points + date */}
                          <div className="text-right flex-shrink-0">
                            <p className={cn("text-sm font-bold", isEarn ? "text-emerald-400" : "text-rose-400")}>
                              {isEarn ? "+" : ""}{txn.points.toLocaleString()} pts
                            </p>
                            <p className="text-[10px] text-white/30">{demoFormatDate(txn.date)}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Tier breakdown (always visible) */}
        <div className="space-y-5">
          <motion.div variants={demoFadeUp}>
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
              Tier Breakdown
            </h2>
            <motion.div
              variants={demoStaggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {tierConfig.map((tier) => {
                const count = tierMemberCounts[tier.name] ?? 0;
                const leftBorder = TIER_LEFT_BORDER[tier.color] ?? "3px solid rgba(255,255,255,0.1)";
                const tierStyle = getTierStyle(tier.name);

                return (
                  <motion.div
                    key={tier.name}
                    variants={demoStaggerItem}
                    whileHover={{ scale: 1.02, y: -1 }}
                    transition={demoSprings.snappy}
                    className="demo-glass rounded-xl p-4"
                    style={{ borderLeft: leftBorder }}
                  >
                    {/* Tier header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Crown size={13} className={tierStyle.text} />
                        <span className={cn("text-sm font-bold", tierStyle.text)}>{tier.name}</span>
                      </div>
                      <span className="text-xs text-white/40">
                        {count} {count === 1 ? "member" : "members"}
                      </span>
                    </div>

                    {/* Points range */}
                    <p className="text-xs text-white/35 mb-2">
                      {tier.min.toLocaleString()}
                      {tier.max === Infinity ? "+" : ` \u2013 ${tier.max.toLocaleString()}`} pts
                    </p>

                    {/* Top 2 perks */}
                    <ul className="space-y-1">
                      {tier.perks.slice(0, 2).map((perk) => (
                        <li key={perk} className="flex items-start gap-1.5 text-[11px] text-white/50">
                          <span className={cn("mt-0.5 text-[8px]", tierStyle.text)}>&#x25CF;</span>
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </DemoPageWrapper>
  );
}
