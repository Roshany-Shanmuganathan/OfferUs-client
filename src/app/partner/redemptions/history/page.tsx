'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { History, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

interface RedemptionHistoryItem {
  id: string;
  offerTitle: string;
  memberName: string;
  redeemedAt: string;
  status: 'completed' | 'cancelled';
}

export default function RedemptionHistoryPage() {
  const [history, setHistory] = useState<RedemptionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Replace with actual API call when backend is ready
    // For now, using mock data
    setTimeout(() => {
      setHistory([
        {
          id: '1',
          offerTitle: '20% Off All Items',
          memberName: 'John Doe',
          redeemedAt: new Date().toISOString(),
          status: 'completed',
        },
        {
          id: '2',
          offerTitle: 'Buy 2 Get 1 Free',
          memberName: 'Jane Smith',
          redeemedAt: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredHistory = history.filter(
    (item) =>
      item.offerTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.memberName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <History className="h-8 w-8" />
            Redemption History
          </h1>
          <p className="text-muted-foreground mt-2">
            View complete history of all offer redemptions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Redemptions</CardTitle>
            <CardDescription>
              Complete list of all redemptions processed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by offer or member name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? 'No redemptions found matching your search'
                  : 'No redemption history available'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Offer</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Redeemed At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.offerTitle}
                      </TableCell>
                      <TableCell>{item.memberName}</TableCell>
                      <TableCell>
                        {new Date(item.redeemedAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === 'completed'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PartnerLayout>
  );
}

