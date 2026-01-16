"use client";

import { useState } from "react";
import {
  Camera,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Clock,
  IndianRupee,
  Edit2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import profileService from "@/services/profile.service";
import { formatExperienceLevel } from "@/constants/experienceLevels";
import BasicDetailsModal from "./modals/BasicDetailsModal";
import EmailChangeModal from "./modals/EmailChangeModal";

export default function ProfileHeaderCard({ profile, onEditPhoto, onUpdate }) {
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not disclosed";
    if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)}L/year`;
    }
    return `₹${salary.toLocaleString()}/month`;
  };

  const formatExperience = (months) => {
    if (!months || months === 0) return "Fresher";
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} years`;
    return `${years} years ${remainingMonths} months`;
  };

  const handleSaveBasicDetails = async (data) => {
    try {
      await profileService.updateBasicProfile(profile.userId, data);
      toast.success("Profile updated successfully");
      setShowBasicModal(false);
      onUpdate();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleSendEmailOtp = async (newEmail) => {
    const response = await profileService.initiateEmailChange(
      profile.userId,
      newEmail
    );
    toast.success("OTP sent to " + newEmail);
    return response; // Return response so modal can get expiry time
  };

  const handleVerifyEmailOtp = async (otp) => {
    const response = await profileService.verifyEmailChange(
      profile.userId,
      otp
    );
    const { accessToken, newEmail } = response.data.data;

    // Update stored token with new one
    localStorage.setItem("accessToken", accessToken);

    toast.success("Email updated successfully");
    onUpdate();
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden group">
        {/* Cover Background */}
        <div className="h-24 bg-gradient-to-r from-red-500 to-red-600 relative">
          <button
            onClick={() => setShowBasicModal(true)}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-colors"
            title="Edit Header Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Profile Photo & Basic Info */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-red-100 flex items-center justify-center overflow-hidden shadow-lg">
                {profile?.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-red-500">
                    {getInitials(profile?.fullName)}
                  </span>
                )}
              </div>
              <button
                onClick={onEditPhoto}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Name & Designation */}
            <div className="flex-1 mt-2 md:mt-0 md:mb-2 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                {profile?.fullName || "Your Name"}
              </h1>
              {profile?.resumeHeadline ? (
                <p className="text-gray-600 mt-1 line-clamp-1">
                  {profile.resumeHeadline}
                </p>
              ) : (
                <p className="text-gray-400 mt-1 italic">
                  Add a headline to stand out
                </p>
              )}
            </div>

            {/* Profile Completion */}
            <div className="md:mb-2 flex justify-center md:justify-end w-full md:w-auto mt-4 md:mt-0">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <div
                  className={`w-2 h-2 rounded-full ${
                    profile?.profileCompleted ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {profile?.profileCompleted ? "Complete" : "Incomplete"}
                </span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            {/* Location */}
            <InfoItem
              icon={<MapPin className="w-4 h-4" />}
              label="Location"
              value={profile?.cityName || "Not set"}
            />

            {/* Experience */}
            <InfoItem
              icon={<Briefcase className="w-4 h-4" />}
              label="Experience"
              value={
                profile?.hasExperience
                  ? formatExperienceLevel(profile?.experienceLevel)
                  : "Fresher"
              }
            />

            {/* Salary */}
            <InfoItem
              icon={<IndianRupee className="w-4 h-4" />}
              label="Current Salary"
              value={formatSalary(profile?.currentSalary)}
            />

            {/* Notice Period */}
            <InfoItem
              icon={<Clock className="w-4 h-4" />}
              label="Notice Period"
              value={profile?.noticePeriod || "Not set"}
            />
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-gray-100 justify-center md:justify-start">
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">
                {profile?.phone || "Not set"}
              </span>
              {profile?.phone && (
                <CheckCircle2 className="w-3 h-3 text-green-500 ml-1" />
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg group/email relative">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">
                {profile?.email || "Not set"}
              </span>
              {profile?.emailVerified &&
                !profile?.email?.endsWith("@phone.local") && (
                  <CheckCircle2
                    className="w-3 h-3 text-green-500 ml-1"
                    title="Email verified"
                  />
                )}
              <button
                onClick={() => setShowEmailModal(true)}
                className="opacity-0 group-hover/email:opacity-100 ml-2 text-xs text-red-600 hover:underline transition-opacity"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BasicDetailsModal
        isOpen={showBasicModal}
        onClose={() => setShowBasicModal(false)}
        onSave={handleSaveBasicDetails}
        initialData={{
          fullName: profile?.fullName,
          cityId: profile?.cityId,
          localityId: profile?.localityId,
          hasExperience: profile?.hasExperience,
          experienceLevel: profile?.experienceLevel,
          currentSalary: profile?.currentSalary,
          resumeHeadline: profile?.resumeHeadline,
          noticePeriod: profile?.noticePeriod,
        }}
      />

      <EmailChangeModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSendOtp={handleSendEmailOtp}
        onVerifyOtp={handleVerifyEmailOtp}
      />
    </>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="p-2 bg-gray-100 rounded-lg text-gray-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
