'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Offer } from '@/types';

interface SavedOfferCardProps {
  offer: Offer;
  onRemove: (offerId: string) => void;
  isRemoving?: boolean;
}

export function SavedOfferCard({
  offer,
  onRemove,
  isRemoving = false,
}: SavedOfferCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {offer.imageUrl ? (
          <Image
            src={offer.imageUrl}
            alt={offer.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
            No Image
          </div>
        )}
        
        {offer.discount && (
          <Badge variant="destructive" className="absolute left-2 top-2">
            -{offer.discount}%
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight hover:text-primary">
          <Link href={`/member/offers/${offer._id}`}>{offer.title}</Link>
        </h3>

        <div className="mb-3 flex flex-wrap items-baseline gap-2">
          <span className="text-xl font-bold text-primary">
            Rs. {offer.discountedPrice?.toLocaleString()}
          </span>
          {offer.originalPrice && offer.originalPrice > offer.discountedPrice && (
            <span className="text-sm text-muted-foreground line-through">
              Rs. {offer.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mb-4 text-sm text-muted-foreground">
          {typeof offer.partner === 'object' && offer.partner?.partnerName && (
            <div className="font-medium text-foreground mb-1">
              {offer.partner.partnerName}
            </div>
          )}
          {typeof offer.partner === 'object' && offer.partner?.location && (
            <div className="flex items-center gap-1 text-xs">
              <MapPin className="h-3 w-3" />
              <span>{offer.partner.location.city}</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <Link href={`/member/offers/${offer._id}`} className="flex-1">
            <Button className="w-full" size="sm" variant="outline">
              View Details
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onRemove(offer._id)}
            disabled={isRemoving}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}


