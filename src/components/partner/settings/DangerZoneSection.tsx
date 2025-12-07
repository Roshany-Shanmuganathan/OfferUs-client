'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useState } from 'react';
import { Trash2, PowerOff, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function DangerZoneSection() {
  const { logout } = useAuth();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [logoutAllDialogOpen, setLogoutAllDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      // Note: Backend may not have delete account endpoint for partners
      toast.info('Account deletion endpoint not available. Please contact support.');
      setDeleteDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete account';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      setLoading(true);
      // Note: Backend may not have deactivate endpoint
      toast.info('Account deactivation endpoint not available. Please contact support.');
      setDeactivateDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to deactivate account';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      setLoading(true);
      // Note: Backend may not have logout all devices endpoint
      toast.info('Logout all devices endpoint not available. Please logout manually from each device.');
      setLogoutAllDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to logout from all devices';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>Irreversible and destructive actions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout from All Devices</span>
            </div>
            <p className="text-sm text-muted-foreground">Sign out from all devices where you're logged in</p>
          </div>
          <Button variant="outline" onClick={() => setLogoutAllDialogOpen(true)}>
            Logout All
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <PowerOff className="h-4 w-4" />
              <span className="font-medium">Deactivate Account</span>
            </div>
            <p className="text-sm text-muted-foreground">Temporarily disable your account</p>
          </div>
          <Button variant="outline" onClick={() => setDeactivateDialogOpen(true)}>
            Deactivate
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="font-medium">Delete Account</span>
            </div>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
          </div>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            Delete Account
          </Button>
        </div>
      </CardContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and will permanently
              delete all your data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate your account? You can reactivate it later by contacting
              support.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeactivateAccount} disabled={loading}>
              {loading ? 'Deactivating...' : 'Deactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={logoutAllDialogOpen} onOpenChange={setLogoutAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout from All Devices</DialogTitle>
            <DialogDescription>
              This will sign you out from all devices where you're currently logged in. You'll need to login
              again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoutAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogoutAll} disabled={loading}>
              {loading ? 'Logging out...' : 'Logout All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

