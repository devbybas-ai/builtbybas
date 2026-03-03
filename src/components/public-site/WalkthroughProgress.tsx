"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { springs } from "@/lib/motion";
import type { WalkthroughStep } from "@/types/services";

interface WalkthroughProgressProps {
  steps: WalkthroughStep[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export function WalkthroughProgress({
  steps,
  currentStep,
  onStepClick,
}: WalkthroughProgressProps) {
  return (
    <div className="relative flex items-center justify-between px-2 sm:px-4">
      {/* Connecting line (background) */}
      <div className="absolute left-8 right-8 top-1/2 h-px -translate-y-1/2 bg-white/10 sm:left-12 sm:right-12" />

      {/* Animated progress fill */}
      <motion.div
        className="absolute left-8 top-1/2 h-px -translate-y-1/2 bg-primary/40 sm:left-12"
        initial={false}
        animate={{
          width: `calc(${(currentStep / (steps.length - 1)) * 100}% - ${currentStep === steps.length - 1 ? "4rem" : "2rem"})`,
        }}
        transition={springs.smooth}
      />

      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <button
            key={step.phase}
            type="button"
            onClick={() => onStepClick(index)}
            className="relative z-10 flex flex-col items-center gap-1.5"
            aria-label={`Step ${index + 1}: ${step.title}${isCompleted ? " (completed)" : isActive ? " (current)" : ""}`}
            aria-current={isActive ? "step" : undefined}
          >
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1.15 : 1,
                backgroundColor: isActive
                  ? "rgb(0, 212, 255)"
                  : isCompleted
                    ? "rgba(0, 212, 255, 0.2)"
                    : "rgba(255, 255, 255, 0.05)",
                borderColor: isActive
                  ? "rgb(0, 212, 255)"
                  : isCompleted
                    ? "rgba(0, 212, 255, 0.4)"
                    : "rgba(255, 255, 255, 0.1)",
              }}
              transition={springs.snappy}
              className="flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold sm:h-9 sm:w-9"
            >
              {isCompleted ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <span
                  className={
                    isActive ? "text-background" : "text-muted-foreground"
                  }
                >
                  {index + 1}
                </span>
              )}
            </motion.div>

            {/* Label — hidden on mobile */}
            <span
              className={`hidden text-[10px] font-medium sm:block ${
                isActive
                  ? "text-primary"
                  : isCompleted
                    ? "text-primary/60"
                    : "text-muted-foreground/60"
              }`}
            >
              {step.phase}
            </span>
          </button>
        );
      })}
    </div>
  );
}
