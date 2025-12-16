'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthModal } from '@/components/auth/AuthModal';

export function LoginTrigger() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    // Check if login query parameter is present
    const shouldOpenLogin = searchParams.get('login') === 'true';
    if (shouldOpenLogin) {
      setLoginOpen(true);
      // Remove query parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  return (
    <AuthModal
      open={loginOpen}
      defaultView="login"
      onOpenChange={(open) => {
        setLoginOpen(open);
        if (!open) {
          // Remove query parameter when modal closes (safety check)
          const url = new URL(window.location.href);
          url.searchParams.delete('login');
          router.replace(url.pathname + url.search);
        }
      }}
    />
  );
}









