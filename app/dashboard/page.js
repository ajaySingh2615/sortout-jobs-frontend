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
  const [searchPage, setSearchPage] = useState(1); // 1-based for search API

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

  // Backend uses 1-based page; we keep page state 0-based for recommended list
  const fetchJobs = async (pageNum = 0, append = false) => {
    try {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);

      const apiPage = pageNum + 1;
      let response;
      if (user?.id) {
        response = await jobService.getRecommendedJobs(user.id, apiPage, 10);
      } else {
        response = await jobService.getJobs(apiPage, 10);
      }

      const data = response.data.data;

      if (append) {
        setJobs((prev) => [...prev, ...(data.jobs || [])]);
      } else {
        setJobs(data.jobs || []);
      }

      setHasMore(data.hasNext ?? false);
      setTotalJobs(data.totalElements ?? 0);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchSearchPage = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const searchRequest = { page: pageNum, size: 10 };
      if (searchKeyword.trim()) searchRequest.keyword = searchKeyword.trim();
      if (selectedLocation) searchRequest.locationType = selectedLocation;
      if (selectedType) searchRequest.employmentType = selectedType;

      const response = await jobService.searchJobs(searchRequest);
      const data = response.data.data;

      if (append) {
        setJobs((prev) => [...prev, ...(data.jobs || [])]);
      } else {
        setJobs(data.jobs || []);
      }

      setHasMore(data.hasNext ?? false);
      setTotalJobs(data.totalElements ?? 0);
      setSearchPage(pageNum);
    } catch (error) {
      console.error("Error searching jobs:", error);
      toast.error("Failed to search jobs");
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
      await fetchSearchPage(1, false);
    } catch {
      // error already handled in fetchSearchPage
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setSelectedLocation("");
    setSelectedType("");
    setSearchPage(1);
    fetchJobs(0, false);
  };

  const isSearchMode = !!(searchKeyword.trim() || selectedLocation || selectedType);

  const handleLoadMore = () => {
    if (isSearchMode) {
      fetchSearchPage(searchPage + 1, true);
    } else {
      fetchJobs(page + 1, true);
    }
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Header + Search — single minimal row */}
            <div className="mb-6">
              <h1 className="text-lg font-semibold text-gray-900 mb-4">
                {user?.fullName ? user.fullName.split(" ")[0] : "Jobs"}
              </h1>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-center">
                <input
                  type="text"
                  placeholder="Search by title, company, keyword..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 min-w-0 h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="sm:w-[120px] h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="">Location</option>
                  <option value="REMOTE">Remote</option>
                  <option value="ONSITE">On-site</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="sm:w-[120px] h-10 px-3 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="">Type</option>
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
                <div className="flex items-center gap-2 sm:shrink-0">
                  <Button
                    size="sm"
                    className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-1.5" />
                        Search
                      </>
                    )}
                  </Button>
                  {(searchKeyword || selectedLocation || selectedType) && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="h-10 px-3 text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats — compact inline */}
            <div className="flex flex-wrap gap-6 mb-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-gray-400" />
                {stats.newJobsToday} new today
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-gray-400" />
                {stats.applicationsSent} applied
              </span>
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-gray-400" />
                {stats.savedJobs} saved
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-gray-400" />
                {stats.interviewCalls} interviews
              </span>
            </div>

            {/* Job list header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">
                {isSearchMode ? "Search Results" : "Recommended"}
              </h2>
              {totalJobs > 0 && (
                <span className="text-xs text-gray-400">{totalJobs} jobs</span>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-gray-100 p-4 animate-pulse"
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-2/5" />
                        <div className="h-3 bg-gray-100 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="rounded-lg border border-gray-100 bg-white p-8 text-center">
                <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-3">
                  {isSearchMode
                    ? "No jobs match your filters."
                    : "No jobs right now."}
                </p>
                {isSearchMode && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
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

            {!loading && hasMore && jobs.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="h-9 px-4 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <Loader2 className="w-4 h-4 animate-spin inline mr-1.5" />
                  ) : null}
                  Load more
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
