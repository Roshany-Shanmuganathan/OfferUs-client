"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PartnerLayout } from "@/components/layout/PartnerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { paymentService } from "@/services/payment.service";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

function SuccessContent() {
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const completePayment = async () => {
      if (!sessionId) {
        setVerifying(false);
        return;
      }

      try {
        await paymentService.verifyPayment(sessionId);
        await refreshUser(); // Update auth context with new subscription status
        setSuccess(true);
        toast.success("Subscription upgraded successfully!");
      } catch (error: any) {
        console.error("Verification failed:", error);
        toast.error("Failed to verify payment. Please contact support.");
      } finally {
        setVerifying(false);
      }
    };

    completePayment();
  }, [sessionId, refreshUser]);

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-2xl font-bold">Verifying your payment...</h2>
        <p className="text-muted-foreground">Please do not refresh or close this page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4">
      <Card className="w-full border-none shadow-2xl bg-card overflow-hidden">
        <div className="h-2 bg-primary" />
        <CardContent className="p-12 text-center space-y-8">
          {success ? (
            <>
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                  Payment Successful!
                </h1>
                <p className="text-xl text-muted-foreground">
                  Your subscription has been activated. Welcome to the premium community!
                </p>
              </div>
              <div className="pt-4">
                <Button 
                  onClick={() => router.push("/partner")}
                  className="w-full h-12 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-white gap-2 transition-all hover:scale-[1.02]"
                >
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
                  <ArrowRight className="h-12 w-12 text-destructive rotate-45" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-foreground">
                  Oops! Something went wrong
                </h1>
                <p className="text-xl text-muted-foreground">
                  We couldn't verify your payment. If you've been charged, please contact our support team.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => router.push("/partner/support")}
                  className="flex-1 h-12 rounded-xl"
                >
                  Contact Support
                </Button>
                <Button 
                  onClick={() => router.push("/partner/subscription")}
                  className="flex-1 h-12 rounded-xl bg-primary text-white"
                >
                  Try Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <PartnerLayout>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </PartnerLayout>
  );
}
