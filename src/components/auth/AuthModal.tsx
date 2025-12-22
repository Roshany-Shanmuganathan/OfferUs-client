"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultView?: "login" | "register";
  redirectUrl?: string;
}

export function AuthModal({
  open,
  onOpenChange,
  defaultView = "login",
  redirectUrl,
}: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">(defaultView);

  // Reset view when modal opens
  useEffect(() => {
    if (open) {
      setView(defaultView);
    }
  }, [open, defaultView]);

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden bg-background border-none shadow-2xl transition-all duration-300">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <DialogDescription className="sr-only">
            Sign in or create an account to continue.
        </DialogDescription>
        
        <div className="grid md:grid-cols-2 gap-0 min-h-[550px] relative overflow-hidden">
          {/* Left Side - Branding (Static container, but moving contents) */}
          <div className={cn(
            "hidden md:flex flex-col items-center justify-center bg-primary text-primary-foreground p-10 relative transition-transform duration-700 ease-in-out z-20",
            view === "register" ? "translate-x-full" : "translate-x-0"
          )}>
            <div className="flex flex-col items-center justify-center flex-1 space-y-8">
              <div className="text-center">
                <div className="relative w-48 h-32 lg:w-56 lg:h-36">
                  <Image
                    src="/assets/logo-light.png"
                    alt="OfferUs Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="text-center space-y-2 z-10">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {view === "login" ? "Welcome back." : "Join us today."}
                </h2>
                <p className="text-base text-primary-foreground/70 max-w-[240px] mx-auto leading-relaxed">
                  {view === "login" 
                    ? "Please sign in to access your account and offers." 
                    : "Create an account to start saving on the best deals."}
                </p>
              </div>

               {/* Animating Icon */}
               <div className="relative w-24 h-24 lg:w-28 lg:h-28 mt-4 overflow-visible flex items-center justify-center">
                  <div 
                    className="w-full h-full bg-[var(--color-gold)] animate-zoom-smooth"
                    style={{
                      maskImage: 'url(/assets/login-offer-icon.png)',
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskImage: 'url(/assets/login-offer-icon.png)',
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                    }}
                  />
               </div>
            </div>
          </div>

          {/* Right Side - Forms with Transition */}
          <div className={cn(
            "flex flex-col justify-center p-8 md:p-10 bg-background relative transition-transform duration-700 ease-in-out z-10",
            view === "register" ? "-translate-x-full" : "translate-x-0"
          )}>
             
             {/* Key changes trigger remount animation defined in the components */}
             <div className="w-full max-w-md mx-auto">
               {view === "login" ? (
                  <LoginForm 
                      onSuccess={handleClose} 
                      onSignupClick={() => setView("register")} 
                      redirectUrl={redirectUrl}
                  />
               ) : (
                  <RegisterForm 
                      onSuccess={handleClose} 
                      onLoginClick={() => setView("login")} 
                      redirectUrl={redirectUrl}
                  />
               )}
             </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
