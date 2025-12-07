import apiClient from '@/lib/apiClient';
import type { ApiResponse, PartnerAnalyticsResponse } from '@/types';

export const analyticsService = {
  getPartnerAnalytics: async (): Promise<PartnerAnalyticsResponse> => {
    const response = await apiClient.get<ApiResponse<PartnerAnalyticsResponse>>('/partners/analytics');
    return response.data.data;
  },
};

