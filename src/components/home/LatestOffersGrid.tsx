"use client";

import { useEffect, useState } from "react";
import { Offer } from "@/types";
import { browseOffers } from "@/services/offer.service";
import { HorizontalOfferCard } from "@/components/offers/HorizontalOfferCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LatestOffersGrid() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Fetch latest 8 offers sorted by creation date
        const response = await browseOffers({ limit: 8, sortBy: 'createdAt' });
        setOffers(response.offers);
      } catch (err) {
        console.error("Failed to fetch latest offers:", err);
        setError("Failed to load offers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-16 sm:py-20 bg-card rounded-2xl border">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          </svg>
        </div>
        <p className="text-muted-foreground text-base sm:text-lg font-medium">
          No latest offers available right now
        </p>
        <p className="text-muted-foreground text-sm mt-2 mb-6">
          Check back later or browse our full collection
        </p>
        <Link href="/offers">
          <Button
            size="lg"
            className="px-8 h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Browse All Offers
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {offers.map((offer) => (
        <HorizontalOfferCard key={offer._id} offer={offer} />
      ))}
    </div>
  );
}
