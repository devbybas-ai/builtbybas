import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";

const notificationSchema = z.object({
  emailOnIntake: z.boolean().optional().default(true),
  emailOnProposal: z.boolean().optional().default(true),
  emailOnInvoicePaid: z.boolean().optional().default(true),
  emailDigest: z.enum(["daily", "weekly", "none"]).optional().default("daily"),
});

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const [row] = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, "notification_prefs"))
    .limit(1);

  return NextResponse.json({
    success: true,
    data: row?.value ?? {
      emailOnIntake: true,
      emailOnProposal: true,
      emailOnInvoicePaid: true,
      emailDigest: "daily",
    },
  });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await request.json();
  const parsed = notificationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await db
    .insert(siteSettings)
    .values({
      key: "notification_prefs",
      value: parsed.data,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: parsed.data, updatedAt: new Date() },
    });

  return NextResponse.json({ success: true });
}
