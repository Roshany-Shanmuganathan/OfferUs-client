"use client";

import { MemberLayout } from "@/components/layout/MemberLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewForm } from "@/components/member/ReviewForm";
import { OfferCard } from "@/components/member/OfferCard";
import {
  getOffer,
  getOfferReviews,
  clickOffer,
} from "@/services/offer.service";
import { savedOfferService } from "@/services/savedOffer.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MapPin, Calendar, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Offer, Review } from "@/types";

function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MemberOfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      // Check if saved
      try {
        const savedResponse = await savedOfferService.getSavedOffers();
        if (savedResponse.success) {
          setIsSaved(savedResponse.data.offers.some((o) => o._id === id));
        }
      } catch (err) {
        // Ignore errors
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load offer";
      toast.error(errorMessage);
      if (error.response?.status === 404) {
        router.push("/member/offers");
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

  const handleSave = async () => {
    try {
      setSaving(true);
      await savedOfferService.saveOffer(id);
      setIsSaved(true);
      toast.success("Offer saved");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save offer";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleUnsave = async () => {
    try {
      setSaving(true);
      await savedOfferService.removeSavedOffer(id);
      setIsSaved(false);
      toast.success("Offer removed from saved list");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove offer";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleReviewSuccess = () => {
    fetchData();
  };

  if (loading) {
    return (
      <MemberLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </MemberLayout>
    );
  }

  if (!offer) {
    return (
      <MemberLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Offer not found</p>
        </div>
      </MemberLayout>
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

  return (
    <MemberLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/member/offers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Offers
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
            {offer.imageUrl ? (
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                fill
                className="object-cover"
                priority
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
                <h1 className="text-3xl font-bold tracking-tight">
                  {offer.title}
                </h1>
                {isExpiringSoon && (
                  <Badge
                    variant="destructive"
                    className="bg-red-500/90 text-white"
                  >
                    Expires Soon
                  </Badge>
                )}
                {isExpired && <Badge variant="destructive">Expired</Badge>}
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-primary">
                  Rs. {offer.discountedPrice?.toLocaleString()}
                </span>
                {offer.originalPrice &&
                  offer.originalPrice > offer.discountedPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      Rs. {offer.originalPrice.toLocaleString()}
                    </span>
                  )}
                {offer.discount && (
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {offer.discount}% OFF
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant={isSaved ? "default" : "outline"}
                  onClick={isSaved ? handleUnsave : handleSave}
                  disabled={saving}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                  />
                  {isSaved ? "Saved" : "Save Offer"}
                </Button>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Category:</span>{" "}
                  {offer.category}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    <span className="font-medium">Expires:</span>{" "}
                    {formatDateShort(expiryDate)} (
                    {formatDistanceToNow(expiryDate, { addSuffix: true })})
                  </span>
                </div>
                {typeof offer.partner === "object" &&
                  offer.partner?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {offer.partner.location.street},{" "}
                        {offer.partner.location.city},{" "}
                        {offer.partner.location.district}
                      </span>
                    </div>
                  )}
                {offer.analytics && (
                  <>
                    <div>
                      <span className="font-medium">Views:</span>{" "}
                      {offer.analytics.views || 0}
                    </div>
                    <div>
                      <span className="font-medium">Clicks:</span>{" "}
                      {offer.analytics.clicks || 0}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {offer.description}
              </p>
            </div>

            {offer.termsAndConditions && (
              <div className="pt-4 border-t">
                <h2 className="text-xl font-semibold mb-3">
                  Terms & Conditions
                </h2>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {offer.termsAndConditions}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Reviews</h2>
            {reviews.length > 0 ? (
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${
                          star <= Math.round(averageRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-muted-foreground">
                    ({reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewForm offerId={id} onSuccess={handleReviewSuccess} />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {typeof review.member === "object" &&
                        review.member.email
                          ? review.member.email
                          : "Anonymous"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDateShort(review.createdAt)}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {review.comment}
                    </p>
                  )}
                  {review.partnerResponse && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs font-medium mb-1">
                        Partner Response:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {review.partnerResponse}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
