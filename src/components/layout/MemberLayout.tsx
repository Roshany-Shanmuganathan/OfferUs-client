'use client';

import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ProtectedRoute } from './ProtectedRoute';

export function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['member']}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

