import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = {
  title: "Settings - BuiltByBas Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-muted-foreground">
        Manage your profile, business information, and notification preferences.
      </p>
      <SettingsForm user={user} />
    </>
  );
}
