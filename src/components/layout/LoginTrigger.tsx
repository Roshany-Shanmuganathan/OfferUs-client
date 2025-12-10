'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoginModal } from '@/components/auth/LoginModal';

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
    <LoginModal
      open={loginOpen}
      onOpenChange={(open) => {
        setLoginOpen(open);
        if (!open) {
          // Remove query parameter when modal closes
          const url = new URL(window.location.href);
          url.searchParams.delete('login');
          router.replace(url.pathname + url.search);
        }
      }}
    />
  );
}






