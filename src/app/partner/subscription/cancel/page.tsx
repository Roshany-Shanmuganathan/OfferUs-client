"use client";

import { useRouter } from "next/navigation";
import { PartnerLayout } from "@/components/layout/PartnerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function SubscriptionCancelPage() {
  const router = useRouter();

  return (
    <PartnerLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4">
        <Card className="w-full border-none shadow-2xl bg-card overflow-hidden">
          <div className="h-2 bg-muted" />
          <CardContent className="p-12 text-center space-y-8">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <XCircle className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Payment Cancelled
              </h1>
              <p className="text-xl text-muted-foreground">
                No problem! Your payment was cancelled and you haven't been charged.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="outline"
                onClick={() => router.push("/partner")}
                className="flex-1 h-12 rounded-xl gap-2 font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button 
                onClick={() => router.push("/partner/subscription")}
                className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white gap-2 font-semibold transition-all hover:scale-[1.02]"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PartnerLayout>
  );
}
