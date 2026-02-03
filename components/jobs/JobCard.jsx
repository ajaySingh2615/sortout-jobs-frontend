"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Briefcase,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { toast } from "sonner";
import jobService from "@/services/job.service";

export default function JobCard({
  job,
  userId,
  onSaveToggle,
  onApply,
  showApplyButton = true,
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [isApplied, setIsApplied] = useState(job.isApplied || false);

  const navigateToJob = () => {
    router.push(`/dashboard/jobs/${job.id}`);
  };

  // Format salary for display
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

  // Format time ago
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

  // Format location type
  const formatLocationType = (type) => {
    if (!type) return "";
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  // Format employment type
  const formatEmploymentType = (type) => {
    if (!type) return "";
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleSaveToggle = async () => {
    if (!userId) {
      toast.error("Please login to save jobs");
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        await jobService.unsaveJob(userId, job.id);
        setIsSaved(false);
        toast.success("Job removed from saved");
      } else {
        await jobService.saveJob(userId, job.id);
        setIsSaved(true);
        toast.success("Job saved successfully");
      }
      if (onSaveToggle) onSaveToggle(job.id, !isSaved);
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error(
        error.response?.data?.message || "Failed to update saved job"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async () => {
    if (!userId) {
      toast.error("Please login to apply");
      return;
    }

    if (isApplied) {
      toast.info("You have already applied to this job");
      return;
    }

    setIsApplying(true);
    try {
      await jobService.applyToJob(userId, job.id);
      setIsApplied(true);
      toast.success("Application submitted successfully!");
      if (onApply) onApply(job.id);
    } catch (error) {
      console.error("Error applying:", error);
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setIsApplying(false);
    }
  };

  // Get location display
  const getLocationDisplay = () => {
    const parts = [];
    if (job.cityName) parts.push(job.cityName);
    if (job.locationType === "REMOTE") return "Remote";
    if (job.locationType && parts.length > 0) {
      return `${parts.join(", ")} (${formatLocationType(job.locationType)})`;
    }
    return parts.join(", ") || "Location not specified";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {/* Company Logo */}
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 font-bold text-lg">
                    {job.company?.charAt(0) || "?"}
                  </span>
                )}
              </div>

              {/* Job Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3
                    className="text-lg font-semibold text-gray-900 hover:text-red-600 cursor-pointer truncate"
                    onClick={navigateToJob}
                  >
                    {job.title}
                  </h3>
                  {job.isFeatured && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{job.company}</p>

                {/* Job Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {getLocationDisplay()}
                  </span>
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {formatEmploymentType(job.employmentType)}
                  </span>
                  <span>
                    {formatSalary(
                      job.salaryMin,
                      job.salaryMax,
                      job.isSalaryDisclosed
                    )}
                  </span>
                  {job.experienceMinYears !== null && (
                    <span>
                      {job.experienceMinYears === 0
                        ? "Freshers welcome"
                        : `${job.experienceMinYears}${
                            job.experienceMaxYears
                              ? `-${job.experienceMaxYears}`
                              : "+"
                          } yrs exp`}
                    </span>
                  )}
                </div>

                {/* Skills/Tags */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Array.from(job.requiredSkills)
                      .slice(0, 5)
                      .map((skill) => (
                        <span
                          key={skill.id}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {skill.name}
                        </span>
                      ))}
                    {job.requiredSkills.length > 5 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">
                        +{job.requiredSkills.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end gap-2">
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatTimeAgo(job.postedAt)}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveToggle}
                disabled={isSaving}
                className={isSaved ? "text-red-600 border-red-600" : ""}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 mr-1" />
                ) : (
                  <Bookmark className="w-4 h-4 mr-1" />
                )}
                {isSaved ? "Saved" : "Save"}
              </Button>
              {showApplyButton && (
                <Button
                  size="sm"
                  className={
                    isApplied
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }
                  onClick={handleApply}
                  disabled={isApplying || isApplied}
                >
                  {isApplied ? "Applied" : isApplying ? "Applying..." : "Apply"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
