'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { OfferCard } from '@/components/member/OfferCard';
import { savedOfferService } from '@/services/savedOffer.service';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';
import type { Offer } from '@/types';

export default function SavedOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});

  const fetchSavedOffers = async () => {
    try {
      setLoading(true);
      const response = await savedOfferService.getSavedOffers();
      if (response.success) {
        setOffers(response.data.offers);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load saved offers';
      toast.error(errorMessage);
      if (error.response?.status === 401) {
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedOffers();
  }, []);

  const handleUnsave = async (offerId: string) => {
    try {
      setSavingStates((prev) => ({ ...prev, [offerId]: true }));
      await savedOfferService.removeSavedOffer(offerId);
      setOffers((prev) => prev.filter((o) => o._id !== offerId));
      toast.success('Offer removed from saved list');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove offer';
      toast.error(errorMessage);
    } finally {
      setSavingStates((prev) => ({ ...prev, [offerId]: false }));
    }
  };

  return (
    <MemberLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Saved Offers</h1>
          <p className="text-muted-foreground mt-2">Your favorite offers</p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No saved offers yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start browsing offers and save your favorites!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {offers.map((offer) => (
              <OfferCard
                key={offer._id}
                offer={offer}
                isSaved={true}
                onUnsave={handleUnsave}
                showSaveButton={true}
              />
            ))}
          </div>
        )}
      </div>
    </MemberLayout>
  );
}

