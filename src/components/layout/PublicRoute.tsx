'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // If user is authenticated, redirect to their portal
    // Members are allowed to view public pages, so we don't redirect them
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        if (typeof window !== 'undefined') {
          window.location.href = '/admin';
        }
        return;
      } else if (user.role === 'partner') {
        // Only redirect if partner is approved
        if (user.partner?.status === 'approved') {
          if (typeof window !== 'undefined') {
            window.location.href = '/partner';
          }
          return;
        }
        // If partner is not approved, they can still view public pages
      }
      // Members can access public pages, no redirect needed
    }
  }, [user, loading, isAuthenticated, router]);

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

  // If authenticated, don't render public content (redirect will happen)
  // Members are allowed to view public pages
  if (isAuthenticated && user) {
    // For partners, only block if approved (pending partners can view public pages)
    if (user.role === 'partner' && user.partner?.status === 'approved') {
      return null;
    }
    // For admin, always block (they should be on admin dashboard)
    if (user.role === 'admin') {
      return null;
    }
    // Members can access public pages
  }

  return <>{children}</>;
}

