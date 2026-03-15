import type { Metadata } from "next";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { projects, clients, billingMilestones } from "@/lib/schema";
import { decrypt } from "@/lib/encryption";
import { ProjectDetailView } from "@/components/admin/ProjectDetailView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project Detail - BuiltByBas Admin",
  robots: { index: false, follow: false },
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project] = await db
    .select({
      id: projects.id,
      clientId: projects.clientId,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      startDate: projects.startDate,
      targetDate: projects.targetDate,
      completedDate: projects.completedDate,
      budgetCents: projects.budgetCents,
      services: projects.services,
      assignedTo: projects.assignedTo,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      clientName: clients.name,
      clientCompany: clients.company,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .where(eq(projects.id, id))
    .limit(1);

  if (!project) notFound();

  const data = {
    ...project,
    clientName: project.clientName ? decrypt(project.clientName) : null,
    services: (project.services ?? []) as string[],
  };

  const milestones = await db
    .select()
    .from(billingMilestones)
    .where(eq(billingMilestones.projectId, id))
    .orderBy(asc(billingMilestones.percentage));

  return <ProjectDetailView project={data} milestones={milestones} />;
}
