'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { OfferForm } from '@/components/partner/offers/OfferForm';
import { partnerOfferService } from '@/services/offer.service';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CreateOfferPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const isBanned = user?.partner?.status === 'rejected';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await partnerOfferService.getCategories();
        if (response.success) {
          setCategories(response.data.categories.sort());
        } else {
          toast.error('Failed to fetch categories');
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Failed to fetch categories';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Offer</h1>
          <p className="text-muted-foreground mt-2">Add a new offer to attract customers</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl">
            <OfferForm categories={categories} />
          </div>
        )}
      </div>
    </PartnerLayout>
  );
}

