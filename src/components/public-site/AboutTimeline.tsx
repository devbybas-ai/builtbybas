"use client";

import { motion } from "framer-motion";
import { fadeInUp, springs, staggerContainer, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";

const milestones = [
  {
    label: "The Beginning",
    title: "Fell in Love with Code",
    description:
      "Started building software and never looked back. The ability to create something from nothing — to solve real problems with logic and creativity — was addictive.",
  },
  {
    label: "The Realization",
    title: "Small Businesses Deserve Better",
    description:
      "Watched too many small businesses get overcharged for templates, abandoned after launch, and left with tools that didn't fit. Knew there had to be a better way.",
  },
  {
    label: "The Evolution",
    title: "AI Changes Everything",
    description:
      "When AI became a real development tool, I went all in. Not as a novelty — as core infrastructure. Human judgment plus AI speed creates something neither can achieve alone.",
  },
  {
    label: "Today",
    title: "BuiltByBas is Born",
    description:
      "One developer. One AI partner. Zero compromises. BuiltByBas exists to give small businesses the custom software they deserve — at a price that makes sense.",
  },
];

export function AboutTimeline() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            The <span className="text-gradient">Journey</span>
          </h2>
        </FadeIn>

        {shouldReduceMotion ? (
          <div className="relative space-y-12">
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent sm:left-1/2" />
            {milestones.map((milestone) => (
              <TimelineItem key={milestone.title} milestone={milestone} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative space-y-12"
          >
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent sm:left-1/2" />
            {milestones.map((milestone) => (
              <TimelineItem
                key={milestone.title}
                milestone={milestone}
                animated
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

interface TimelineItemProps {
  milestone: {
    label: string;
    title: string;
    description: string;
  };
  animated?: boolean;
}

function TimelineItem({ milestone, animated }: TimelineItemProps) {
  const content = (
    <div className="relative pl-12 sm:pl-0">
      {/* Dot */}
      <div className="absolute left-[13px] top-2 h-3 w-3 rounded-full border-2 border-primary bg-background sm:left-1/2 sm:-translate-x-1/2" />

      {/* Card */}
      <div className="glass-card p-6 sm:ml-auto sm:w-[calc(50%-2rem)]">
        <span className="text-xs font-medium uppercase tracking-wider text-primary">
          {milestone.label}
        </span>
        <h3 className="mt-1 text-lg font-semibold">{milestone.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {milestone.description}
        </p>
      </div>
    </div>
  );

  if (!animated) {
    return <div>{content}</div>;
  }

  return (
    <motion.div variants={fadeInUp} transition={springs.smooth}>
      {content}
    </motion.div>
  );
}
