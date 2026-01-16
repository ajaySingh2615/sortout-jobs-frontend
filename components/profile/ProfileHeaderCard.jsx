"use client";

import {
  Camera,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Clock,
  IndianRupee,
} from "lucide-react";

export default function ProfileHeaderCard({ profile, onEditPhoto }) {
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

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Cover Background */}
      <div className="h-24 bg-gradient-to-r from-red-500 to-red-600" />

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
          <div className="flex-1 mt-2 md:mt-0 md:mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.fullName || "Your Name"}
            </h1>
            {profile?.headline ? (
              <p className="text-gray-600 mt-1">{profile.headline}</p>
            ) : (
              <p className="text-gray-400 mt-1 italic">
                Add a headline to stand out
              </p>
            )}
          </div>

          {/* Profile Completion */}
          <div className="md:mb-2">
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
            value={formatExperience(profile?.totalExperienceMonths)}
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
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span className="text-sm">{profile?.phone || "Not set"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{profile?.email || "Not set"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gray-100 rounded-lg text-gray-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
