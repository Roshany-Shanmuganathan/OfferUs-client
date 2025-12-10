'use client';

import { Suspense } from 'react';
import { AdminLayout } from './AdminLayout';

/**
 * Wrapper component for AdminLayout that provides Suspense boundary
 * Required for useSearchParams() in Next.js 15
 */
export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  );
}
