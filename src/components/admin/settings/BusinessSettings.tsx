"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useFormSection } from "@/hooks/useFormSection";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

interface BusinessInfo {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessWebsite: string;
  businessDescription: string;
}

export function BusinessSettings() {
  const [business, setBusiness] = useState<BusinessInfo>({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    businessAddress: "",
    businessWebsite: "",
    businessDescription: "",
  });
  const { status, setStatus, error, setError } = useFormSection();

  useEffect(() => {
    fetch("/api/settings/business")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setBusiness((prev) => ({ ...prev, ...d.data }));
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/settings/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(business),
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
      <h2 className="text-lg font-semibold text-foreground">Business Information</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Company details used in proposals and invoices.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
