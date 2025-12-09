import apiClient from "@/lib/apiClient";
import type { ApiResponse, User, UserWithDetails } from "@/types";

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GetUsersParams {
  role?: "admin" | "partner" | "member";
  page?: number;
  limit?: number;
}

export interface UpdateUserRequest {
  isActive?: boolean;
  role?: "admin" | "partner" | "member";
  profileImage?: string;
}

export const userService = {
  /**
   * Get all users with optional filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Users response with pagination metadata
   */
  getUsers: async (params?: GetUsersParams): Promise<UsersResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append("role", params.role);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const url = `/users${queryString ? `?${queryString}` : ""}`;
    const response = await apiClient.get<ApiResponse<UsersResponse>>(url);
    return response.data.data;
  },

  /**
   * Get a single user by ID
   * @param id - User ID
   * @returns User with associated partner or member data
   */
  getUser: async (id: string): Promise<UserWithDetails> => {
    const response = await apiClient.get<ApiResponse<{ user: UserWithDetails }>>(
      `/users/${id}`
    );
    return response.data.data.user;
  },

  /**
   * Update a user
   * @param id - User ID
   * @param data - Update data (isActive, role)
   * @returns Updated user
   */
  updateUser: async (
    id: string,
    data: UpdateUserRequest
  ): Promise<User> => {
    const response = await apiClient.put<ApiResponse<{ user: User }>>(
      `/users/${id}`,
      data
    );
    return response.data.data.user;
  },

  /**
   * Delete a user
   * @param id - User ID
   * @returns Success response
   */
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};



