"use client";

import { useState } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useFormSection } from "@/hooks/useFormSection";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

interface ProfileSettingsProps {
  user: { id: string; name: string; email: string; role: string };
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const { status, setStatus, error, setError } = useFormSection();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, email: profileEmail }),
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
      <h2 className="text-lg font-semibold text-foreground">Profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your personal information and login credentials.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-name" className={labelClass}>
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="profile-email" className={labelClass}>
              Email Address
            </label>
            <input
              id="profile-email"
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className={inputClass}
              required
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
