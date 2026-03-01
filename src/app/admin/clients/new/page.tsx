"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/shared/GlassCard";

export default function NewClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      phone: (form.get("phone") as string) || undefined,
      company: form.get("company") as string,
      industry: (form.get("industry") as string) || undefined,
      website: (form.get("website") as string) || undefined,
      source: (form.get("source") as string) || undefined,
    };

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        router.push(`/admin/clients/${result.data.id}`);
      } else {
        setError(result.error || "Failed to create client");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none";

  return (
    <>
      <Link
        href="/admin/clients"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; Back to clients
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">Add Client</h1>
      <p className="mt-1 text-muted-foreground">
        Create a new client record in the CRM.
      </p>

      <GlassCard className="mt-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium"
              >
                Name *
              </label>
              <input
                id="name"
                name="name"
                required
                minLength={2}
                className={inputClass}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={inputClass}
                placeholder="john@company.com"
              />
            </div>
            <div>
              <label
                htmlFor="company"
                className="mb-1.5 block text-sm font-medium"
              >
                Company *
              </label>
              <input
                id="company"
                name="company"
                required
                className={inputClass}
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                className={inputClass}
                placeholder="555-1234"
              />
            </div>
            <div>
              <label
                htmlFor="industry"
                className="mb-1.5 block text-sm font-medium"
              >
                Industry
              </label>
              <input
                id="industry"
                name="industry"
                className={inputClass}
                placeholder="Technology"
              />
            </div>
            <div>
              <label
                htmlFor="website"
                className="mb-1.5 block text-sm font-medium"
              >
                Website
              </label>
              <input
                id="website"
                name="website"
                className={inputClass}
                placeholder="https://acme.com"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="source"
                className="mb-1.5 block text-sm font-medium"
              >
                Source
              </label>
              <input
                id="source"
                name="source"
                className={inputClass}
                placeholder="Referral, website, cold outreach..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-cyan-hover disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Client"}
            </button>
            <Link
              href="/admin/clients"
              className="rounded-lg border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              Cancel
            </Link>
          </div>
        </form>
      </GlassCard>
    </>
  );
}
