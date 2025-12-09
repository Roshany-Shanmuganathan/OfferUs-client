import apiClient from '@/lib/apiClient';
import type { ApiResponse, Review } from '@/types';

export interface CreateReviewData {
  offerId: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  createReview: async (data: CreateReviewData): Promise<ApiResponse<{ review: Review }>> => {
    const response = await apiClient.post<ApiResponse<{ review: Review }>>('/reviews', data);
    return response.data;
  },

  getPartnerReviews: async (): Promise<ApiResponse<{ reviews: Review[] }>> => {
    const response = await apiClient.get<ApiResponse<{ reviews: Review[] }>>('/reviews/partner');
    return response.data;
  },

  respondToReview: async (reviewId: string, responseText: string): Promise<ApiResponse<{ review: Review }>> => {
    const response = await apiClient.put<ApiResponse<{ review: Review }>>(`/reviews/${reviewId}/respond`, {
      response: responseText,
    });
    return response.data;
  },
};

