"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { IntakeFormData, StepConfig } from "@/types/intake";
import { INITIAL_FORM_DATA, buildSteps } from "@/types/intake";
import {
  serviceSelectionSchema,
  contactSchema,
  businessSchema,
  timelineBudgetSchema,
  designBrandSchema,
  finalSchema,
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

export function useIntakeForm() {
  const [state, setState] = useState<IntakeFormState>(() => {
    const draft = loadDraft();
    return {
      currentStep: 0,
      formData: draft ? { ...INITIAL_FORM_DATA, ...draft } : INITIAL_FORM_DATA,
      errors: {},
      isSubmitting: false,
      isComplete: false,
    };
  });

  // Dynamic step list based on selected services
  const steps: StepConfig[] = useMemo(
    () => buildSteps(state.formData.selectedServices),
    [state.formData.selectedServices],
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

    let result: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } };

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
      const newSteps = buildSteps(prev.formData.selectedServices);
      const bounded = Math.min(nextIdx, newSteps.length - 1);

      return {
        ...prev,
        currentStep: bounded,
        errors: {},
      };
    });
  }, [validateCurrentStep, totalSteps]);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      errors: {},
    }));
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setState((prev) => ({ ...prev, currentStep: step, errors: {} }));
      }
    },
    [totalSteps],
  );

  const submitForm = useCallback(async () => {
    if (!validateCurrentStep()) return;

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          errors: { form: "Submission failed. Please try again." },
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
    goToStep,
    submitForm,
  };
}
