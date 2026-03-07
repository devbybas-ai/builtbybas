"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Code2, Zap, HeartHandshake } from "lucide-react";
import { springs, viewportRepeat } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";
import type { LucideIcon } from "lucide-react";

const values = [
  {
    icon: Code2,
    title: "Custom, Not Templated",
    description:
      "Every project built from scratch for your specific business needs. No cookie-cutter themes. No recycled designs. Just solutions that fit.",
    accent: "from-cyan-400 to-blue-500",
  },
  {
    icon: Zap,
    title: "Fast, Accurate, Reliable",
    description:
      "AI-augmented delivery in 2-3 weeks for most projects — complex builds take longer. Human and code-based gates ensure accuracy. You get speed, reliability, and full documentation with every delivery.",
    accent: "from-violet-400 to-purple-500",
  },
  {
    icon: HeartHandshake,
    title: "Ongoing, Not Abandoned",
    description:
      "Maintenance, support, and feature add-ons for as long as you need them. We don't disappear after launch.",
    accent: "from-emerald-400 to-teal-500",
  },
];

export function ValueProposition() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="value-proposition" className="scroll-mt-20 relative pt-8 pb-10 sm:pt-12 sm:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Why <span className="text-gradient">BuiltByBas</span>?
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Your business deserves better than what most agencies deliver.
          </p>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value, index) => (
            <ValueCard
              key={value.title}
              value={value}
              index={index}
              animated={!shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ValueCardProps {
  value: {
    icon: LucideIcon;
    title: string;
    description: string;
    accent: string;
  };
  index: number;
  animated: boolean;
}

function ValueCard({ value, index, animated }: ValueCardProps) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [4, -4]);
  const rotateY = useTransform(mouseX, [0, 1], [-4, 4]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!animated) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  const Icon = value.icon;
  const directions = [-50, 0, 50];

  const content = (
    <div className="group relative h-full">
      <div
        className="glass-card relative h-full p-6 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_40px_-5px] hover:shadow-primary/15"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>

        <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {value.description}
        </p>
      </div>
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      initial={{ opacity: 0, x: directions[index] ?? 0, y: 30 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewportRepeat}
      transition={{ ...springs.smooth, duration: 0.7, delay: index * 0.15 }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
    >
      {content}
    </motion.div>
  );
}
