'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, History, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function RedemptionsPage() {
  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Redemptions</h1>
          <p className="text-muted-foreground mt-2">
            Manage offer redemptions and track redemption history
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Redemption Requests
              </CardTitle>
              <CardDescription>
                View and manage pending redemption requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/partner/redemptions/requests">
                  View Requests
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Redemption History
              </CardTitle>
              <CardDescription>
                View complete history of all redemptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/partner/redemptions/history">
                  View History
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Scan
              </CardTitle>
              <CardDescription>
                Scan QR codes to verify and process redemptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/partner/redemptions/scan">
                  Open Scanner
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PartnerLayout>
  );
}

