import { NextResponse } from "next/server";
import { getSession } from "./auth";
import type { SafeUser } from "@/types/auth";

type AuthSuccess = { user: SafeUser };
type AuthFailure = { error: NextResponse };

export async function requireAdmin(): Promise<AuthSuccess | AuthFailure> {
  const user = await getSession();

  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  if (user.role !== "owner" && user.role !== "team") {
    return {
      error: NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      ),
    };
  }

  return { user };
}
