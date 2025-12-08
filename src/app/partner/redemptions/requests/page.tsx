'use client';

import { PartnerLayout } from '@/components/layout/PartnerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Ticket, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface RedemptionRequest {
  id: string;
  offerTitle: string;
  memberName: string;
  memberEmail: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function RedemptionRequestsPage() {
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call when backend is ready
    // For now, using mock data
    setTimeout(() => {
      setRequests([
        {
          id: '1',
          offerTitle: '20% Off All Items',
          memberName: 'John Doe',
          memberEmail: 'john@example.com',
          requestedAt: new Date().toISOString(),
          status: 'pending',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleApprove = (id: string) => {
    toast.success('Redemption request approved');
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'approved' as const } : req
      )
    );
  };

  const handleReject = (id: string) => {
    toast.error('Redemption request rejected');
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'rejected' as const } : req
      )
    );
  };

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Ticket className="h-8 w-8" />
            Redemption Requests
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and manage pending redemption requests from members
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>
              Approve or reject redemption requests from members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending redemption requests
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Offer</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Requested At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.offerTitle}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.memberName}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.memberEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === 'approved'
                              ? 'default'
                              : request.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
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

