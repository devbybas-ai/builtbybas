"use client";

import { motion } from "framer-motion";
import { springs, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";

const milestones = [
  {
    label: "The Beginning",
    title: "Fell in Love with Code at 16",
    description:
      "Discovered HTML, CSS, JavaScript, and Visual Basic as a teenager and was hooked. The ability to create something from nothing \u2014 to solve real problems with logic and creativity \u2014 was addictive. But life moves fast, and code stayed a passion I could never fully pursue. I learned, I tinkered, but I never had enough time to sharpen the saw.",
  },
  {
    label: "The Realization",
    title: "Businesses Deserve Better",
    description:
      "Watched too many businesses get overcharged for templates, abandoned after launch, and left with tools that didn\u2019t fit. Owners paying premium prices for cookie-cutter solutions that didn\u2019t serve them. Knew there had to be a better way, and that it would take someone who actually cared about the craft.",
  },
  {
    label: "The Evolution",
    title: "AI Made the Dream Real",
    description:
      "When AI became a true development partner, everything changed. The dream I\u2019d carried since I was 16 was suddenly within reach. I learned React, TypeScript, and modern full-stack engineering \u2014 and for the first time, I had a co-pilot that matched my ambition. AI didn\u2019t replace the craft. It gave me the time and power to finally master it.",
  },
  {
    label: "Today",
    title: "BuiltByBas is Born",
    description:
      "One developer. One AI partner. A lifetime of passion finally unleashed. BuiltByBas exists to give every business the custom software they deserve, built by someone who waited his whole life for this moment. No templates. No shortcuts. Just precision-engineered solutions from someone who lives and breathes this craft.",
  },
];

export function AboutTimeline() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            The <span className="text-gradient">Journey</span>
          </h2>
        </FadeIn>

        {/* 2x2 grid on desktop, single column on mobile */}
        <div className="grid gap-6 sm:grid-cols-2">
          {milestones.map((milestone, index) => (
            <TimelineCard
              key={milestone.title}
              milestone={milestone}
              index={index}
              animated={!shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TimelineCardProps {
  milestone: {
    label: string;
    title: string;
    description: string;
  };
  index: number;
  animated?: boolean;
}

function TimelineCard({ milestone, index, animated }: TimelineCardProps) {
  const card = (
    <div className="group relative h-full">
      <div className="glass-card relative h-full p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_-5px] hover:shadow-primary/20 sm:p-8">

        <span className="text-xs font-medium uppercase tracking-widest text-primary">
          {milestone.label}
        </span>
        <h3 className="mt-2 text-lg font-semibold sm:text-xl">
          {milestone.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {milestone.description}
        </p>
      </div>
    </div>
  );

  if (!animated) {
    return card;
  }

  // Alternate entrance directions: left/right for columns, staggered delay
  const fromLeft = index % 2 === 0;

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, x: fromLeft ? -40 : 40, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...springs.smooth, duration: 0.6, delay: index * 0.12 }}
    >
      {card}
    </motion.div>
  );
}
