"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  Search,
  MapPin,
  Zap,
  ShieldCheck,
  Timer,
  Tag,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { partnerOfferService, getCategories } from "@/services/offer.service";
import { SRI_LANKA_DISTRICTS } from "@/lib/constants";

const SLIDES = [
  {
    id: 1,
    color: "bg-blue-500",
    title: "Summer Sale",
    description: "Up to 50% off on electronics",
  },
  {
    id: 2,
    color: "bg-purple-500",
    title: "New Arrivals",
    description: "Check out the latest fashion trends",
  },
  {
    id: 3,
    color: "bg-green-500",
    title: "Flash Deal",
    description: "24 hours only - Don't miss out!",
  },
];

export function HeroSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for inputs
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [district, setDistrict] = useState(searchParams.get("district") || "");
  const [categories, setCategories] = useState<string[]>([]);
  
  // State for dropdown visibility
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data && response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        // Silently fail or log debug message for network errors to avoid console noise
        // This is expected if backend is offline
        // console.debug("Failed to fetch categories - using default empty list", error);
      }
    };
    fetchCategories();
  }, []);

  // Filtered lists
  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(category.toLowerCase())
  );
  const filteredDistricts = SRI_LANKA_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(district.toLowerCase())
  );

  const [currentSlide, setCurrentSlide] = useState(0);

  // Click outside to close dropdowns
  const wrapperRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
        setShowDistrictDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) {
      params.set("category", category);
    }
    if (district) {
      params.set("district", district);
    }
    router.push(`/offers?${params.toString()}`);
  };

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-auto lg:h-[480px]">
        {/* Left Content Column (2/3 width) */}
        <div className="lg:col-span-2 relative overflow-visible rounded-[2rem] bg-gradient-to-br from-primary to-[#1a3328] p-6 sm:p-8 lg:p-10 flex flex-col justify-center text-white shadow-2xl z-30">
          {/* Background Decorative Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          {/* Running Animation Content (Marquee) */}
          <div className="absolute top-4 left-0 w-full overflow-hidden opacity-30 pointer-events-none">
             <div className="animate-marquee whitespace-nowrap flex gap-8 text-xs text-gold font-medium tracking-widest uppercase">
              <span className="flex items-center gap-2">• Welcome to OfferUs</span>
              <span className="flex items-center gap-2">• Real-time Offers</span>
              <span className="flex items-center gap-2">• Best Deals in Sri Lanka</span>
              <span className="flex items-center gap-2">• Welcome to OfferUs</span>
              <span className="flex items-center gap-2">• Real-time Offers</span>
              <span className="flex items-center gap-2">• Best Deals in Sri Lanka</span>
               <span className="flex items-center gap-2">• Welcome to OfferUs</span>
              <span className="flex items-center gap-2">• Real-time Offers</span>
              <span className="flex items-center gap-2">• Best Deals in Sri Lanka</span>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl mt-4">
            {/* Badge & Blinking Icon */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold"></span>
              </span>
              <span className="text-xs sm:text-sm font-medium text-white/90">
                Live Offers Available
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Find the Best <span className="text-gold">Deals</span> <br className="hidden sm:block" />
              Around You
            </h1>

            <p className="text-base sm:text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
              Discover verified offers from trusted partners across Sri Lanka.
              Save money on your favorite brands today.
            </p>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="mb-8" ref={wrapperRef}>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-1.5 border border-white/20 shadow-xl relative z-50">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5">
                  {/* Category Search Input */}
                  <div className="sm:col-span-5 relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      placeholder="Category"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setShowCategoryDropdown(true);
                        setShowDistrictDropdown(false);
                      }}
                      onFocus={() => {
                        setShowCategoryDropdown(true);
                        setShowDistrictDropdown(false);
                      }}
                      className="pl-10 h-10 sm:h-11 bg-transparent border-none text-white placeholder:text-white/50 focus-visible:ring-0 text-sm sm:text-base cursor-text"
                    />
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 opacity-50" />
                    
                    {/* Category Dropdown */}
                    {showCategoryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl py-2 z-[100]">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((cat) => (
                            <div
                              key={cat}
                              className="px-4 py-2 hover:bg-primary/10 text-primary cursor-pointer text-sm transition-colors"
                              onClick={() => {
                                setCategory(cat);
                                setShowCategoryDropdown(false);
                              }}
                            >
                              {cat}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-primary/50 text-sm">No categories found</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* District Search Input */}
                  <div className="sm:col-span-4 relative border-t sm:border-t-0 sm:border-l border-white/10 sm:border-white/20 group">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      placeholder="Location (District)"
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setShowDistrictDropdown(true);
                         setShowCategoryDropdown(false);
                      }}
                       onFocus={() => {
                        setShowDistrictDropdown(true);
                        setShowCategoryDropdown(false);
                      }}
                      className="pl-10 h-10 sm:h-11 bg-transparent border-none text-white placeholder:text-white/50 focus-visible:ring-0 text-sm sm:text-base"
                    />
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 opacity-50" />

                     {/* District Dropdown */}
                    {showDistrictDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl py-2 z-[100]">
                        {filteredDistricts.length > 0 ? (
                          filteredDistricts.map((dist) => (
                            <div
                              key={dist}
                              className="px-4 py-2 hover:bg-primary/10 text-primary cursor-pointer text-sm transition-colors"
                              onClick={() => {
                                setDistrict(dist);
                                setShowDistrictDropdown(false);
                              }}
                            >
                              {dist}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-primary/50 text-sm">No districts found</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <Button type="submit" className="w-full h-10 sm:h-11 bg-gold hover:bg-gold/90 text-primary font-bold rounded-lg shadow-lg text-sm sm:text-base transition-transform hover:scale-[1.02] active:scale-[0.98]">
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 text-xs sm:text-sm text-white/50 font-medium">
                <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-gold" /> Verified Partners
                </div>
                 <div className="flex items-center gap-1.5">
                    <Timer className="h-4 w-4 text-gold" /> Real-time Updates
                </div>
            </div>
          </div>
        </div>

        {/* Right Slider Column (1/3 width) - Enabled on Mobile */}
        <div className="col-span-1 block relative min-h-[300px] lg:h-full rounded-[2rem] overflow-hidden shadow-2xl">
            {SLIDES.map((slide, index) => (
                <div
                    key={slide.id}
                    className={cn(
                        "absolute inset-0 transition-all duration-700 ease-in-out flex items-center justify-center p-8 text-center",
                        slide.color,
                        index === currentSlide ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                    )}
                    style={{
                        transform: index === currentSlide ? 'translateX(0)' : 'translateX(100%)',
                        zIndex: index === currentSlide ? 10 : 0, 
                        // Note: Simple CSS transition for fade/slide might need more complex setup for continuous loop, 
                        // but this is a simple implementation. 
                        // A better approach for "slider" is absolute positioning with opacity/transform.
                    }}
                >
                     {/* Overwrite transform for simple fade/stack effect or implement a proper slider library logic if needed. 
                        For now, let's do a simple crossfade/stack. 
                     */}
                     <div className="absolute inset-0 opacity-20 bg-black/20" /> {/* Texture overlay */}
                     
                     <div className="relative z-10 text-white">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4">{slide.title}</h3>
                        <p className="text-lg opacity-90">{slide.description}</p>
                        
                        <Button 
                          className="mt-8 bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 font-bold border-none shadow-lg px-8"
                        >
                            View Deal
                        </Button>
                     </div>
                </div>
            ))}
            
            {/* Slider Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            idx === currentSlide ? "w-8 bg-white" : "bg-white/50 hover:bg-white/80"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
