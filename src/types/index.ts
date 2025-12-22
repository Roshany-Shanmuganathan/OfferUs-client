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
  isActive?: boolean;
  profileImage?: string;
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
  profilePicture?: string;
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
  status: "pending" | "approved" | "rejected" | "banned";
  profileImage?: string;
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
  lastName?: string;
  mobileNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  profilePicture?: string;
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
  profileImage?: string;
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
  couponColor?: string;
  couponExpiryDays?: number | null;
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
// Coupon Types
// ============================================================================

export interface Coupon {
  _id: string;
  couponCode: string;
  member: string | User;
  partner: string | Partner;
  offer: string | Offer;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED';
  qrToken: string;
  qrCodeDataUrl?: string;
  couponColor: string;
  expiryDate: string;
  redeemedAt?: string;
  redeemedBy?: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface CouponResponse {
  coupon: Coupon;
}

export interface CouponsResponse {
  coupons: Coupon[];
  count: number;
}

export interface CouponValidationResponse {
  valid: boolean;
  message: string;
  coupon?: Coupon;
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
  offer:
    | {
        _id: string;
        title: string;
      }
    | string;
  rating: number;
  comment?: string;
  images?: string[];
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

// Admin Analytics Types
export interface AdminAnalytics {
  users: {
    total: number;
    members: number;
    partners: number;
    active: number;
  };
  partners: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  offers: {
    total: number;
    active: number;
    expired: number;
    views: number;
    clicks: number;
    redemptions: number;
  };
  reviews: {
    total: number;
    averageRating: number;
  };
}

export interface AdminAnalyticsResponse {
  analytics: AdminAnalytics;
}