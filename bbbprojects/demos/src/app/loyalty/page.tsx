"use client";

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
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import GlassButton from "@/components/shared/GlassButton";
import { staggerContainer, staggerItem, springs, fadeUp } from "@/lib/motion";
import { cn, formatDate, getInitials, getRelativeTime } from "@/lib/utils";
import {
  loyaltyMembers,
  rewards,
  loyaltyTransactions,
  tierConfig,
} from "@/data/seed";

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

// Lookup member name from id for transactions
const memberMap = Object.fromEntries(
  loyaltyMembers.map((m) => [m.id, m.name])
);

export default function LoyaltyPage() {
  const totalPoints = loyaltyMembers.reduce((s, m) => s + m.lifetimePoints, 0);
  const redeemCount = loyaltyTransactions.filter((t) => t.type === "redeem").length;
  const availableRewards = rewards.filter((r) => r.available).length;

  // Member count per tier
  const tierMemberCounts = Object.fromEntries(
    tierConfig.map((t) => [
      t.name,
      loyaltyMembers.filter((m) => m.tier === t.name).length,
    ])
  );

  // Recent 5 transactions
  const recentTxns = loyaltyTransactions.slice(0, 5);

  return (
    <PageWrapper>
      <PageHeader
        title="Loyalty Program"
        subtitle="Member tiers, points, and rewards catalog"
        icon={Award}
        color="amber"
      />

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <StatCard label="Total Members" value={loyaltyMembers.length} icon={Users} color="amber" />
        <StatCard
          label="Points Awarded"
          value={totalPoints.toLocaleString()}
          icon={Star}
          color="cyan"
        />
        <StatCard label="Redemptions" value={redeemCount} icon={Gift} color="violet" />
        <StatCard label="Active Rewards" value={availableRewards} icon={Award} color="emerald" />
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[65%_35%] gap-5">
        {/* LEFT: Member list + Transactions */}
        <div className="space-y-5">
          {/* Member list */}
          <motion.div variants={fadeUp}>
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
              Members
            </h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {loyaltyMembers.map((member) => {
                const s = getTierStyle(member.tier);
                return (
                  <motion.div
                    key={member.id}
                    variants={staggerItem}
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={springs.snappy}
                    className="glass rounded-xl p-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                          s.avatar
                        )}
                      >
                        {getInitials(member.name)}
                      </div>

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
                              {getRelativeTime(member.lastActivity)}
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

                      {/* View history button */}
                      <GlassButton variant="ghost" size="sm">
                        View History
                      </GlassButton>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div variants={fadeUp}>
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
              Recent Transactions
            </h2>
            <div className="glass rounded-xl overflow-hidden">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="divide-y divide-white/5"
              >
                {recentTxns.map((txn) => {
                  const isEarn = txn.type === "earn";
                  return (
                    <motion.div
                      key={txn.id}
                      variants={staggerItem}
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
                        {isEarn ? (
                          <TrendingUp size={13} />
                        ) : (
                          <TrendingDown size={13} />
                        )}
                      </div>

                      {/* Description + member */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 truncate">
                          {txn.description}
                        </p>
                        <p className="text-xs text-white/35">
                          {memberMap[txn.memberId] ?? txn.memberId}
                        </p>
                      </div>

                      {/* Points + date */}
                      <div className="text-right flex-shrink-0">
                        <p
                          className={cn(
                            "text-sm font-bold",
                            isEarn ? "text-emerald-400" : "text-rose-400"
                          )}
                        >
                          {isEarn ? "+" : ""}
                          {txn.points.toLocaleString()} pts
                        </p>
                        <p className="text-[10px] text-white/30">
                          {formatDate(txn.date)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Tier breakdown + Rewards catalog */}
        <div className="space-y-5">
          {/* Tier Breakdown */}
          <motion.div variants={fadeUp}>
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
              Tier Breakdown
            </h2>
            <motion.div
              variants={staggerContainer}
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
                    variants={staggerItem}
                    whileHover={{ scale: 1.02, y: -1 }}
                    transition={springs.snappy}
                    className="glass rounded-xl p-4"
                    style={{ borderLeft: leftBorder }}
                  >
                    {/* Tier header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Crown
                          size={13}
                          className={tierStyle.text}
                        />
                        <span
                          className={cn("text-sm font-bold", tierStyle.text)}
                        >
                          {tier.name}
                        </span>
                      </div>
                      <span className="text-xs text-white/40">
                        {count} {count === 1 ? "member" : "members"}
                      </span>
                    </div>

                    {/* Points range */}
                    <p className="text-xs text-white/35 mb-2">
                      {tier.min.toLocaleString()}
                      {tier.max === Infinity
                        ? "+"
                        : ` – ${tier.max.toLocaleString()}`}{" "}
                      pts
                    </p>

                    {/* Top 2 perks */}
                    <ul className="space-y-1">
                      {tier.perks.slice(0, 2).map((perk) => (
                        <li
                          key={perk}
                          className="flex items-start gap-1.5 text-[11px] text-white/50"
                        >
                          <span className={cn("mt-0.5 text-[8px]", tierStyle.text)}>
                            ●
                          </span>
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Rewards Catalog */}
          <motion.div variants={fadeUp}>
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
              Rewards Catalog
            </h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3"
            >
              <AnimatePresence>
                {rewards.map((reward) => (
                  <motion.div
                    key={reward.id}
                    variants={staggerItem}
                    whileHover={reward.available ? { scale: 1.03, y: -2 } : undefined}
                    transition={springs.snappy}
                    className="glass rounded-xl p-3 relative overflow-hidden"
                    style={
                      !reward.available
                        ? { opacity: 0.55 }
                        : undefined
                    }
                  >
                    {/* Unavailable overlay */}
                    {!reward.available && (
                      <div
                        className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1 z-10"
                        style={{ background: "rgba(10,10,15,0.6)", backdropFilter: "blur(2px)" }}
                      >
                        <Lock size={14} className="text-white/30" />
                        <span className="text-[10px] text-white/30 font-medium">
                          Coming Soon
                        </span>
                      </div>
                    )}

                    {/* Reward name */}
                    <p className="text-xs font-semibold text-white leading-tight mb-2">
                      {reward.name}
                    </p>

                    {/* Points cost */}
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs text-amber-400 font-bold">
                        {reward.points.toLocaleString()}
                      </span>
                    </div>

                    {/* Category chip */}
                    <div className="mb-3">
                      <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-white/8 text-white/40 border border-white/10">
                        {reward.category}
                      </span>
                    </div>

                    {/* Redeem button */}
                    <motion.button
                      whileHover={reward.available ? { scale: 1.03 } : undefined}
                      whileTap={reward.available ? { scale: 0.97 } : undefined}
                      transition={springs.snappy}
                      disabled={!reward.available}
                      className={cn(
                        "w-full py-1.5 text-[11px] font-semibold rounded-lg border transition-colors",
                        reward.available
                          ? "bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 border-amber-400/30"
                          : "bg-white/5 text-white/25 border-white/10 cursor-not-allowed"
                      )}
                    >
                      Redeem
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
