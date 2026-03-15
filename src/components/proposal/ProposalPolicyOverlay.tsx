"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PrivacyContent,
  TermsContent,
  CookieContent,
  RefundContent,
  ResponsibleAIContent,
} from "./ProposalPolicies";

export type PolicyKey =
  | "privacy"
  | "terms"
  | "cookies"
  | "refund"
  | "ai-policy";

const POLICY_TITLES: Record<PolicyKey, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  cookies: "Cookie Policy",
  refund: "Refund & Cancellation Policy",
  "ai-policy": "Responsible AI Policy",
};

const POLICY_COMPONENTS: Record<PolicyKey, React.FC> = {
  privacy: PrivacyContent,
  terms: TermsContent,
  cookies: CookieContent,
  refund: RefundContent,
  "ai-policy": ResponsibleAIContent,
};

interface ProposalPolicyOverlayProps {
  activePolicy: PolicyKey | null;
  onClose: () => void;
}

export function ProposalPolicyOverlay({
  activePolicy,
  onClose,
}: ProposalPolicyOverlayProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!activePolicy) return;
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [activePolicy, handleEscape]);

  // Reset scroll when switching policies
  useEffect(() => {
    if (activePolicy && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activePolicy]);

  const Content = activePolicy ? POLICY_COMPONENTS[activePolicy] : null;

  return (
    <AnimatePresence>
      {activePolicy && Content && (
        <>
          {/* Backdrop */}
          <motion.div
            key="policy-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="policy-panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-x-0 bottom-0 top-12 z-50 flex flex-col rounded-t-2xl border-t border-white/10 bg-background shadow-2xl sm:inset-x-4 sm:top-16 md:inset-x-auto md:left-1/2 md:w-full md:max-w-3xl md:-translate-x-1/2"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                {POLICY_TITLES[activePolicy]}
              </h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close policy"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto overscroll-contain px-6 py-6"
            >
              <div className="space-y-8 text-sm leading-relaxed text-white/60 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-white [&_h3]:text-sm [&_h3]:font-medium [&_h3]:text-white/80 [&_li]:text-white/60 [&_p]:text-white/60 [&_strong]:text-white/80 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_table]:w-full [&_th]:pb-2 [&_th]:pr-4 [&_th]:text-left [&_th]:text-xs [&_th]:font-medium [&_th]:text-white/40 [&_td]:py-1.5 [&_td]:pr-4 [&_td]:text-white/60">
                <Content />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
