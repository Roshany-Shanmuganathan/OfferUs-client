import apiClient from '@/lib/apiClient';
import type {
  ApiResponse,
  Coupon,
  CouponResponse,
  CouponsResponse,
  CouponValidationResponse,
} from '@/types';

/**
 * Coupon Service
 * Handles all coupon-related API calls for members and partners
 */

// ============================================================================
// Member Coupon Operations
// ============================================================================

/**
 * Generate a new coupon for an offer
 * @param offerId - The offer ID to generate coupon for
 */
export const generateCoupon = async (offerId: string): Promise<Coupon> => {
  const response = await apiClient.post<ApiResponse<CouponResponse>>(
    '/coupons/generate',
    { offerId }
  );
  return response.data.data.coupon;
};

/**
 * Get all coupons for the logged-in member
 * @param status - Optional filter by status (ACTIVE, REDEEMED, EXPIRED)
 */
export const getMyCoupons = async (status?: string): Promise<Coupon[]> => {
  const response = await apiClient.get<ApiResponse<CouponsResponse>>(
    '/coupons/my-coupons',
    { params: { status } }
  );
  return response.data.data.coupons;
};

/**
 * Get specific coupon details
 * @param couponId - The coupon ID
 */
export const getCoupon = async (couponId: string): Promise<Coupon> => {
  const response = await apiClient.get<ApiResponse<CouponResponse>>(
    `/coupons/${couponId}`
  );
  return response.data.data.coupon;
};

// ============================================================================
// Partner Coupon Operations
// ============================================================================

/**
 * Validate a coupon by QR token
 * @param qrToken - The QR token to validate
 */
export const validateCoupon = async (
  qrToken: string
): Promise<CouponValidationResponse> => {
  const response = await apiClient.post<ApiResponse<CouponValidationResponse>>(
    '/coupons/validate',
    { qrToken }
  );
  return response.data.data;
};

/**
 * Redeem a validated coupon
 * @param couponId - The coupon ID to redeem
 */
export const redeemCoupon = async (couponId: string): Promise<Coupon> => {
  const response = await apiClient.post<ApiResponse<CouponResponse>>(
    '/coupons/redeem',
    { couponId }
  );
  return response.data.data.coupon;
};

/**
 * Get all redeemed coupons for the partner
 */
export const getPartnerRedemptions = async (): Promise<Coupon[]> => {
  const response = await apiClient.get<ApiResponse<CouponsResponse>>(
    '/coupons/partner/redeemed'
  );
  return response.data.data.coupons;
};

/**
 * Get member coupon statistics
 */
export const getMemberStats = async (): Promise<{
  totalGenerated: number;
  totalRedeemed: number;
  activeCoupons: number;
}> => {
  const response = await api.get('/coupons/member/stats');
  return response.data.data;
};

export const couponService = {
  generateCoupon,
  getMyCoupons,
  getCoupon,
  validateCoupon,
  redeemCoupon,
  getPartnerRedemptions,
  getMemberStats,
};
