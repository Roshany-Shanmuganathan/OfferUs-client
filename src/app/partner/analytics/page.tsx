'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { StatsCard } from '@/components/partner/analytics/StatsCard';
import { AnalyticsCharts } from '@/components/partner/analytics/AnalyticsCharts';
import { OfferStatsTable } from '@/components/partner/analytics/OfferStatsTable';
import { analyticsService } from '@/services/analytics.service';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Package,
  Eye,
  MousePointerClick,
  Gift,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import type { PartnerAnalytics } from '@/types';

export default function PartnerAnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<PartnerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const isBanned = user?.partner?.status === 'rejected';

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getPartnerAnalytics();
      setAnalytics(data.analytics);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to fetch analytics';
      toast.error(errorMessage);
      
      if (error.response?.status === 401) {
        window.location.href = '/';
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Please contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isBanned) {
    return (
      <PartnerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h1 className="text-3xl font-bold">Account Banned</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Your account has been banned. Analytics access is disabled.
          </p>
        </div>
      </PartnerLayout>
    );
  }

  const expiredOffers = analytics
    ? analytics.totalOffers - analytics.activeOffers
    : 0;
  const disabledOffers = 0;

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track your offer performance and engagement metrics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Offers"
            value={analytics?.totalOffers || 0}
            icon={Package}
            loading={loading}
          />
          <StatsCard
            title="Active Offers"
            value={analytics?.activeOffers || 0}
            icon={TrendingUp}
            loading={loading}
            description={`${expiredOffers} expired, ${disabledOffers} disabled`}
          />
          <StatsCard
            title="Total Views"
            value={analytics?.totalViews?.toLocaleString() || '0'}
            icon={Eye}
            loading={loading}
          />
          <StatsCard
            title="Total Clicks"
            value={analytics?.totalClicks?.toLocaleString() || '0'}
            icon={MousePointerClick}
            loading={loading}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <StatsCard
            title="Total Redemptions"
            value={analytics?.totalRedemptions?.toLocaleString() || '0'}
            icon={Gift}
            loading={loading}
          />
        </div>

        <AnalyticsCharts analytics={analytics} loading={loading} />

        <OfferStatsTable offers={analytics?.offers || []} loading={loading} />
      </div>
    </PartnerLayout>
  );
}

