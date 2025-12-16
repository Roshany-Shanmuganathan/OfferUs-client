"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used, or generic UI feedback

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      // toast.success("Successfully subscribed!"); 
    }, 1500);
  };

  if (isSubscribed) {
    return (
      <div className="bg-muted/50 rounded-2xl p-8 text-center border border-border/50 animate-in fade-in zoom-in duration-300">
        <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2">You're Subscribed!</h3>
        <p className="text-muted-foreground">
          Thank you for subscribing. We'll send the best deals directly to your inbox.
        </p>
        <Button variant="link" onClick={() => setIsSubscribed(false)} className="mt-2 text-primary">
            sign up with another email
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-primary/5 rounded-2xl p-8 md:p-12 relative overflow-hidden border border-primary/10">
       {/* Background decoration */}
       <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
       
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
        <div className="text-center md:text-left space-y-2 flex-1">
          <div className="inline-flex items-center justify-center md:justify-start gap-2 text-primary font-semibold mb-2">
            <Mail className="w-5 h-5" />
            <span>Newsletter</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Never Miss a Deal
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto md:mx-0">
            Subscribe to our newsletter and get the latest offers, exclusive coupons, and discounts delivered to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto min-w-[300px] lg:min-w-[400px]">
          <Input 
            type="email" 
            placeholder="Enter your email address" 
            className="h-11 bg-background"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" size="lg" className="h-11 px-8" disabled={isLoading}>
            {isLoading ? (
               <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
               "Subscribe"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
