"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/shared/GlassCard";

interface ProposalFormProps {
  clients: { id: string; label: string }[];
}

export function ProposalForm({ clients }: ProposalFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [clientId, setClientId] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const validUntilStr = form.get("validUntil") as string;

    const body = {
      clientId,
      title: form.get("title") as string,
      summary: form.get("summary") as string,
      content: form.get("content") as string,
      timeline: (form.get("timeline") as string) || undefined,
      validUntil: validUntilStr
        ? new Date(validUntilStr).toISOString()
        : undefined,
    };

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/admin/proposals/${data.data.id}`);
      } else {
        setError(data.error || "Failed to create proposal");
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlassCard>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium">
              Client
            </label>
            <select
              id="clientId"
              name="clientId"
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="timeline" className="block text-sm font-medium">
              Timeline (optional)
            </label>
            <input
              id="timeline"
              name="timeline"
              type="text"
              placeholder="6-8 weeks"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="Proposal for Acme Corp"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={2}
            required
            placeholder="Brief overview of the proposal"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            required
            placeholder="## Executive Summary&#10;&#10;This proposal outlines..."
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="validUntil" className="block text-sm font-medium">
            Valid Until (optional)
          </label>
          <input
            id="validUntil"
            name="validUntil"
            type="date"
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Proposal"}
        </button>
      </form>
    </GlassCard>
  );
}
