import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Note: HTTP-only cookies from different domains (like backend API) are not accessible here
  // We use the user cookie (set by frontend) for basic checks
  // AuthContext will verify actual authentication via API calls
  const userCookie = request.cookies.get("user")?.value;
  let user = null;

  try {
    if (userCookie) {
      user = JSON.parse(userCookie);
    }
  } catch (error) {
    // Invalid user cookie
  }

  // 1. Role-based Redirects from Home
  // If partner or admin logs in, don't allow to view public page (home), redirect to dashboard
  if (pathname === "/" && user) {
    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (user.role === "partner") {
      return NextResponse.redirect(new URL("/partner", request.url));
    }
  }

  // 2. Define Protected Routes Logic
  // Intead of whitelist, we use a blacklist of protected prefixes
  // This ensures that unknown routes (404s) are not caught by the auth check
  const protectedPrefixes = ["/admin", "/partner", "/member"];
  const publicExceptions = ["/partner/register"];

  const isProtectedPath = protectedPrefixes.some((prefix) => 
    pathname.startsWith(prefix)
  );
  const isException = publicExceptions.some((ex) => pathname.startsWith(ex));

  if (isProtectedPath && !isException) {
    // If accessing a protected route without being logged in
    if (!user) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("login", "true");
      return NextResponse.redirect(loginUrl);
    }

    // Role-based Access Control
    if (pathname.startsWith("/admin")) {
      if (user.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    if (pathname.startsWith("/partner")) {
      if (user.role !== "partner") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // Check if partner is approved
      if (
        user.partner &&
        user.partner.status !== "approved"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    if (pathname.startsWith("/member")) {
      if (user.role !== "member") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};

