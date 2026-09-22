"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { fetchApi } from "@/lib/api";

interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setToken(null);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetchApi("/auth/test-token", { method: "POST" });
      setToken(storedToken);
      setUser(response.data);
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    await checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await fetchApi("/auth/signout", { method: "POST" });
    } catch (e) {
      console.error("Error during signout on backend", e);
    }
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
