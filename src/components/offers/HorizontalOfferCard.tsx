"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Heart, Star, Percent } from "lucide-react";
import type { Offer } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { savedOfferService } from "@/services/savedOffer.service";
import { activityService } from "@/services/activity.service";
import { useState } from "react";
import { toast } from "sonner";
import { useSavedOffers } from "@/contexts/SavedOffersContext";

interface HorizontalOfferCardProps {
  offer: Offer;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export function HorizontalOfferCard({ offer, isSaved: initialSaved, onSaveToggle }: HorizontalOfferCardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { refreshCount } = useSavedOffers();
  const [isSaved, setIsSaved] = useState(initialSaved || false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Reuse logic from OfferCard
  const expiryDate = new Date(offer.expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpired = daysUntilExpiry < 0;
  const expiresSoon = daysUntilExpiry <= 5 && daysUntilExpiry >= 0;

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      const url = new URL(window.location.href);
      url.searchParams.set("login", "true");
      router.push(url.pathname + url.search);
      return;
    }

    // Only members can save offers
    if (user.role !== 'member') {
      toast.error("Only members can save offers");
      return;
    }

    try {
      setIsSaving(true);
      
      if (isSaved) {
        await savedOfferService.removeSavedOffer(offer._id);
        setIsSaved(false);
        activityService.trackUnsave(offer);
        toast.success("Offer removed from saved list");
      } else {
        await savedOfferService.saveOffer(offer._id);
        setIsSaved(true);
        activityService.trackSave(offer);
        toast.success("Offer saved");
      }
      
      refreshCount();
      onSaveToggle?.();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update saved offer";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="group relative flex w-full overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-md">
      {/* Left Image Section - Fixed width */}
      <div className="relative w-1/3 min-w-[120px] sm:min-w-[160px] md:min-w-[180px] bg-muted shrink-0">
        {offer.imageUrl ? (
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
            <Percent className="h-8 w-8 opacity-30" />
          </div>
        )}
        
        {/* Heart Icon on Image */}
        <button
          onClick={handleSaveToggle}
          disabled={isSaving}
          className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm backdrop-blur-[2px] ${
            isSaved ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Rating Overlay */}
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-white/90 shadow-sm flex items-center gap-1 text-[10px] font-bold text-foreground">
             <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
             <span>4.8</span>
        </div>
      </div>

      {/* Right Content Section */}
      <div className="flex flex-1 flex-col p-3 sm:p-4 min-w-0 justify-between">
        <div>
           {/* Title */}
           <h3 className="line-clamp-2 text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
             <Link href={`/offers/${offer._id}`}>
                <span className="absolute inset-0 z-0"></span>
                {offer.title}
             </Link>
           </h3>

           {/* Location / Partner */}
           {typeof offer.partner === 'object' ? (
             <div className="text-xs text-muted-foreground truncate mb-2 flex items-center gap-1">
                 {offer.partner.location?.city || offer.partner.partnerName}
             </div>
           ) : null}
        </div>

        {/* Price & Discount Section */}
        <div className="mt-2 space-y-1">
           {/* Price Row */}
            <div className="flex items-center gap-2 flex-wrap">
                {offer.originalPrice > offer.discountedPrice && (
                    <span className="text-xs text-muted-foreground line-through decoration-border">
                        Rs.{offer.originalPrice}
                    </span>
                )}
                <span className="text-sm sm:text-base font-bold text-primary">
                Rs.{offer.discountedPrice}
                </span>
            </div>

            {/* Discount Row */}
            <div className="flex items-center gap-2 flex-wrap">
                 <span className="text-lg sm:text-xl font-bold text-destructive">
                    Rs.{offer.discountedPrice}
                 </span>
                 <span className="text-xs font-medium text-destructive">
                   -{offer.discount}%
                 </span>
                 {expiresSoon && (
                     <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                         Limited time
                     </span>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
}
