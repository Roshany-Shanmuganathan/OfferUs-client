'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsProfileForm } from '@/components/partner/settings/SettingsProfileForm';
import { SettingsPasswordForm } from '@/components/partner/settings/SettingsPasswordForm';
import { SettingsNotificationsForm } from '@/components/partner/settings/SettingsNotificationsForm';
import { SettingsLogoUploader } from '@/components/partner/settings/SettingsLogoUploader';
import { DangerZoneSection } from '@/components/partner/settings/DangerZoneSection';
import { partnerSettingsService } from '@/services/partner.settings.service';
import { partnerOfferService } from '@/services/offer.service';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, User, Lock, Bell, Image, AlertTriangle } from 'lucide-react';
import type { Partner } from '@/types';

export default function PartnerSettingsPage() {
  const { user, refreshUser } = useAuth();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const isBanned = user?.partner?.status === 'rejected';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileResponse, categoriesResponse] = await Promise.all([
        partnerSettingsService.getPartnerProfile(),
        partnerOfferService.getCategories(),
      ]);

      if (profileResponse.success) {
        setPartner(profileResponse.data.partner);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data.categories.sort());
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to load settings';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProfileUpdate = async () => {
    await fetchData();
    await refreshUser();
  };

  if (isBanned) {
    return (
      <PartnerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h1 className="text-3xl font-bold">Account Banned</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Your account has been banned. Settings are restricted.
          </p>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="password">
                <Lock className="mr-2 h-4 w-4" />
                Password
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="branding">
                <Image className="mr-2 h-4 w-4" />
                Branding
              </TabsTrigger>
              <TabsTrigger value="danger">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Danger Zone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your business and contact information</CardDescription>
                </CardHeader>
                <CardContent>
                  <SettingsProfileForm
                    partner={partner}
                    categories={categories}
                    onSuccess={handleProfileUpdate}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="password" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <SettingsPasswordForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <SettingsNotificationsForm />
            </TabsContent>

            <TabsContent value="branding" className="mt-6">
              <SettingsLogoUploader currentLogoUrl={undefined} />
            </TabsContent>

            <TabsContent value="danger" className="mt-6">
              <DangerZoneSection />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PartnerLayout>
  );
}

