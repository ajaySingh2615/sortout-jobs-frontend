"use client";

import { createContext, useContext, useState, useEffect } from "react";
import authService from "@/services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Helper: store auth data from our backend response
  const storeAuth = (data) => {
    const { user: userData, accessToken, refreshToken } = data;

    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);
  };

  // Login (email/password - used for admin)
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    storeAuth(response.data);
    return response;
  };

  // Register
  const register = async (name, email, password) => {
    const response = await authService.register(name, email, password);
    storeAuth(response.data);
    return response;
  };

  // Logout
  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  // Login with OTP (phone)
  const loginWithOtp = async (phone, code) => {
    const response = await authService.verifyOtp(phone, code);
    storeAuth(response.data);
    return response;
  };

  // Google OAuth (id_token flow)
  const loginWithGoogle = async (idToken) => {
    const response = await authService.googleAuth(idToken);
    storeAuth(response.data);
    return response;
  };

  // Handle OAuth callback (if using redirect flow)
  const handleOAuthCallback = (accessToken, refreshToken, userData) => {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    loginWithOtp,
    loginWithGoogle,
    handleOAuthCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
