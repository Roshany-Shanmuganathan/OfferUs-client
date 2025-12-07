import apiClient from '@/lib/apiClient';
import type { ApiResponse, Offer } from '@/types';

export const savedOfferService = {
  getSavedOffers: async (): Promise<ApiResponse<{ offers: Offer[] }>> => {
    const response = await apiClient.get<ApiResponse<{ offers: Offer[] }>>('/saved-offers');
    return response.data;
  },

  saveOffer: async (offerId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/saved-offers', { offerId });
    return response.data;
  },

  removeSavedOffer: async (offerId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/saved-offers/${offerId}`);
    return response.data;
  },
};

