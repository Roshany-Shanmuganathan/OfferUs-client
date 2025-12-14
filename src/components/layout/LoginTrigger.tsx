'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoginModal } from '@/components/auth/LoginModal';
import { MemberRegisterModal } from '@/components/auth/MemberRegisterModal';

export function LoginTrigger() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [returnTo, setReturnTo] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Check if login query parameter is present
    const shouldOpenLogin = searchParams.get('login') === 'true';
    const returnToParam = searchParams.get('returnTo');
    
    console.log('[LoginTrigger] useEffect - shouldOpenLogin:', shouldOpenLogin, 'returnToParam:', returnToParam);
    
    if (shouldOpenLogin) {
      setLoginOpen(true);
      // Store returnTo if provided
      // URLSearchParams.get() already decodes the value, so we use it directly
      if (returnToParam && returnToParam.trim() !== '') {
        console.log('[LoginTrigger] ✅ Setting returnTo in state:', returnToParam);
        setReturnTo(returnToParam);
      } else {
        console.log('[LoginTrigger] ❌ No returnTo parameter, will redirect to dashboard');
        setReturnTo(undefined);
      }
      
      // Remove query parameters from URL but keep the path
      // We do this after storing returnTo in state so it's preserved
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      url.searchParams.delete('returnTo');
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  const handleCloseModals = () => {
    setLoginOpen(false);
    setSignupOpen(false);
    // Clear returnTo when modals close
    setReturnTo(undefined);
    // Remove query parameters when modals close
    const url = new URL(window.location.href);
    url.searchParams.delete('login');
    url.searchParams.delete('returnTo');
    router.replace(url.pathname + url.search);
  };

  // Log whenever returnTo changes to debug
  useEffect(() => {
    console.log('[LoginTrigger] returnTo state changed to:', returnTo);
  }, [returnTo]);

  return (
    <>
      <LoginModal
        open={loginOpen}
        onOpenChange={(open) => {
          setLoginOpen(open);
          if (!open) {
            handleCloseModals();
          }
        }}
        onSignupClick={() => {
          console.log('[LoginTrigger] Switching to signup, preserving returnTo:', returnTo);
          setLoginOpen(false);
          setSignupOpen(true);
          // returnTo is preserved in state, so it will be passed to MemberRegisterModal
        }}
        returnTo={returnTo}
      />
      <MemberRegisterModal
        open={signupOpen}
        onOpenChange={(open) => {
          setSignupOpen(open);
          if (!open) {
            handleCloseModals();
          }
        }}
        onLoginClick={() => {
          console.log('[LoginTrigger] Switching to login, preserving returnTo:', returnTo);
          setSignupOpen(false);
          setLoginOpen(true);
          // returnTo is preserved in state, so it will be passed to LoginModal
        }}
        returnTo={returnTo}
      />
    </>
  );
}










