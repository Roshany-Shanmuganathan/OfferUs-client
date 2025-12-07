'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { partnerOfferService } from '@/services/offer.service';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import type { Offer } from '@/types';

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
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

export default function PartnerOffersPage() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isBanned = user?.partner?.status === 'rejected';

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await partnerOfferService.getPartnerOffers();
      if (response.success) {
        setOffers(response.data.offers);
      } else {
        toast.error('Failed to fetch offers');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch offers';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDeleteClick = (offer: Offer) => {
    setOfferToDelete(offer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!offerToDelete) return;

    try {
      setDeleting(true);
      await partnerOfferService.deleteOffer(offerToDelete._id);
      toast.success('Offer deleted successfully');
      setDeleteDialogOpen(false);
      setOfferToDelete(null);
      fetchOffers();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to delete offer';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Offers</h1>
            <p className="text-muted-foreground mt-2">Manage your offers and view their status</p>
          </div>
          <Link href="/partner/offers/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Offer
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading offers...</p>
            </div>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground mb-4">No offers yet. Create your first offer!</p>
            <Link href="/partner/offers/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Offer
              </Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => {
                  const status = getOfferStatus(offer);
                  return (
                    <TableRow key={offer._id}>
                      <TableCell>
                        {offer.imageUrl ? (
                          <div className="relative h-12 w-12 rounded overflow-hidden">
                            <Image
                              src={offer.imageUrl}
                              alt={offer.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{offer.title}</TableCell>
                      <TableCell>{offer.discount}%</TableCell>
                      <TableCell>
                        ${offer.discountedPrice.toFixed(2)} / ${offer.originalPrice.toFixed(2)}
                      </TableCell>
                      <TableCell>{formatDate(offer.expiryDate)}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/partner/offers/${offer._id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/partner/offers/${offer._id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(offer)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Offer</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{offerToDelete?.title}&quot;? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PartnerLayout>
  );
}

