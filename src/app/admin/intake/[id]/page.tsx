import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getSubmission } from "@/lib/intake-storage";
import { db } from "@/lib/db";
import { clients } from "@/lib/schema";
import { IntakeAnalysisDashboard } from "@/components/admin/IntakeAnalysisDashboard";
import { GenerateProposalButton } from "@/components/admin/GenerateProposalButton";

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

  const submission = await getSubmission(id);

  if (!submission) {
    notFound();
  }

  // Look up linked client for proposal generation
  const [linkedClient] = await db
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.intakeSubmissionId, id))
    .limit(1);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/intake"
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back to submissions
        </Link>
        {linkedClient && (
          <GenerateProposalButton
            intakeSubmissionId={id}
            clientId={linkedClient.id}
          />
        )}
      </div>
      <IntakeAnalysisDashboard analysis={submission} />
    </>
  );
}
