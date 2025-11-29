import axios, { AxiosError } from "axios";

// Get API base URL from environment variable
// Next.js requires NEXT_PUBLIC_ prefix for client-side environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
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
      // Token expired or invalid
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }
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
  token: string;
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
