'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { PartnerAnalytics } from '@/types';

interface AnalyticsChartsProps {
  analytics: PartnerAnalytics | null;
  loading: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function AnalyticsCharts({ analytics, loading }: AnalyticsChartsProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics || analytics.offers.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No data available for charts</p>
      </div>
    );
  }

  const barChartData = analytics.offers
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)
    .map((offer) => ({
      name: offer.title.length > 20 ? offer.title.substring(0, 20) + '...' : offer.title,
      views: offer.views,
      clicks: offer.clicks,
      redemptions: offer.redemptions,
    }));

  const pieChartData = [
    {
      name: 'Active',
      value: analytics.activeOffers || 0,
    },
    {
      name: 'Expired',
      value: (analytics.totalOffers || 0) - (analytics.activeOffers || 0),
    },
    {
      name: 'Disabled',
      value: 0,
    },
  ].filter((item) => item.value > 0);

  const lineChartData = analytics.offers
    .sort((a, b) => {
      const dateA = new Date(a.id).getTime();
      const dateB = new Date(b.id).getTime();
      return dateA - dateB;
    })
    .slice(0, 12)
    .map((offer, index) => ({
      month: `Offer ${index + 1}`,
      redemptions: offer.redemptions,
    }));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Offers vs Views</CardTitle>
          <CardDescription>Top performing offers by views</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#0088FE" name="Views" />
              <Bar dataKey="clicks" fill="#00C49F" name="Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Redemptions Trend</CardTitle>
          <CardDescription>Redemptions over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="redemptions" stroke="#FF8042" name="Redemptions" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Offer Status</CardTitle>
          <CardDescription>Distribution of offer statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

