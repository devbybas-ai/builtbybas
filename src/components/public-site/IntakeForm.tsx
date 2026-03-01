"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIntakeForm } from "@/hooks/useIntakeForm";
import { IntakeProgress } from "@/components/public-site/IntakeProgress";
import { IntakeStep } from "@/components/public-site/IntakeStep";
import { cn } from "@/lib/utils";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export function IntakeForm() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const {
    currentStep,
    totalSteps,
    steps,
    currentStepConfig,
    formData,
    errors,
    isSubmitting,
    isComplete,
    updateField,
    updateServiceAnswer,
    nextStep,
    prevStep,
    submitForm,
  } = useIntakeForm();

  const isLastStep = currentStep === totalSteps - 1;

  async function handleSubmit() {
    await submitForm();
  }

  if (isComplete) {
    router.push("/intake/confirmation");
    return null;
  }

  if (!currentStepConfig) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <IntakeProgress
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={steps}
      />

      <div className="glass-card overflow-hidden p-6 sm:p-8">
        {shouldReduceMotion ? (
          <IntakeStep
            stepConfig={currentStepConfig}
            formData={formData}
            errors={errors}
            onUpdate={updateField}
            onUpdateServiceAnswer={updateServiceAnswer}
          />
        ) : (
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={`${currentStepConfig.type}-${currentStepConfig.serviceId ?? currentStep}`}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ ...springs.snappy, duration: 0.25 }}
            >
              <IntakeStep
                stepConfig={currentStepConfig}
                formData={formData}
                errors={errors}
                onUpdate={updateField}
                onUpdateServiceAnswer={updateServiceAnswer}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Form-level error */}
        {errors.form && (
          <div
            className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            role="alert"
          >
            {errors.form}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium",
                "text-muted-foreground transition-colors hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {isLastStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={cn(
                "neon-glow inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors",
                "hover:bg-cyan-hover",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {isSubmitting ? "Submitting..." : "Submit Project"}
              {!isSubmitting && <Send className="h-4 w-4" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors",
                "hover:bg-cyan-hover",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
