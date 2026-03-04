"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { IntakeStatus } from "@/lib/intake-storage";

interface IntakeActionBarProps {
  intakeId: string;
  initialStatus: IntakeStatus;
  linkedClientId: string | null;
}

const STATUS_CONFIG: Record<
  IntakeStatus,
  { label: string; color: string }
> = {
  new: { label: "New", color: "bg-blue-500/20 text-blue-400" },
  reviewed: { label: "Reviewed", color: "bg-amber-500/20 text-amber-400" },
  accepted: { label: "Accepted", color: "bg-emerald-500/20 text-emerald-400" },
  rejected: { label: "Rejected", color: "bg-red-500/20 text-red-400" },
  converted: { label: "Converted", color: "bg-cyan-500/20 text-cyan-400" },
};

export function IntakeActionBar({
  intakeId,
  initialStatus,
  linkedClientId,
}: IntakeActionBarProps) {
  const router = useRouter();
  const [status, setStatus] = useState<IntakeStatus>(initialStatus);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [clientId, setClientId] = useState(linkedClientId);

  async function updateStatus(newStatus: IntakeStatus) {
    setLoading(newStatus);
    setError("");
    try {
      const res = await fetch(`/api/intake/${intakeId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(newStatus);
      } else {
        setError(data.error || "Failed to update status");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading("");
    }
  }

  async function convertToClient() {
    setLoading("convert");
    setError("");
    try {
      const res = await fetch("/api/clients/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeSubmissionId: intakeId }),
      });
      const data = await res.json();
      if (data.success) {
        setClientId(data.data.id);
        setStatus("converted");
        await fetch(`/api/intake/${intakeId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "converted" }),
        });
        router.refresh();
      } else {
        setError(data.error || "Failed to convert");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading("");
    }
  }

  async function generateProposal() {
    setLoading("proposal");
    setError("");
    try {
      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intakeSubmissionId: intakeId,
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
      setLoading("");
    }
  }

  const config = STATUS_CONFIG[status];
  const isLoading = loading !== "";

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Badge */}
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
            config.color,
          )}
        >
          {config.label}
        </span>

        <div className="h-4 w-px bg-white/10" />

        {/* Action Buttons */}
        {status === "new" && (
          <>
            <button
              type="button"
              onClick={() => updateStatus("reviewed")}
              disabled={isLoading}
              className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-500/20 disabled:opacity-50"
            >
              {loading === "reviewed" ? "Updating..." : "Mark Reviewed"}
            </button>
            <button
              type="button"
              onClick={() => updateStatus("accepted")}
              disabled={isLoading}
              className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
            >
              {loading === "accepted" ? "Updating..." : "Accept"}
            </button>
            <button
              type="button"
              onClick={() => updateStatus("rejected")}
              disabled={isLoading}
              className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            >
              {loading === "rejected" ? "Updating..." : "Reject"}
            </button>
          </>
        )}

        {status === "reviewed" && (
          <>
            <button
              type="button"
              onClick={() => updateStatus("accepted")}
              disabled={isLoading}
              className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
            >
              {loading === "accepted" ? "Updating..." : "Accept"}
            </button>
            <button
              type="button"
              onClick={() => updateStatus("rejected")}
              disabled={isLoading}
              className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
            >
              {loading === "rejected" ? "Updating..." : "Reject"}
            </button>
          </>
        )}

        {status === "accepted" && !clientId && (
          <button
            type="button"
            onClick={convertToClient}
            disabled={isLoading}
            className="rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20 disabled:opacity-50"
          >
            {loading === "convert" ? "Converting..." : "Convert to Client"}
          </button>
        )}

        {(status === "accepted" || status === "converted") && (
          <button
            type="button"
            onClick={generateProposal}
            disabled={isLoading}
            className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
          >
            {loading === "proposal" ? "Generating..." : "Generate Proposal"}
          </button>
        )}

        {status === "rejected" && (
          <button
            type="button"
            onClick={() => updateStatus("new")}
            disabled={isLoading}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            {loading === "new" ? "Updating..." : "Reopen"}
          </button>
        )}

        {clientId && (
          <a
            href={`/admin/clients/${clientId}`}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/10"
          >
            View Client
          </a>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
