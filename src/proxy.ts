import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// Role-to-home mapping
const ROLE_HOME: Record<string, string> = {
  FARMER: "/farmer/dashboard",
  BUYER: "/buyer/marketplace",
  ADMIN: "/admin/dashboard",
};

// Which path prefixes each role MAY access (whitelist)
const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  FARMER: ["/farmer"],
  BUYER: ["/buyer"],
  ADMIN: ["/admin"],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Next.js internals, static files, and Auth.js API route
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Public landing page
  if (pathname === "/") {
    return NextResponse.next();
  }

  // 3. For login and register: redirect already-authenticated users to their dashboard
  if (pathname === "/login" || pathname === "/register") {
    const session = await auth();
    if (session?.user) {
      const role = (session.user as unknown as { role: string }).role;
      const home = ROLE_HOME[role] ?? "/";
      return NextResponse.redirect(new URL(home, req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  // 4. Check if the route is role-protected
  const isProtected =
    pathname.startsWith("/farmer") ||
    pathname.startsWith("/buyer") ||
    pathname.startsWith("/admin");

  if (!isProtected) {
    return NextResponse.next();
  }

  // 5. Get the session (Auth.js v5 — reads JWT cookie)
  const session = await auth();

  // 6. Not authenticated → redirect to login
  if (!session?.user) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (session.user as unknown as { role: string }).role;

  // 7. Check role is allowed to access this path
  const allowedPrefixes = ROLE_ALLOWED_PREFIXES[role] ?? [];
  const isAllowed = allowedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isAllowed) {
    // Redirect to that role's own home page
    const home = ROLE_HOME[role] ?? "/login";
    return NextResponse.redirect(new URL(home, req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match everything except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Files with extensions (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)",
  ],
};
