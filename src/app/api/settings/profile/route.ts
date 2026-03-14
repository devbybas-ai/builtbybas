import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { requireAdmin } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { sanitizeString } from "@/lib/sanitize";

const profileSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
});

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

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 },
    );
  }

  const { name, email } = parsed.data;

  // Check email uniqueness (excluding current user)
  if (email !== auth.user.email) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already in use" },
        { status: 409 },
      );
    }
  }

  await db
    .update(users)
    .set({ name: sanitizeString(name), email: email.toLowerCase(), updatedAt: new Date() })
    .where(eq(users.id, auth.user.id));

  return NextResponse.json({ success: true });
}
