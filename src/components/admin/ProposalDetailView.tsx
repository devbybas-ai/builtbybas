"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";
import {
  PROPOSAL_STATUSES,
  getProposalStatusMeta,
} from "@/types/proposal";
import type { ProposalStatus, ProposalService } from "@/types/proposal";
import { markdownToHtml } from "@/lib/markdown-to-html";

interface ProposalData {
  id: string;
  clientId: string;
  intakeSubmissionId: string | null;
  title: string;
  summary: string;
  content: string;
  services: ProposalService[];
  estimatedBudgetCents: number | null;
  timeline: string | null;
  validUntil: Date | null;
  status: ProposalStatus;
  generatedBy: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  sentAt: Date | null;
  acceptedAt: Date | null;
  respondedAt: Date | null;
  rejectionReason: string | null;
  nudgedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  clientName: string | null;
  clientCompany: string | null;
  clientEmail: string | null;
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toDateInputValue(d: Date | null): string {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toISOString().split("T")[0];
}

export function ProposalDetailView({
  proposal,
}: {
  proposal: ProposalData;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [sendEmail, setSendEmail] = useState("");
  const [sendName, setSendName] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(proposal.title);
  const [editSummary, setEditSummary] = useState(proposal.summary);
  const [editContent, setEditContent] = useState(proposal.content);
  const [editTimeline, setEditTimeline] = useState(proposal.timeline ?? "");
  const [editValidUntil, setEditValidUntil] = useState(
    toDateInputValue(proposal.validUntil)
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Rejection dialog
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  // Nudge
  const [nudging, setNudging] = useState(false);
  const [nudgeError, setNudgeError] = useState("");
  const [nudgeSuccess, setNudgeSuccess] = useState(false);

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const statusMeta = getProposalStatusMeta(proposal.status);
  const isExpired =
    proposal.validUntil && new Date(proposal.validUntil) < new Date();

  const canEdit = ["draft", "reviewed"].includes(proposal.status);

  async function updateStatus(status: string, extra?: Record<string, unknown>) {
    setUpdating(true);
    try {
      await fetch(`/api/proposals/${proposal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extra }),
      });
      router.refresh();
    } finally {
      setUpdating(false);
    }
  }

  function handleStatusClick(status: string) {
    if (status === "rejected") {
      setRejectReason("");
      setRejectError("");
      setShowRejectDialog(true);
    } else {
      updateStatus(status);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) {
      setRejectError("Please provide a reason for rejecting this proposal.");
      return;
    }
    setRejectError("");
    setShowRejectDialog(false);
    await updateStatus("rejected", { rejectionReason: rejectReason.trim() });
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/proposals");
      }
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  async function handleReviewAndMark() {
    await updateStatus("reviewed");
    setReviewed(true);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setSendError("");
    setSendSuccess(false);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: sendEmail,
          recipientName: sendName || undefined,
          customMessage: sendMessage || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSendSuccess(true);
        router.refresh();
      } else {
        setSendError(data.error || "Failed to send proposal");
      }
    } catch {
      setSendError("Network error");
    } finally {
      setSending(false);
    }
  }

  async function handleNudge() {
    setNudging(true);
    setNudgeError("");
    setNudgeSuccess(false);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/nudge`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setNudgeSuccess(true);
      } else {
        setNudgeError(data.error || "Failed to send follow-up");
      }
    } catch {
      setNudgeError("Network error");
    } finally {
      setNudging(false);
    }
  }

  function startEditing() {
    setEditTitle(proposal.title);
    setEditSummary(proposal.summary);
    setEditContent(proposal.content);
    setEditTimeline(proposal.timeline ?? "");
    setEditValidUntil(toDateInputValue(proposal.validUntil));
    setSaveError("");
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setSaveError("");
  }

  async function handleSaveRevision() {
    setSaving(true);
    setSaveError("");
    try {
      const payload: Record<string, unknown> = {
        title: editTitle,
        summary: editSummary,
        content: editContent,
        timeline: editTimeline || null,
        validUntil: editValidUntil
          ? new Date(editValidUntil + "T00:00:00Z").toISOString()
          : null,
      };
      // If previously reviewed, reset to draft — content changed, needs re-review
      if (proposal.status === "reviewed") {
        payload.status = "draft";
      }
      const res = await fetch(`/api/proposals/${proposal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setEditing(false);
        setReviewed(false);
        router.refresh();
      } else {
        setSaveError(data.error || "Failed to save changes");
      }
    } catch {
      setSaveError("Network error");
    } finally {
      setSaving(false);
    }
  }

  const canSend =
    proposal.status === "reviewed" || reviewed;

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/proposals"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; All Proposals
          </Link>
          {editing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-2xl font-bold tracking-tight focus:border-primary focus:outline-none"
            />
          ) : (
            <h1 className="mt-2 text-2xl font-bold tracking-tight">
              {proposal.title}
            </h1>
          )}
          <p className="mt-1 text-muted-foreground">
            {proposal.clientCompany}
            {proposal.clientName ? ` — ${proposal.clientName}` : ""}
            {proposal.clientEmail ? ` (${proposal.clientEmail})` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
          >
            Delete
          </button>
          {canEdit && !editing && (
            <button
              onClick={startEditing}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/10"
            >
              Edit Proposal
            </button>
          )}
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
              isExpired && proposal.status === "sent"
                ? "bg-red-500/20 text-red-400"
                : statusMeta.color
            )}
          >
            {isExpired && proposal.status === "sent"
              ? "Expired"
              : statusMeta.label}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className="mt-1 text-2xl font-bold">
            {proposal.estimatedBudgetCents
              ? formatCents(proposal.estimatedBudgetCents)
              : "—"}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Timeline</p>
          <p className="mt-1 text-xl font-bold">
            {proposal.timeline ?? "—"}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Valid Until</p>
          <p
            className={cn(
              "mt-1 text-xl font-bold",
              isExpired && "text-red-400"
            )}
          >
            {formatDate(proposal.validUntil)}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Services</p>
          <p className="mt-1 text-xl font-bold">
            {proposal.services.length}
          </p>
        </GlassCard>
      </div>

      {/* Client Response Banner */}
      {proposal.status === "accepted" && proposal.respondedAt && (
        <GlassCard className="mt-6 border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-emerald-400">Client Accepted</p>
              <p className="text-sm text-muted-foreground">
                Responded on {formatDate(proposal.respondedAt)}
                {proposal.acceptedAt ? ` — Accepted ${formatDate(proposal.acceptedAt)}` : ""}
              </p>
            </div>
          </div>
        </GlassCard>
      )}
      {proposal.status === "rejected" && proposal.respondedAt && (
        <GlassCard className="mt-6 border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-red-400">Client Declined</p>
              <p className="text-sm text-muted-foreground">
                Responded on {formatDate(proposal.respondedAt)}
              </p>
              {proposal.rejectionReason && (
                <p className="mt-1 text-sm text-white/70">
                  &ldquo;{proposal.rejectionReason}&rdquo;
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Edit Controls */}
      {editing && (
        <GlassCard className="mt-6 border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Editing Proposal</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {proposal.status === "reviewed"
                  ? "Saving will reset status to Draft for re-review."
                  : "Make your changes, then save."}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={cancelEditing}
                disabled={saving}
                className="rounded-lg border border-white/10 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRevision}
                disabled={saving || !editTitle.trim() || !editSummary.trim() || !editContent.trim()}
                className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Revisions"}
              </button>
            </div>
          </div>
          {saveError && (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {saveError}
            </p>
          )}
        </GlassCard>
      )}

      {/* Summary */}
      <GlassCard className="mt-6">
        <h2 className="text-sm font-semibold">Summary</h2>
        {editing ? (
          <textarea
            value={editSummary}
            onChange={(e) => setEditSummary(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            {proposal.summary}
          </p>
        )}
      </GlassCard>

      {/* Editable Timeline + Valid Until */}
      {editing && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <GlassCard>
            <label htmlFor="editTimeline" className="text-sm font-semibold">
              Timeline
            </label>
            <input
              id="editTimeline"
              type="text"
              value={editTimeline}
              onChange={(e) => setEditTimeline(e.target.value)}
              placeholder="e.g., 8-12 weeks"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </GlassCard>
          <GlassCard>
            <label htmlFor="editValidUntil" className="text-sm font-semibold">
              Valid Until
            </label>
            <input
              id="editValidUntil"
              type="date"
              value={editValidUntil}
              onChange={(e) => setEditValidUntil(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </GlassCard>
        </div>
      )}

      {/* Services Breakdown */}
      {proposal.services.length > 0 && (
        <GlassCard className="mt-4">
          <h2 className="text-sm font-semibold">Services</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs text-muted-foreground">
                  <th className="pb-2 pr-4">Service</th>
                  <th className="pb-2 pr-4 text-right">Estimate</th>
                  <th className="pb-2 text-right">Timeline</th>
                </tr>
              </thead>
              <tbody>
                {proposal.services.map((svc) => (
                  <tr
                    key={svc.serviceId}
                    className="border-b border-white/5"
                  >
                    <td className="py-3 pr-4">
                      <p className="font-medium">{svc.serviceName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {svc.description}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-right font-medium">
                      {formatCents(svc.estimatedPriceCents)}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">
                      {svc.estimatedTimeline}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-white/10 text-lg font-bold">
                  <td className="pt-3">Total</td>
                  <td className="pt-3 text-right">
                    {proposal.estimatedBudgetCents
                      ? formatCents(proposal.estimatedBudgetCents)
                      : "—"}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Full Proposal Content */}
      <GlassCard className="mt-4">
        <h2 className="text-sm font-semibold">Proposal Content</h2>
        {editing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={20}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm leading-relaxed focus:border-primary focus:outline-none"
            placeholder="Markdown content..."
          />
        ) : (
          <div
            className="proposal-content mt-4"
            dangerouslySetInnerHTML={{
              __html: markdownToHtml(proposal.content),
            }}
          />
        )}
      </GlassCard>

      {/* Rejection Reason */}
      {proposal.rejectionReason && (
        <GlassCard className="mt-4">
          <h2 className="text-sm font-semibold text-red-400">
            Rejection Reason
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {proposal.rejectionReason}
          </p>
        </GlassCard>
      )}

      {/* Audit Trail */}
      <GlassCard className="mt-4">
        <h2 className="text-sm font-semibold">Timeline</h2>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          <p>Created: {formatDate(proposal.createdAt)}</p>
          {proposal.reviewedAt && (
            <p>Reviewed: {formatDate(proposal.reviewedAt)}</p>
          )}
          {proposal.sentAt && (
            <p>Sent: {formatDate(proposal.sentAt)}</p>
          )}
          {proposal.respondedAt && (
            <p>Client Responded: {formatDate(proposal.respondedAt)}</p>
          )}
          {proposal.acceptedAt && (
            <p>Accepted: {formatDate(proposal.acceptedAt)}</p>
          )}
        </div>
      </GlassCard>

      {/* Status Update */}
      <GlassCard className="mt-6">
        <h2 className="text-sm font-semibold">Update Status</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROPOSAL_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStatusClick(s.value)}
              disabled={updating || s.value === proposal.status}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-40",
                s.value === proposal.status
                  ? s.color
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Review Gate (RAI Compliance) */}
      {proposal.status === "draft" && (
        <GlassCard className="mt-6 border-amber-500/20">
          <h2 className="text-sm font-semibold">Review Gate</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This proposal must be reviewed before it can be sent to the
            client. Review the content above, then confirm.
          </p>
          <button
            onClick={handleReviewAndMark}
            disabled={updating}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {updating
              ? "Marking..."
              : "I have reviewed this proposal"}
          </button>
        </GlassCard>
      )}

      {/* Send Proposal */}
      {canSend && !sendSuccess && (
        <GlassCard className="mt-6 border-cyan-500/20">
          <h2 className="text-sm font-semibold">Send Proposal</h2>
          <form onSubmit={handleSend} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="sendEmail"
                  className="block text-sm font-medium"
                >
                  Recipient Email
                </label>
                <input
                  id="sendEmail"
                  type="email"
                  required
                  value={sendEmail}
                  onChange={(e) => setSendEmail(e.target.value)}
                  placeholder={
                    proposal.clientEmail ?? "client@example.com"
                  }
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="sendName"
                  className="block text-sm font-medium"
                >
                  Recipient Name (optional)
                </label>
                <input
                  id="sendName"
                  type="text"
                  value={sendName}
                  onChange={(e) => setSendName(e.target.value)}
                  placeholder={proposal.clientName ?? ""}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="sendMessage"
                className="block text-sm font-medium"
              >
                Custom Message (optional)
              </label>
              <textarea
                id="sendMessage"
                rows={2}
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
                placeholder="Looking forward to working together!"
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            {sendError && (
              <p className="text-sm text-red-400" role="alert">
                {sendError}
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Proposal"}
            </button>
          </form>
        </GlassCard>
      )}

      {sendSuccess && (
        <GlassCard className="mt-6 border-emerald-500/20">
          <p className="text-sm font-medium text-emerald-400">
            Proposal sent successfully.
          </p>
        </GlassCard>
      )}

      {/* Gentle Nudge — only for sent proposals */}
      {proposal.status === "sent" && (
        <GlassCard className="mt-6 border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Follow Up</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Send a gentle reminder to the client.
                {proposal.nudgedAt && (
                  <> Last follow-up: {formatDate(proposal.nudgedAt)}.</>
                )}
              </p>
            </div>
            <button
              onClick={handleNudge}
              disabled={nudging || nudgeSuccess}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              {nudging
                ? "Sending..."
                : nudgeSuccess
                  ? "Follow-up Sent"
                  : "Send Gentle Nudge"}
            </button>
          </div>
          {nudgeError && (
            <p className="mt-2 text-sm text-red-400" role="alert">
              {nudgeError}
            </p>
          )}
          {nudgeSuccess && (
            <p className="mt-2 text-sm text-emerald-400">
              Follow-up email sent successfully.
            </p>
          )}
        </GlassCard>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0A0A0F] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-red-400">
              Delete Proposal
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to permanently delete this proposal? This
              action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0A0A0F] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-red-400">
              Reject Proposal
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please explain why this proposal is being rejected. This reason
              will be recorded for reference.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Reason for rejection..."
              className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
              autoFocus
            />
            {rejectError && (
              <p className="mt-2 text-sm text-red-400" role="alert">
                {rejectError}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectDialog(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={updating}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {updating ? "Rejecting..." : "Reject Proposal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
