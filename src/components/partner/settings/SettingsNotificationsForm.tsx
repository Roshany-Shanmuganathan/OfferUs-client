'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { Bell, Mail, Gift, AlertCircle } from 'lucide-react';

export function SettingsNotificationsForm() {
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [redemptionNotifications, setRedemptionNotifications] = useState(true);

  const handleSave = async () => {
    try {
      setLoading(true);
      // Note: Backend may not have notification settings endpoint
      // This is a placeholder - handle gracefully
      toast.info('Notification settings endpoint not available. Feature coming soon.');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save settings';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Label htmlFor="email-notifications">Email Notifications</Label>
            </div>
            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <Label htmlFor="approval-alerts">Offer Approval Alerts</Label>
            </div>
            <p className="text-sm text-muted-foreground">Get notified when offers are approved or rejected</p>
          </div>
          <Switch id="approval-alerts" checked={approvalAlerts} onCheckedChange={setApprovalAlerts} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <Label htmlFor="redemption-notifications">Redemption Notifications</Label>
            </div>
            <p className="text-sm text-muted-foreground">Get notified when offers are redeemed</p>
          </div>
          <Switch
            id="redemption-notifications"
            checked={redemptionNotifications}
            onCheckedChange={setRedemptionNotifications}
          />
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

