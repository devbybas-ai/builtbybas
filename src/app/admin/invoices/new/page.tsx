import type { Metadata } from "next";
import { desc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients, projects } from "@/lib/schema";
import { decrypt } from "@/lib/encryption";
import { InvoiceForm } from "@/components/admin/InvoiceForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Invoice - BuiltByBas Admin",
  robots: { index: false, follow: false },
};

export default async function NewInvoicePage() {
  const [allClients, allProjects] = await Promise.all([
    db
      .select({ id: clients.id, name: clients.name, company: clients.company })
      .from(clients)
      .orderBy(desc(clients.updatedAt)),
    db
      .select({
        id: projects.id,
        name: projects.name,
        clientId: projects.clientId,
      })
      .from(projects)
      .where(inArray(projects.status, ["planning", "in_progress", "on_hold"]))
      .orderBy(desc(projects.updatedAt)),
  ]);

  const clientOptions = allClients.map((c) => ({
    id: c.id,
    label: `${decrypt(c.name)} — ${c.company}`,
  }));

  const projectOptions = allProjects.map((p) => ({
    id: p.id,
    label: p.name,
    clientId: p.clientId,
  }));

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">New Invoice</h1>
      <div className="mt-8 max-w-3xl">
        <InvoiceForm clients={clientOptions} projects={projectOptions} />
      </div>
    </>
  );
}
