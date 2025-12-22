'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthModal } from '@/components/auth/AuthModal';

export function LoginTrigger() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);

  const [redirectUrl, setRedirectUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Check if login query parameter is present
    const shouldOpenLogin = searchParams.get('login') === 'true';
    if (shouldOpenLogin) {
      // Set the current place as redirect URL before clearing params
      const currentPath = window.location.pathname + window.location.search.replace(/[?&]login=true/, '').replace(/^\?$/, '');
      setRedirectUrl(currentPath);
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
      redirectUrl={redirectUrl}
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









