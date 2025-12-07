'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Offer } from '@/types';
import { formatDistanceToNow } from 'date-fns';

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
  const isExpired = new Date(offer.expiryDate) < new Date();
  const isExpiringSoon =
    !isExpired && new Date(offer.expiryDate).getTime() - Date.now() < 5 * 24 * 60 * 60 * 1000;

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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/member/offers/${offer._id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={offer.imageUrl || '/placeholder-offer.jpg'}
            alt={offer.title}
            fill
            className="object-cover"
          />
          {isExpiringSoon && (
            <Badge className="absolute top-2 right-2 bg-red-500">Expires Soon</Badge>
          )}
          {isExpired && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Expired
            </Badge>
          )}
          {showSaveButton && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 h-8 w-8 bg-background/80 hover:bg-background"
              onClick={handleSaveClick}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          )}
        </div>
      </Link>

      <CardHeader>
        <h3 className="font-semibold text-lg line-clamp-2">{offer.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-2xl font-bold text-primary">
              Rs. {offer.discountedPrice?.toLocaleString()}
            </span>
            {offer.originalPrice && offer.originalPrice > offer.discountedPrice && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                Rs. {offer.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {offer.discount && (
            <Badge variant="secondary">{offer.discount}% OFF</Badge>
          )}
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          {typeof offer.partner === 'object' && offer.partner?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{offer.partner.location.city}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Expires {formatDistanceToNow(new Date(offer.expiryDate), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/member/offers/${offer._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

