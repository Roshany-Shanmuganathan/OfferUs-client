"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "partner" | "member")[];
  requireApproved?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireApproved = false,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Skip if still loading
    if (loading) return;

    // If user is authenticated, check role and approval requirements
    if (isAuthenticated && user) {
      // Check role restrictions
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push("/");
        return;
      }

      // Check if partner is approved
      if (requireApproved && user.role === "partner") {
        if (user.partner?.status !== "approved") {
          router.push("/");
          return;
        }
      }
    }
    // If not authenticated, the modal will be shown in render (no state update needed)
  }, [user, loading, isAuthenticated, allowedRoles, requireApproved, router]);

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

  // Show login modal if not authenticated
  // Derive modal state from authentication state instead of managing it separately
  const shouldShowLoginModal = !loading && (!isAuthenticated || !user);

  if (shouldShowLoginModal) {
    return (
      <>
        <LoginModal
          open={true}
          onOpenChange={open => {
            // If user tries to close modal without logging in, redirect to home
            if (!open && !isAuthenticated) {
              router.push("/");
            }
          }}
        />
        {null}
      </>
    );
  }

  // At this point, user must be authenticated and not null
  // Add explicit null check for TypeScript
  if (!user) {
    return null;
  }

  // Don't render if role doesn't match
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  // Don't render if partner is not approved when required
  if (
    requireApproved &&
    user.role === "partner" &&
    user.partner?.status !== "approved"
  ) {
    return null;
  }

  return <>{children}</>;
}
