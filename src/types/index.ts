/**
 * Type Definitions
 *
 * This file contains all TypeScript type definitions used throughout the application.
 * Types are organized by entity/domain for better maintainability.
 */

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}

// ============================================================================
// User Types
// ============================================================================

/**
 * User entity
 */
export interface User {
  _id: string;
  email: string;
  role: "admin" | "partner" | "member";
  createdAt: string;
}

/**
 * Member entity
 */
export interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  address: string;
  dateOfBirth?: string;
  gender?: string;
}

/**
 * Partner entity
 */
export interface Partner {
  _id: string;
  userId?:
    | {
        _id: string;
        email: string;
      }
    | string;
  partnerName: string;
  shopName: string;
  location: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
    coordinates?: [number, number];
  };
  category: string;
  contactInfo: {
    mobileNumber: string;
    website?: string;
  };
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

/**
 * User with associated partner or member data
 */
export type UserWithDetails = User & {
  partner?: Partner;
  member?: Member;
};

// ============================================================================
// Auth Types
// ============================================================================

/**
 * Authentication response from login/register
 */
export interface AuthResponse {
  user: User;
  token: string;
  partner?: Partner;
  member?: Member;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Member registration request payload
 */
export interface MemberRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  address: string;
  dateOfBirth?: string;
  gender?: string;
}

/**
 * Partner registration request payload
 */
export interface PartnerRegisterRequest {
  email: string;
  password: string;
  partnerName: string;
  shopName: string;
  location: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
    coordinates?: [number, number];
  };
  category: string;
  contactInfo: {
    mobileNumber: string;
    website?: string;
  };
}

// ============================================================================
// Partner Types
// ============================================================================

/**
 * Partner approval response with pagination
 */
export interface PartnerApprovalResponse {
  partners: Partner[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Axios error with API error response
 */
export interface ApiError extends Error {
  response?: {
    data: ApiErrorResponse;
    status: number;
  };
  message: string;
}

// ============================================================================
// Offer Types
// ============================================================================

export interface Offer {
  _id: string;
  partner: Partner | string;
  title: string;
  description: string;
  discount: number;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  expiryDate: string;
  isActive: boolean;
  imageUrl?: string;
  termsAndConditions?: string;
  analytics: {
    views: number;
    clicks: number;
    redemptions: number;
  };
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
}

export interface OfferBrowseResponse {
  offers: Offer[];
  isAuthenticated: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OfferResponse {
  offer: Offer;
  isAuthenticated: boolean;
}

// ============================================================================
// Review Types
// ============================================================================

export interface Review {
  _id: string;
  member:
    | {
        _id: string;
        email: string;
      }
    | string;
  partner: string;
  offer: string;
  rating: number;
  comment?: string;
  partnerResponse?: string;
  responseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface PartnerAnalyticsOffer {
  id: string;
  title: string;
  views: number;
  clicks: number;
  redemptions: number;
}

export interface PartnerAnalytics {
  totalOffers: number;
  activeOffers: number;
  totalViews: number;
  totalClicks: number;
  totalRedemptions: number;
  offers: PartnerAnalyticsOffer[];
}

export interface PartnerAnalyticsResponse {
  analytics: PartnerAnalytics;
}
