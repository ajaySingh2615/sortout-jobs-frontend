import api from "./api";

const authService = {
  // Login
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Register
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
    const response = await api.post("/auth/refresh-token", { refreshToken });
    return response.data;
  },

  // Forgot password
  async forgotPassword(email) {
    const response = await api.post(
      `/auth/forgot-password?email=${encodeURIComponent(email)}`
    );
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
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  // Resend verification
  async resendVerification(email) {
    const response = await api.post(
      `/auth/resend-verification?email=${encodeURIComponent(email)}`
    );
    return response.data;
  },

  // Send OTP
  async sendOtp(phone) {
    const response = await api.post("/auth/phone/send-otp", { phone });
    return response.data;
  },

  // Verify OTP
  async verifyOtp(phone, otp) {
    const response = await api.post("/auth/phone/verify-otp", { phone, otp });
    return response.data;
  },

  // Get profile
  async getProfile(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update profile
  async updateProfile(userId, data) {
    const response = await api.put(`/profile/${userId}`, data);
    return response.data;
  },

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const response = await api.post(`/profile/${userId}/change-password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Get sessions
  async getSessions(userId) {
    const response = await api.get(`/auth/sessions/${userId}`);
    return response.data;
  },

  // Logout all sessions
  async logoutAllSessions(userId) {
    const response = await api.post(`/auth/logout-all/${userId}`);
    return response.data;
  },

  // Google OAuth URL
  getGoogleOAuthUrl() {
    return (
      process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL ||
      "http://localhost:8080/oauth2/authorization/google"
    );
  },
};

export default authService;
