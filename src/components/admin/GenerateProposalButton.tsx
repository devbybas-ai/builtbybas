"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GenerateProposalButtonProps {
  intakeSubmissionId: string;
  clientId?: string;
}

export function GenerateProposalButton({
  intakeSubmissionId,
  clientId,
}: GenerateProposalButtonProps) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intakeSubmissionId,
          clientId: clientId || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/admin/proposals/${data.data.id}`);
      } else {
        setError(data.error || "Failed to generate proposal");
      }
    } catch {
      setError("Network error");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {generating ? "Generating..." : "Generate Proposal"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
