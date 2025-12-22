"use client";

import { MemberLayout } from "@/components/layout/MemberLayout";
import { OfferCard } from "@/components/member/OfferCard";
import { browseOffers } from "@/services/offer.service";
import { savedOfferService } from "@/services/savedOffer.service";
import { useSavedOffers } from "@/contexts/SavedOffersContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Bookmark, 
  TrendingUp, 
  Eye, 
  ArrowRight,
  Sparkles,
  ShoppingBag,
  User
} from "lucide-react";
import type { Offer } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { activityService, Activity } from "@/services/activity.service";
import { formatDistanceToNow } from "date-fns";

export default function MemberDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [suggestedOffers, setSuggestedOffers] = useState<Offer[]>([]);
  const [savedOfferIds, setSavedOfferIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState({
    savedCount: 0,
    activeOffersCount: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const { count, refreshCount } = useSavedOffers();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch suggested offers (latest 4 offers)
        const offersData = await browseOffers({ limit: 4, sortBy: '-createdAt' });
        setSuggestedOffers(offersData.offers || []);

        // Fetch saved offers to show saved state
        try {
          const savedResponse = await savedOfferService.getSavedOffers();
          if (savedResponse.success) {
            setSavedOfferIds(new Set(savedResponse.data.offers.map(o => o._id)));
            setStats(prev => ({ ...prev, savedCount: savedResponse.data.offers.length }));
          }
        } catch (err) {
          // Ignore errors for saved offers
        }

        // Get active offers count from the browse response
        if (offersData.pagination) {
          setStats(prev => ({ ...prev, activeOffersCount: offersData.pagination.total || 0 }));
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load dashboard data";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Load recent activities
    const activities = activityService.getRecentActivities(5);
    setRecentActivities(activities);
  }, []);

  const handleSave = async (offerId: string) => {
    try {
      setSavingStates(prev => ({ ...prev, [offerId]: true }));
      await savedOfferService.saveOffer(offerId);
      setSavedOfferIds(prev => new Set([...prev, offerId]));
      setStats(prev => ({ ...prev, savedCount: prev.savedCount + 1 }));
      refreshCount();
      toast.success("Offer saved");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save offer";
      toast.error(errorMessage);
    } finally {
      setSavingStates(prev => ({ ...prev, [offerId]: false }));
    }
  };

  const handleUnsave = async (offerId: string) => {
    try {
      setSavingStates(prev => ({ ...prev, [offerId]: true }));
      await savedOfferService.removeSavedOffer(offerId);
      setSavedOfferIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(offerId);
        return newSet;
      });
      setStats(prev => ({ ...prev, savedCount: Math.max(0, prev.savedCount - 1) }));
      refreshCount();
      toast.success("Offer removed from saved list");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove offer";
      toast.error(errorMessage);
    } finally {
      setSavingStates(prev => ({ ...prev, [offerId]: false }));
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getMemberName = () => {
    if (user?.member) {
      return user.member.firstName;
    }
    return "Member";
  };

  return (
    <MemberLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
            {getGreeting()}, {getMemberName()}! 
            <Sparkles className="h-7 w-7 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-2 text-base sm:text-lg">
            Welcome to your personalized dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Offers</CardTitle>
              <Bookmark className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : stats.savedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Your collection of favorites
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : stats.activeOffersCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Available to explore
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Status</CardTitle>
              <Eye className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground mt-1">
                Full access to all offers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => router.push("/offers")}
            >
              <Search className="h-6 w-6" />
              <span className="font-semibold">Browse Offers</span>
              <span className="text-xs opacity-80">Discover new deals</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => router.push("/saved-offers")}
            >
              <ShoppingBag className="h-6 w-6" />
              <span className="font-semibold">Saved Offers</span>
              <span className="text-xs opacity-80">View your collection</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => router.push("/profile")}
            >
              <User className="h-6 w-6" />
              <span className="font-semibold">My Profile</span>
              <span className="text-xs opacity-80">Update your info</span>
            </Button>
          </div>
        </div>

        {/* Suggested Offers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Suggested For You
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Latest offers handpicked just for you
              </p>
            </div>
            <Link
              href="/offers"
              className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all text-sm"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="border rounded-xl overflow-hidden bg-card"
                >
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : suggestedOffers.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No offers available</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back soon for new deals!
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {suggestedOffers.map(offer => (
                <OfferCard
                  key={offer._id}
                  offer={offer}
                  isSaved={savedOfferIds.has(offer._id)}
                  onSave={handleSave}
                  onUnsave={handleUnsave}
                  showSaveButton={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {activity.type === 'view' && (
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                        {activity.type === 'save' && (
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <Bookmark className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                        )}
                        {activity.type === 'unsave' && (
                          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                            <Bookmark className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.type === 'view' && 'Viewed offer'}
                          {activity.type === 'save' && 'Saved offer'}
                          {activity.type === 'unsave' && 'Removed offer'}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {activity.offerTitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">No recent activity</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start browsing offers to see your activity here
                  </p>
                  <Button
                    variant="default"
                    className="mt-4"
                    onClick={() => router.push("/offers")}
                  >
                    Browse Offers
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MemberLayout>
  );
}
