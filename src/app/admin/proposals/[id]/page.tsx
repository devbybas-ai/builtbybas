import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { proposals, clients } from "@/lib/schema";
import { decrypt } from "@/lib/encryption";
import { ProposalDetailView } from "@/components/admin/ProposalDetailView";
import type { ProposalService } from "@/types/proposal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proposal Detail - BuiltByBas Admin",
  robots: { index: false, follow: false },
};

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^[a-f0-9-]+$/i.test(id)) {
    notFound();
  }

  const [proposal] = await db
    .select({
      id: proposals.id,
      clientId: proposals.clientId,
      intakeSubmissionId: proposals.intakeSubmissionId,
      title: proposals.title,
      summary: proposals.summary,
      content: proposals.content,
      services: proposals.services,
      estimatedBudgetCents: proposals.estimatedBudgetCents,
      timeline: proposals.timeline,
      validUntil: proposals.validUntil,
      status: proposals.status,
      generatedBy: proposals.generatedBy,
      reviewedBy: proposals.reviewedBy,
      reviewedAt: proposals.reviewedAt,
      sentAt: proposals.sentAt,
      acceptedAt: proposals.acceptedAt,
      respondedAt: proposals.respondedAt,
      rejectionReason: proposals.rejectionReason,
      nudgedAt: proposals.nudgedAt,
      createdAt: proposals.createdAt,
      updatedAt: proposals.updatedAt,
      clientName: clients.name,
      clientCompany: clients.company,
      clientEmail: clients.email,
    })
    .from(proposals)
    .leftJoin(clients, eq(proposals.clientId, clients.id))
    .where(eq(proposals.id, id))
    .limit(1);

  if (!proposal) notFound();

  const data = {
    ...proposal,
    services: (proposal.services ?? []) as ProposalService[],
    clientName: proposal.clientName ? decrypt(proposal.clientName) : null,
    clientEmail: proposal.clientEmail
      ? decrypt(proposal.clientEmail)
      : null,
  };

  return <ProposalDetailView proposal={data} />;
}
