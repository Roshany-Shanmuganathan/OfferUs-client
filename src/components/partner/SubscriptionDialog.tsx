"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, Star, ArrowRight } from "lucide-react";

interface SubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionDialog({ isOpen, onClose }: SubscriptionDialogProps) {
  const router = useRouter();

  const handleChoosePlan = () => {
    onClose();
    router.push("/partner/subscription");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] border-none bg-card p-0 overflow-hidden shadow-2xl">
        <div className="relative h-40 bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center p-6 text-primary-foreground">
          <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-1/4 -translate-y-1/4">
            <Zap size={120} className="rotate-12" />
          </div>
          <div className="absolute bottom-0 left-0 p-4 opacity-10 transform -translate-x-1/4 translate-y-1/4">
            <Star size={100} className="-rotate-12" />
          </div>
          <div className="relative z-10 bg-white/15 backdrop-blur-xl p-5 rounded-3xl border border-white/20 shadow-inner">
            <ShieldCheck className="w-16 h-16 text-white drop-shadow-lg" />
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Complete Your Subscription
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2 text-foreground/80 font-medium leading-relaxed">
              Your account has been approved! To start uploading offers and reaching customers, please select a subscription plan.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/50 border border-border/50">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Boost Your Visibility</p>
                <p className="text-xs text-muted-foreground">Choose a plan that fits your business needs and start growing today.</p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-1/2 h-11 rounded-xl text-foreground font-medium border-border hover:bg-accent transition-colors"
            >
              I will do later
            </Button>
            <Button
              type="button"
              onClick={handleChoosePlan}
              className="w-full sm:w-1/2 h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Choose Plan Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
