'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authAPI, type User, type Partner, type Member, type AuthResponse } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: (User & { partner?: Partner; member?: Member }) | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerMember: (data: any) => Promise<void>;
  registerPartner: (data: any) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
} 

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(User & { partner?: Partner; member?: Member }) | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      // Token is stored in HTTP-only cookie, automatically sent with request
      const response = await authAPI.getMe();
      if (response.success) {
        setUser({
          ...response.data.user,
          partner: response.data.partner,
          member: response.data.member,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
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
      const response = await authAPI.login({ email, password });
      if (response.success) {
        // Token is stored in HTTP-only cookie by the backend
        // No need to store in localStorage
        
        setUser({
          ...response.data.user,
          partner: response.data.partner,
          member: response.data.member,
        });

        // Redirect based on role - use window.location for immediate navigation
        if (typeof window !== 'undefined') {
          if (response.data.user.role === 'admin') {
            window.location.href = '/admin';
          } else if (response.data.user.role === 'partner') {
            window.location.href = '/partner';
          } else if (response.data.user.role === 'member') {
            window.location.href = '/member';
          } else {
            window.location.href = '/';
          }
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      // Preserve the original error structure so components can access response.data
      if (error.response) {
        throw error; // Re-throw axios error to preserve response structure
      }
      const message = error.message || 'Login failed';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      // Call logout API which clears the HTTP-only cookie
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      // Cookie will be cleared by backend
    } finally {
      setUser(null);
      router.push('/');
    }
  };

  const registerMember = async (data: any) => {
    try {
      const response = await authAPI.registerMember(data);
      if (response.success) {
        // Token is stored in HTTP-only cookie by the backend
        // No need to store in localStorage
        
        setUser({
          ...response.data.user,
          partner: response.data.partner,
          member: response.data.member,
        });

        // Auto-login after member registration
        if (typeof window !== 'undefined') {
          window.location.href = '/member';
        }
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      // Preserve the original error structure so components can access response.data
      if (error.response) {
        throw error; // Re-throw axios error to preserve response structure
      }
      const message = error.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const registerPartner = async (data: any) => {
    try {
      const response = await authAPI.registerPartner(data);
      if (response.success) {
        // Do NOT auto-login for partners
        // They must wait for admin approval
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      // Preserve the original error structure so components can access response.data
      if (error.response) {
        throw error; // Re-throw axios error to preserve response structure
      }
      const message = error.message || 'Registration failed';
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

