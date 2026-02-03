"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import adminService from "@/services/admin.service";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Briefcase,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";

export default function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllJobs(page, 10);
      const data = response.data.data;
      setJobs(data.jobs || []);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    setActionLoading(jobId);
    try {
      await adminService.toggleJobStatus(jobId, !currentStatus);
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, isActive: !currentStatus } : job
        )
      );
      toast.success(currentStatus ? "Job deactivated" : "Job activated");
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update job status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    setActionLoading(jobId);
    try {
      await adminService.deleteJob(jobId);
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Not disclosed";
    const format = (val) => (val / 100000).toFixed(1) + " LPA";
    if (min && max) return `₹${format(min)} - ₹${format(max)}`;
    if (min) return `₹${format(min)}+`;
    return `Up to ₹${format(max)}`;
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
          <p className="text-gray-600">Create, edit, and manage job postings</p>
        </div>
        <Button
          className="bg-red-600 hover:bg-red-700"
          onClick={() => router.push("/admin/jobs/new")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs by title or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Try a different search term"
                : "Start by posting your first job"}
            </p>
            {!searchTerm && (
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => router.push("/admin/jobs/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className={!job.isActive ? "opacity-60" : ""}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      {job.isFeatured && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                          Featured
                        </span>
                      )}
                      {!job.isActive && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{job.company}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.cityName || job.locationType || "Not specified"}
                      </span>
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.employmentType?.replace("_", " ") || "Full-time"}
                      </span>
                      <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Posted {formatDate(job.postedAt)}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {job.applicationsCount || 0} applications
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(job.id, job.isActive)}
                      disabled={actionLoading === job.id}
                      title={job.isActive ? "Deactivate" : "Activate"}
                    >
                      {actionLoading === job.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : job.isActive ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(job.id)}
                      disabled={actionLoading === job.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete"
                    >
                      {actionLoading === job.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
