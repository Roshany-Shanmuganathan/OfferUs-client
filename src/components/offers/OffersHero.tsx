"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Tag } from "lucide-react";

export function OffersHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground mb-8">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      
      <div className="relative px-6 py-12 md:px-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <Badge variant="secondary" className="w-fit bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
            <Sparkles className="mr-1 h-3 w-3 text-yellow-300" />
            Limited Time Deals
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Discover Exclusive Deals & Discounts
          </h1>
          <p className="text-primary-foreground/90 text-lg md:text-xl max-w-lg">
            Save big on your favorite brands. Browse hundreds of verified offers updated daily.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="secondary" size="lg" className="font-semibold" onClick={() => {
                const element = document.getElementById('offers-grid');
                element?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Browse Offers
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
              <Tag className="mr-2 h-4 w-4" />
              Latest Coupons
            </Button>
          </div>
        </div>
        
        {/* Visual Element / Illustration */}
        <div className="hidden md:block relative">
           <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl skew-y-3 skew-x-2 transform transition hover:skew-y-0 hover:skew-x-0 duration-500">
              <div className="flex items-center gap-4 mb-4">
                 <div className="h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center text-primary font-bold text-xl">
                    %
                 </div>
                 <div>
                    <div className="h-2 w-24 bg-white/40 rounded mb-2"></div>
                    <div className="h-2 w-16 bg-white/30 rounded"></div>
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="h-20 w-48 bg-white/20 rounded-lg"></div>
                 <div className="flex justify-between items-center">
                    <div className="h-6 w-20 bg-white/30 rounded"></div>
                    <div className="h-8 w-20 bg-white rounded"></div>
                 </div>
              </div>
           </div>
           
             {/* Floating Elements */}
             <div className="absolute -top-6 -right-6 animate-bounce delay-700">
                <Badge className="bg-red-500 text-white border-2 border-white text-lg px-3 py-1">-50%</Badge>
             </div>
             <div className="absolute -bottom-4 -left-8 animate-bounce duration-[2000ms]">
                <Badge className="bg-blue-500 text-white border-2 border-white text-md px-3 py-1">New</Badge>
             </div>
        </div>
      </div>
    </div>
  );
}
