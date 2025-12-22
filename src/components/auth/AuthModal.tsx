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
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-background border-none shadow-2xl duration-300">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <DialogDescription className="sr-only">
            Sign in or create an account to continue.
        </DialogDescription>
        
        <div className="grid md:grid-cols-2 gap-0 min-h-[550px]">
          {/* Left Side - Branding (Static) */}
          <div className="hidden md:flex flex-col items-center justify-center bg-primary text-primary-foreground p-8 relative">
            <div className="flex flex-col items-center justify-center flex-1 space-y-6">
              <div className="text-center">
                <div className="relative w-40 h-28 lg:w-48 lg:h-32">
                  <Image
                    src="/assets/logo-light.png"
                    alt="OfferUs Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="text-center space-y-1.5 z-10">
                <h2 className="text-xl font-medium tracking-tight">
                    {view === "login" ? "Welcome back." : "Join us today."}
                </h2>
                <p className="text-sm text-primary-foreground/70 max-w-[200px] mx-auto leading-relaxed">
                  {view === "login" 
                    ? "Please sign in to access your account and offers." 
                    : "Create an account to start saving on the best deals."}
                </p>
              </div>

               {/* Decorative Element */}
              <div className="relative w-24 h-24 opacity-20 animate-pulse">
                 <div className="absolute inset-0 bg-gradient-to-tr from-white to-transparent rounded-full blur-xl" />
              </div>
            </div>
          </div>

          {/* Right Side - Forms with Transition */}
          <div className="flex flex-col justify-center p-6 md:p-8 bg-background relative overflow-hidden">
             
             {/* Key changes trigger remount animation defined in the components */}
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
      </DialogContent>
    </Dialog>
  );
}
