"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import jobService from "@/services/job.service";
import JobForm from "@/components/admin/JobForm";
import { Loader2 } from "lucide-react";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(jobId);
      setJob(response.data.data);
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Failed to load job details");
      router.push("/admin/jobs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!job) return null;

  return <JobForm initialData={job} isEdit={true} />;
}
