import type { Metadata } from "next";
import { GlassCard } from "@/components/shared/GlassCard";

export const metadata: Metadata = {
  title: "Client Portal",
  robots: { index: false, follow: false },
};

export default function PortalDashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
      <p className="mt-1 text-muted-foreground">
        Track your project progress and deliverables.
      </p>

      <div className="mt-8">
        <GlassCard>
          <p className="text-sm text-muted-foreground">
            Your projects will appear here once assigned.
          </p>
        </GlassCard>
      </div>
    </>
  );
}
