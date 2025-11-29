import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/offers', '/about', '/contact', '/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Admin routes
  if (pathname.startsWith('/admin')) {
    // Check token in localStorage is not possible in middleware
    // We'll handle this in the layout/component level
    return NextResponse.next();
  }

  // Partner routes
  if (pathname.startsWith('/partner') && !pathname.startsWith('/partner/register')) {
    return NextResponse.next();
  }

  // Member routes
  if (pathname.startsWith('/member')) {
    return NextResponse.next();
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

