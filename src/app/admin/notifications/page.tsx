"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { notificationService, type Notification } from "@/services/notification.service";
import type { ApiError } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Bell, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(page, 10);
      if (response.success) {
        setNotifications(response.data.notifications);
        setTotalPages(response.data.pagination.pages);
        setUnreadCount(response.data.unreadCount);
      } else {
        toast.error("Failed to fetch notifications");
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const handleMarkAsRead = async (id: string) => {
    setMarkingAsRead(id);
    try {
      const response = await notificationService.markAsRead(id);
      if (response.success) {
        toast.success("Notification marked as read");
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === id ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        toast.error("Failed to mark notification as read");
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to mark notification as read");
    } finally {
      setMarkingAsRead(null);
    }
  };

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      new_offer: "bg-blue-50 text-blue-700 border-blue-200",
      expiring_offer: "bg-orange-50 text-orange-700 border-orange-200",
      partner_approved: "bg-green-50 text-green-700 border-green-200",
      partner_rejected: "bg-red-50 text-red-700 border-red-200",
      new_review: "bg-purple-50 text-purple-700 border-purple-200",
      system: "bg-gray-50 text-gray-700 border-gray-200",
      member_registered: "bg-indigo-50 text-indigo-700 border-indigo-200",
      partner_registered: "bg-teal-50 text-teal-700 border-teal-200",
    };

    const colorClass = typeColors[type] || "bg-gray-50 text-gray-700 border-gray-200";
    const displayName = type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <Badge variant="outline" className={colorClass}>
        {displayName}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-2">
              Manage and view your notifications
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="default" className="bg-blue-600">
              <Bell className="h-3 w-3 mr-1" />
              {unreadCount} unread
            </Badge>
          )}
        </div>

        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">
                  No notifications found.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.map((notification) => (
                        <TableRow
                          key={notification._id}
                          className={
                            !notification.isRead
                              ? "bg-blue-50/50 font-medium"
                              : ""
                          }
                        >
                          <TableCell>{getTypeBadge(notification.type)}</TableCell>
                          <TableCell className="font-medium">
                            {notification.title}
                          </TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                          </TableCell>
                          <TableCell>
                            {notification.isRead ? (
                              <Badge variant="outline" className="bg-gray-50">
                                Read
                              </Badge>
                            ) : (
                              <Badge variant="default" className="bg-blue-600">
                                Unread
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(notification.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {!notification.isRead && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsRead(notification._id)}
                                disabled={markingAsRead === notification._id}
                              >
                                {markingAsRead === notification._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Mark as Read
                                  </>
                                )}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
