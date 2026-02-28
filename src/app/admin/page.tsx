import type { Metadata } from "next";
import { GlassCard } from "@/components/shared/GlassCard";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        Welcome back. Here&apos;s your business at a glance.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <p className="text-sm text-muted-foreground">Active Clients</p>
          <p className="mt-1 text-3xl font-bold text-foreground">—</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Pipeline</p>
          <p className="mt-1 text-3xl font-bold text-foreground">—</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Revenue (Month)</p>
          <p className="mt-1 text-3xl font-bold text-foreground">—</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Proposals Sent</p>
          <p className="mt-1 text-3xl font-bold text-foreground">—</p>
        </GlassCard>
      </div>
    </>
  );
}
