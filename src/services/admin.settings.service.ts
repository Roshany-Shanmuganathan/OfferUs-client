/**
 * Admin Settings Service
 *
 * This service handles all admin settings-related API calls.
 * It uses the centralized API client for making requests.
 */

import type { ApiResponse } from '@/types';
import apiClient from '@/lib/apiClient';

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Admin Settings API service
 * Contains all methods for admin settings operations
 */
export const adminSettingsService = {
  /**
   * Change admin password
   * @param data - Password change data (current password and new password)
   * @returns Success response
   */
  changePassword: async (
    data: ChangePasswordData
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(
      '/auth/change-password',
      data
    );
    return response.data;
  },
};







