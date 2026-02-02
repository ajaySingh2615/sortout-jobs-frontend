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

  // Login
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { accessToken, refreshToken, email: userEmail, role } = response.data;

    const userData = { email: userEmail, role };

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);

    return response;
  };

  // Register
  const register = async (name, email, password) => {
    const response = await authService.register(name, email, password);
    const { accessToken, refreshToken, email: userEmail, role } = response.data;

    const userData = { name, email: userEmail, role };

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);

    return response;
  };

  // Logout
  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  // Login with OTP
  const loginWithOtp = async (phone, otp) => {
    const response = await authService.verifyOtp(phone, otp);
    const { accessToken, refreshToken, email, role, userId, isNewUser } =
      response.data;

    const userData = { id: userId, email, phone, role, isNewUser };

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);

    return response;
  };

  // Handle OAuth callback
  const handleOAuthCallback = (accessToken, refreshToken, email, role) => {
    const userData = { email, role };

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
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
