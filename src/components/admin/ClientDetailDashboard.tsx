"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/shared/GlassCard";
import { StageBadge } from "./StageBadge";
import {
  PIPELINE_STAGES,
  getStageMeta,
  type PipelineStage,
  type ClientNoteType,
} from "@/types/client";

interface ClientDetailProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string;
    industry: string | null;
    website: string | null;
    pipelineStage: PipelineStage;
    stageChangedAt: Date;
    intakeSubmissionId: string | null;
    source: string | null;
    status: string;
    createdAt: Date;
    assignedUser: { id: string; name: string | null } | null;
  };
  notes: {
    id: string;
    type: ClientNoteType;
    content: string;
    createdAt: Date;
    author: { id: string; name: string | null };
  }[];
  pipelineHistory: {
    id: string;
    fromStage: PipelineStage | null;
    toStage: PipelineStage;
    note: string | null;
    createdAt: Date;
    changedByUser: { id: string; name: string | null } | null;
  }[];
}

export function ClientDetailDashboard({
  client,
  notes,
  pipelineHistory,
}: ClientDetailProps) {
  const router = useRouter();
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState<ClientNoteType>("general");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const stageMeta = getStageMeta(client.pipelineStage);
  const nextStage = stageMeta
    ? PIPELINE_STAGES.find((s) => s.order === stageMeta.order + 1)
    : undefined;

  async function handleAdvanceStage() {
    if (!nextStage || isAdvancing) return;
    setIsAdvancing(true);
    try {
      const res = await fetch(`/api/clients/${client.id}/stage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: nextStage.value }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setIsAdvancing(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/clients");
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  async function handleAddNote() {
    if (!noteContent.trim() || isSavingNote) return;
    setIsSavingNote(true);
    try {
      const res = await fetch(`/api/clients/${client.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: noteType, content: noteContent }),
      });
      if (res.ok) {
        setNoteContent("");
        router.refresh();
      }
    } finally {
      setIsSavingNote(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {client.company} — {client.email}
            {client.phone ? ` — ${client.phone}` : ""}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <StageBadge stage={client.pipelineStage} />
            {client.source && (
              <span className="text-xs text-muted-foreground">
                Source: {client.source}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
            type="button"
          >
            Delete
          </button>
          {nextStage && (
            <button
              onClick={handleAdvanceStage}
              disabled={isAdvancing}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-cyan-hover disabled:opacity-50"
              type="button"
            >
              {isAdvancing ? "Moving..." : `Move to ${nextStage.label}`}
            </button>
          )}
        </div>
      </div>

      {/* Contact & Business */}
      <GlassCard as="section">
        <h2 className="text-lg font-semibold">Contact & Business</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-medium">{client.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="font-medium">{client.phone ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Company</p>
            <p className="font-medium">{client.company}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Industry</p>
            <p className="font-medium">{client.industry ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Website</p>
            <p className="font-medium">
              {client.website ? (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {client.website}
                </a>
              ) : (
                "—"
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Assigned To</p>
            <p className="font-medium">
              {client.assignedUser?.name ?? "Unassigned"}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Intake Link */}
      {client.intakeSubmissionId && (
        <GlassCard as="section">
          <h2 className="text-lg font-semibold">Intake Submission</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This client was converted from an intake form submission.
          </p>
          <Link
            href={`/admin/intake/${client.intakeSubmissionId}`}
            className="mt-3 inline-flex items-center text-sm text-primary hover:underline"
          >
            View Analysis Dashboard &rarr;
          </Link>
        </GlassCard>
      )}

      {/* Add Note */}
      <GlassCard as="section">
        <h2 className="text-lg font-semibold">Add Note</h2>
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            {(
              ["general", "call", "email", "meeting", "internal"] as const
            ).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setNoteType(t)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  noteType === t
                    ? "bg-primary/20 text-primary"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add a note about this client..."
            rows={3}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
          <button
            onClick={handleAddNote}
            disabled={!noteContent.trim() || isSavingNote}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-cyan-hover disabled:opacity-50"
            type="button"
          >
            {isSavingNote ? "Saving..." : "Save Note"}
          </button>
        </div>
      </GlassCard>

      {/* Notes */}
      {notes.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Notes</h2>
          <div className="mt-4 space-y-3">
            {notes.map((note) => (
              <GlassCard key={note.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {note.author.name}
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                        {note.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-muted-foreground">
                    {new Date(note.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {/* Pipeline History */}
      {pipelineHistory.length > 0 && (
        <GlassCard as="section">
          <h2 className="text-lg font-semibold">Pipeline History</h2>
          <div className="mt-4 space-y-4">
            {pipelineHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 border-l-2 border-white/10 pl-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {entry.fromStage && (
                      <>
                        <StageBadge stage={entry.fromStage} />
                        <span className="text-xs text-muted-foreground">
                          &rarr;
                        </span>
                      </>
                    )}
                    <StageBadge stage={entry.toStage} />
                  </div>
                  {entry.note && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {entry.note}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entry.changedByUser?.name ?? "System"} &middot;{" "}
                    {new Date(entry.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0A0A0F] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-red-400">
              Delete Client
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">{client.name}</strong>? This
              will also delete all their notes and pipeline history. This action
              cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                type="button"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
