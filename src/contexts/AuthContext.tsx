"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import type {
  User,
  Partner,
  Member,
  UserWithDetails,
  MemberRegisterRequest,
  PartnerRegisterRequest,
  ApiError,
} from "@/types";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

interface AuthContextType {
  user: UserWithDetails | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerMember: (data: MemberRegisterRequest) => Promise<void>;
  registerPartner: (data: PartnerRegisterRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      // HTTP-only cookies cannot be read by JavaScript
      // We check authentication by calling the /auth/me endpoint
      // The browser will automatically send the HTTP-only cookie if it exists
      const response = await authService.getMe();
      if (response.success) {
        // Store user data with partner/member info in cookie for middleware/role checks
        const userDataForCookie = {
          ...response.data.user,
          partner: response.data.partner,
          member: response.data.member,
        };
        Cookies.set("user", JSON.stringify(userDataForCookie), { 
          expires: 7,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production"
        });
        setUser({
          ...response.data.user,
          partner: response.data.partner,
          member: response.data.member,
        });
      } else {
        // Authentication failed - clear user cookie
        Cookies.remove("user");
        setUser(null);
      }
    } catch (error) {
      // Check if it's a 401 error (unauthorized) vs network error
      const apiError = error as ApiError;
      const hasUserCookie = Cookies.get("user");
      
      // Only clear user state if it's a 401 (unauthorized)
      // If we have a user cookie but get 401, the token might be expired/invalid
      // If we don't have a user cookie and get 401, user was never logged in
      if (apiError.response?.status === 401) {
        // 401 means token is invalid/expired - clear user state
        Cookies.remove("user");
        setUser(null);
      } else if (!hasUserCookie) {
        // Network error and no user cookie - user is not authenticated
        setUser(null);
      }
      // For network errors with existing user cookie, keep user state
      // This prevents logout loops when cookies aren't immediately available after login
      // The ProtectedRoute component will handle showing login modal if authentication is truly needed
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        // Backend sets HTTP-only cookie automatically
        // Store user data with partner/member info in cookie for middleware/role checks
        // This is critical for middleware to check partner approval status
        const userDataForCookie = {
          ...response.data.user,
          partner: response.data.partner,
          member: response.data.member,
        };
        Cookies.set("user", JSON.stringify(userDataForCookie), { 
          expires: 7,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production"
        });

        setUser({
          ...response.data.user,
          partner: response.data.partner,
          member: response.data.member,
        });

        // Redirect based on role - use window.location for immediate navigation
        if (typeof window !== "undefined") {
          if (response.data.user.role === "admin") {
            window.location.href = "/admin";
          } else if (response.data.user.role === "partner") {
            window.location.href = "/partner";
          } else if (response.data.user.role === "member") {
            window.location.href = "/member";
          } else {
            window.location.href = "/";
          }
        }
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error: unknown) {
      // Preserve the original error structure so components can access response.data
      const apiError = error as ApiError;
      if (apiError.response) {
        throw error; // Re-throw axios error to preserve response structure
      }
      const message = apiError.message || "Login failed";
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint - backend will clear HTTP-only cookie
      await authService.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      // Clear user cookie (token is HTTP-only and cleared by backend)
      Cookies.remove("user");
      setUser(null);
      router.push("/");
    }
  };

  const registerMember = async (data: MemberRegisterRequest) => {
    try {
      const response = await authService.registerMember(data);
      if (response.success) {
        // Backend sets HTTP-only cookie automatically
        // We only store user data in a regular cookie for middleware/role checks
        Cookies.set("user", JSON.stringify(response.data.user), { 
          expires: 7,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production"
        });

        setUser({
          ...response.data.user,
          partner: response.data.partner,
          member: response.data.member,
        });

        // Auto-login after member registration
        if (typeof window !== "undefined") {
          window.location.href = "/member";
        }
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error: unknown) {
      // Preserve the original error structure so components can access response.data
      const apiError = error as ApiError;
      if (apiError.response) {
        throw error; // Re-throw axios error to preserve response structure
      }
      const message = apiError.message || "Registration failed";
      throw new Error(message);
    }
  };

  const registerPartner = async (data: PartnerRegisterRequest) => {
    try {
      const response = await authService.registerPartner(data);
      if (response.success) {
        // Do NOT auto-login for partners
        // They must wait for admin approval
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error: unknown) {
      // Preserve the original error structure so components can access response.data
      const apiError = error as ApiError;
      if (apiError.response) {
        throw error; // Re-throw axios error to preserve response structure
      }
      const message = apiError.message || "Registration failed";
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        registerMember,
        registerPartner,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
