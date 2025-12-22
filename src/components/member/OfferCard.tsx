"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar, Clock, Percent } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Offer } from "@/types";

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
  onSave?: (offerId: string) => void;
  onUnsave?: (offerId: string) => void;
  showSaveButton?: boolean;
}

export function OfferCard({
  offer,
  isSaved = false,
  onSave,
  onUnsave,
  showSaveButton = true,
}: OfferCardProps) {
  const expiryDate = new Date(offer.expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpired = daysUntilExpiry < 0;
  const expiresSoon = daysUntilExpiry <= 5 && daysUntilExpiry >= 0;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved && onUnsave) {
      onUnsave(offer._id);
    } else if (!isSaved && onSave) {
      onSave(offer._id);
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

        {/* Save Button */}
        {showSaveButton && (
          <Button
            variant="secondary"
            size="icon"
            className={`absolute top-3 left-3 h-9 w-9 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
              isSaved
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-white/90 hover:bg-white text-foreground"
            }`}
            onClick={handleSaveClick}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        )}
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
