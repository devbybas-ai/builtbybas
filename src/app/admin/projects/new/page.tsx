import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients } from "@/lib/schema";
import { decrypt } from "@/lib/encryption";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Project — BuiltByBas Admin",
  robots: { index: false, follow: false },
};

export default async function NewProjectPage() {
  const allClients = await db
    .select({
      id: clients.id,
      name: clients.name,
      company: clients.company,
    })
    .from(clients)
    .orderBy(desc(clients.updatedAt));

  const clientOptions = allClients.map((c) => ({
    id: c.id,
    label: `${decrypt(c.name)} — ${c.company}`,
  }));

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">New Project</h1>
      <div className="mt-8 max-w-2xl">
        <ProjectForm clients={clientOptions} />
      </div>
    </>
  );
}
