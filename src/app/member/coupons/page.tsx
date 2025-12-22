"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Store, Tag, Eye, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { couponService } from '@/services/coupon.service';
import { CouponModal } from '@/components/member/CouponModal';
import type { Coupon } from '@/types';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export default function MyCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const [stats, setStats] = useState({
    totalGenerated: 0,
    totalRedeemed: 0,
    activeCoupons: 0,
  });

  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await couponService.getMemberStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await couponService.getMyCoupons();
      setCoupons(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowModal(true);
  };

  const getStatusColor = (coupon: Coupon) => {
    if (coupon.status === 'REDEEMED') return 'bg-gray-500';
    if (coupon.status === 'EXPIRED' || new Date(coupon.expiryDate) < new Date()) return 'bg-destructive';
    return 'bg-success';
  };

  const getStatusText = (coupon: Coupon) => {
    if (coupon.status === 'REDEEMED') return 'Redeemed';
    if (coupon.status === 'EXPIRED' || new Date(coupon.expiryDate) < new Date()) return 'Expired';
    return 'Active';
  };

  const filterCoupons = (status: string) => {
    if (status === 'all') return coupons;
    if (status === 'active') {
      return coupons.filter(c => c.status === 'ACTIVE' && new Date(c.expiryDate) >= new Date());
    }
    if (status === 'redeemed') {
      return coupons.filter(c => c.status === 'REDEEMED');
    }
    if (status === 'expired') {
      return coupons.filter(c => c.status === 'EXPIRED' || new Date(c.expiryDate) < new Date());
    }
    return coupons;
  };

  const filteredCoupons = filterCoupons(activeTab);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Coupons</h1>
        <p className="text-muted-foreground">
          View and manage your generated coupons
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Generated</p>
              <h3 className="text-3xl font-bold text-primary">{stats.totalGenerated}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Tag className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Coupons</p>
              <h3 className="text-3xl font-bold text-success">{stats.activeCoupons}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gold/5 border-gold/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Redeemed</p>
              <h3 className="text-3xl font-bold text-gold">{stats.totalRedeemed}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center">
              <Store className="h-6 w-6 text-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">
            All ({coupons.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({filterCoupons('active').length})
          </TabsTrigger>
          <TabsTrigger value="redeemed">
            Redeemed ({filterCoupons('redeemed').length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({filterCoupons('expired').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredCoupons.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Tag className="h-16 w-16 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No coupons found
              </h3>
              <p className="text-muted-foreground">
                {activeTab === 'all'
                  ? 'Generate your first coupon from any offer!'
                  : `You don't have any ${activeTab} coupons.`}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoupons.map((coupon) => {
            const offer = typeof coupon.offer === 'object' ? coupon.offer : null;
            const partner = typeof coupon.partner === 'object' ? coupon.partner : null;
            const isExpired = new Date(coupon.expiryDate) < new Date();
            const isActive = coupon.status === 'ACTIVE' && !isExpired;

            return (
              <Card
                key={coupon._id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleViewCoupon(coupon)}
              >
                <div className="relative h-40 bg-gradient-to-br from-gold/10 to-gold/5">
                  {offer?.imageUrl ? (
                    <Image
                      src={offer.imageUrl}
                      alt={offer.title || 'Offer'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Tag className="h-16 w-16 text-gold/30" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={`${getStatusColor(coupon)} text-white`}>
                      {getStatusText(coupon)}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-1">
                      {offer?.title || 'Offer'}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {offer?.description || ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Store className="h-4 w-4" />
                    <span className="truncate">{partner?.shopName || 'Shop'}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4 text-gold" />
                      <span className="font-mono font-semibold text-gold">
                        {coupon.couponCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {isExpired ? 'Expired' : 'Expires'}: {new Date(coupon.expiryDate).toLocaleDateString()}
                      </span>
                    </div>

                    {isActive && (
                      <div className="flex items-center gap-2 text-sm text-warning">
                        <Clock className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(coupon.expiryDate), { addSuffix: true })}</span>
                      </div>
                    )}

                    {coupon.status === 'REDEEMED' && coupon.redeemedAt && (
                      <div className="text-sm text-muted-foreground">
                        Redeemed: {new Date(coupon.redeemedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-gold text-gold hover:bg-gold/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCoupon(coupon);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CouponModal
        coupon={selectedCoupon}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
