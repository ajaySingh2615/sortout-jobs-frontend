"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Pencil, Trash2, School, Calendar } from "lucide-react";
import ProfileSection from "./ProfileSection";
import EducationModal from "./modals/EducationModal";
import profileService from "@/services/profile.service";
import { toast } from "sonner";

export default function EducationSection({
  userId,
  educations: initialEducations,
  onUpdate,
}) {
  const [educations, setEducations] = useState(initialEducations || []);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    setEducations(initialEducations || []);
  }, [initialEducations]);

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this education?")) return;

    try {
      await profileService.deleteEducation(userId, id);
      toast.success("Education deleted successfully");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error("Failed to delete education");
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingItem) {
        await profileService.updateEducation(userId, editingItem.id, data);
        toast.success("Education updated successfully");
      } else {
        await profileService.addEducation(userId, data);
        toast.success("Education added successfully");
      }
      setShowModal(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error saving education:", error);
      toast.error("Failed to save education");
    }
  };

  const formatEducationLevel = (level) => {
    const map = {
      BELOW_10TH: "Below 10th",
      CLASS_10TH: "10th",
      CLASS_12TH: "12th",
      DIPLOMA: "Diploma",
      GRADUATION: "Graduation",
      POST_GRADUATION: "Post Graduation",
      PHD: "PhD",
    };
    return map[level] || level;
  };

  return (
    <>
      <ProfileSection
        id="education"
        title="Education"
        icon={GraduationCap}
        onAdd={handleAdd}
        addLabel="Add Education"
        isEmpty={educations.length === 0}
        emptyMessage="Add your educational qualifications"
      >
        <div className="space-y-4">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <School className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {edu.course || formatEducationLevel(edu.educationLevel)}
                    </h4>
                    {edu.specialization && (
                      <p className="text-gray-600">{edu.specialization}</p>
                    )}
                    <p className="text-gray-600">{edu.university}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {edu.passingYear}
                      </span>
                      {edu.marks && (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                          {edu.gradingSystem}: {edu.marks}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ProfileSection>

      {showModal && (
        <EducationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialData={editingItem}
        />
      )}
    </>
  );
}
