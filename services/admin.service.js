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
    return api.patch(`/admin/jobs/applications/${applicationId}/status?${params}`);
  },
};

export default adminService;
