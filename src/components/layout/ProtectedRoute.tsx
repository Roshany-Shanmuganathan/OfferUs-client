'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'partner' | 'member')[];
  requireApproved?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireApproved = false,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected.current) return;
    if (loading) return;

    if (!isAuthenticated || !user) {
      if (pathname !== '/') {
        hasRedirected.current = true;
        router.push('/');
      }
      return;
    }

    // Check role restrictions
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (pathname !== '/') {
        hasRedirected.current = true;
        router.push('/');
      }
      return;
    }

    // Check if partner is approved
    if (requireApproved && user.role === 'partner') {
      if (user.partner?.status !== 'approved') {
        if (pathname !== '/') {
          hasRedirected.current = true;
          router.push('/');
        }
        return;
      }
    }
  }, [user, loading, isAuthenticated, allowedRoles, requireApproved, router, pathname]);

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

  if (!isAuthenticated || !user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  if (requireApproved && user.role === 'partner' && user.partner?.status !== 'approved') {
    return null;
  }

  return <>{children}</>;
}

