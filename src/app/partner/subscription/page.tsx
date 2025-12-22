"use client";

import { PartnerLayout } from "@/components/layout/PartnerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Shield, Star, Zap, Crown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    name: "Basic",
    price: "1000",
    icon: Shield,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    description: "Perfect for small shops starting out.",
    features: {
      "Upload Offers": "10/month",
      "Analytics Type": "Limited",
      "Dashboard": "Basic",
      "Notifications": "Email",
      "Visibility": "Normal listing in search results",
      "Customer Feedback": "Rating only",
      "Branding / Watermark": "Platform watermark",
      "Highlight Badge": false,
    }
  },
  {
    name: "Standard",
    price: "2000",
    icon: Zap,
    color: "text-primary",
    bgColor: "bg-primary/10",
    popular: true,
    description: "Ideal for growing businesses with more reach.",
    features: {
      "Upload Offers": "20/month",
      "Analytics Type": "Basic",
      "Dashboard": "Enhanced",
      "Notifications": "Email + Dashboard alerts",
      "Visibility": "Higher in search results, Featured in Popular Offers",
      "Customer Feedback": "Ratings & Comments",
      "Branding / Watermark": "Platform watermark",
      "Highlight Badge": false,
    }
  },
  {
    name: "Premium",
    price: "2500",
    icon: Crown,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    description: "Ultimate power and maximum visibility.",
    features: {
      "Upload Offers": "Unlimited",
      "Analytics Type": "Advanced",
      "Dashboard": "Advanced",
      "Notifications": "Email + Push notifications",
      "Visibility": "Top of homepage, Special tags/banners, Maximum visibility",
      "Customer Feedback": "Verified reviews",
      "Branding / Watermark": "No watermark (Custom branding)",
      "Highlight Badge": true,
    }
  }
];

const featureList = [
  "Upload Offers",
  "Analytics Type",
  "Dashboard",
  "Notifications",
  "Visibility",
  "Customer Feedback",
  "Branding / Watermark",
  "Highlight Badge"
];

import { paymentService } from "@/services/payment.service";

// ... existing plans and featureList ...

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const currentPlan = user?.partner?.subscription?.plan || "none";
  const isPaid = user?.partner?.subscription?.status === "paid";

  const handleSelectPlan = async (planName: string) => {
    if (planName.toLowerCase() === currentPlan.toLowerCase() && isPaid) return;
    
    setLoading(planName);
    try {
      const plan = plans.find(p => p.name === planName);
      if (!plan) throw new Error("Plan not found");

      toast.loading(`Preparing checkout for ${planName} plan...`);
      await paymentService.createCheckoutSession(planName, parseInt(plan.price));
      // Redirect happens inside the service
    } catch (error: any) {
      console.error("Payment failed:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
      setLoading(null);
    }
  };

  return (
    <PartnerLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-12">
        {/* Current Subscription Status */}
        {isPaid && user?.partner?.subscription && (
          <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold capitalize">Active Plan: {currentPlan}</h2>
                  <p className="text-sm text-muted-foreground">
                    Next payment date: {user.partner.subscription.endDate ? new Date(user.partner.subscription.endDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-bold uppercase tracking-wider">
                  Paid & Active
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Choose the Right Plan for Your Business
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upgrade your presence on OfferUs and connect with thousands of customers looking for the best deals.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular ? "border-primary scale-105 shadow-lg z-10" : "border-border hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <CardContent className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-2xl ${plan.bgColor}`}>
                    <plan.icon className={`h-8 w-8 ${plan.color}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">LKR {plan.price}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={loading !== null || (isPaid && plan.name.toLowerCase() === currentPlan.toLowerCase())}
                  variant={plan.name.toLowerCase() === currentPlan.toLowerCase() ? "secondary" : (plan.popular ? "default" : "outline")}
                  className={`w-full h-12 text-base font-bold rounded-xl mb-8 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    plan.name.toLowerCase() === currentPlan.toLowerCase()
                      ? "bg-green-100 text-green-700 border-green-200 cursor-default hover:scale-100"
                      : plan.popular 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20" 
                        : "border-2 hover:bg-accent text-foreground"
                  }`}
                >
                  {loading === plan.name ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : null}
                  {plan.name.toLowerCase() === currentPlan.toLowerCase() && isPaid 
                    ? "Current Plan" 
                    : isPaid ? `Switch to ${plan.name}` : `Choose ${plan.name}`}
                </Button>

                <div className="space-y-4 flex-1">
                  <p className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
                    Features
                  </p>
                  <ul className="space-y-3">
                    {featureList.map((feature) => {
                      const value = plan.features[feature as keyof typeof plan.features];
                      return (
                        <li key={feature} className="flex gap-3 text-sm">
                          <div className="mt-0.5">
                            {typeof value === "boolean" ? (
                              value ? (
                                <Check className="h-4 w-4 text-green-500 font-bold" />
                              ) : (
                                <X className="h-4 w-4 text-muted-foreground" />
                              )
                            ) : (
                              <Check className="h-4 w-4 text-primary font-bold" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium">{feature}: </span>
                            <span className="text-muted-foreground">
                              {typeof value === "boolean" ? (value ? "Enabled" : "Not Included") : value}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table (Desktop Only) */}
        <div className="hidden lg:block mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">Detailed Comparison</h2>
          <div className="border rounded-2xl overflow-hidden bg-card shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-6 text-left font-semibold text-lg">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="p-6 text-center font-bold text-lg">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {featureList.map((feature) => (
                  <tr key={feature} className="hover:bg-muted/20 transition-colors">
                    <td className="p-6 font-medium text-foreground/80">{feature}</td>
                    {plans.map((plan) => {
                      const value = plan.features[feature as keyof typeof plan.features];
                      return (
                        <td key={plan.name} className="p-6 text-center">
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className="h-6 w-6 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-6 w-6 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm font-medium">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="bg-muted/30">
                  <td className="p-6 font-bold text-lg">Monthly Price</td>
                  {plans.map((plan) => (
                    <td key={plan.name} className="p-6 text-center">
                      <span className="text-xl font-extrabold text-primary">LKR {plan.price}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}
