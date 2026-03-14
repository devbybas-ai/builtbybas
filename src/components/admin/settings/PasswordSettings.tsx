"use client";

import { useState } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useFormSection } from "@/hooks/useFormSection";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

export function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { status, setStatus, error, setError } = useFormSection();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setStatus("error");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setStatus("error");
      return;
    }

    setStatus("saving");
    try {
      const res = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setStatus("error");
    }
  }

  return (
    <GlassCard>
      <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Update your password. Must be at least 8 characters.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="current-password" className={labelClass}>
            Current Password
          </label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={cn(inputClass, "max-w-sm")}
            required
            autoComplete="current-password"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="new-password" className={labelClass}>
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className={labelClass}>
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
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
            {status === "saving" ? "Saving..." : status === "success" ? "Saved" : status === "error" ? "Error — Try Again" : "Update Password"}
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
