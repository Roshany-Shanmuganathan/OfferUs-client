"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircle,
  ShieldCheck,
  Smartphone,
  BarChart3,
  Bookmark,
  LayoutDashboard,
  Users,
  Building2,
  Lock,
} from "lucide-react";
import { LoginTrigger } from "@/components/layout/LoginTrigger";
import { Suspense } from "react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense fallback={null}>
        <LoginTrigger />
      </Suspense>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#1a3328] py-16 sm:py-20 md:py-28">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-gold rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-6">
              Discover the best offers in Sri Lanka
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              All in one trusted platform.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 sm:p-4 bg-primary/10 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  To make Sri Lankan customers save time and money by giving
                  them access to genuine, verified, and real-time offers from
                  trusted business partners.
                </p>
              </div>
              <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 sm:p-4 bg-primary/10 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  To become Sri Lanka's most reliable, intelligent, and
                  comprehensive offers ecosystem — connecting every customer and
                  business through transparency, convenience, and smart
                  technology.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-12 sm:py-16 lg:py-20 bg-accent/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
                Our Story
              </h2>
              <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <p>
                  OfferUs started with a simple problem: people miss great
                  offers every day because they don't know they exist.
                </p>
                <p>
                  To solve this, we built a platform that collects, verifies,
                  and showcases deals from trusted partners across Sri Lanka.
                </p>
                <p>
                  What began as a small idea to help customers find savings has
                  now grown into a powerful system that also supports businesses
                  by increasing their reach and visibility.
                </p>
                <p>
                  Today, OfferUs stands as a bridge between deal seekers and
                  business owners, making the offers world more transparent,
                  fair, and accessible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do (Key Features) */}
        <section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              What We Do
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  icon: <CheckCircle className="w-6 h-6" />,
                  title: "Verified Real-Time Offers",
                  description:
                    "Only trusted and approved deals appear to members.",
                },
                {
                  icon: <Bookmark className="w-6 h-6" />,
                  title: "Save for Later",
                  description:
                    "Members can save offers and revisit them anytime.",
                },
                {
                  icon: <LayoutDashboard className="w-6 h-6" />,
                  title: "Partner Dashboard",
                  description:
                    "Businesses can create, manage, and update offers easily.",
                },
                {
                  icon: <ShieldCheck className="w-6 h-6" />,
                  title: "AI-Assisted Safety Checks",
                  description:
                    "Ensures partners and offers are safe and authentic.",
                },
                {
                  icon: <BarChart3 className="w-6 h-6" />,
                  title: "Analytics for Partners",
                  description: "Insights on views, saves, and user engagement.",
                },
                {
                  icon: <Smartphone className="w-6 h-6" />,
                  title: "Mobile-Friendly Experience",
                  description: "Smooth and fast across all devices.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-5 sm:p-6 border rounded-2xl bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="mb-4 p-3 bg-primary/10 rounded-xl w-fit text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Our Team</h2>
            <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-sm border">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">S</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Shalu</h3>
              <p className="text-primary font-medium mb-4">
                Founder & System Architect
              </p>
              <p className="text-muted-foreground">
                Passionate about building practical systems that genuinely help
                people. Strong focus on UI/UX, system architecture, and
                problem-solving.
              </p>
            </div>
          </div>
        </section>

        {/* Trust & Credibility */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Trust & Credibility</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Users className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">
                        1500+ Active Users
                      </h3>
                      <p className="text-muted-foreground">
                        Discovering deals daily
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Building2 className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">
                        50+ Verified Partners
                      </h3>
                      <p className="text-muted-foreground">
                        Trusted businesses
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <ShieldCheck className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">
                        Strict Approval System
                      </h3>
                      <p className="text-muted-foreground">
                        To avoid fake or misleading offers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Lock className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Secure Backend</h3>
                      <p className="text-muted-foreground">
                        RBAC, JWT, and Bcrypt security
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-primary/5 p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-6 text-center">
                  What People Say
                </h3>
                <div className="space-y-6">
                  <blockquote className="bg-card p-6 rounded-lg shadow-sm">
                    <p className="italic text-muted-foreground mb-4">
                      "OfferUs helped me find deals I never knew existed. Very
                      user-friendly platform!"
                    </p>
                    <footer className="font-semibold">
                      — Member (Colombo)
                    </footer>
                  </blockquote>
                  <blockquote className="bg-card p-6 rounded-lg shadow-sm">
                    <p className="italic text-muted-foreground mb-4">
                      "Our shop's visibility increased after joining OfferUs.
                      Easy dashboard, great results."
                    </p>
                    <footer className="font-semibold">
                      — Business Partner (Kandy)
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-primary via-primary to-[#1a3328] text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              Explore the latest offers today
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">
              Don't miss your next great deal.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/member/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto font-semibold"
                >
                  Join Now
                </Button>
              </Link>
              <Link href="/offers">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-semibold"
                >
                  Explore Offers
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-semibold"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
