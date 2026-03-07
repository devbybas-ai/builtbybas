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
} from "lucide-react";
import { springs, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";
import type { LucideIcon } from "lucide-react";

const pillars: {
  icon: LucideIcon;
  title: string;
  question: string;
}[] = [
  {
    icon: Shield,
    title: "Security Minded",
    question: "Can this be exploited?",
  },
  {
    icon: Layers,
    title: "Structure",
    question: "Can someone else pick this up tomorrow?",
  },
  {
    icon: Zap,
    title: "Performance",
    question: "Does this respect the user's time and device?",
  },
  {
    icon: Users,
    title: "Inclusive",
    question: "Can everyone use this?",
  },
  {
    icon: Scale,
    title: "Non-Bias",
    question: "Does this assume or exclude?",
  },
  {
    icon: MousePointerClick,
    title: "UX Minded",
    question: "Does this feel intentional and clear?",
  },
  {
    icon: Globe,
    title: "Universal Design",
    question: "Does this work for the widest range of people without adaptation?",
  },
  {
    icon: ServerCog,
    title: "R3S",
    question: "What happens when something fails?",
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
  };
  index: number;
  animated: boolean;
}

function PillarCard({ pillar, index, animated }: PillarCardProps) {
  const Icon = pillar.icon;

  const card = (
    <div className="group relative h-full">
      <div className="glass-card relative flex h-full flex-col p-6 transition-all duration-500 hover:border-primary/30 hover:[box-shadow:0_0_30px_-5px_rgba(0,212,255,0.15)]">
        <div className="relative mb-3 inline-flex">
          <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative inline-flex rounded-lg bg-primary/10 p-2.5 transition-colors duration-300 group-hover:bg-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>

        <span className="text-xs font-medium uppercase tracking-widest text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-1 text-sm font-semibold">{pillar.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground italic">
          &ldquo;{pillar.question}&rdquo;
        </p>
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
