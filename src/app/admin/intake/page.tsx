import type { Metadata } from "next";
import { listSubmissions } from "@/lib/intake-storage";
import { IntakeListCard } from "@/components/admin/IntakeListCard";

export const metadata: Metadata = {
  title: "Intake Submissions",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminIntakePage() {
  const submissions = await listSubmissions();

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Intake Submissions</h1>
      <p className="mt-1 text-muted-foreground">
        Review and analyze incoming project inquiries. Every submission gets the
        same depth of analysis.
      </p>

      {submissions.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground">No submissions yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When someone completes the intake form, their submission will appear
            here with a full analysis.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {submissions.map((submission) => (
            <IntakeListCard key={submission.id} analysis={submission} />
          ))}
        </div>
      )}
    </>
  );
}
