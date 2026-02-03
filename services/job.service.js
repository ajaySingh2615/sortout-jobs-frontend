import api from "./api";

const jobService = {
  // ==================== JOB LISTING ====================

  // Get all jobs (paginated)
  getJobs: (page = 0, size = 10) => 
    api.get(`/jobs?page=${page}&size=${size}`),

  // Search jobs with filters
  searchJobs: (searchRequest) => 
    api.post("/jobs/search", searchRequest),

  // Get recommended jobs for user
  getRecommendedJobs: (userId, page = 0, size = 10) =>
    api.get(`/jobs/recommended/${userId}?page=${page}&size=${size}`),

  // Get job details
  getJobById: (jobId, userId = null) => {
    const url = userId ? `/jobs/${jobId}?userId=${userId}` : `/jobs/${jobId}`;
    return api.get(url);
  },

  // ==================== SAVED JOBS ====================

  // Save a job (bookmark)
  saveJob: (userId, jobId) => 
    api.post(`/jobs/${jobId}/save/${userId}`),

  // Unsave a job
  unsaveJob: (userId, jobId) => 
    api.delete(`/jobs/${jobId}/save/${userId}`),

  // Get user's saved jobs
  getSavedJobs: (userId, page = 0, size = 10) =>
    api.get(`/jobs/saved/${userId}?page=${page}&size=${size}`),

  // Get saved job IDs (for quick UI lookup)
  getSavedJobIds: (userId) => 
    api.get(`/jobs/saved/${userId}/ids`),

  // ==================== JOB APPLICATIONS ====================

  // Apply to a job
  applyToJob: (userId, jobId, data = {}) =>
    api.post(`/jobs/${jobId}/apply/${userId}`, data),

  // Get user's applications
  getMyApplications: (userId) =>
    api.get(`/jobs/applications/${userId}`),

  // Get application details
  getApplicationById: (userId, applicationId) =>
    api.get(`/jobs/applications/${userId}/${applicationId}`),

  // Get applied job IDs (for quick UI lookup)
  getAppliedJobIds: (userId) =>
    api.get(`/jobs/applied/${userId}/ids`),

  // ==================== STATS ====================

  // Get job stats for dashboard
  getJobStats: (userId) =>
    api.get(`/jobs/stats/${userId}`),
};

export default jobService;
