"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Heart, Phone, Clock, Percent } from "lucide-react";
import type { Offer } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { savedOfferService } from "@/services/savedOffer.service";
import { activityService } from "@/services/activity.service";
import { useState } from "react";
import { toast } from "sonner";
import { useSavedOffers } from "@/contexts/SavedOffersContext";

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface OfferCardProps {
  offer: Offer;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export function OfferCard({ offer, isSaved: initialSaved, onSaveToggle }: OfferCardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { refreshCount } = useSavedOffers();
  const [isSaved, setIsSaved] = useState(initialSaved || false);
  const [isSaving, setIsSaving] = useState(false);
  
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

  const handleCallPartner = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      const url = new URL(window.location.href);
      url.searchParams.set("login", "true");
      router.push(url.pathname + url.search);
      return;
    }

    // Only members can call partners
    if (user.role !== 'member') {
      toast.error("Only members can contact partners");
      return;
    }

    // If authenticated, make the call
    if (typeof offer.partner === "object" && offer.partner?.contactInfo?.mobileNumber) {
      window.location.href = `tel:${offer.partner.contactInfo.mobileNumber}`;
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {offer.imageUrl ? (
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
            <Percent className="h-12 w-12 opacity-30" />
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {expiresSoon && (
            <Badge className="bg-amber-500 text-white border-0 shadow-lg text-xs font-semibold px-2.5 py-1">
              <Clock className="h-3 w-3 mr-1" />
              {daysUntilExpiry} days left
            </Badge>
          )}

          {isExpired && (
            <Badge
              variant="destructive"
              className="shadow-lg text-xs font-semibold px-2.5 py-1"
            >
              Expired
            </Badge>
          )}

          {offer.discount && offer.discount > 0 && (
            <Badge className="bg-green-500 text-white border-0 shadow-lg text-xs font-bold px-2.5 py-1">
              {offer.discount}% OFF
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className={`h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm ${
              isSaved ? 'text-red-500' : ''
            }`}
            onClick={handleSaveToggle}
            disabled={isSaving}
            title={isSaved ? "Unsave Offer" : "Save Offer"}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>

          {typeof offer.partner === "object" &&
            offer.partner?.contactInfo?.mobileNumber && (
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
                onClick={handleCallPartner}
                title="Call Partner"
              >
                <Phone className="h-4 w-4 text-foreground" />
              </Button>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
          {offer.title}
        </h3>

        {/* Price */}
        <div className="mb-3 flex items-baseline gap-2 flex-wrap">
          <span className="text-xl sm:text-2xl font-bold text-primary">
            Rs.{" "}
            {offer.discountedPrice?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
          {offer.originalPrice &&
            offer.originalPrice > offer.discountedPrice && (
              <span className="text-sm text-muted-foreground line-through">
                Rs.{" "}
                {offer.originalPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            )}
        </div>

        {/* Meta Info */}
        <div className="space-y-1.5 mb-4">
          {typeof offer.partner === "object" && offer.partner?.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">
                {offer.partner.location.city}, {offer.partner.location.district}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Expires {formatDate(expiryDate)}</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link href={`/offers/${offer._id}`} className="mt-auto">
          <Button className="w-full h-10 font-medium" size="default">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
