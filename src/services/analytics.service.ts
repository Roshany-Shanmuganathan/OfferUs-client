import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  PartnerAnalyticsResponse,
  AdminAnalyticsResponse,
} from "@/types";

export const analyticsService = {
  getPartnerAnalytics: async (): Promise<PartnerAnalyticsResponse> => {
    const response = await apiClient.get<ApiResponse<PartnerAnalyticsResponse>>(
      "/partners/analytics"
    );
    return response.data.data;
  },
  getAdminAnalytics: async (
    startDate?: string,
    endDate?: string
  ): Promise<AdminAnalyticsResponse> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const queryString = params.toString();
    const url = `/admin/analytics${queryString ? `?${queryString}` : ""}`;
    const response = await apiClient.get<ApiResponse<AdminAnalyticsResponse>>(
      url
    );
    return response.data.data;
  },
};
