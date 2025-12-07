import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Define public routes
  const publicRoutes = ["/", "/auth/login", "/auth/signup", "/offers"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Role-based access
  const userCookie = request.cookies.get("user")?.value;
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      if (pathname.startsWith("/admin") && user.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (pathname.startsWith("/partner") && user.role !== "partner") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (pathname.startsWith("/member") && user.role !== "member") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      // Invalid user cookie, continue with normal flow
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/partner/:path*", "/member/:path*"],
};

