import api from "./api";

const adminService = {
  // ==================== STATS ====================

  getAdminStats: () => api.get("/admin/jobs/stats"),

  // ==================== JOB CRUD ====================

  // Get all jobs for admin (includes inactive)
  getAllJobs: (page = 0, size = 10) =>
    api.get(`/admin/jobs?page=${page}&size=${size}`),

  // Create a new job
  createJob: (adminId, jobData) => api.post(`/admin/jobs/${adminId}`, jobData),

  // Update a job
  updateJob: (jobId, jobData) => api.put(`/admin/jobs/${jobId}`, jobData),

  // Delete a job (soft delete)
  deleteJob: (jobId) => api.delete(`/admin/jobs/${jobId}`),

  // Toggle job status
  toggleJobStatus: (jobId, isActive) =>
    api.patch(`/admin/jobs/${jobId}/status?isActive=${isActive}`),

  // ==================== MASTER DATA ====================

  // Get cities
  getCities: () => api.get("/master/cities"),

  // Get job roles
  getRoles: () => api.get("/master/roles"),

  // Get skills by role
  getSkillsByRole: (roleId) => api.get(`/master/roles/${roleId}/skills`),

  // ==================== APPLICATIONS ====================

  // Update application status
  updateApplicationStatus: (applicationId, status, notes = null) => {
    const params = new URLSearchParams({ status });
    if (notes) params.append("notes", notes);
    return api.patch(
      `/admin/jobs/applications/${applicationId}/status?${params}`
    );
  },

  // ==================== USER MANAGEMENT ====================

  // Get user stats for dashboard
  getUserStats: () => api.get("/admin/users/stats"),

  // Get all users with search/filter/pagination
  getAllUsers: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.role) queryParams.append("role", params.role);
    if (
      params.isActive !== undefined &&
      params.isActive !== null &&
      params.isActive !== ""
    )
      queryParams.append("isActive", params.isActive);
    if (params.authProvider)
      queryParams.append("authProvider", params.authProvider);
    queryParams.append("page", params.page || 0);
    queryParams.append("size", params.size || 10);
    return api.get(`/admin/users?${queryParams}`);
  },

  // Get user detail
  getUserDetail: (userId) => api.get(`/admin/users/${userId}`),

  // Update user
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),

  // Toggle user status (active/disabled)
  toggleUserStatus: (userId, isActive) =>
    api.patch(`/admin/users/${userId}/status?isActive=${isActive}`),

  // Verify user email manually
  verifyUserEmail: (userId) => api.patch(`/admin/users/${userId}/verify-email`),

  // Send password reset email
  sendPasswordReset: (userId) =>
    api.post(`/admin/users/${userId}/reset-password`),

  // Get user sessions
  getUserSessions: (userId) => api.get(`/admin/users/${userId}/sessions`),

  // Revoke all user sessions
  revokeAllSessions: (userId) => api.delete(`/admin/users/${userId}/sessions`),

  // Revoke specific session
  revokeSession: (userId, sessionId) =>
    api.delete(`/admin/users/${userId}/sessions/${sessionId}`),

  // Delete user
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export default adminService;
