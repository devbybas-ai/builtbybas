import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubmission } from "@/lib/intake-storage";
import { IntakeAnalysisDashboard } from "@/components/admin/IntakeAnalysisDashboard";

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

  return (
    <>
      <Link
        href="/admin/intake"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; Back to submissions
      </Link>
      <IntakeAnalysisDashboard analysis={submission} />
    </>
  );
}
