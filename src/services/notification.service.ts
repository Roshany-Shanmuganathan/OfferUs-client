import apiClient from '@/lib/apiClient';
import type { ApiResponse } from '@/types';

export interface Notification {
  _id: string;
  user: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntity?: {
    entityType: string;
    entityId: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const notificationService = {
  getNotifications: async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<NotificationsResponse>> => {
    const response = await apiClient.get<ApiResponse<NotificationsResponse>>('/notifications', {
      params: { page, limit },
    });
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/notifications/${id}/read`);
    return response.data;
  },
};

