"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Layers,
  Zap,
  Users,
  Scale,
  MousePointerClick,
  Globe,
  ServerCog,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { springs, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";
import type { LucideIcon } from "lucide-react";

const pillars: {
  icon: LucideIcon;
  title: string;
  question: string;
  example: string;
  risk?: string;
  mitigation?: string;
}[] = [
  {
    icon: Shield,
    title: "Security Minded",
    question: "Can this be exploited?",
    example:
      "Encrypted logins, protected data, rate-limited forms — no shortcuts on safety.",
  },
  {
    icon: Layers,
    title: "Structure",
    question: "Can someone else pick this up tomorrow?",
    example:
      "Clean, organized code that any developer can read, maintain, and extend.",
  },
  {
    icon: Zap,
    title: "Performance",
    question: "Does this respect the user's time and device?",
    example:
      "Optimized images, fast load times, and smooth interactions — even on slow connections.",
  },
  {
    icon: Users,
    title: "Inclusive",
    question: "Can everyone use this?",
    example:
      "Screen readers, keyboard navigation, 4.5:1 contrast — built in from day one.",
  },
  {
    icon: Scale,
    title: "Non-Bias",
    question: "Does this assume or exclude?",
    example:
      "Neutral language, no demographic assumptions — your product welcomes everyone.",
  },
  {
    icon: MousePointerClick,
    title: "UX Minded",
    question: "Does this feel intentional and clear?",
    example:
      "Loading states, error messages, confirmations — every interaction is considered.",
  },
  {
    icon: Globe,
    title: "Universal Design",
    question: "Does this work for the widest range of people without adaptation?",
    example:
      "Mobile, tablet, desktop — works everywhere without compromise.",
  },
  {
    icon: ServerCog,
    title: "R3S",
    question: "What happens when something fails?",
    example:
      "Auto-restart, error recovery, graceful fallbacks — built to stay up.",
    risk: "Downtime, data loss, cascading failures.",
    mitigation:
      "PM2 auto-restart, error boundaries on every route, static fallbacks.",
  },
];

export function AboutPillars() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            The Eight <span className="text-gradient">Pillars</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every decision is governed by these eight pillars. They are
            non-negotiable.
          </p>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => (
            <PillarCard
              key={pillar.title}
              pillar={pillar}
              index={index}
              animated={!shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface PillarCardProps {
  pillar: {
    icon: LucideIcon;
    title: string;
    question: string;
    example: string;
    risk?: string;
    mitigation?: string;
  };
  index: number;
  animated: boolean;
}

function PillarCard({ pillar, index, animated }: PillarCardProps) {
  const Icon = pillar.icon;

  const card = (
    <div className="h-full">
      <div className="glass-card relative flex h-full flex-col p-6 transition-colors duration-300 hover:border-primary/30">
        <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <span className="text-xs font-medium uppercase tracking-widest text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-1 text-sm font-semibold">{pillar.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground italic">
          &ldquo;{pillar.question}&rdquo;
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">
          {pillar.example}
        </p>

        {pillar.risk && pillar.mitigation && (
          <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
              <p className="text-xs leading-relaxed text-amber-400/80">
                {pillar.risk}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
              <p className="text-xs leading-relaxed text-emerald-400/80">
                {pillar.mitigation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!animated) return card;

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...springs.smooth, duration: 0.5, delay: index * 0.06 }}
    >
      {card}
    </motion.div>
  );
}
