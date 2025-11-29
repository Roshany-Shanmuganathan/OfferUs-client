import axios, { AxiosError } from "axios";

// Get API base URL from environment variable
// Next.js requires NEXT_PUBLIC_ prefix for client-side environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor - cookies are sent automatically with withCredentials: true
// No need to manually add token to headers since it's in HTTP-only cookie
api.interceptors.request.use(
  (config) => {
    // Cookies are automatically sent with requests when withCredentials is true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{ success: false; message: string; errors?: string[] }>
  ) => {
    // Handle network errors (no response from server)
    if (!error.response) {
      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        // Server is not running or unreachable
        const networkError = new Error(
          "Unable to connect to server. Please make sure the backend server is running."
        );
        (networkError as any).isNetworkError = true;
        return Promise.reject(networkError);
      }
      if (error.code === "ETIMEDOUT") {
        const timeoutError = new Error(
          "Request timed out. Please check your internet connection."
        );
        (timeoutError as any).isNetworkError = true;
        return Promise.reject(timeoutError);
      }
      // Generic network error
      const genericError = new Error(
        "Network error. Please check your connection and try again."
      );
      (genericError as any).isNetworkError = true;
      return Promise.reject(genericError);
    }

    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to home
      // Cookie will be cleared by backend on logout
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    if (error.response?.status === 404) {
      // Endpoint not found - likely API URL misconfiguration
      const notFoundError = new Error(
        `API endpoint not found (404). Please check that the backend server is running on the correct port and the API URL is configured correctly.`
      );
      (notFoundError as any).isNetworkError = true;
      return Promise.reject(notFoundError);
    }

    return Promise.reject(error);
  }
);

// Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}

export interface User {
  _id: string;
  email: string;
  role: "admin" | "partner" | "member";
  createdAt: string;
}

export interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  address: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface Partner {
  _id: string;
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

export interface AuthResponse {
  user: User;
  // Token is stored in HTTP-only cookie, not returned in response body
  partner?: Partner;
  member?: Member;
}

export interface LoginRequest {
  email: string;
  password: string;
}

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

export interface PartnerApprovalResponse {
  partners: Partner[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  registerMember: async (
    data: MemberRegisterRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post("/auth/register/member", data);
    return response.data;
  },

  registerPartner: async (
    data: PartnerRegisterRequest
  ): Promise<ApiResponse<{ partner: Partner }>> => {
    const response = await api.post("/auth/register/partner", data);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};

// Partner API
export const partnerAPI = {
  getPending: async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PartnerApprovalResponse>> => {
    const response = await api.get(
      `/partners/pending?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  approve: async (id: string): Promise<ApiResponse<{ partner: Partner }>> => {
    const response = await api.patch(`/partners/${id}/approve`);
    return response.data;
  },

  reject: async (
    id: string,
    reason?: string
  ): Promise<ApiResponse<{ partner: Partner }>> => {
    const response = await api.patch(`/partners/${id}/reject`, { reason });
    return response.data;
  },
};

export default api;
