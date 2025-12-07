'use client';

import { useEffect, useState } from 'react';
import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { analyticsService } from '@/services/analytics.service';
import type { PartnerAnalytics, ApiError } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Tag, Eye, MousePointerClick, AlertCircle } from 'lucide-react';

export default function PartnerDashboard() {
  const [analytics, setAnalytics] = useState<PartnerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await analyticsService.getPartnerAnalytics();
        setAnalytics(response.analytics);
      } catch (error: unknown) {
        const apiError = error as ApiError;
        toast.error(apiError.message || 'Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', error);
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
      </div>
    </PartnerLayout>
  );
}

