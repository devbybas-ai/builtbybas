import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { sanitizeString } from "@/lib/sanitize";

const businessSchema = z.object({
  businessName: z.string().max(255).optional().default(""),
  businessEmail: z.string().email().max(255).or(z.literal("")).optional().default(""),
  businessPhone: z.string().max(50).optional().default(""),
  businessAddress: z.string().max(500).optional().default(""),
  businessWebsite: z.string().max(255).optional().default(""),
  businessDescription: z.string().max(1000).optional().default(""),
});

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const [row] = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, "business_info"))
    .limit(1);

  return NextResponse.json({
    success: true,
    data: row?.value ?? {},
  });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = businessSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 },
    );
  }

  const sanitized = {
    businessName: sanitizeString(parsed.data.businessName ?? ""),
    businessEmail: parsed.data.businessEmail ?? "",
    businessPhone: sanitizeString(parsed.data.businessPhone ?? ""),
    businessAddress: sanitizeString(parsed.data.businessAddress ?? ""),
    businessWebsite: parsed.data.businessWebsite ?? "",
    businessDescription: sanitizeString(parsed.data.businessDescription ?? ""),
  };

  await db
    .insert(siteSettings)
    .values({
      key: "business_info",
      value: sanitized,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: sanitized, updatedAt: new Date() },
    });

  return NextResponse.json({ success: true });
}
