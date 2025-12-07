import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Note: HTTP-only cookies from different domains (like backend API) are not accessible here
  // We use the user cookie (set by frontend) for basic checks
  // AuthContext will verify actual authentication via API calls
  const userCookie = request.cookies.get("user")?.value;

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/offers",
    "/auth/login",
    "/auth/signup",
    "/partner/register",
  ];

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(route);
  });

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes - check user cookie for basic authorization
  // Actual authentication is verified by AuthContext via API calls
  if (!userCookie) {
    // No user cookie - redirect to home with login trigger
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("login", "true");
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control using user cookie
  try {
    const user = JSON.parse(userCookie);

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (user.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Partner routes
    if (pathname.startsWith("/partner")) {
      if (user.role !== "partner") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // Check if partner is approved (except for register route)
      // Note: If partner data isn't in cookie yet (edge case), allow through
      // ProtectedRoute will handle the actual authentication check via API
      if (
        !pathname.startsWith("/partner/register") &&
        user.partner &&
        user.partner.status !== "approved"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // If partner data is missing from cookie, allow through - AuthContext will verify via API
    }

    // Member routes
    if (pathname.startsWith("/member")) {
      if (user.role !== "member") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  } catch (error) {
    // Invalid user cookie - redirect to home
    // AuthContext will handle re-authentication
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("login", "true");
    return NextResponse.redirect(loginUrl);
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

