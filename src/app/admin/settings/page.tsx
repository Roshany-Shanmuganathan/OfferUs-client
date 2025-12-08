'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { adminSettingsService } from '@/services/admin.settings.service';
import { Loader2, Key, User, Shield, Building2, BarChart3, Tag, Settings2, ExternalLink, TrendingUp, Package, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { partnerOfferService } from '@/services/offer.service';
import { analyticsService } from '@/services/analytics.service';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function AdminSettingsPage() {
  const { user, refreshUser } = useAuth();
  const [changingPassword, setChangingPassword] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [industryStats, setIndustryStats] = useState<{ category: string; count: number }[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const fetchIndustryData = async () => {
      try {
        setLoadingCategories(true);
        setLoadingStats(true);
        
        // Fetch categories
        const categoriesResponse = await partnerOfferService.getCategories();
        if (categoriesResponse.success) {
          const sortedCategories = categoriesResponse.data.categories.sort();
          setCategories(sortedCategories);
          
          // Fetch analytics to get industry stats
          try {
            const analyticsResponse = await analyticsService.getAdminAnalytics();
            // We'll need to fetch offers to get category breakdown
            // For now, we'll use the categories list
            setIndustryStats(
              sortedCategories.map((cat) => ({
                category: cat,
                count: 0, // This would be populated from actual offer data
              }))
            );
          } catch (error) {
            console.error('Error fetching analytics:', error);
          }
        }
      } catch (error: any) {
        console.error('Error fetching industry data:', error);
        toast.error('Failed to load industry data');
      } finally {
        setLoadingCategories(false);
        setLoadingStats(false);
      }
    };

    fetchIndustryData();
  }, []);

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      setChangingPassword(true);
      const response = await adminSettingsService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.success) {
        toast.success('Password changed successfully');
        passwordForm.reset();
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your admin account settings and preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Account Information</CardTitle>
              </div>
              <CardDescription>Your admin account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <p className="mt-1 text-sm font-medium">{user?.email || 'N/A'}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                <p className="mt-1 text-sm font-medium capitalize">{user?.role || 'N/A'}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Account Created</Label>
                <p className="mt-1 text-sm font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Keep your account secure by regularly updating your password.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Industry Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <CardTitle>Industry Management</CardTitle>
              </div>
              <Link href="/admin/categories">
                <Button variant="outline" size="sm">
                  Manage Categories
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>
              Manage industry categories and view industry statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingCategories ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No categories available. Add categories to get started.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Active Industries</Label>
                  <Badge variant="secondary">{categories.length} Categories</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {categories.slice(0, 12).map((category) => (
                    <Badge key={category} variant="outline" className="justify-center py-1.5">
                      {category}
                    </Badge>
                  ))}
                  {categories.length > 12 && (
                    <Badge variant="outline" className="justify-center py-1.5">
                      +{categories.length - 12} more
                    </Badge>
                  )}
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Link href="/admin/categories" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Tag className="mr-2 h-4 w-4" />
                      View All Categories
                    </Button>
                  </Link>
                  <Link href="/admin/analytics" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Industry Analytics
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Industry Analytics Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <CardTitle>Industry Analytics Overview</CardTitle>
            </div>
            <CardDescription>
              Quick overview of industry performance and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Total Industries</span>
                  </div>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>Active Categories</span>
                  </div>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    <span>Industry Coverage</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {categories.length > 0 ? '100%' : '0%'}
                  </p>
                </div>
              </div>
            )}
            <Separator className="my-4" />
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full">
                View Detailed Analytics
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Industry Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              <CardTitle>Industry Preferences</CardTitle>
            </div>
            <CardDescription>
              Configure industry-specific settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Category Auto-Approval</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically approve offers in certain categories
                  </p>
                </div>
                <Badge variant="secondary">Disabled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Industry Filtering</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable industry-based filtering for members
                  </p>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Category Recommendations</Label>
                  <p className="text-xs text-muted-foreground">
                    Show category suggestions to partners
                  </p>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" disabled>
                <Settings2 className="mr-2 h-4 w-4" />
                Configure Settings
              </Button>
              <Link href="/admin/categories" className="flex-1">
                <Button variant="outline" className="w-full">
                  Manage Industries
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Industry Quick Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Industry Quick Actions</CardTitle>
            </div>
            <CardDescription>
              Quick access to industry-related management features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-start">
                  <Tag className="mr-2 h-4 w-4" />
                  Manage Categories
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/admin/approvals">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Partner Approvals
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Dashboard Overview
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={passwordForm.handleSubmit(handleChangePassword)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter your current password"
                  {...passwordForm.register('currentPassword')}
                  disabled={changingPassword}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password (min. 8 characters)"
                  {...passwordForm.register('newPassword')}
                  disabled={changingPassword}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  {...passwordForm.register('confirmPassword')}
                  disabled={changingPassword}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={changingPassword} className="w-full md:w-auto">
                {changingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}


