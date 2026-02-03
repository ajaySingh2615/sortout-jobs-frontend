"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import {
  Briefcase,
  MapPin,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Loader2,
  ArrowRight,
} from "lucide-react";

const statusConfig = {
  PENDING: {
    label: "Under Review",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  REVIEWED: {
    label: "Reviewed",
    color: "bg-blue-100 text-blue-700",
    icon: FileText,
  },
  SHORTLISTED: {
    label: "Shortlisted",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  INTERVIEW_SCHEDULED: {
    label: "Interview Scheduled",
    color: "bg-purple-100 text-purple-700",
    icon: Phone,
  },
  REJECTED: {
    label: "Not Selected",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  HIRED: {
    label: "Hired",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
  },
};

export default function MyApplicationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?.id) {
      fetchApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await jobService.getMyApplications(user.id);
      setApplications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const filteredApplications = applications.filter(app => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "PENDING").length,
    shortlisted: applications.filter(a => a.status === "SHORTLISTED" || a.status === "INTERVIEW_SCHEDULED").length,
    rejected: applications.filter(a => a.status === "REJECTED").length,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />

        <main className="pt-20 pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600">Track the status of your job applications</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card 
                className={`cursor-pointer transition-all ${filter === "all" ? "ring-2 ring-red-500" : ""}`}
                onClick={() => setFilter("all")}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-500">Total Applications</div>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-all ${filter === "PENDING" ? "ring-2 ring-red-500" : ""}`}
                onClick={() => setFilter("PENDING")}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-gray-500">Under Review</div>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-all ${filter === "SHORTLISTED" ? "ring-2 ring-red-500" : ""}`}
                onClick={() => setFilter("SHORTLISTED")}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.shortlisted}</div>
                  <div className="text-sm text-gray-500">Shortlisted</div>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-all ${filter === "REJECTED" ? "ring-2 ring-red-500" : ""}`}
                onClick={() => setFilter("REJECTED")}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                  <div className="text-sm text-gray-500">Not Selected</div>
                </CardContent>
              </Card>
            </div>

            {/* Applications List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredApplications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filter === "all" ? "No applications yet" : "No applications found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {filter === "all" 
                      ? "Start applying to jobs to track them here"
                      : "No applications match this filter"
                    }
                  </p>
                  {filter === "all" && (
                    <Button 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => router.push("/dashboard")}
                    >
                      Browse Jobs
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => {
                  const status = statusConfig[application.status] || statusConfig.PENDING;
                  const StatusIcon = status.icon;
                  const job = application.job;

                  return (
                    <Card 
                      key={application.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/dashboard/jobs/${application.jobId}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {/* Company Logo */}
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                              {job?.companyLogo ? (
                                <img 
                                  src={job.companyLogo} 
                                  alt={application.company} 
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Briefcase className="w-6 h-6 text-gray-400" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {application.jobTitle}
                              </h3>
                              <p className="text-gray-600">{application.company}</p>
                              
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                                {job?.cityName && (
                                  <span className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {job.cityName}
                                  </span>
                                )}
                                {job?.employmentType && (
                                  <span className="flex items-center">
                                    <Briefcase className="w-4 h-4 mr-1" />
                                    {job.employmentType.replace(/_/g, " ")}
                                  </span>
                                )}
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  Applied {formatTimeAgo(application.appliedAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Status Badge */}
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              {status.label}
                            </div>

                            <ArrowRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>

                        {/* Cover Letter Preview */}
                        {application.coverLetter && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Your note:</span>{" "}
                              {application.coverLetter.length > 150 
                                ? `${application.coverLetter.substring(0, 150)}...` 
                                : application.coverLetter
                              }
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
