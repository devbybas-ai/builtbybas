"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { springs } from "@/lib/motion";
import type { StepConfig } from "@/types/intake";
import { cn } from "@/lib/utils";

interface IntakeProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: StepConfig[];
}

export function IntakeProgress({ currentStep, totalSteps, steps }: IntakeProgressProps) {
  const shouldReduceMotion = useReducedMotion();
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentLabel = steps[currentStep]?.label ?? "";

  return (
    <div className="mb-10">
      {/* Mobile: compact */}
      <div className="flex items-center justify-between sm:hidden">
        <span className="text-sm font-medium text-primary">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">
          {currentLabel}
        </span>
      </div>

      {/* Desktop: step indicators */}
      <div className="mb-3 hidden sm:flex sm:items-center sm:justify-between">
        <span className="text-sm font-medium">
          {currentLabel}
        </span>
        <span className="text-sm text-muted-foreground">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
        {shouldReduceMotion ? (
          <div
            className="h-full rounded-full bg-green-400"
            style={{ width: `${progress}%` }}
          />
        ) : (
          <motion.div
            className="h-full rounded-full bg-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={springs.smooth}
          />
        )}
      </div>

      {/* Step dots — desktop only */}
      <div className="mt-4 hidden gap-1 sm:flex">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= currentStep ? "bg-green-400" : "bg-white/10"
            )}
          />
        ))}
      </div>
    </div>
  );
}
