"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { IntakeFormData, StepConfig } from "@/types/intake";
import { INITIAL_FORM_DATA, buildSteps } from "@/types/intake";
import {
  serviceSelectionSchema,
  contactSchema,
  businessSchema,
  timelineBudgetSchema,
  budgetOnlySchema,
  designBrandSchema,
  finalSchema,
  fullIntakeSchema,
  validateServiceStep,
} from "@/lib/intake-validation";

const STORAGE_KEY = "builtbybas-intake-draft";

export interface IntakeFormState {
  currentStep: number;
  formData: IntakeFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isComplete: boolean;
}

function loadDraft(): IntakeFormData | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as IntakeFormData;
  } catch {
    return null;
  }
}

function saveDraft(data: IntakeFormData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export interface UseIntakeFormOptions {
  preselectedService?: string;
}

export function useIntakeForm(options: UseIntakeFormOptions = {}) {
  const searchParams = useSearchParams();
  const conciergeService =
    options.preselectedService ?? searchParams.get("service") ?? undefined;
  const conciergePriority = searchParams.get("priority");
  const conciergeTimeline = searchParams.get("timeline");

  const skipServiceSelection = !!conciergeService;
  const skipTimeline = !!conciergeTimeline;

  const [state, setState] = useState<IntakeFormState>(() => {
    const draft = loadDraft();
    const base = draft
      ? { ...INITIAL_FORM_DATA, ...draft }
      : { ...INITIAL_FORM_DATA };

    // Concierge params override draft for controlled fields
    if (conciergeService) {
      base.selectedServices = [conciergeService];
    }
    if (conciergePriority) {
      base.conciergePriority = conciergePriority;
    }
    if (conciergeTimeline) {
      base.timeline = conciergeTimeline;
    }

    return {
      currentStep: 0,
      formData: base,
      errors: {},
      isSubmitting: false,
      isComplete: false,
    };
  });

  // Dynamic step list based on selected services
  const steps: StepConfig[] = useMemo(
    () =>
      buildSteps(
        state.formData.selectedServices,
        skipServiceSelection,
        skipTimeline,
      ),
    [state.formData.selectedServices, skipServiceSelection, skipTimeline],
  );

  const totalSteps = steps.length;
  const currentStepConfig = steps[state.currentStep] as StepConfig | undefined;

  // Auto-save on form data change
  useEffect(() => {
    saveDraft(state.formData);
  }, [state.formData]);

  const updateField = useCallback(
    <K extends keyof IntakeFormData>(field: K, value: IntakeFormData[K]) => {
      setState((prev) => ({
        ...prev,
        formData: { ...prev.formData, [field]: value },
        errors: { ...prev.errors, [field]: "" },
      }));
    },
    [],
  );

  const updateServiceAnswer = useCallback(
    (serviceId: string, questionId: string, value: string | string[]) => {
      setState((prev) => {
        const existing = prev.formData.serviceAnswers[serviceId] ?? {};
        return {
          ...prev,
          formData: {
            ...prev.formData,
            serviceAnswers: {
              ...prev.formData.serviceAnswers,
              [serviceId]: { ...existing, [questionId]: value },
            },
          },
          errors: { ...prev.errors, [questionId]: "" },
        };
      });
    },
    [],
  );

  const validateCurrentStep = useCallback((): boolean => {
    const step = steps[state.currentStep];
    if (!step) return true;

    let result: {
      success: boolean;
      error?: { issues: { path: PropertyKey[]; message: string }[] };
    };

    switch (step.type) {
      case "service-selection":
        result = serviceSelectionSchema.safeParse(state.formData);
        break;
      case "contact":
        result = contactSchema.safeParse(state.formData);
        break;
      case "business":
        result = businessSchema.safeParse(state.formData);
        break;
      case "timeline-budget":
        result = timelineBudgetSchema.safeParse(state.formData);
        break;
      case "budget-only": {
        const budgetResult = budgetOnlySchema.safeParse({
          budgetRange: state.formData.budgetRange,
        });
        if (!budgetResult.success) {
          const fieldErrors: Record<string, string> = {};
          for (const issue of budgetResult.error.issues) {
            const field = issue.path[0] as string;
            fieldErrors[field] = issue.message;
          }
          setState((prev) => ({ ...prev, errors: fieldErrors }));
          return false;
        }
        setState((prev) => ({ ...prev, errors: {} }));
        return true;
      }
      case "design-brand":
        result = designBrandSchema.safeParse(state.formData);
        break;
      case "final":
        result = finalSchema.safeParse(state.formData);
        break;
      case "service-questions": {
        if (!step.serviceId) return true;
        const answers = state.formData.serviceAnswers[step.serviceId] ?? {};
        const serviceResult = validateServiceStep(step.serviceId, answers);
        if (serviceResult.valid) {
          setState((prev) => ({ ...prev, errors: {} }));
          return true;
        }
        setState((prev) => ({ ...prev, errors: serviceResult.errors }));
        return false;
      }
      default:
        return true;
    }

    if (result.success) {
      setState((prev) => ({ ...prev, errors: {} }));
      return true;
    }

    const errors: Record<string, string> = {};
    if (result.error) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field && typeof field === "string" && !errors[field]) {
          errors[field] = issue.message;
        }
      }
    }
    setState((prev) => ({ ...prev, errors }));
    return false;
  }, [state.currentStep, state.formData, steps]);

  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) return;

    setState((prev) => {
      const nextIdx = Math.min(prev.currentStep + 1, totalSteps - 1);

      // When service selection changes, ensure we don't go past new bounds
      const newSteps = buildSteps(
        prev.formData.selectedServices,
        skipServiceSelection,
        skipTimeline,
      );
      const bounded = Math.min(nextIdx, newSteps.length - 1);

      return {
        ...prev,
        currentStep: bounded,
        errors: {},
      };
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [validateCurrentStep, totalSteps, skipServiceSelection, skipTimeline]);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      errors: {},
    }));

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const submitForm = useCallback(async () => {
    if (!validateCurrentStep()) return;

    // Full-form validation before hitting the API -- catches any field
    // that may have been cleared or corrupted after its step was passed.
    const preCheck = fullIntakeSchema.safeParse(state.formData);
    if (!preCheck.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of preCheck.error.issues) {
        const key = issue.path[0];
        if (key && typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      // Include a user-facing summary alongside the field errors
      fieldErrors.form =
        "Some required fields are missing. Please go back and fill in all required fields.";
      setState((prev) => ({ ...prev, errors: fieldErrors }));
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Surface field-level errors returned by the API
        const apiErrors: Record<string, string> = {};
        if (result.fieldErrors) {
          for (const [key, msg] of Object.entries(result.fieldErrors)) {
            if (typeof msg === "string") apiErrors[key] = msg;
          }
        }
        apiErrors.form =
          apiErrors.form ?? "Submission failed. Please try again.";

        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          errors: apiErrors,
        }));
        return;
      }

      clearDraft();
      sessionStorage.setItem("builtbybas-intake-name", state.formData.name);
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        isComplete: true,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: {
          form: "Network error. Please check your connection and try again.",
        },
      }));
    }
  }, [validateCurrentStep, state.formData]);

  return {
    ...state,
    steps,
    totalSteps,
    currentStepConfig,
    updateField,
    updateServiceAnswer,
    nextStep,
    prevStep,
    submitForm,
    skipTimeline,
    conciergeService,
  };
}
