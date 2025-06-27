import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "./queryClient";
import { useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

// Token management
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

export const setStoredUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();
    
    if (token && storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setToken(data.token);
      setStoredUser(data.user);
      setUser(data.user);
      // Clear cache but don't trigger auth queries
      queryClient.clear();
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: { 
      email: string; 
      password: string; 
      firstName: string; 
      lastName: string;
      storeType?: string;
      storeName?: string;
      storeAddress?: string;
      storePhone?: string;
      language?: string;
    }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setToken(data.token);
      setStoredUser(data.user);
      setUser(data.user);
      // Clear cache but don't trigger auth queries
      queryClient.clear();
    }
  });

  const logout = () => {
    removeToken();
    setUser(null);
    queryClient.clear();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    isLogoutPending: false,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message
  };
}
