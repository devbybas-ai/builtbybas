"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Hammer,
  Headphones,
  Palette,
  Rocket,
  Search,
  X,
} from "lucide-react";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { ServiceIcon } from "@/components/public-site/ServiceIcon";
import { WalkthroughProgress } from "@/components/public-site/WalkthroughProgress";
import type { Service } from "@/types/services";
import { toIntakeId } from "@/data/service-id-map";

// ============================================================
// Step icon mapping
// ============================================================

const stepIconMap: Record<string, React.ComponentType<{ className?: string }>> =
  {
    search: Search,
    palette: Palette,
    hammer: Hammer,
    rocket: Rocket,
    headphones: Headphones,
  };

function StepIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = stepIconMap[icon];
  if (!Icon) return null;
  return <Icon className={className} />;
}

// ============================================================
// Animation variants
// ============================================================

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "100%" },
};

const stepSlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

// ============================================================
// Main Component
// ============================================================

interface ServiceWalkthroughOverlayProps {
  service: Service;
  onClose: () => void;
}

export function ServiceWalkthroughOverlay({
  service,
  onClose,
}: ServiceWalkthroughOverlayProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const walkthrough = service.walkthrough;
  if (!walkthrough) return null;

  const steps = walkthrough.steps;
  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  useFocusTrap(containerRef, true);
  useBodyScrollLock(true);

  const goNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, steps.length]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (index: number) => {
      setDirection(index > currentStep ? 1 : -1);
      setCurrentStep(index);
    },
    [currentStep],
  );

  // Keyboard: Escape, Left, Right
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goNext, goPrev]);

  // Reduced motion: no animations
  const motionProps = shouldReduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {};

  return (
    <>
      {/* Backdrop */}
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <motion.div
        ref={containerRef}
        variants={shouldReduceMotion ? undefined : modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={shouldReduceMotion ? { duration: 0 } : springs.smooth}
        {...motionProps}
        role="dialog"
        aria-modal="true"
        aria-label={`Service walkthrough for ${service.title}`}
        className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center"
      >
        <div className="flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-background sm:max-h-[85vh] sm:max-w-2xl sm:rounded-2xl">
          {/* ---- Header ---- */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-background/80 px-5 py-4 backdrop-blur-lg">
            <div className="flex items-center gap-3">
              <ServiceIcon icon={service.icon} />
              <div>
                <h2 className="text-base font-semibold">{service.title}</h2>
                <p className="text-xs text-muted-foreground">
                  {service.priceRange}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              aria-label="Close walkthrough"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ---- Progress ---- */}
          <div className="shrink-0 border-b border-white/5 px-4 py-3">
            <WalkthroughProgress
              steps={steps}
              currentStep={currentStep}
              onStepClick={goToStep}
            />
          </div>

          {/* ---- Tagline ---- */}
          <div className="shrink-0 px-5 pt-4">
            <p className="text-gradient text-sm font-medium italic">
              {walkthrough.tagline}
            </p>
          </div>

          {/* ---- Step Content ---- */}
          <div className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-4">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={shouldReduceMotion ? undefined : stepSlideVariants}
                initial={shouldReduceMotion ? false : "enter"}
                animate="center"
                exit="exit"
                transition={
                  shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeInOut" }
                }
                aria-live="polite"
              >
                {/* Phase icon + title */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <StepIcon icon={step.icon} className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {step.duration}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                {/* Deliverables */}
                <div className="mt-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary/80">
                    What You Get
                  </h4>
                  <motion.ul
                    className="mt-3 space-y-2.5"
                    initial="hidden"
                    animate="visible"
                    variants={
                      shouldReduceMotion
                        ? undefined
                        : {
                            hidden: {},
                            visible: {
                              transition: {
                                staggerChildren: 0.05,
                              },
                            },
                          }
                    }
                  >
                    {step.deliverables.map((item) => (
                      <motion.li
                        key={item}
                        variants={
                          shouldReduceMotion
                            ? undefined
                            : {
                                hidden: { opacity: 0, x: -10 },
                                visible: { opacity: 1, x: 0 },
                              }
                        }
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        {item}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ---- Bottom Navigation ---- */}
          <div className="flex shrink-0 items-center justify-between border-t border-white/5 bg-background/80 px-5 py-4 backdrop-blur-lg">
            <button
              type="button"
              onClick={goPrev}
              disabled={isFirstStep}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {isLastStep ? (
              <Link
                href={`/intake?service=${toIntakeId(service.id) ?? service.id}`}
                className="btn-shine neon-glow inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background transition-all hover:bg-cyan-hover"
              >
                {walkthrough.cta}
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
