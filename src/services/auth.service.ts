/**
 * Authentication Service
 *
 * This service handles all authentication-related API calls.
 * It uses the centralized API client for making requests.
 */

import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  MemberRegisterRequest,
  PartnerRegisterRequest,
  Partner,
} from "@/types";
import apiClient from "@/lib/apiClient";

/**
 * Authentication API service
 * Contains all methods for authentication operations
 */
export const authService = {
  /**
   * Login user with email and password
   * @param data - Login credentials
   * @returns Authentication response with user data and token
   */
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  /**
   * Register a new member
   * @param data - Member registration data
   * @returns Authentication response with user data and token
   */
  registerMember: async (
    data: MemberRegisterRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post("/auth/register/member", data);
    return response.data;
  },

  /**
   * Register a new partner
   * @param data - Partner registration data
   * @returns Response with partner data (no token - requires approval)
   */
  registerPartner: async (
    data: PartnerRegisterRequest
  ): Promise<ApiResponse<{ partner: Partner }>> => {
    const response = await apiClient.post("/auth/register/partner", data);
    return response.data;
  },

  /**
   * Get current authenticated user information
   * @returns Current user data with associated partner/member info
   */
  getMe: async (): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  /**
   * Logout current user
   * @returns Success response
   */
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};
