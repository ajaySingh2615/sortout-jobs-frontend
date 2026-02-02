"use client";

import { useState } from "react";
import { FileText, Upload, Trash2, Download, FileCheck } from "lucide-react";
import ProfileSection from "./ProfileSection";
import profileService from "@/services/profile.service";
import { toast } from "sonner";

export default function ResumeSection({ userId, resume, onUpdate }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      await profileService.uploadResume(userId, file);
      toast.success("Resume uploaded successfully");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your resume?")) return;

    try {
      await profileService.deleteResume(userId);
      toast.success("Resume deleted successfully");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    }
  };

  return (
    <ProfileSection
      id="resume"
      title="Resume"
      icon={FileText}
      isEmpty={!resume}
      emptyMessage="Upload your resume to help recruiters find you"
    >
      {resume ? (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <FileCheck className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {resume.fileName || "Resume"}
              </p>
              <p className="text-sm text-gray-500">
                Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {resume.url && (
              <a
                href={resume.url}
                download
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </a>
            )}
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 hover:bg-red-50/50 transition-colors">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
          <div className="p-4 bg-red-50 rounded-full mb-4">
            <Upload className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg font-medium text-gray-900">
            {uploading ? "Uploading..." : "Upload Resume"}
          </p>
          <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
        </label>
      )}
    </ProfileSection>
  );
}
