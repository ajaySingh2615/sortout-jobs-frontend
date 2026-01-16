"use client";

import { useState, useEffect } from "react";
import { Code2, Pencil, Trash2, Clock } from "lucide-react";
import ProfileSection from "./ProfileSection";
import ITSkillModal from "./modals/ITSkillModal";
import profileService from "@/services/profile.service";
import { toast } from "sonner";

export default function ITSkillsSection({
  userId,
  itSkills: initialSkills,
  onUpdate,
}) {
  const [itSkills, setItSkills] = useState(initialSkills || []);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    setItSkills(initialSkills || []);
  }, [initialSkills]);

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      await profileService.deleteITSkill(userId, id);
      toast.success("Skill deleted successfully");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingItem) {
        await profileService.updateITSkill(userId, editingItem.id, data);
        toast.success("Skill updated successfully");
      } else {
        await profileService.addITSkill(userId, data);
        toast.success("Skill added successfully");
      }
      setShowModal(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error saving skill:", error);
      toast.error("Failed to save skill");
    }
  };

  const formatExperience = (months) => {
    if (!months) return "Beginner";
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${remainingMonths}mo`;
    if (remainingMonths === 0) return `${years}yr`;
    return `${years}yr ${remainingMonths}mo`;
  };

  return (
    <>
      <ProfileSection
        id="it-skills"
        title="IT Skills"
        icon={Code2}
        onAdd={handleAdd}
        addLabel="Add Skill"
        isEmpty={itSkills.length === 0}
        emptyMessage="Add your technical skills and proficiency"
      >
        <div className="flex flex-wrap gap-3">
          {itSkills.map((skill) => (
            <div
              key={skill.id}
              className="group relative flex items-center gap-2 px-4 py-2 bg-cyan-50 rounded-xl border border-cyan-200 hover:border-cyan-300 transition-colors"
            >
              <span className="font-medium text-cyan-800">
                {skill.skillName || skill.name}
              </span>
              {skill.version && (
                <span className="text-xs text-cyan-600">v{skill.version}</span>
              )}
              <span className="flex items-center gap-1 text-xs text-cyan-600">
                <Clock className="w-3 h-3" />
                {formatExperience(skill.experienceMonths)}
              </span>

              {/* Action buttons (show on hover) */}
              <div className="absolute -top-2 -right-2 hidden group-hover:flex items-center gap-1 bg-white rounded-lg shadow-md p-1">
                <button
                  onClick={() => handleEdit(skill)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ProfileSection>

      {showModal && (
        <ITSkillModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialData={editingItem}
        />
      )}
    </>
  );
}
