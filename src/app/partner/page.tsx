'use client';

import { useEffect, useState } from 'react';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { analyticsService } from '@/services/analytics.service';
import { reviewService } from '@/services/review.service';
import type { PartnerAnalytics, ApiError, Review } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Tag, Eye, MousePointerClick, AlertCircle, MessageSquare, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PartnerDashboard() {
  const [analytics, setAnalytics] = useState<PartnerAnalytics | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [analyticsRes, reviewsRes] = await Promise.all([
          analyticsService.getPartnerAnalytics(),
          reviewService.getPartnerReviews()
        ]);
        
        setAnalytics(analyticsRes.analytics);
        if (reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data.reviews);
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        // Don't show error if just reviews fail, but show if analytics fail
        console.error('Error fetching dashboard data:', error);
        if (!analytics) {
           toast.error(apiError.message || 'Failed to fetch dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <PartnerLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Partner Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your offers and view analytics
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PartnerLayout>
    );
  }

  if (!analytics) {
    return (
      <PartnerLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Partner Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your offers and view analytics
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">
                  Unable to load dashboard data. Please try again later.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PartnerLayout>
    );
  }

  const totalEngagements = analytics.totalClicks + analytics.totalRedemptions;
  const expiredOffers = analytics.totalOffers - analytics.activeOffers;

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your offers and view analytics
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.activeOffers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.totalOffers} total, {expiredOffers} expired
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.totalClicks.toLocaleString()} clicks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagements</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalEngagements.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.totalClicks.toLocaleString()} clicks, {analytics.totalRedemptions.toLocaleString()} redemptions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reviews Section */}
        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Reviews</CardTitle>
              <Link 
                href="/partner/reviews" 
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review._id} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">
                            {typeof review.offer === 'object' ? review.offer.title : 'Offer'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {review.comment}
                      </p>
                      {review.partnerResponse && (
                        <div className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                          <span className="font-semibold">You:</span> {review.partnerResponse}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PartnerLayout>
  );
}

