"use client";

import { useState, useCallback, useEffect } from "react";
import type { IntakeFormData } from "@/types/intake";
import { INITIAL_FORM_DATA } from "@/types/intake";
import { stepSchemas } from "@/lib/intake-validation";

const STORAGE_KEY = "builtbybas-intake-draft";
const TOTAL_STEPS = 10;

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

function getStepFields(step: number): (keyof IntakeFormData)[] {
  const fieldsByStep: (keyof IntakeFormData)[][] = [
    ["name", "email", "phone", "company"],
    ["industry", "businessSize", "website"],
    ["projectTypes"],
    ["description", "goals"],
    ["timeline", "budgetRange"],
    ["hasExistingSite", "currentPainPoints"],
    ["desiredFeatures"],
    ["designPreference", "hasBrandAssets"],
    ["competitors", "inspiration"],
    ["additionalNotes", "howDidYouHear"],
  ];
  return fieldsByStep[step] || [];
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
    []
  );

  const validateCurrentStep = useCallback((): boolean => {
    const schema = stepSchemas[state.currentStep];
    if (!schema) return true;

    const fields = getStepFields(state.currentStep);
    const stepData: Record<string, unknown> = {};
    for (const field of fields) {
      stepData[field] = state.formData[field];
    }

    const result = schema.safeParse(stepData);
    if (result.success) {
      setState((prev) => ({ ...prev, errors: {} }));
      return true;
    }

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field && typeof field === "string") {
        errors[field] = issue.message;
      }
    }
    setState((prev) => ({ ...prev, errors }));
    return false;
  }, [state.currentStep, state.formData]);

  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) return;
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS - 1),
      errors: {},
    }));
  }, [validateCurrentStep]);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      errors: {},
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_STEPS) {
      setState((prev) => ({ ...prev, currentStep: step, errors: {} }));
    }
  }, []);

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
      setState((prev) => ({ ...prev, isSubmitting: false, isComplete: true }));
    } catch {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: { form: "Network error. Please check your connection and try again." },
      }));
    }
  }, [validateCurrentStep, state.formData]);

  return {
    ...state,
    totalSteps: TOTAL_STEPS,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
  };
}
