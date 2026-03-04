"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SettingsFormProps {
  user: { id: string; name: string; email: string; role: string };
}

interface BusinessInfo {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessWebsite: string;
  businessDescription: string;
}

interface NotificationPrefs {
  emailOnIntake: boolean;
  emailOnProposal: boolean;
  emailOnInvoicePaid: boolean;
  emailDigest: "daily" | "weekly" | "none";
}

type SectionStatus = "idle" | "saving" | "saved" | "error";

// ---------------------------------------------------------------------------
// Shared input styles
// ---------------------------------------------------------------------------

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

function SaveButton({ status, label = "Save Changes" }: { status: SectionStatus; label?: string }) {
  return (
    <button
      type="submit"
      disabled={status === "saving"}
      className={cn(
        "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        status === "saving"
          ? "bg-white/10 text-muted-foreground cursor-wait"
          : status === "saved"
            ? "bg-emerald-500/20 text-emerald-400"
            : status === "error"
              ? "bg-red-500/20 text-red-400"
              : "bg-primary/20 text-primary hover:bg-primary/30",
      )}
    >
      {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : status === "error" ? "Error — Try Again" : label}
    </button>
  );
}

function StatusMessage({ status, error }: { status: SectionStatus; error: string }) {
  if (status === "saved") {
    return <p className="text-xs text-emerald-400">Changes saved successfully.</p>;
  }
  if (status === "error" && error) {
    return <p className="text-xs text-red-400">{error}</p>;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SettingsForm({ user }: SettingsFormProps) {
  // --- Profile state ---
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileStatus, setProfileStatus] = useState<SectionStatus>("idle");
  const [profileError, setProfileError] = useState("");

  // --- Password state ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<SectionStatus>("idle");
  const [passwordError, setPasswordError] = useState("");

  // --- Business info state ---
  const [business, setBusiness] = useState<BusinessInfo>({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    businessWebsite: "",
    businessDescription: "",
  });
  const [businessStatus, setBusinessStatus] = useState<SectionStatus>("idle");
  const [businessError, setBusinessError] = useState("");

  // --- Notification prefs state ---
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    emailOnIntake: true,
    emailOnProposal: true,
    emailOnInvoicePaid: true,
    emailDigest: "daily",
  });
  const [notifStatus, setNotifStatus] = useState<SectionStatus>("idle");
  const [notifError, setNotifError] = useState("");

  // --- Load business + notification data on mount ---
  useEffect(() => {
    fetch("/api/settings/business")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setBusiness((prev) => ({ ...prev, ...d.data }));
      })
      .catch(() => {});

    fetch("/api/settings/notifications")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setNotifications((prev) => ({ ...prev, ...d.data }));
      })
      .catch(() => {});
  }, []);

  // --- Auto-clear status after 3s ---
  useEffect(() => {
    if (profileStatus === "saved" || profileStatus === "error") {
      const t = setTimeout(() => setProfileStatus("idle"), 3000);
      return () => clearTimeout(t);
    }
  }, [profileStatus]);
  useEffect(() => {
    if (passwordStatus === "saved" || passwordStatus === "error") {
      const t = setTimeout(() => setPasswordStatus("idle"), 3000);
      return () => clearTimeout(t);
    }
  }, [passwordStatus]);
  useEffect(() => {
    if (businessStatus === "saved" || businessStatus === "error") {
      const t = setTimeout(() => setBusinessStatus("idle"), 3000);
      return () => clearTimeout(t);
    }
  }, [businessStatus]);
  useEffect(() => {
    if (notifStatus === "saved" || notifStatus === "error") {
      const t = setTimeout(() => setNotifStatus("idle"), 3000);
      return () => clearTimeout(t);
    }
  }, [notifStatus]);

  // --- Handlers ---

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileStatus("saving");
    setProfileError("");
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, email: profileEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setProfileStatus("saved");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to save");
      setProfileStatus("error");
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      setPasswordStatus("error");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setPasswordStatus("error");
      return;
    }

    setPasswordStatus("saving");
    try {
      const res = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setPasswordStatus("saved");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to save");
      setPasswordStatus("error");
    }
  }

  async function handleBusinessSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusinessStatus("saving");
    setBusinessError("");
    try {
      const res = await fetch("/api/settings/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(business),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setBusinessStatus("saved");
    } catch (err) {
      setBusinessError(err instanceof Error ? err.message : "Failed to save");
      setBusinessStatus("error");
    }
  }

  async function handleNotifSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotifStatus("saving");
    setNotifError("");
    try {
      const res = await fetch("/api/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifications),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setNotifStatus("saved");
    } catch (err) {
      setNotifError(err instanceof Error ? err.message : "Failed to save");
      setNotifStatus("error");
    }
  }

  return (
    <div className="mt-6 space-y-6">
      {/* ============ Profile ============ */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your personal information and login credentials.
        </p>
        <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4">
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
            <SaveButton status={profileStatus} />
            <StatusMessage status={profileStatus} error={profileError} />
          </div>
        </form>
      </GlassCard>

      {/* ============ Password ============ */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your password. Must be at least 8 characters.
        </p>
        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
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
            <SaveButton status={passwordStatus} label="Update Password" />
            <StatusMessage status={passwordStatus} error={passwordError} />
          </div>
        </form>
      </GlassCard>

      {/* ============ Business Info ============ */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-foreground">Business Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Company details used in proposals and invoices.
        </p>
        <form onSubmit={handleBusinessSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="biz-name" className={labelClass}>
                Business Name
              </label>
              <input
                id="biz-name"
                type="text"
                value={business.businessName}
                onChange={(e) => setBusiness({ ...business, businessName: e.target.value })}
                className={inputClass}
                placeholder="BuiltByBas"
              />
            </div>
            <div>
              <label htmlFor="biz-email" className={labelClass}>
                Business Email
              </label>
              <input
                id="biz-email"
                type="email"
                value={business.businessEmail}
                onChange={(e) => setBusiness({ ...business, businessEmail: e.target.value })}
                className={inputClass}
                placeholder="hello@builtbybas.com"
              />
            </div>
            <div>
              <label htmlFor="biz-phone" className={labelClass}>
                Phone
              </label>
              <input
                id="biz-phone"
                type="tel"
                value={business.businessPhone}
                onChange={(e) => setBusiness({ ...business, businessPhone: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="biz-website" className={labelClass}>
                Website
              </label>
              <input
                id="biz-website"
                type="text"
                value={business.businessWebsite}
                onChange={(e) => setBusiness({ ...business, businessWebsite: e.target.value })}
                className={inputClass}
                placeholder="https://builtbybas.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="biz-address" className={labelClass}>
              Address
            </label>
            <input
              id="biz-address"
              type="text"
              value={business.businessAddress}
              onChange={(e) => setBusiness({ ...business, businessAddress: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="biz-description" className={labelClass}>
              Business Description
            </label>
            <textarea
              id="biz-description"
              value={business.businessDescription}
              onChange={(e) => setBusiness({ ...business, businessDescription: e.target.value })}
              className={cn(inputClass, "min-h-[80px] resize-y")}
              placeholder="Brief description of your business for proposals..."
              maxLength={1000}
            />
          </div>
          <div className="flex items-center gap-3">
            <SaveButton status={businessStatus} />
            <StatusMessage status={businessStatus} error={businessError} />
          </div>
        </form>
      </GlassCard>

      {/* ============ Notifications ============ */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Control when and how you receive email notifications.
        </p>
        <form onSubmit={handleNotifSubmit} className="mt-4 space-y-4">
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
            <SaveButton status={notifStatus} />
            <StatusMessage status={notifStatus} error={notifError} />
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
