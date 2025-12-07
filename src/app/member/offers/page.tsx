'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { OfferCard } from '@/components/member/OfferCard';
import { browseOffers } from '@/services/offer.service';
import { savedOfferService } from '@/services/savedOffer.service';
import { partnerOfferService } from '@/services/offer.service';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { Offer } from '@/types';

export default function BrowseOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [savedOfferIds, setSavedOfferIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (category && category !== 'all') params.category = category;

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
  }, [category]);

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
      toast.success('Offer removed from saved list');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove offer';
      toast.error(errorMessage);
    } finally {
      setSavingStates((prev) => ({ ...prev, [offerId]: false }));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOffers();
  };

  return (
    <MemberLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Browse Offers</h1>
          <p className="text-muted-foreground mt-2">Discover amazing deals and discounts</p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search offers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
            <p className="text-muted-foreground">No offers found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        )}
      </div>
    </MemberLayout>
  );
}

