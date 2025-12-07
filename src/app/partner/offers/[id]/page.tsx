'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { partnerOfferService } from '@/services/offer.service';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit } from 'lucide-react';
import type { Offer } from '@/types';

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getOfferStatus(offer: Offer): {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
} {
  const expiryDate = new Date(offer.expiryDate);
  const now = new Date();

  if (!offer.isActive) {
    return { label: 'Disabled', variant: 'secondary' };
  }

  if (expiryDate < now) {
    return { label: 'Expired', variant: 'destructive' };
  }

  return { label: 'Active', variant: 'default' };
}

interface OfferDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function PartnerOfferDetailsPage({ params }: OfferDetailsPageProps) {
  const { user } = useAuth();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [offerId, setOfferId] = useState<string>('');

  const isBanned = user?.partner?.status === 'rejected';

  useEffect(() => {
    params.then((p) => setOfferId(p.id));
  }, [params]);

  useEffect(() => {
    if (!offerId) return;

    const fetchOffer = async () => {
      try {
        setLoading(true);
        const response = await partnerOfferService.getPartnerOffer(offerId);
        if (response.success) {
          setOffer(response.data.offer);
        } else {
          toast.error('Failed to fetch offer');
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Failed to fetch offer';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [offerId]);

  if (isBanned) {
    return (
      <PartnerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <div className="text-6xl">🚫</div>
          <h1 className="text-3xl font-bold">Account Banned</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Your account has been banned. All offers are disabled and you cannot perform any
            actions.
          </p>
        </div>
      </PartnerLayout>
    );
  }

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading offer...</p>
          </div>
        </div>
      </PartnerLayout>
    );
  }

  if (!offer) {
    return (
      <PartnerLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Offer not found</p>
          <Link href="/partner/offers" className="mt-4 inline-block">
            <Button variant="outline">Back to Offers</Button>
          </Link>
        </div>
      </PartnerLayout>
    );
  }

  const status = getOfferStatus(offer);

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/partner/offers">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{offer.title}</h1>
              <p className="text-muted-foreground mt-1">Offer Details</p>
            </div>
          </div>
          <Link href={`/partner/offers/${offer._id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Offer
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
            {offer.imageUrl ? (
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-semibold">Offer Information</h2>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-primary">
                  ${offer.discountedPrice.toFixed(2)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  ${offer.originalPrice.toFixed(2)}
                </span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {offer.discount}% OFF
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Category:</span>{' '}
                  <span>{offer.category}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Expires:</span>{' '}
                  <span>{formatDate(offer.expiryDate)}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Views:</span>{' '}
                  <span>{offer.analytics.views}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Clicks:</span>{' '}
                  <span>{offer.analytics.clicks}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Redemptions:</span>{' '}
                  <span>{offer.analytics.redemptions}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{offer.description}</p>
            </div>

            {offer.termsAndConditions && (
              <div className="pt-4 border-t">
                <h3 className="text-xl font-semibold mb-3">Terms & Conditions</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {offer.termsAndConditions}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}

