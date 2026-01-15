import api from "./api";

const profileService = {
  // Get full profile data
  getProfile: (userId) => api.get(`/profile/${userId}`),

  // Update profile (basic info)
  updateProfile: (userId, data) => api.put(`/profile/${userId}`, data),
};

export default profileService;
