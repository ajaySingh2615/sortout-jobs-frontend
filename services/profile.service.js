import api from "./api";

const profileService = {
  // ==================== FULL PROFILE ====================

  // Get full profile data
  getProfile: (userId) => api.get(`/profile/${userId}`),

  // Update profile (basic info)
  updateProfile: (userId, data) => api.put(`/profile/${userId}`, data),

  // ==================== PERSONAL DETAILS ====================

  // Get personal details
  getPersonalDetails: (userId) =>
    api.get(`/profile/${userId}/personal-details`),

  // Update personal details
  updatePersonalDetails: (userId, data) =>
    api.put(`/profile/${userId}/personal-details`, data),

  // ==================== HEADLINE & SUMMARY ====================

  // Update resume headline
  updateHeadline: (userId, headline) =>
    api.put(`/profile/${userId}/headline`, headline),

  // Update profile summary
  updateSummary: (userId, summary) =>
    api.put(`/profile/${userId}/summary`, summary, {
      headers: { "Content-Type": "text/plain" },
    }),

  // Basic Profile & Email
  updateBasicProfile: (userId, data) =>
    api.put(`/profile/${userId}/basic`, data),
  initiateEmailChange: (userId, newEmail) =>
    api.post(`/profile/${userId}/email/initiate`, { newEmail }),
  verifyEmailChange: (userId, otp) =>
    api.post(`/profile/${userId}/email/verify`, { otp }),

  // Employment CRUD
  // Get all employments
  getEmployments: (userId) => api.get(`/profile/${userId}/employments`),

  // Add employment
  addEmployment: (userId, data) =>
    api.post(`/profile/${userId}/employments`, data),

  // Update employment
  updateEmployment: (userId, employmentId, data) =>
    api.put(`/profile/${userId}/employments/${employmentId}`, data),

  // Delete employment
  deleteEmployment: (userId, employmentId) =>
    api.delete(`/profile/${userId}/employments/${employmentId}`),

  // ==================== EDUCATIONS ====================

  // Get all educations
  getEducations: (userId) => api.get(`/profile/${userId}/educations`),

  // Add education
  addEducation: (userId, data) =>
    api.post(`/profile/${userId}/educations`, data),

  // Update education
  updateEducation: (userId, educationId, data) =>
    api.put(`/profile/${userId}/educations/${educationId}`, data),

  // Delete education
  deleteEducation: (userId, educationId) =>
    api.delete(`/profile/${userId}/educations/${educationId}`),

  // ==================== PROJECTS ====================

  // Get all projects
  getProjects: (userId) => api.get(`/profile/${userId}/projects`),

  // Add project
  addProject: (userId, data) => api.post(`/profile/${userId}/projects`, data),

  // Update project
  updateProject: (userId, projectId, data) =>
    api.put(`/profile/${userId}/projects/${projectId}`, data),

  // Delete project
  deleteProject: (userId, projectId) =>
    api.delete(`/profile/${userId}/projects/${projectId}`),

  // ==================== IT SKILLS ====================

  // Get all IT skills
  getITSkills: (userId) => api.get(`/profile/${userId}/it-skills`),

  // Add IT skill
  addITSkill: (userId, data) => api.post(`/profile/${userId}/it-skills`, data),

  // Update IT skill
  updateITSkill: (userId, skillId, data) =>
    api.put(`/profile/${userId}/it-skills/${skillId}`, data),

  // Delete IT skill
  deleteITSkill: (userId, skillId) =>
    api.delete(`/profile/${userId}/it-skills/${skillId}`),

  // ==================== RESUME ====================

  // Upload resume
  uploadResume: (userId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/profile/${userId}/resume`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Delete resume
  deleteResume: (userId) => api.delete(`/profile/${userId}/resume`),
};

export default profileService;
