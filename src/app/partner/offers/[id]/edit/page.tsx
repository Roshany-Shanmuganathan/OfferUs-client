'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { OfferForm } from '@/components/partner/offers/OfferForm';
import { partnerOfferService } from '@/services/offer.service';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Offer } from '@/types';

interface EditOfferPageProps {
  params: Promise<{ id: string }>;
}

export default function EditOfferPage({ params }: EditOfferPageProps) {
  const { user } = useAuth();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [offerId, setOfferId] = useState<string>('');

  const isBanned = user?.partner?.status === 'rejected';

  useEffect(() => {
    params.then((p) => setOfferId(p.id));
  }, [params]);

  useEffect(() => {
    if (!offerId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [offerResponse, categoriesResponse] = await Promise.all([
          partnerOfferService.getPartnerOffer(offerId),
          partnerOfferService.getCategories(),
        ]);

        if (offerResponse.success) {
          setOffer(offerResponse.data.offer);
        } else {
          toast.error('Failed to fetch offer');
        }

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data.categories.sort());
        } else {
          toast.error('Failed to fetch categories');
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Failed to load data';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
            <p className="mt-4 text-muted-foreground">Loading...</p>
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
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Offer</h1>
          <p className="text-muted-foreground mt-2">Update your offer details</p>
        </div>

        <div className="max-w-3xl">
          <OfferForm offer={offer} categories={categories} />
        </div>
      </div>
    </PartnerLayout>
  );
}

