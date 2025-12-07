import apiClient from '@/lib/apiClient';
import type { ApiResponse, Partner } from '@/types';

export interface UpdatePartnerProfileData {
  partnerName?: string;
  shopName?: string;
  location?: {
    street?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  };
  category?: string;
  contactInfo?: {
    mobileNumber?: string;
    website?: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const partnerSettingsService = {
  getPartnerProfile: async (): Promise<ApiResponse<{ partner: Partner }>> => {
    const response = await apiClient.get<ApiResponse<{ partner: Partner }>>('/partners/profile');
    return response.data;
  },

  updatePartnerProfile: async (
    data: UpdatePartnerProfileData
  ): Promise<ApiResponse<{ partner: Partner }>> => {
    const response = await apiClient.put<ApiResponse<{ partner: Partner }>>('/partners/profile', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData): Promise<ApiResponse<null>> => {
    // Note: This endpoint may not exist - handle gracefully
    try {
      const response = await apiClient.post<ApiResponse<null>>('/auth/change-password', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Password change endpoint not available. Please contact support.');
      }
      throw error;
    }
  },
};

