"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import JobCard from "@/components/jobs/JobCard";
import {
  Search,
  Loader2,
  Briefcase,
  FileText,
  Bookmark,
  Phone,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    newJobsToday: 0,
    applicationsSent: 0,
    savedJobs: 0,
    interviewCalls: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);

  // Search & Filter state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch stats when user changes
  useEffect(() => {
    if (user?.id) {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchJobs = async (pageNum = 0, append = false) => {
    try {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);

      let response;
      if (user?.id) {
        // Get recommended jobs if user is logged in
        response = await jobService.getRecommendedJobs(user.id, pageNum, 10);
      } else {
        // Get all jobs for non-logged in users
        response = await jobService.getJobs(pageNum, 10);
      }

      const data = response.data.data;

      if (append) {
        setJobs((prev) => [...prev, ...data.jobs]);
      } else {
        setJobs(data.jobs || []);
      }

      setHasMore(data.hasNext);
      setTotalJobs(data.totalElements);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await jobService.getJobStats(user.id);
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const searchRequest = {
        keyword: searchKeyword || null,
        locationType: selectedLocation || null,
        employmentType: selectedType || null,
        page: 0,
        size: 10,
      };

      const response = await jobService.searchJobs(searchRequest);
      const data = response.data.data;

      setJobs(data.jobs || []);
      setHasMore(data.hasNext);
      setTotalJobs(data.totalElements);
      setPage(0);
    } catch (error) {
      console.error("Error searching jobs:", error);
      toast.error("Failed to search jobs");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setSelectedLocation("");
    setSelectedType("");
    fetchJobs(0, false);
  };

  const handleLoadMore = () => {
    fetchJobs(page + 1, true);
  };

  const handleSaveToggle = (jobId, isSaved) => {
    // Update the job in the list
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, isSaved } : job))
    );
    // Update stats
    setStats((prev) => ({
      ...prev,
      savedJobs: isSaved ? prev.savedJobs + 1 : prev.savedJobs - 1,
    }));
  };

  const handleApply = (jobId) => {
    // Update the job in the list
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, isApplied: true } : job))
    );
    // Update stats
    setStats((prev) => ({
      ...prev,
      applicationsSent: prev.applicationsSent + 1,
    }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />

        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back
                {user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}! 👋
              </h1>
              <p className="text-gray-600">
                Here are the latest job opportunities for you
              </p>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search jobs by title, company, or keyword..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">All Locations</option>
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">On-site</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">All Types</option>
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                  <Button
                    className="bg-red-600 hover:bg-red-700 px-6"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4 mr-2" />
                    )}
                    Search
                  </Button>
                  {(searchKeyword || selectedLocation || selectedType) && (
                    <Button variant="outline" onClick={handleClearSearch}>
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.newJobsToday}
                    </div>
                    <div className="text-sm text-gray-500">New Jobs Today</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.applicationsSent}
                    </div>
                    <div className="text-sm text-gray-500">
                      Applications Sent
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Bookmark className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.savedJobs}
                    </div>
                    <div className="text-sm text-gray-500">Saved Jobs</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.interviewCalls}
                    </div>
                    <div className="text-sm text-gray-500">Interview Calls</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {searchKeyword || selectedLocation || selectedType
                  ? "Search Results"
                  : "Recommended Jobs"}
              </h2>
              {totalJobs > 0 && (
                <span className="text-sm text-gray-500">
                  {totalJobs} jobs found
                </span>
              )}
            </div>

            {loading ? (
              // Loading skeleton
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              // Empty state
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchKeyword || selectedLocation || selectedType
                    ? "Try adjusting your search filters"
                    : "Check back later for new opportunities"}
                </p>
                {(searchKeyword || selectedLocation || selectedType) && (
                  <Button variant="outline" onClick={handleClearSearch}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              // Job list
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    userId={user?.id}
                    onSaveToggle={handleSaveToggle}
                    onApply={handleApply}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {!loading && hasMore && jobs.length > 0 && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  className="px-8"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Jobs"
                  )}
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
