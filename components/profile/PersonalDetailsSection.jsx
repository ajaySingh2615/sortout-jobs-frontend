"use client";

import { useState } from "react";
import {
  User,
  Pencil,
  Check,
  X,
  MapPin,
  Calendar,
  Heart,
  Globe,
} from "lucide-react";
import ProfileSection from "./ProfileSection";
import profileService from "@/services/profile.service";
import { toast } from "sonner";

export default function PersonalDetailsSection({
  userId,
  personalDetails,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(personalDetails || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await profileService.updatePersonalDetails(userId, formData);
      toast.success("Personal details updated successfully");
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating personal details:", error);
      toast.error("Failed to update personal details");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(personalDetails || {});
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Not set";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <ProfileSection
      id="personal-details"
      title="Personal Details"
      icon={User}
      onEdit={() => setIsEditing(true)}
      isEmpty={!personalDetails && !isEditing}
      emptyMessage="Add your personal details"
    >
      {isEditing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={formData.gender || ""}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marital Status
              </label>
              <select
                value={formData.maritalStatus || ""}
                onChange={(e) => handleChange("maritalStatus", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Status</option>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="GENERAL">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            {/* Hometown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hometown
              </label>
              <input
                type="text"
                value={formData.hometown || ""}
                onChange={(e) => handleChange("hometown", e.target.value)}
                placeholder="e.g., Mumbai"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                value={formData.pincode || ""}
                onChange={(e) => handleChange("pincode", e.target.value)}
                placeholder="e.g., 400001"
                maxLength={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Permanent Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permanent Address
            </label>
            <textarea
              value={formData.permanentAddress || ""}
              onChange={(e) => handleChange("permanentAddress", e.target.value)}
              placeholder="Enter your permanent address"
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.differentlyAbled || false}
                onChange={(e) =>
                  handleChange("differentlyAbled", e.target.checked)
                }
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Differently Abled</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.careerBreak || false}
                onChange={(e) => handleChange("careerBreak", e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Have a Career Break</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : personalDetails ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DetailItem
              icon={<Calendar className="w-4 h-4" />}
              label="Date of Birth"
              value={formatDate(personalDetails.dateOfBirth)}
            />
            <DetailItem
              icon={<User className="w-4 h-4" />}
              label="Gender"
              value={personalDetails.gender || "Not set"}
            />
            <DetailItem
              icon={<Heart className="w-4 h-4" />}
              label="Marital Status"
              value={personalDetails.maritalStatus || "Not set"}
            />
            <DetailItem
              icon={<Globe className="w-4 h-4" />}
              label="Category"
              value={personalDetails.category || "Not set"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <DetailItem
              icon={<MapPin className="w-4 h-4" />}
              label="Hometown"
              value={personalDetails.hometown || "Not set"}
            />
            <DetailItem
              icon={<MapPin className="w-4 h-4" />}
              label="Pincode"
              value={personalDetails.pincode || "Not set"}
            />
          </div>

          {personalDetails.permanentAddress && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Permanent Address</p>
              <p className="text-gray-900">
                {personalDetails.permanentAddress}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
            {personalDetails.differentlyAbled && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Differently Abled
              </span>
            )}
            {personalDetails.careerBreak && (
              <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                Career Break
              </span>
            )}
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit Details
          </button>
        </div>
      ) : null}
    </ProfileSection>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}
