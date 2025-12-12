'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { SavedOfferCard } from '@/components/member/SavedOfferCard';
import { savedOfferService } from '@/services/savedOffer.service';
import { useSavedOffers } from '@/contexts/SavedOffersContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Offer } from '@/types';

export default function SavedOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { updateCount } = useSavedOffers();

  const fetchSavedOffers = async () => {
    try {
      setLoading(true);
      const response = await savedOfferService.getSavedOffers();
      if (response.success) {
        setOffers(response.data.offers);
        updateCount(response.data.offers.length);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load saved offers';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedOffers();
  }, []);

  const handleRemove = async (offerId: string) => {
    try {
      setRemovingId(offerId);
      const response = await savedOfferService.removeSavedOffer(offerId);
      
      // Optimistic update or refetch
      const newOffers = offers.filter((o) => o._id !== offerId);
      setOffers(newOffers);
      updateCount(newOffers.length);
      
      toast.success('Offer removed from saved list');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove offer';
      toast.error(errorMessage);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <MemberLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Saved Offers</h1>
            <p className="text-muted-foreground mt-1">
              {offers.length} {offers.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden bg-card">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2 pt-4">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-16 text-center shadow-sm">
            <div className="mb-6 rounded-full bg-muted p-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">No saved offers yet</h2>
            <p className="max-w-sm text-muted-foreground mt-2 mb-6">
              Looks like you haven't saved any offers yet. Browse our collection and save the ones you like!
            </p>
            <Link href="/offers">
              <Button size="lg">Browse Offers</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {offers.map((offer) => (
              <SavedOfferCard
                key={offer._id}
                offer={offer}
                onRemove={handleRemove}
                isRemoving={removingId === offer._id}
              />
            ))}
          </div>
        )}
      </div>
    </MemberLayout>
  );
}


