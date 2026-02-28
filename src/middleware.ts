import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/services",
  "/portfolio",
  "/about",
  "/intake",
  "/login",
];

const SESSION_COOKIE = "builtbybas_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;

  // Public routes — always accessible
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/api/intake") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Login page — redirect to dashboard if already authenticated
  if (pathname === "/login" && sessionCookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Admin routes — require session
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!sessionCookie) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Portal routes — require session
  if (pathname.startsWith("/portal") || pathname.startsWith("/api/portal")) {
    if (!sessionCookie) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
