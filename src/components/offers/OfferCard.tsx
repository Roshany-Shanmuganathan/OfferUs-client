'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Offer } from '@/types';

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const expiryDate = new Date(offer.expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const expiresSoon = daysUntilExpiry <= 5 && daysUntilExpiry >= 0;

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
        {expiresSoon && (
          <Badge
            variant="destructive"
            className="absolute right-2 top-2 bg-red-500/90 text-white"
          >
            Expires Soon
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 font-semibold leading-tight">{offer.title}</h3>

        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            ${offer.discountedPrice.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            ${offer.originalPrice.toFixed(2)}
          </span>
          <span className="text-sm font-medium text-green-600">{offer.discount}% OFF</span>
        </div>

        <div className="mb-4 text-xs text-muted-foreground">
          Expires: {formatDate(expiryDate)}
        </div>

        <Link href={`/offers/${offer._id}`} className="mt-auto">
          <Button className="w-full" variant="default">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}

