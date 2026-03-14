"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useFormSection } from "@/hooks/useFormSection";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

interface NotificationPrefs {
  emailOnIntake: boolean;
  emailOnProposal: boolean;
  emailOnInvoicePaid: boolean;
  emailDigest: "daily" | "weekly" | "none";
}

export function NotificationSettings() {
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    emailOnIntake: true,
    emailOnProposal: true,
    emailOnInvoicePaid: true,
    emailDigest: "daily",
  });
  const { status, setStatus, error, setError } = useFormSection();

  useEffect(() => {
    fetch("/api/settings/notifications")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setNotifications((prev) => ({ ...prev, ...d.data }));
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifications),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setStatus("error");
    }
  }

  return (
    <GlassCard>
      <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Control when and how you receive email notifications.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications.emailOnIntake}
              onChange={(e) =>
                setNotifications({ ...notifications, emailOnIntake: e.target.checked })
              }
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/30"
            />
            <span className="text-sm text-foreground">
              New intake submission received
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications.emailOnProposal}
              onChange={(e) =>
                setNotifications({ ...notifications, emailOnProposal: e.target.checked })
              }
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/30"
            />
            <span className="text-sm text-foreground">
              Proposal viewed or accepted by client
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications.emailOnInvoicePaid}
              onChange={(e) =>
                setNotifications({ ...notifications, emailOnInvoicePaid: e.target.checked })
              }
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/30"
            />
            <span className="text-sm text-foreground">
              Invoice paid
            </span>
          </label>
        </div>

        <div>
          <label htmlFor="email-digest" className={labelClass}>
            Email Digest
          </label>
          <select
            id="email-digest"
            value={notifications.emailDigest}
            onChange={(e) =>
              setNotifications({
                ...notifications,
                emailDigest: e.target.value as NotificationPrefs["emailDigest"],
              })
            }
            className={cn(inputClass, "max-w-xs")}
          >
            <option value="daily">Daily summary</option>
            <option value="weekly">Weekly summary</option>
            <option value="none">No digest emails</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === "saving"}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              status === "saving"
                ? "bg-white/10 text-muted-foreground cursor-wait"
                : status === "success"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : status === "error"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-primary/20 text-primary hover:bg-primary/30",
            )}
          >
            {status === "saving" ? "Saving..." : status === "success" ? "Saved" : status === "error" ? "Error — Try Again" : "Save Changes"}
          </button>
          {status === "success" && (
            <p className="text-xs text-emerald-400">Changes saved successfully.</p>
          )}
          {status === "error" && error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
