"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PublicRoute } from '@/components/layout/PublicRoute';
import { ReviewSection } from '@/components/reviews/ReviewSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  getOffer,
  getOfferReviews,
  clickOffer,
} from '@/services/offer.service';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { savedOfferService } from '@/services/savedOffer.service';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  Phone, 
  Store, 
  QrCode, 
  Share2, 
  Minus, 
  Plus 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Offer, Review } from '@/types';
import { LoginTrigger } from '@/components/layout/LoginTrigger';
import { Suspense } from 'react';

function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function OfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const id = params.id as string;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [executingAction, setExecutingAction] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [offerData, reviewsData] = await Promise.all([
        getOffer(id),
        getOfferReviews(id),
      ]);

      setOffer(offerData.offer);
      setReviews(reviewsData.reviews || []);

      // Track click
      try {
        await clickOffer(id);
      } catch (err) {
        // Ignore click tracking errors
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to load offer';
      toast.error(errorMessage);
      if (error.response?.status === 404) {
        router.push('/offers');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  // Execute action after login redirect
  useEffect(() => {
    const executeAction = async () => {
      const action = searchParams.get('action');
      
      // Only execute if user is authenticated and action is present
      if (!isAuthenticated || !action || executingAction || !offer) {
        return;
      }

      // Only execute for members (save/call actions are member-only)
      if (user?.role !== 'member') {
        return;
      }

      setExecutingAction(true);

      try {
        if (action === 'save') {
          // Save the offer
          await savedOfferService.saveOffer(id);
          toast.success('Offer saved successfully!');
          // Remove action parameter from URL
          const url = new URL(window.location.href);
          url.searchParams.delete('action');
          router.replace(url.pathname + url.search);
        } else if (action === 'call') {
          // For call action, just remove the action parameter
          // The call button will work normally for authenticated users
          const url = new URL(window.location.href);
          url.searchParams.delete('action');
          router.replace(url.pathname + url.search);
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to execute action';
        toast.error(errorMessage);
        // Remove action parameter even on error
        const url = new URL(window.location.href);
        url.searchParams.delete('action');
        router.replace(url.pathname + url.search);
      } finally {
        setExecutingAction(false);
      }
    };

    executeAction();
  }, [isAuthenticated, user, searchParams, offer, id, router, executingAction]);

  const handleAction = async (action: 'call' | 'save') => {
    // If not authenticated, redirect to login with returnTo
    if (!isAuthenticated || user?.role !== 'member') {
      const returnToUrl = new URL(window.location.pathname, window.location.origin);
      returnToUrl.searchParams.set('action', action);
      
      // Build the returnTo value (pathname + search params)
      const returnToValue = returnToUrl.pathname + returnToUrl.search;
      
      console.log('[OfferDetailsPage] handleAction - action:', action, 'returnToValue:', returnToValue, 'currentPath:', window.location.pathname);
      
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('login', 'true');
      currentUrl.searchParams.set('returnTo', returnToValue);
      
      console.log('[OfferDetailsPage] Redirecting to:', currentUrl.pathname + currentUrl.search);
      router.push(currentUrl.pathname + currentUrl.search);
      return;
    }

    // If authenticated, execute action directly
    if (action === 'call' && partner?.contactInfo?.mobileNumber) {
      window.location.href = `tel:${partner.contactInfo.mobileNumber}`;
    } else if (action === 'save') {
      try {
        setExecutingAction(true);
        await savedOfferService.saveOffer(id);
        toast.success('Offer saved successfully!');
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to save offer';
        toast.error(errorMessage);
      } finally {
        setExecutingAction(false);
      }
    }
  };

  const handleReviewSuccess = () => {
    fetchData();
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <PublicRoute>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-8">
              <Skeleton className="h-10 w-32 mb-6" />
              <div className="grid lg:grid-cols-12 gap-6">
                <Skeleton className="col-span-12 lg:col-span-4 h-96 w-full" />
                <Skeleton className="col-span-12 lg:col-span-5 h-96 w-full" />
                <Skeleton className="col-span-12 lg:col-span-3 h-64 w-full" />
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </PublicRoute>
    );
  }

  if (!offer) {
    return (
      <PublicRoute>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-8">
              <p className="text-muted-foreground">Offer not found</p>
            </div>
          </main>
          <Footer />
        </div>
      </PublicRoute>
    );
  }

  const expiryDate = new Date(offer.expiryDate);
  const isExpired = expiryDate < new Date();
  const isExpiringSoon =
    !isExpired && expiryDate.getTime() - Date.now() < 5 * 24 * 60 * 60 * 1000;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const partner = typeof offer.partner === 'object' ? offer.partner : null;

  return (
    <PublicRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <Suspense fallback={null}>
          <LoginTrigger />
        </Suspense>
        <div className="bg-background min-h-screen pb-12">
          {/* Breadcrumb / Back Navigation */}
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Link href="/offers" className="hover:text-primary transition-colors">
                Offers
              </Link>
              <span className="mx-2">/</span>
              <span className="truncate max-w-[200px]">{offer.category}</span>
              <span className="mx-2">/</span>
              <span className="text-foreground truncate max-w-[300px]">{offer.title}</span>
            </div>
          </div>

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: Images */}
              <div className="md:col-span-4 space-y-4">
                <div className="aspect-square relative overflow-hidden rounded-lg border bg-white">
                  {offer.imageUrl ? (
                    <Image
                      src={offer.imageUrl}
                      alt={offer.title}
                      fill
                      className="object-contain p-2"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                      No Image Available
                    </div>
                  )}
                </div>
                
                {/* Vertical Gallery Thumbnails (Simulated) */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                   {offer.imageUrl && (
                     [1, 2, 3].map((_, i) => (
                       <div key={i} className={`relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border ${i === 0 ? 'border-primary ring-1 ring-primary' : 'border-muted hover:border-primary/50'}`}>
                          <Image
                            src={offer.imageUrl!}
                            alt={`Thumbnail ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                       </div>
                     ))
                   )}
                </div>
              </div>

              {/* CENTER COLUMN: Product Info */}
              <div className="md:col-span-5 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground leading-tight mb-2">
                    {offer.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-base">
                            {star <= Math.round(averageRating) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {reviews.length} Ratings
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center text-muted-foreground">
                      <span className="mr-1">Brand:</span>
                      <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                        {partner?.shopName || 'Unknown Shop'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-primary">
                        Rs. {offer.discountedPrice?.toLocaleString()}
                      </span>
                      {offer.originalPrice > offer.discountedPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          Rs. {offer.originalPrice.toLocaleString()}
                        </span>
                      )}
                      {offer.discount > 0 && (
                        <Badge variant="destructive" className="text-sm px-2">
                          -{offer.discount}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground w-20">Quantity</span>
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-none" 
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-12 text-center text-sm font-medium border-x h-9 flex items-center justify-center">
                        {quantity}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-none" 
                        onClick={incrementQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Buttons - Check auth and execute or redirect to login */}
                  <div className="flex gap-3">
                    {partner?.contactInfo?.mobileNumber && (
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700" 
                        size="lg"
                        onClick={() => handleAction('call')}
                        disabled={executingAction}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Call Shop
                      </Button>
                    )}
                    
                    <Button
                      variant="default"
                      onClick={() => handleAction('save')}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                      size="lg"
                      disabled={executingAction}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      {executingAction ? 'Saving...' : 'Save Offer'}
                    </Button>
                  </div>
                  
                  <div className="flex gap-4 text-xs text-muted-foreground pt-4 border-t">
                     <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        <span>Share</span>
                     </div>
                     {isExpiringSoon && (
                       <div className="flex items-center gap-1 text-red-500 font-medium">
                         <Calendar className="h-3 w-3" />
                         <span>Expires Soon: {formatDateShort(expiryDate)}</span>
                       </div>
                     )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Sidebar (Seller & QR) */}
              <div className="md:col-span-3 space-y-6">
                {/* Seller Details */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="p-4 bg-muted/20 border-b">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Sold By</div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={partner?.profileImage} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {partner?.shopName?.substring(0, 2).toUpperCase() || 'SH'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{partner?.shopName || 'Verified Partner'}</div>
                        <div className="text-xs text-muted-foreground truncate">{partner?.partnerName}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    {partner?.location && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {partner.location.street}, {partner.location.city}, {partner.location.district}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Store className="h-4 w-4 flex-shrink-0" />
                      <span>Positive Seller Ratings: 95%</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
                  <div className="p-4 flex flex-col items-center text-center space-y-3">
                     <div className="text-sm font-medium">Scan to Redeem</div>
                     <div className="bg-white p-2 rounded-lg border">
                        <QrCode className="h-24 w-24 text-foreground" />
                     </div>
                     <div className="text-xs text-muted-foreground">
                       Show this QR code at the shop counter to redeem your offer.
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Description & Reviews */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6">
               <div className="md:col-span-9 space-y-8">
                  
                  {/* Description */}
                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                     <h2 className="text-lg font-semibold mb-4 bg-muted/30 p-2 rounded-md inline-block">Product Details</h2>
                     <div className="prose max-w-none text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {offer.description}
                     </div>
                     
                     {offer.termsAndConditions && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="text-md font-medium mb-3">Terms & Conditions</h3>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {offer.termsAndConditions}
                        </div>
                      </div>
                     )}
                  </div>

                  {/* Reviews */}
                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <ReviewSection 
                      offerId={id} 
                      reviews={reviews} 
                      isAuthenticated={false} 
                      onReviewSuccess={handleReviewSuccess} 
                    />
                  </div>
               </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PublicRoute>
  );
}
