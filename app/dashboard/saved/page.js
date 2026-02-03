"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import JobCard from "@/components/jobs/JobCard";
import { Bookmark, Loader2 } from "lucide-react";

export default function SavedJobsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchSavedJobs = async (pageNum = 0, append = false) => {
    try {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);

      const response = await jobService.getSavedJobs(user.id, pageNum, 10);
      const data = response.data.data;

      if (append) {
        setJobs(prev => [...prev, ...data.jobs]);
      } else {
        setJobs(data.jobs || []);
      }

      setHasMore(data.hasNext);
      setTotalJobs(data.totalElements);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    fetchSavedJobs(page + 1, true);
  };

  const handleSaveToggle = (jobId, isSaved) => {
    if (!isSaved) {
      // Job was unsaved, remove from list
      setJobs(prev => prev.filter(job => job.id !== jobId));
      setTotalJobs(prev => prev - 1);
    }
  };

  const handleApply = (jobId) => {
    // Update the job in the list to show as applied
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isApplied: true } : job
    ));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />

        <main className="pt-20 pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
                <p className="text-gray-600">
                  {totalJobs > 0 
                    ? `You have ${totalJobs} saved job${totalJobs !== 1 ? "s" : ""}`
                    : "Jobs you bookmark will appear here"
                  }
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push("/dashboard")}
              >
                Browse More Jobs
              </Button>
            </div>

            {/* Saved Jobs List */}
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
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No saved jobs yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Save jobs you&apos;re interested in to easily find them later
                  </p>
                  <Button 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => router.push("/dashboard")}
                  >
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={{ ...job, isSaved: true }} // All jobs here are saved
                    userId={user?.id}
                    onSaveToggle={handleSaveToggle}
                    onApply={handleApply}
                  />
                ))}

                {/* Load More */}
                {hasMore && (
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
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
