"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  Shirt,
  Utensils,
  Heart,
  Home,
  Plane,
  GraduationCap,
  Ticket,
  Car,
  Briefcase,
  ShoppingBasket,
  Gift,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Monitor,
  ShoppingBag,
  Coffee,
  Activity,
  BookOpen,
  Music,
  Wrench,
  Apple,
  Zap,
  Dumbbell,
  Leaf,
  HeartPulse,
  Palette,
  Baby,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CATEGORY_ICONS: Record<string, any> = {
  // Electronics
  "Electronics": Smartphone,
  "Computers": Monitor,
  "Gadgets": Gamepad2,

  // Fashion
  "Fashion": Shirt,
  "Clothing": Shirt,
  "Fashion & Clothing": ShoppingBag,
  "Accessories": Gift,
  
  // Food & Health
  "Food": Utensils,
  "Food & Beverage": Coffee,
  "Organic Foods": Leaf,
  "Groceries": Apple,
  "Health": HeartPulse,
  "Health & Beauty": Heart,
  "Fitness": Dumbbell,
  "Wellness": Activity,

  // Lifestyle
  "Home": Home,
  "Home & Living": Home,
  "Travel": Plane,
  "Travel & Tourism": Plane,
  "Entertainment": Music,
  "Movies": Ticket,
  
  // Education & Work
  "Education": GraduationCap,
  "Services": Wrench,
  "Automotive": Car,
  
  // Others
  "Gifts": Gift,
  "Gifts & Hobbies": Palette,
  "Kids": Baby,
};

// Fallback icon
const DefaultIcon = LayoutGrid;

import { partnerOfferService, getCategories } from "@/services/offer.service";

export function CategoryBar() {
  const [categories, setCategories] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response.data && response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        // Silently fail to avoid console noise
      }
    };
    fetchCategories();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollAmount = 300;

      if (direction === "right") {
        // Check if we're near the end (within 10px tolerance)
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
          // Loop back to start
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      } else {
        // Check if we're at the start
        if (scrollLeft <= 10) {
          // Loop to end
          scrollRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <section className="py-8 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative group">
        {/* Left Button */}
        <div className="absolute left-0 top-0 bottom-0 w-12 z-20 flex items-center justify-center pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="pointer-events-auto h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-none shadow-lg text-primary hover:bg-white hover:scale-110 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
        </div>

        {/* Scroll Container with Mask */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 py-4 px-12 scrollbar-hide snap-x touch-pan-x relative z-10 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => {
            // Case-insensitive lookup for the icon
            const matchedKey = Object.keys(CATEGORY_ICONS).find(
              key => key.toLowerCase() === category.toLowerCase()
            );
            const Icon = matchedKey ? CATEGORY_ICONS[matchedKey] : DefaultIcon;
            return (
              <Link
                key={category}
                href={`/offers?category=${encodeURIComponent(category.toLowerCase())}`}
                className="flex-none snap-start"
              >
                <div className="group/item flex flex-col items-center gap-3 w-[100px] sm:w-[120px] p-4 rounded-2xl bg-white border border-border/40 shadow-sm hover:shadow-xl hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary/50 flex items-center justify-center group-hover/item:bg-gold transition-colors duration-300 shadow-inner">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover/item:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-center text-muted-foreground group-hover/item:text-primary leading-tight line-clamp-2 min-h-[2.5em] flex items-center justify-center">
                    {category}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right Button */}
         <div className="absolute right-0 top-0 bottom-0 w-12 z-20 flex items-center justify-center pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="pointer-events-auto h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-none shadow-lg text-primary hover:bg-white hover:scale-110 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </section>
  );
}
