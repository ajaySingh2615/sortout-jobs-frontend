"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import {
  MapPin,
  Briefcase,
  Clock,
  GraduationCap,
  IndianRupee,
  Calendar,
  Users,
  Building2,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Share2,
} from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const jobId = params.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, user?.id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(jobId, user?.id);
      setJob(response.data.data);
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Failed to load job details");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!user?.id) {
      toast.error("Please login to save jobs");
      return;
    }

    setIsSaving(true);
    try {
      if (job.isSaved) {
        await jobService.unsaveJob(user.id, job.id);
        setJob(prev => ({ ...prev, isSaved: false }));
        toast.success("Job removed from saved");
      } else {
        await jobService.saveJob(user.id, job.id);
        setJob(prev => ({ ...prev, isSaved: true }));
        toast.success("Job saved successfully");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async () => {
    if (!user?.id) {
      toast.error("Please login to apply");
      return;
    }

    if (job.isApplied) {
      toast.info("You have already applied to this job");
      return;
    }

    setIsApplying(true);
    try {
      await jobService.applyToJob(user.id, job.id, { coverLetter });
      setJob(prev => ({ ...prev, isApplied: true }));
      setShowApplyModal(false);
      setCoverLetter("");
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying:", error);
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setIsApplying(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  // Format helpers
  const formatSalary = (min, max, isDisclosed) => {
    if (!isDisclosed) return "Not Disclosed";
    if (!min && !max) return "Not Disclosed";
    
    const formatLPA = (value) => {
      if (!value) return null;
      const lpa = value / 100000;
      return lpa >= 100 ? `₹${(lpa / 100).toFixed(1)} Cr` : `₹${lpa} LPA`;
    };

    const minStr = formatLPA(min);
    const maxStr = formatLPA(max);

    if (minStr && maxStr) return `${minStr} - ${maxStr}`;
    if (minStr) return `${minStr}+`;
    if (maxStr) return `Up to ${maxStr}`;
    return "Not Disclosed";
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

  const formatLocationType = (type) => {
    if (!type) return "";
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const formatEmploymentType = (type) => {
    if (!type) return "";
    return type.replace(/_/g, " ").split(" ").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
  };

  const formatEducation = (level) => {
    if (!level) return "Any";
    return level.replace(/_/g, " ").split(" ").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
  };

  const getLocationDisplay = () => {
    if (job.locationType === "REMOTE") return "Remote";
    const parts = [];
    if (job.cityName) parts.push(job.cityName);
    if (job.stateName) parts.push(job.stateName);
    if (job.locationType && parts.length > 0) {
      return `${parts.join(", ")} (${formatLocationType(job.locationType)})`;
    }
    return parts.join(", ") || "Location not specified";
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <DashboardNavbar />
          <main className="pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!job) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />

        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </button>

            {/* Job Header Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Building2 className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                        {job.isFeatured && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-lg text-gray-600 mt-1">{job.company}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        Posted {formatTimeAgo(job.postedAt)}
                        {job.applicationDeadline && (
                          <>
                            <span className="mx-2">•</span>
                            <Calendar className="w-4 h-4" />
                            Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSaveToggle}
                      disabled={isSaving}
                      className={job.isSaved ? "text-red-600 border-red-600" : ""}
                    >
                      {job.isSaved ? (
                        <BookmarkCheck className="w-4 h-4 mr-2" />
                      ) : (
                        <Bookmark className="w-4 h-4 mr-2" />
                      )}
                      {job.isSaved ? "Saved" : "Save"}
                    </Button>
                    <Button
                      className={job.isApplied ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                      onClick={() => job.isApplied ? null : setShowApplyModal(true)}
                      disabled={job.isApplied}
                    >
                      {job.isApplied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Applied
                        </>
                      ) : (
                        "Apply Now"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium text-sm">{getLocationDisplay()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Salary</p>
                      <p className="font-medium text-sm">{formatSalary(job.salaryMin, job.salaryMax, job.isSalaryDisclosed)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Experience</p>
                      <p className="font-medium text-sm">
                        {job.experienceMinYears === 0 
                          ? "Freshers" 
                          : `${job.experienceMinYears}${job.experienceMaxYears ? `-${job.experienceMaxYears}` : "+"} years`
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Education</p>
                      <p className="font-medium text-sm">{formatEducation(job.minEducation)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Job Type</p>
                    <p className="font-medium">{formatEmploymentType(job.employmentType)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Openings</p>
                    <p className="font-medium">{job.vacancies} positions</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Applications</p>
                    <p className="font-medium">{job.applicationsCount} applied</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Skills */}
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(job.requiredSkills).map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-full"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Job Description */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bottom Apply Section */}
            {!job.isApplied && (
              <Card className="sticky bottom-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.company}</p>
                    </div>
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => setShowApplyModal(true)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Apply for {job.title}
                </h2>
                <p className="text-gray-600 mb-6">at {job.company}</p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Write a brief message to the recruiter..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    maxLength={1000}
                  />
                  <p className="text-xs text-gray-500 mt-1">{coverLetter.length}/1000</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowApplyModal(false);
                      setCoverLetter("");
                    }}
                    disabled={isApplying}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={handleApply}
                    disabled={isApplying}
                  >
                    {isApplying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
