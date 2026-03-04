import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getSubmission } from "@/lib/intake-storage";
import { db } from "@/lib/db";
import { clients } from "@/lib/schema";
import { IntakeAnalysisDashboard } from "@/components/admin/IntakeAnalysisDashboard";
import { IntakeActionBar } from "@/components/admin/IntakeActionBar";

export const metadata: Metadata = {
  title: "Intake Analysis",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminIntakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^[a-f0-9-]+$/i.test(id)) {
    notFound();
  }

  const row = await getSubmission(id);

  if (!row) {
    notFound();
  }

  // Look up linked client
  const [linkedClient] = await db
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.intakeSubmissionId, id))
    .limit(1);

  return (
    <>
      <div className="mb-4">
        <Link
          href="/admin/intake"
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back to submissions
        </Link>
      </div>

      <IntakeActionBar
        intakeId={id}
        initialStatus={row.status}
        linkedClientId={linkedClient?.id ?? null}
      />

      <div className="mt-6">
        <IntakeAnalysisDashboard analysis={row.analysis} />
      </div>
    </>
  );
}
