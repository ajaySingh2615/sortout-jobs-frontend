"use client";

import { useState } from "react";
import { Type, Pencil, Check, X } from "lucide-react";
import ProfileSection from "./ProfileSection";
import profileService from "@/services/profile.service";
import { toast } from "sonner";

export default function HeadlineSection({ userId, headline, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(headline || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) {
      toast.error("Please enter a headline");
      return;
    }

    try {
      setSaving(true);
      await profileService.updateHeadline(userId, value);
      toast.success("Headline updated successfully");
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating headline:", error);
      toast.error("Failed to update headline");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(headline || "");
    setIsEditing(false);
  };

  return (
    <ProfileSection
      id="headline"
      title="Resume Headline"
      icon={Type}
      onEdit={() => setIsEditing(true)}
      isEmpty={!headline && !isEditing}
      emptyMessage="Add a catchy headline to attract recruiters"
    >
      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g., Senior Software Developer with 5+ years in Java, Spring Boot & React"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows={2}
            maxLength={200}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {value.length}/200 characters
            </span>
            <div className="flex items-center gap-2">
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
        </div>
      ) : headline ? (
        <div className="flex items-start justify-between">
          <p className="text-gray-700 leading-relaxed">{headline}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      ) : null}
    </ProfileSection>
  );
}
