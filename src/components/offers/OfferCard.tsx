'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Heart, Phone, ArrowRight } from 'lucide-react';
import type { Offer } from '@/types';

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const router = useRouter();
  const expiryDate = new Date(offer.expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpired = daysUntilExpiry < 0;
  const expiresSoon = daysUntilExpiry <= 5 && daysUntilExpiry >= 0;

  const handleRedirectToLogin = (e: React.MouseEvent, action?: 'call' | 'save') => {
    e.preventDefault();
    e.stopPropagation();
    // Build returnTo URL pointing to the offer detail page with action parameter
    const offerDetailPath = `/offers/${offer._id}`;
    const returnToUrl = new URL(offerDetailPath, window.location.origin);
    if (action) {
      returnToUrl.searchParams.set('action', action);
    }
    
    // Build the returnTo value (pathname + search params)
    const returnToValue = returnToUrl.pathname + returnToUrl.search;
    
    console.log('[OfferCard] handleRedirectToLogin - action:', action, 'returnToValue:', returnToValue);
    
    // Redirect to current page with login=true and returnTo parameter
    // searchParams.set() will automatically encode the value
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('login', 'true');
    currentUrl.searchParams.set('returnTo', returnToValue);
    
    console.log('[OfferCard] Redirecting to:', currentUrl.pathname + currentUrl.search);
    router.push(currentUrl.pathname + currentUrl.search);
  };

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
        
        {isExpired && (
          <Badge variant="destructive" className="absolute right-2 top-2">
            Expired
          </Badge>
        )}
        
        {/* Save Button - Redirects to login */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 h-8 w-8 bg-background/80 hover:bg-background"
          onClick={(e) => handleRedirectToLogin(e, 'save')}
          title="Save Offer"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Call Button - Redirects to login */}
        {typeof offer.partner === 'object' && offer.partner?.contactInfo?.mobileNumber && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-12 h-8 w-8 bg-background/80 hover:bg-background"
            onClick={(e) => handleRedirectToLogin(e, 'call')}
            title="Call Partner"
          >
            <Phone className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight">{offer.title}</h3>

        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            Rs. {offer.discountedPrice?.toFixed(2)}
          </span>
          {offer.originalPrice && offer.originalPrice > offer.discountedPrice && (
            <span className="text-sm text-muted-foreground line-through">
              Rs. {offer.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {offer.discount && (
          <Badge variant="secondary" className="mb-3 w-fit">
            {offer.discount}% OFF
          </Badge>
        )}

        <div className="space-y-1 mb-4">
          {typeof offer.partner === 'object' && offer.partner?.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{offer.partner.location.city}, {offer.partner.location.district}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Expires {formatDate(expiryDate)}</span>
          </div>
        </div>

        <Link href={`/offers/${offer._id}`} className="mt-auto">
          <Button className="w-full" size="default">
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
