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
import { savedOfferService } from '@/services/savedOffer.service';
import { activityService } from '@/services/activity.service';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
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
import { useAuth } from '@/contexts/AuthContext';
import { useSavedOffers } from '@/contexts/SavedOffersContext';
import { CouponModal } from '@/components/member/CouponModal';
import { couponService } from '@/services/coupon.service';
import type { Coupon } from '@/types';

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
  const id = params.id as string;

  const { user, isAuthenticated } = useAuth();
  const { refreshCount } = useSavedOffers();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedCoupon, setGeneratedCoupon] = useState<Coupon | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [generatingCoupon, setGeneratingCoupon] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [offerData, reviewsData] = await Promise.all([
        getOffer(id),
        getOfferReviews(id),
      ]);

      setOffer(offerData.offer);
      setReviews(reviewsData.reviews || []);

      // Track view
      if (isAuthenticated && user?.role === 'member') {
        activityService.trackView(offerData.offer);
      }

      // Check if offer is saved
      if (isAuthenticated && user?.role === 'member') {
        try {
          const savedResponse = await savedOfferService.getSavedOffers();
          if (savedResponse.success) {
            setIsSaved(savedResponse.data.offers.some(o => o._id === id));
          }
        } catch (err) {
          // Ignore errors
        }
      }

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

  const handleSaveToggle = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      const url = new URL(window.location.href);
      url.searchParams.set('login', 'true');
      router.push(url.pathname + url.search);
      return;
    }

    // Only members can save offers
    if (user.role !== 'member') {
      toast.error("Only members can save offers");
      return;
    }

    if (!offer) return;

    try {
      setIsSaving(true);
      
      if (isSaved) {
        await savedOfferService.removeSavedOffer(id);
        setIsSaved(false);
        activityService.trackUnsave(offer);
        toast.success("Offer removed from saved list");
      } else {
        await savedOfferService.saveOffer(id);
        setIsSaved(true);
        activityService.trackSave(offer);
        toast.success("Offer saved");
      }
      
      refreshCount();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update saved offer";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGetCoupon = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      const url = new URL(window.location.href);
      url.searchParams.set('login', 'true');
      router.push(url.pathname + url.search);
      return;
    }

    // Only members can generate coupons
    if (user.role !== 'member') {
      toast.error("Only members can generate coupons");
      return;
    }

    if (!offer) return;

    try {
      setGeneratingCoupon(true);
      const coupon = await couponService.generateCoupon(id);
      setGeneratedCoupon(coupon);
      setShowCouponModal(true);
      toast.success("Coupon generated successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate coupon";
      toast.error(errorMessage);
    } finally {
      setGeneratingCoupon(false);
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
          <div className="bg-secondary/30 border-b border-border/50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center text-sm">
                <Link 
                  href="/offers" 
                  className="text-muted-foreground hover:text-gold transition-colors font-medium flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Offers
                </Link>
                <span className="mx-2 text-muted-foreground/50">/</span>
                <span className="text-muted-foreground truncate max-w-[200px]">{offer.category}</span>
                <span className="mx-2 text-muted-foreground/50">/</span>
                <span className="text-foreground font-medium truncate max-w-[300px]">{offer.title}</span>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: Images */}
              <div className="lg:col-span-5 space-y-4">
                <div className="aspect-square relative overflow-hidden rounded-xl border-2 border-gold/20 bg-white shadow-lg hover:border-gold/40 transition-all duration-300">
                  {offer.imageUrl ? (
                    <Image
                      src={offer.imageUrl}
                      alt={offer.title}
                      fill
                      className="object-contain p-4"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                      No Image Available
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                   {offer.imageUrl && (
                     [1, 2, 3].map((_, i) => (
                       <div 
                         key={i} 
                         className={`relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                           i === 0 
                             ? 'border-gold ring-2 ring-gold/30 shadow-md' 
                             : 'border-border hover:border-gold/50 hover:shadow-md'
                         }`}
                       >
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

              {/* RIGHT COLUMN: Product Info & Sidebar */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Product Title & Rating */}
                <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm">
                  <h1 className="text-3xl font-bold text-foreground leading-tight mb-4">
                    {offer.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex text-gold">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-lg">
                            {star <= Math.round(averageRating) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-gold font-semibold hover:underline cursor-pointer">
                        {reviews.length} {reviews.length === 1 ? 'Rating' : 'Ratings'}
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Brand:</span>
                      <span className="text-primary font-semibold hover:text-gold transition-colors cursor-pointer">
                        {partner?.shopName || 'Unknown Shop'}
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gradient-to-br from-gold/10 to-gold/5 p-6 rounded-xl border-2 border-gold/30 shadow-sm">
                    <div className="flex items-baseline gap-4 flex-wrap">
                      <span className="text-4xl font-bold text-gold">
                        Rs. {offer.discountedPrice?.toLocaleString()}
                      </span>
                      {offer.originalPrice > offer.discountedPrice && (
                        <span className="text-xl text-muted-foreground line-through">
                          Rs. {offer.originalPrice.toLocaleString()}
                        </span>
                      )}
                      {offer.discount > 0 && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white text-base px-3 py-1">
                          -{offer.discount}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm space-y-6">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-semibold text-foreground min-w-[80px]">Quantity</span>
                    <div className="flex items-center border-2 border-gold/30 rounded-lg overflow-hidden">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-11 w-11 rounded-none hover:bg-gold/10 hover:text-gold transition-colors" 
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      <div className="w-16 text-center text-base font-bold border-x-2 border-gold/30 h-11 flex items-center justify-center bg-gold/5">
                        {quantity}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-11 w-11 rounded-none hover:bg-gold/10 hover:text-gold transition-colors" 
                        onClick={incrementQuantity}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 flex-wrap">
                    <Button 
                      className="flex-1 min-w-[200px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 h-12 text-base font-semibold" 
                      size="lg"
                      onClick={handleGetCoupon}
                      disabled={generatingCoupon}
                    >
                      <QrCode className="mr-2 h-5 w-5" />
                      {generatingCoupon ? 'Generating...' : 'Get Coupon'}
                    </Button>
                    
                    <Button
                      variant="default"
                      onClick={handleSaveToggle}
                      disabled={isSaving}
                      className={`flex-1 min-w-[200px] shadow-md hover:shadow-lg transition-all duration-300 h-12 text-base font-semibold ${
                        isSaved 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-gold hover:bg-gold/90 text-primary'
                      }`}
                      size="lg"
                    >
                      <Heart className={`mr-2 h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                      {isSaved ? 'Saved' : 'Save Offer'}
                    </Button>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="flex gap-6 text-sm pt-4 border-t border-border/50">
                     <button className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span className="font-medium">Share</span>
                     </button>
                     {isExpiringSoon && (
                       <div className="flex items-center gap-2 text-red-500 font-semibold">
                         <Calendar className="h-4 w-4" />
                         <span>Expires: {formatDateShort(expiryDate)}</span>
                       </div>
                     )}
                  </div>
                </div>

                {/* Seller Details */}
                <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden hover:border-gold/30 transition-all duration-300">
                  <div className="p-5 bg-gradient-to-r from-gold/10 to-gold/5 border-b border-gold/20">
                    <div className="text-xs font-bold text-gold uppercase tracking-wider mb-3">Sold By</div>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-2 border-gold/50 shadow-md">
                        <AvatarImage src={partner?.profileImage} />
                        <AvatarFallback className="bg-gold/20 text-gold font-bold text-lg">
                          {partner?.shopName?.substring(0, 2).toUpperCase() || 'SH'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground truncate text-lg">{partner?.shopName || 'Verified Partner'}</div>
                        <div className="text-sm text-muted-foreground truncate">{partner?.partnerName}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    {partner?.location && (
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-gold" />
                        <span className="text-muted-foreground leading-relaxed">
                          {partner.location.street}, {partner.location.city}, {partner.location.district}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <Store className="h-5 w-5 flex-shrink-0 text-gold" />
                      <span className="text-muted-foreground">Positive Seller Ratings: <span className="font-semibold text-success">95%</span></span>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                {/* <div className="bg-card rounded-xl border-2 border-gold/30 shadow-md overflow-hidden">
                  <div className="p-6 flex flex-col items-center text-center space-y-4 bg-gradient-to-b from-gold/5 to-transparent">
                     <div className="text-base font-bold text-foreground">Scan to Redeem</div>
                     <div className="bg-white p-4 rounded-xl border-2 border-gold/40 shadow-lg">
                        <QrCode className="h-32 w-32 text-primary" />
                     </div>
                     <div className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                       Show this QR code at the shop counter to redeem your offer.
                     </div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Bottom Section: Description & Reviews */}
            <div className="mt-12 space-y-8">
                  
              {/* Description */}
              <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-12 bg-gold rounded-full"></div>
                  <h2 className="text-2xl font-bold text-foreground">Product Details</h2>
                </div>
                <div className="prose max-w-none text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {offer.description}
                </div>
                
                {offer.termsAndConditions && (
                  <div className="mt-8 pt-8 border-t border-border/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-1 w-12 bg-gold rounded-full"></div>
                      <h3 className="text-xl font-bold text-foreground">Terms & Conditions</h3>
                    </div>
                    <div className="text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {offer.termsAndConditions}
                    </div>
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div className="bg-card rounded-xl border border-border/50 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-12 bg-gold rounded-full"></div>
                  <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
                </div>
                <ReviewSection 
                  offerId={id} 
                  reviews={reviews} 
                  isAuthenticated={isAuthenticated} 
                  onReviewSuccess={handleReviewSuccess} 
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
        
        {/* Coupon Modal */}
        <CouponModal
          coupon={generatedCoupon}
          open={showCouponModal}
          onClose={() => setShowCouponModal(false)}
        />
      </div>
    </PublicRoute>
  );
}
