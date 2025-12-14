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
  district?: string;
  location?: string;
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

export const fetchOffersServer = async (options: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  district?: string;
  location?: string;
  sortBy?: string;
} = {}): Promise<{ offers: Offer[]; pagination: any }> => {
  try {
    const { page = 1, limit = 10, search, category, district, location, sortBy } = options;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (category && category !== 'all') params.append('category', category);
    if (district && district !== 'all') params.append('district', district);
    if (location) params.append('location', location);
    if (sortBy) params.append('sortBy', sortBy);

    const url = `${baseUrl}/offers?${params.toString()}`;
    console.log('[fetchOffersServer] Fetching from:', url);

    const response = await fetch(url, {
      next: { revalidate: 0 }, // Dynamic data needs 0 revalidation or force-dynamic
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[fetchOffersServer] Error response:', text.substring(0, 500));
      throw new Error(`Failed to fetch offers: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    const data: ApiResponse<OfferBrowseResponse> = JSON.parse(text);
    return {
      offers: data.data.offers,
      pagination: data.data.pagination
    };
  } catch (error) {
    console.error('[fetchOffersServer] Error:', error);
    if (error instanceof Error) {
      // Check if it's a network error (fetch failed)
      if (error.message === 'fetch failed' || error.message.includes('ECONNREFUSED') || error.message.includes('Failed to fetch')) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        console.error(
          `[fetchOffersServer] Network error: Cannot connect to API server at ${baseUrl}. ` +
          `Please ensure:\n` +
          `1. The backend server is running\n` +
          `2. The API URL is correct (check NEXT_PUBLIC_API_URL environment variable)\n` +
          `3. The server is accessible from this environment`
        );
      } else {
        console.error('[fetchOffersServer] Error message:', error.message);
      }
    }
    // Return empty array instead of throwing to prevent page crash
    return { offers: [], pagination: null };
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

export const fetchCategoriesServer = async (): Promise<string[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const url = `${baseUrl}/offers/categories`;
    
    console.log('[fetchCategoriesServer] Fetching from:', url);
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      cache: 'force-cache',
    });

    console.log('[fetchCategoriesServer] Response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('[fetchCategoriesServer] Error response:', text.substring(0, 500));
      return [];
    }

    const text = await response.text();
    console.log('[fetchCategoriesServer] Response text (first 200 chars):', text.substring(0, 200));
    
    const data: ApiResponse<{ categories: string[] }> = JSON.parse(text);
    return data.data.categories;
  } catch (error) {
    console.error('[fetchCategoriesServer] Error:', error);
    if (error instanceof Error) {
      console.error('[fetchCategoriesServer] Error message:', error.message);
    }
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

