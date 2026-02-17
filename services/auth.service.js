import api from "./api";

const authService = {
  // Login (email/password)
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Register (email/password)
  async register(name, email, password) {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  // Logout
  async logout() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refreshToken });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  // Refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  // Forgot password
  async forgotPassword(email) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password
  async resetPassword(token, newPassword) {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },

  // Verify email
  async verifyEmail(token) {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  },

  // Resend verification
  async resendVerification(email) {
    const response = await api.post("/auth/resend-verify-email", { email });
    return response.data;
  },

  // Send OTP to phone
  async sendOtp(phone) {
    const response = await api.post("/auth/request-otp", { phone });
    return response.data;
  },

  // Verify OTP (field name is "code", not "otp")
  async verifyOtp(phone, code) {
    const response = await api.post("/auth/verify-otp", { phone, code });
    return response.data;
  },

  // Get current user profile
  async getMe() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Link phone to existing account (requires auth + OTP)
  async linkPhone(phone, code) {
    const response = await api.post("/auth/link-phone", { phone, code });
    return response.data;
  },

  // Link email to existing account (requires auth)
  async linkEmail(email, password, name) {
    const response = await api.post("/auth/link-email", {
      email,
      password,
      ...(name ? { name } : {}),
    });
    return response.data;
  },

  // Google OAuth (send id_token from client-side Google Sign-In)
  async googleAuth(idToken) {
    const response = await api.post("/auth/google", { idToken });
    return response.data;
  },
};

export default authService;
