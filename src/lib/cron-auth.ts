import { type NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { requireAdmin } from "./api-auth";

export async function requireCronAuth(
  request: NextRequest
): Promise<{ source: "cron" | "admin" } | { error: NextResponse }> {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ") && cronSecret) {
    const token = authHeader.slice(7);
    const tokenBuf = Buffer.from(token);
    const secretBuf = Buffer.from(cronSecret);
    if (
      tokenBuf.length === secretBuf.length &&
      timingSafeEqual(tokenBuf, secretBuf)
    ) {
      return { source: "cron" };
    }
  }

  const admin = await requireAdmin();
  if ("error" in admin) return { error: admin.error };
  return { source: "admin" };
}
