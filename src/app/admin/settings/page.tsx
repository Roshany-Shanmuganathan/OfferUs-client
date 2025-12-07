'use client';

import { useState } from 'react';
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
import { Loader2, Key, User, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

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

