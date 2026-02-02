"use client";

import { useState } from "react";
import { AlignLeft, Pencil, Check, X } from "lucide-react";
import ProfileSection from "./ProfileSection";
import profileService from "@/services/profile.service";
import { toast } from "sonner";

export default function SummarySection({ userId, summary, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(summary || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) {
      toast.error("Please enter a summary");
      return;
    }

    try {
      setSaving(true);
      await profileService.updateSummary(userId, value);
      toast.success("Summary updated successfully");
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating summary:", error);
      toast.error("Failed to update summary");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(summary || "");
    setIsEditing(false);
  };

  return (
    <ProfileSection
      id="summary"
      title="Profile Summary"
      icon={AlignLeft}
      onEdit={() => setIsEditing(true)}
      isEmpty={!summary && !isEditing}
      emptyMessage="Write a brief summary about your professional background"
    >
      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write a compelling summary about your professional experience, skills, and career goals..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows={5}
            maxLength={2000}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {value.length}/2000 characters
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
      ) : summary ? (
        <div className="flex items-start justify-between gap-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      ) : null}
    </ProfileSection>
  );
}
