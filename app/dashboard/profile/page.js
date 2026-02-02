"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import profileService from "@/services/profile.service";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "sonner";

import {
  ProfileHeaderCard,
  QuickLinksCard,
  ResumeSection,
  HeadlineSection,
  SummarySection,
  EmploymentSection,
  EducationSection,
  ProjectSection,
  ITSkillsSection,
  PersonalDetailsSection,
} from "@/components/profile";

function ProfileContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await profileService.getProfile(user.id);
      setProfile(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdate = () => {
    fetchProfile();
  };

  const handleEditPhoto = () => {
    // TODO: Implement photo upload modal
    toast.info("Photo upload coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="h-24 bg-gray-200" />
              <div className="p-6">
                <div className="flex items-end gap-4 -mt-12">
                  <div className="w-24 h-24 bg-gray-300 rounded-full" />
                  <div className="flex-1 space-y-2 mb-2">
                    <div className="h-6 w-48 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <div className="h-16 bg-gray-100 rounded-lg" />
                  <div className="h-16 bg-gray-100 rounded-lg" />
                  <div className="h-16 bg-gray-100 rounded-lg" />
                  <div className="h-16 bg-gray-100 rounded-lg" />
                </div>
              </div>
            </div>
            {/* Sections skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-gray-200 rounded-2xl" />
                <div className="h-48 bg-gray-200 rounded-2xl" />
              </div>
              <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchProfile}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeaderCard
          profile={profile}
          onEditPhoto={handleEditPhoto}
          onUpdate={handleUpdate}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Main Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume */}
            <ResumeSection
              userId={user?.id}
              resume={profile?.resume}
              onUpdate={handleUpdate}
            />

            {/* Headline */}
            <HeadlineSection
              userId={user?.id}
              headline={profile?.resumeHeadline}
              onUpdate={handleUpdate}
            />

            {/* Employment */}
            <EmploymentSection
              userId={user?.id}
              employments={profile?.employments}
              onUpdate={handleUpdate}
            />

            {/* Education */}
            <EducationSection
              userId={user?.id}
              educations={profile?.educations}
              onUpdate={handleUpdate}
            />

            {/* Projects */}
            <ProjectSection
              userId={user?.id}
              projects={profile?.projects}
              onUpdate={handleUpdate}
            />

            {/* IT Skills */}
            <ITSkillsSection
              userId={user?.id}
              itSkills={profile?.itSkills}
              onUpdate={handleUpdate}
            />

            {/* Summary */}
            <SummarySection
              userId={user?.id}
              summary={profile?.profileSummary}
              onUpdate={handleUpdate}
            />

            {/* Personal Details */}
            <PersonalDetailsSection
              userId={user?.id}
              personalDetails={profile?.personalDetails}
              onUpdate={handleUpdate}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="sticky top-24">
              <QuickLinksCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
