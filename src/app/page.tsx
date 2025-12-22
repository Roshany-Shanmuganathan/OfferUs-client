"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PublicRoute } from "@/components/layout/PublicRoute";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryBar } from "@/components/home/CategoryBar";
import { LatestOffersGrid } from "@/components/home/LatestOffersGrid";
import Link from "next/link"; // Added Link import

export default function HomeWrapper() {
  return (
    <PublicRoute>
      <HomeContent />
    </PublicRoute>
  );
}

function HomeContent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryBar />
        

        {/* Offers Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Latest Gifts
                </h2>
                <p className="mt-1 sm:mt-2 text-muted-foreground text-sm sm:text-base">
                  Handpicked deals just for you
                </p>
              </div>
              <Link
                href="/offers"
                className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all text-sm sm:text-base"
              >
                View all offers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Offers Grid */}
            <LatestOffersGrid />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
