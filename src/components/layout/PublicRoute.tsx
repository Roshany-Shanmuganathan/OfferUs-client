'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Define routes that authenticated users can access (offer pages, home, etc.)
    const allowedRoutesForMembers = [
      '/',
      '/offers',
      '/about',
      '/contact',
    ];
    
    // Check if current path is an offer detail page or allowed route
    const isOfferDetailPage = pathname?.startsWith('/offers/');
    const isAllowedRoute = pathname && allowedRoutesForMembers.some(route => 
      route === '/' ? pathname === '/' : pathname.startsWith(route)
    );
    const canViewPage = isOfferDetailPage || isAllowedRoute;

    // If user is authenticated, check if they should be redirected
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        // Admins should always go to admin dashboard (except on allowed routes)
        if (!canViewPage && typeof window !== 'undefined') {
          window.location.href = '/admin';
        }
        return;
      } else if (user.role === 'partner') {
        // Only redirect if partner is approved and not on allowed route
        if (user.partner?.status === 'approved' && !canViewPage) {
          if (typeof window !== 'undefined') {
            window.location.href = '/partner';
          }
          return;
        }
        // If partner is not approved, they can still view public pages
      } else if (user.role === 'member') {
        // Members can view offer pages and public pages
        // Only redirect to dashboard if they're on a non-allowed route
        // This allows members to browse offers even when logged in
        if (!canViewPage && typeof window !== 'undefined') {
          window.location.href = '/member';
        }
        return;
      }
    }
  }, [user, loading, isAuthenticated, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, check if we should block rendering
  if (isAuthenticated && user) {
    // Define routes that authenticated users can access
    const allowedRoutesForMembers = [
      '/',
      '/offers',
      '/about',
      '/contact',
    ];
    
    const isOfferDetailPage = pathname?.startsWith('/offers/');
    const isAllowedRoute = pathname && allowedRoutesForMembers.some(route => 
      route === '/' ? pathname === '/' : pathname.startsWith(route)
    );
    const canViewPage = isOfferDetailPage || isAllowedRoute;

    // For partners, only block if approved and not on allowed route
    if (user.role === 'partner' && user.partner?.status === 'approved' && !canViewPage) {
      return null;
    }
    // For admin, block if not on allowed route
    if (user.role === 'admin' && !canViewPage) {
      return null;
    }
    // For members, allow viewing offer pages and public pages
    // Don't block members from viewing offers
  }

  return <>{children}</>;
}

