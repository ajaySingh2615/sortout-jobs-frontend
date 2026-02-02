import api from "./api";

const onboardingService = {
  // Master Data APIs (public)
  getCities: () => api.get("/master/cities"),

  getLocalitiesByCity: (cityId) =>
    api.get(`/master/cities/${cityId}/localities`),

  getRoles: () => api.get("/master/roles"),

  getSkillsByRole: (roleId) => api.get(`/master/roles/${roleId}/skills`),

  // Onboarding APIs (authenticated)
  getOnboardingStatus: (userId) => api.get(`/onboarding/status/${userId}`),

  saveProfile: (userId, profileData) =>
    api.post(`/onboarding/profile/${userId}`, profileData),

  savePreferences: (userId, preferencesData) =>
    api.post(`/onboarding/preferences/${userId}`, preferencesData),
};

export default onboardingService;
