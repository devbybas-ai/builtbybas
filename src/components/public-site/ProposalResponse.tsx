"use client";

import { useState, useEffect } from "react";
import { markdownToHtml } from "@/lib/markdown-to-html";
import {
  ProposalPolicyOverlay,
  type PolicyKey,
} from "@/components/proposal/ProposalPolicyOverlay";

interface ProposalData {
  title: string;
  summary: string;
  content: string;
  estimatedBudgetCents: number | null;
  timeline: string | null;
  status: string;
  sentAt: string | null;
  respondedAt: string | null;
  validUntil: string | null;
  services: {
    serviceId: string;
    serviceName: string;
    description: string;
    estimatedPriceCents: number;
    estimatedTimeline: string;
  }[];
}

export function ProposalResponse({ token }: { token: string }) {
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState(false);
  const [responded, setResponded] = useState<"accepted" | "rejected" | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);

  useEffect(() => {
    async function fetchProposal() {
      try {
        const res = await fetch(`/api/proposals/respond?token=${token}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error ?? "Proposal not found");
          return;
        }
        setProposal(data.proposal);
        if (data.proposal.status === "accepted" || data.proposal.status === "rejected") {
          setResponded(data.proposal.status);
        }
      } catch {
        setError("Failed to load proposal");
      } finally {
        setLoading(false);
      }
    }
    fetchProposal();
  }, [token]);

  async function handleRespond(action: "accept" | "decline") {
    setResponding(true);
    try {
      const res = await fetch("/api/proposals/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          action,
          reason: action === "decline" ? declineReason : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? "Failed to submit response");
        return;
      }
      setResponded(action === "accept" ? "accepted" : "rejected");
      setShowDeclineForm(false);
    } catch {
      setError("Failed to submit response");
    } finally {
      setResponding(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white/50 text-lg">Loading proposal...</div>
      </main>
    );
  }

  if (error && !proposal) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Proposal Not Found</h1>
          <p className="text-white/50">{error}</p>
        </div>
      </main>
    );
  }

  if (!proposal) return null;

  const budgetDisplay = proposal.estimatedBudgetCents
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
        proposal.estimatedBudgetCents / 100
      )
    : null;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-cyan-400 text-xl font-bold tracking-wide">BuiltByBas</h1>
        </div>

        {/* Response Status Banner */}
        {responded && (
          <div
            className={`mb-8 p-4 rounded-xl border ${
              responded === "accepted"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <p className="font-semibold text-lg">
              {responded === "accepted"
                ? "You accepted this proposal. We'll be in touch soon!"
                : "You've declined this proposal. Thank you for letting us know."}
            </p>
          </div>
        )}

        {/* Proposal Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          {/* Title + Summary */}
          <div className="p-6 sm:p-8 border-b border-white/10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{proposal.title}</h2>
            <p className="text-white/60 text-base leading-relaxed">{proposal.summary}</p>

            {/* Stats */}
            <div className="flex gap-8 mt-6">
              {budgetDisplay && (
                <div>
                  <span className="text-xs text-white/40 uppercase tracking-wider">Investment</span>
                  <p className="text-xl font-semibold text-cyan-400 mt-1">{budgetDisplay}</p>
                </div>
              )}
              {proposal.timeline && (
                <div>
                  <span className="text-xs text-white/40 uppercase tracking-wider">Timeline</span>
                  <p className="text-xl font-semibold text-cyan-400 mt-1">{proposal.timeline}</p>
                </div>
              )}
            </div>
          </div>

          {/* Full Content */}
          <div className="p-6 sm:p-8">
            <div
              className="prose prose-invert prose-sm max-w-none
                [&_h2]:text-white [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-2 [&_h2]:mt-8 [&_h2]:mb-4
                [&_h3]:text-cyan-400 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
                [&_p]:text-white/70 [&_p]:leading-relaxed
                [&_li]:text-white/70
                [&_strong]:text-white
                [&_table]:w-full [&_th]:text-left [&_th]:text-white/40 [&_th]:text-xs [&_th]:uppercase [&_th]:p-2 [&_th]:border-b [&_th]:border-white/10
                [&_td]:text-white/70 [&_td]:p-2 [&_td]:border-b [&_td]:border-white/5
                [&_hr]:border-white/10"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(proposal.content) }}
            />
          </div>

          {/* Accept / Decline Actions */}
          {!responded && proposal.status === "sent" && (
            <div className="p-6 sm:p-8 border-t border-white/10 bg-white/[0.02]">
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              {!showDeclineForm ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleRespond("accept")}
                    disabled={responding}
                    className="flex-1 py-3 px-6 bg-primary hover:bg-cyan-hover text-primary-foreground font-bold rounded-xl transition-colors disabled:opacity-50 text-center"
                  >
                    {responding ? "Submitting..." : "Accept Proposal"}
                  </button>
                  <button
                    onClick={() => setShowDeclineForm(true)}
                    disabled={responding}
                    className="flex-1 py-3 px-6 border border-white/20 text-white/60 hover:text-white hover:border-white/40 font-semibold rounded-xl transition-colors disabled:opacity-50 text-center"
                  >
                    Decline
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-white/70 text-sm mb-3">
                    We&apos;d appreciate knowing why so we can improve. This is optional.
                  </p>
                  <label htmlFor="decline-reason" className="sr-only">
                    Reason for declining
                  </label>
                  <textarea
                    id="decline-reason"
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Reason for declining (optional)"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm placeholder:text-white/30 resize-none focus:outline-none focus:border-white/20 mb-3"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRespond("decline")}
                      disabled={responding}
                      className="py-2.5 px-6 bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {responding ? "Submitting..." : "Confirm Decline"}
                    </button>
                    <button
                      onClick={() => setShowDeclineForm(false)}
                      className="py-2.5 px-6 text-white/40 hover:text-white/60 font-medium rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {(
              [
                ["privacy", "Privacy Policy"],
                ["terms", "Terms of Service"],
                ["cookies", "Cookie Policy"],
                ["refund", "Refund Policy"],
                ["ai-policy", "Responsible AI"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActivePolicy(key)}
                className="text-xs text-white/30 transition-colors hover:text-primary"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 text-center">
            <a
              href="https://builtbybas.com"
              className="text-primary/50 text-xs hover:text-primary transition-colors"
            >
              builtbybas.com
            </a>
          </div>
        </div>
      </div>

      {/* Policy overlay */}
      <ProposalPolicyOverlay
        activePolicy={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </main>
  );
}
