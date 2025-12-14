'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { OfferCard } from '@/components/member/OfferCard';
import { OfferFilters } from '@/components/offers/OfferFilters';
import { browseOffers } from '@/services/offer.service';
import { savedOfferService } from '@/services/savedOffer.service';
import { partnerOfferService } from '@/services/offer.service';
import { useSavedOffers } from '@/contexts/SavedOffersContext';
import { useEffect, useState, Suspense } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Offer } from '@/types';

function MemberDashboardContent() {
  const searchParams = useSearchParams();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [savedOfferIds, setSavedOfferIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const { refreshCount } = useSavedOffers();

  // Get filter values from URL params
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const district = searchParams.get('district') || 'all';
  const location = searchParams.get('location') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (category && category !== 'all') params.category = category;
      if (district && district !== 'all') params.district = district;
      if (location) params.location = location;
      if (sortBy) params.sortBy = sortBy;

      const data = await browseOffers(params);
      setOffers(data.offers || []);

      // Fetch saved offers to show saved state
      try {
        const savedResponse = await savedOfferService.getSavedOffers();
        if (savedResponse.success) {
          setSavedOfferIds(new Set(savedResponse.data.offers.map((o) => o._id)));
        }
      } catch (err) {
        // Ignore errors for saved offers
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load offers';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [search, category, district, location, sortBy]);

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await partnerOfferService.getCategories();
        if (response.success) {
          setCategories(response.data.categories || []);
        }
      } catch (err) {
        // Ignore errors
      }
    };
    fetchCategories();
  }, []);

  const handleSave = async (offerId: string) => {
    try {
      setSavingStates((prev) => ({ ...prev, [offerId]: true }));
      await savedOfferService.saveOffer(offerId);
      setSavedOfferIds((prev) => new Set([...prev, offerId]));
      refreshCount();
      toast.success('Offer saved');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save offer';
      toast.error(errorMessage);
    } finally {
      setSavingStates((prev) => ({ ...prev, [offerId]: false }));
    }
  };

  const handleUnsave = async (offerId: string) => {
    try {
      setSavingStates((prev) => ({ ...prev, [offerId]: true }));
      await savedOfferService.removeSavedOffer(offerId);
      setSavedOfferIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(offerId);
        return newSet;
      });
      refreshCount();
      toast.success('Offer removed from saved list');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove offer';
      toast.error(errorMessage);
    } finally {
      setSavingStates((prev) => ({ ...prev, [offerId]: false }));
    }
  };

  // Define all Sri Lankan districts for location filtering
  const districts = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Kandy',
    'Matale',
    'Nuwara Eliya',
    'Galle',
    'Matara',
    'Hambantota',
    'Jaffna',
    'Kilinochchi',
    'Mannar',
    'Vavuniya',
    'Mullaitivu',
    'Batticaloa',
    'Ampara',
    'Trincomalee',
    'Kurunegala',
    'Puttalam',
    'Anuradhapura',
    'Polonnaruwa',
    'Badulla',
    'Moneragala',
    'Ratnapura',
    'Kegalle',
  ];

  return (
    <MemberLayout>
      <main className="flex-1">
        <div className="mx-auto">
          {/* Hero Section - Same as home page */}
          <div className="mb-12 text-center bg-primary space-y-6 px-4 py-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-secondary">
              Welcome to OfferUs
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted platform for discovering the best offers and deals
              from verified partners.
            </p>
          </div>

          {/* Filters - Using OfferFilters component */}
          <div className="mb-8">
            <OfferFilters categories={categories} districts={districts} />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
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
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No offers found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
                {offers.map((offer) => (
                  <OfferCard
                    key={offer._id}
                    offer={offer}
                    isSaved={savedOfferIds.has(offer._id)}
                    onSave={handleSave}
                    onUnsave={handleUnsave}
                    showSaveButton={true}
                  />
                ))}
              </div>

              <div className="flex justify-center mb-5">
                <Link href="/offers">
                  <Button size="lg" variant="default">
                    Browse More
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </MemberLayout>
  );
}

export default function MemberDashboard() {
  return (
    <Suspense fallback={
      <MemberLayout>
        <main className="flex-1">
          <div className="mx-auto">
            <div className="mb-12 text-center bg-primary space-y-6 px-4 py-16">
              <Skeleton className="h-16 w-64 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </MemberLayout>
    }>
      <MemberDashboardContent />
    </Suspense>
  );
}
