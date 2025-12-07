/**
 * Partner Service
 *
 * This service handles all partner-related API calls.
 * It uses the centralized API client for making requests.
 */ 

import type { ApiResponse, Partner, PartnerApprovalResponse } from "@/types";
import apiClient from "@/lib/apiClient";

/**
 * Partner API service
 * Contains all methods for partner operations
 */
export const partnerService = {
  /**
   * Get all pending partner registrations
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @returns List of pending partners with pagination info
   */
  getPending: async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PartnerApprovalResponse>> => {
    const response = await apiClient.get(
      `/partners/pending?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Approve a partner registration
   * @param id - Partner ID to approve
   * @returns Updated partner data
   */
  approve: async (id: string): Promise<ApiResponse<{ partner: Partner }>> => {
    const response = await apiClient.patch(`/partners/${id}/approve`);
    return response.data;
  },

  /**
   * Reject a partner registration
   * @param id - Partner ID to reject
   * @param reason - Optional rejection reason
   * @returns Updated partner data
   */
  reject: async (
    id: string,
    reason?: string
  ): Promise<ApiResponse<{ partner: Partner }>> => {
    const response = await apiClient.patch(`/partners/${id}/reject`, {
      reason,
    });
    return response.data;
  },
};
