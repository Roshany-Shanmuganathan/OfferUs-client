import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  OfferBrowseResponse,
  OfferResponse,
  ReviewsResponse,
  Review,
  Offer,
} from '@/types';

export const browseOffers = async (params?: {
  category?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}): Promise<OfferBrowseResponse> => {
  const response = await apiClient.get<ApiResponse<OfferBrowseResponse>>('/offers', {
    params,
  });
  return response.data.data;
};

export const getOffer = async (id: string): Promise<OfferResponse> => {
  const response = await apiClient.get<ApiResponse<OfferResponse>>(`/offers/${id}`);
  return response.data.data;
};

export const getOfferReviews = async (offerId: string): Promise<ReviewsResponse> => {
  const response = await apiClient.get<ApiResponse<ReviewsResponse>>(
    `/offers/${offerId}/reviews`
  );
  return response.data.data;
};

export const clickOffer = async (id: string): Promise<void> => {
  await apiClient.post(`/offers/${id}/click`);
};

export const fetchOffersServer = async (limit: number = 10): Promise<Offer[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${baseUrl}/offers?limit=${limit}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch offers');
    }

    const data: ApiResponse<OfferBrowseResponse> = await response.json();
    return data.data.offers;
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
};

export const fetchOfferServer = async (id: string): Promise<Offer | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${baseUrl}/offers/${id}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      return null;
    }

    const data: ApiResponse<OfferResponse> = await response.json();
    return data.data.offer;
  } catch (error) {
    console.error('Error fetching offer:', error);
    return null;
  }
};

export const fetchOfferReviewsServer = async (offerId: string): Promise<Review[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${baseUrl}/offers/${offerId}/reviews`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      return [];
    }

    const data: ApiResponse<ReviewsResponse> = await response.json();
    return data.data.reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const partnerOfferService = {
  createOffer: async (data: {
    title: string;
    description: string;
    discount: number;
    originalPrice: number;
    discountedPrice: number;
    category: string;
    expiryDate: string;
    imageUrl?: string;
    termsAndConditions?: string;
  }): Promise<ApiResponse<{ offer: Offer }>> => {
    const response = await apiClient.post<ApiResponse<{ offer: Offer }>>('/offers', data);
    return response.data;
  },

  getPartnerOffers: async (): Promise<ApiResponse<{ offers: Offer[] }>> => {
    const response = await apiClient.get<ApiResponse<{ offers: Offer[] }>>(
      '/offers/partner/my-offers'
    );
    return response.data;
  },

  getPartnerOffer: async (id: string): Promise<ApiResponse<{ offer: Offer }>> => {
    const response = await apiClient.get<ApiResponse<{ offer: Offer }>>(
      `/offers/partner/${id}`
    );
    return response.data;
  },

  updateOffer: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      discount?: number;
      originalPrice?: number;
      discountedPrice?: number;
      category?: string;
      expiryDate?: string;
      imageUrl?: string;
      termsAndConditions?: string;
      isActive?: boolean;
    }
  ): Promise<ApiResponse<{ offer: Offer }>> => {
    const response = await apiClient.put<ApiResponse<{ offer: Offer }>>(`/offers/${id}`, data);
    return response.data;
  },

  deleteOffer: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/offers/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<ApiResponse<{ categories: string[] }>> => {
    const response = await apiClient.get<ApiResponse<{ categories: string[] }>>(
      '/offers/categories'
    );
    return response.data;
  },

  addCategory: async (name: string): Promise<ApiResponse<{ category: string }>> => {
    const response = await apiClient.post<ApiResponse<{ category: string }>>(
      '/offers/categories',
      { name }
    );
    return response.data;
  },

  deleteCategory: async (name: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/offers/categories/${encodeURIComponent(name)}`);
    return response.data;
  },
};

