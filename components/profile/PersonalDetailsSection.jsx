"use client";

import { useState, useEffect } from "react";
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

const initialFormState = () => ({
  dateOfBirth: "",
  maritalStatus: "",
  address: "",
  pincode: "",
  nationality: "",
});

export default function PersonalDetailsSection({
  userId,
  personalDetails,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialFormState());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (personalDetails) {
      setFormData({
        dateOfBirth: personalDetails.dateOfBirth || "",
        maritalStatus: personalDetails.maritalStatus || "",
        address: personalDetails.address || "",
        pincode: personalDetails.pincode || "",
        nationality: personalDetails.nationality || "",
      });
    } else {
      setFormData(initialFormState());
    }
  }, [personalDetails]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        dateOfBirth: formData.dateOfBirth || null,
        maritalStatus: formData.maritalStatus || null,
        address: formData.address?.trim() || null,
        pincode: formData.pincode?.trim() || null,
        nationality: formData.nationality?.trim() || null,
      };
      await profileService.updatePersonalDetails(userId, payload);
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
    if (personalDetails) {
      setFormData({
        dateOfBirth: personalDetails.dateOfBirth || "",
        maritalStatus: personalDetails.maritalStatus || "",
        address: personalDetails.address || "",
        pincode: personalDetails.pincode || "",
        nationality: personalDetails.nationality || "",
      });
    } else {
      setFormData(initialFormState());
    }
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

  const openEdit = () => {
    if (personalDetails) {
      setFormData({
        dateOfBirth: personalDetails.dateOfBirth || "",
        maritalStatus: personalDetails.maritalStatus || "",
        address: personalDetails.address || "",
        pincode: personalDetails.pincode || "",
        nationality: personalDetails.nationality || "",
      });
    }
    setIsEditing(true);
  };

  return (
    <ProfileSection
      id="personal-details"
      title="Personal Details"
      icon={User}
      onEdit={openEdit}
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

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality
              </label>
              <input
                type="text"
                value={formData.nationality || ""}
                onChange={(e) => handleChange("nationality", e.target.value)}
                placeholder="e.g., Indian"
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

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter your permanent address"
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
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
              value={
                personalDetails.dateOfBirth
                  ? formatDate(personalDetails.dateOfBirth)
                  : "Not set"
              }
            />
            <DetailItem
              icon={<Heart className="w-4 h-4" />}
              label="Marital Status"
              value={
                personalDetails.maritalStatus
                  ? personalDetails.maritalStatus.replace("_", " ")
                  : "Not set"
              }
            />
            <DetailItem
              icon={<Globe className="w-4 h-4" />}
              label="Nationality"
              value={personalDetails.nationality || "Not set"}
            />
            <DetailItem
              icon={<MapPin className="w-4 h-4" />}
              label="Pincode"
              value={personalDetails.pincode || "Not set"}
            />
          </div>

          {personalDetails.address && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="text-gray-900">{personalDetails.address}</p>
            </div>
          )}

          <button
            onClick={openEdit}
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
