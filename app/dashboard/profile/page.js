"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import profileService from "@/services/profile.service";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "sonner";

function ProfileContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await profileService.getProfile(user.id);
        setProfile(response.data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-red-500">
                  {(profile?.fullName || profile?.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile?.fullName || profile?.name || "User"}
                </h2>
                <p className="text-gray-500">{profile?.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Phone" value={profile?.phone} />
              <InfoItem label="Email" value={profile?.email || "Not set"} />
              <InfoItem label="Gender" value={profile?.gender || "Not set"} />
              <InfoItem
                label="Education"
                value={formatEducation(profile?.educationLevel)}
              />
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                label="Has Experience"
                value={profile?.hasExperience ? "Yes" : "Fresher"}
              />
              {profile?.hasExperience && (
                <>
                  <InfoItem
                    label="Experience Level"
                    value={formatExperience(profile?.experienceLevel)}
                  />
                  <InfoItem
                    label="Current Salary"
                    value={
                      profile?.currentSalary
                        ? `₹${profile.currentSalary.toLocaleString()}/month`
                        : "Not disclosed"
                    }
                  />
                </>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Location Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="City" value={profile?.cityName || "Not set"} />
              <InfoItem
                label="Locality"
                value={profile?.localityName || "Not set"}
              />
              <InfoItem
                label="WhatsApp Updates"
                value={profile?.whatsappUpdates ? "Enabled" : "Disabled"}
              />
            </div>
          </div>

          {/* Job Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Job Preferences
            </h3>
            <div className="space-y-4">
              <InfoItem
                label="Preferred Role"
                value={profile?.roleName || "Not set"}
              />

              <div>
                <p className="text-sm text-gray-500 mb-2">Skills</p>
                {profile?.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">No skills added</p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  profile?.profileCompleted ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              <span className="text-gray-700">
                Profile {profile?.profileCompleted ? "Complete" : "Incomplete"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}

function formatEducation(level) {
  if (!level) return "Not set";
  const map = {
    BELOW_10TH: "Below 10th",
    _10TH_PASS: "10th Pass",
    _12TH_PASS: "12th Pass",
    GRADUATE: "Graduate",
    POST_GRADUATE: "Post Graduate",
  };
  return map[level] || level;
}

function formatExperience(level) {
  if (!level) return "Not set";
  const map = {
    FRESHER: "Fresher",
    _0_1_YEARS: "0-1 Years",
    _1_3_YEARS: "1-3 Years",
    _3_5_YEARS: "3-5 Years",
    _5_PLUS_YEARS: "5+ Years",
  };
  return map[level] || level;
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
