"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import type { Partner, ApiError } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { partnerService } from "@/services/partner.service";

export default function PartnerApprovalsPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await partnerService.getPending(page, 10);
      if (response.success) {
        setPartners(response.data.partners);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        toast.error("Failed to fetch pending partners");
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to fetch pending partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [page]);

  const handleApprove = async () => {
    if (!selectedPartner) return;

    setProcessing(true);
    try {
      const response = await partnerService.approve(selectedPartner._id);
      if (response.success) {
        toast.success("Partner approved successfully!");
        setApproveDialogOpen(false);
        setSelectedPartner(null);
        fetchPartners();
      } else {
        toast.error("Failed to approve partner");
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to approve partner");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPartner) return;

    setProcessing(true);
    try {
      const response = await partnerService.reject(
        selectedPartner._id,
        rejectReason || undefined
      );
      if (response.success) {
        toast.success("Partner rejected successfully!");
        setRejectDialogOpen(false);
        setSelectedPartner(null);
        setRejectReason("");
        fetchPartners();
      } else {
        toast.error("Failed to reject partner");
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to reject partner");
    } finally {
      setProcessing(false);
    }
  };

  const openApproveDialog = (partner: Partner) => {
    setSelectedPartner(partner);
    setApproveDialogOpen(true);
  };

  const openRejectDialog = (partner: Partner) => {
    setSelectedPartner(partner);
    setRejectDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Partner Approvals</h1>
          <p className="text-muted-foreground mt-2">
            Review and approve or reject partner registration requests.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No pending partners found.</p>
          </div>
        ) : (
          <>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner Name</TableHead>
                    <TableHead>Shop Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map(partner => (
                    <TableRow key={partner._id}>
                      <TableCell className="font-medium">
                        {partner.partnerName}
                      </TableCell>
                      <TableCell>{partner.shopName}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{partner.location.street}</div>
                          <div className="text-muted-foreground">
                            {partner.location.city}, {partner.location.district}
                          </div>
                          <div className="text-muted-foreground">
                            {partner.location.postalCode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{partner.category}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{partner.contactInfo.mobileNumber}</div>
                          {partner.contactInfo.website && (
                            <div className="text-muted-foreground">
                              <a
                                href={partner.contactInfo.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {partner.contactInfo.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(partner.status)}</TableCell>
                      <TableCell>
                        {new Date(partner.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => openApproveDialog(partner)}
                            disabled={partner.status !== "pending"}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openRejectDialog(partner)}
                            disabled={partner.status !== "pending"}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Approve Dialog */}
        <AlertDialog
          open={approveDialogOpen}
          onOpenChange={setApproveDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Partner Registration?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve{" "}
                <strong>{selectedPartner?.partnerName}</strong>? They will be
                able to login after approval.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={processing}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleApprove}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  "Approve"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reject Dialog */}
        <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Partner Registration?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject{" "}
                <strong>{selectedPartner?.partnerName}</strong>? You can provide
                a reason below.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="rejectReason">Reason (Optional)</Label>
                <Textarea
                  id="rejectReason"
                  placeholder="Enter reason for rejection..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  disabled={processing}
                  rows={4}
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={processing}
                onClick={() => setRejectReason("")}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReject}
                disabled={processing}
                className="bg-red-600 hover:bg-red-700"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Reject"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
