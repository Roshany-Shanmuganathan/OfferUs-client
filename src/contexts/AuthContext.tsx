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
      const token = Cookies.get("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await authService.getMe();
      if (response.success) {
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 }); // Update user cookie
        setUser({
          ...response.data.user,
          partner: response.data.partner,
          member: response.data.member,
        });
      } else {
        Cookies.remove("token");
        Cookies.remove("user");
        setUser(null);
      }
    } catch (error) {
      Cookies.remove("token");
      Cookies.remove("user");
      setUser(null);
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
        Cookies.set("token", response.data.token, { expires: 7 }); // 7 days expiry
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 }); // For middleware role checks

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
      const token = Cookies.get("token");
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      Cookies.remove("token");
      Cookies.remove("user");
      setUser(null);
      router.push("/");
    }
  };

  const registerMember = async (data: MemberRegisterRequest) => {
    try {
      const response = await authService.registerMember(data);
      if (response.success) {
        Cookies.set("token", response.data.token, { expires: 7 }); // 7 days expiry
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 }); // For middleware role checks

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
