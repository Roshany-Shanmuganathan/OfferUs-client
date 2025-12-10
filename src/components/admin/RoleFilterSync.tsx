"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface UseRoleFilterProps {
  onRoleChange: (role: string) => void;
}

/**
 * Component that reads role from URL search params
 * Must be wrapped in Suspense boundary
 */
export function RoleFilterSync({ onRoleChange }: UseRoleFilterProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const role = searchParams.get("role");
    if (role) {
      onRoleChange(role);
    }
  }, [searchParams, onRoleChange]);

  return null; // This component doesn't render anything
}
