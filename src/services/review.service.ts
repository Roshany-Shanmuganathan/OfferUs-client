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
};

