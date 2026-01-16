"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Pencil,
  Trash2,
  Building2,
  Calendar,
  Clock,
} from "lucide-react";
import ProfileSection from "./ProfileSection";
import EmploymentModal from "./modals/EmploymentModal";
import profileService from "@/services/profile.service";
import { toast } from "sonner";

export default function EmploymentSection({
  userId,
  employments: initialEmployments,
  onUpdate,
}) {
  const [employments, setEmployments] = useState(initialEmployments || []);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    setEmployments(initialEmployments || []);
  }, [initialEmployments]);

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employment?")) return;

    try {
      await profileService.deleteEmployment(userId, id);
      toast.success("Employment deleted successfully");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error deleting employment:", error);
      toast.error("Failed to delete employment");
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingItem) {
        await profileService.updateEmployment(userId, editingItem.id, data);
        toast.success("Employment updated successfully");
      } else {
        await profileService.addEmployment(userId, data);
        toast.success("Employment added successfully");
      }
      setShowModal(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error saving employment:", error);
      toast.error("Failed to save employment");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <ProfileSection
        id="employment"
        title="Employment"
        icon={Briefcase}
        onAdd={handleAdd}
        addLabel="Add Employment"
        isEmpty={employments.length === 0}
        emptyMessage="Add your work experience to showcase your career"
      >
        <div className="space-y-4">
          {employments.map((emp) => (
            <div
              key={emp.id}
              className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="p-3 bg-gray-100 rounded-xl">
                    <Building2 className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {emp.designation}
                    </h4>
                    <p className="text-gray-600">{emp.organization}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(emp.startDate)} -{" "}
                        {emp.isCurrentEmployment
                          ? "Present"
                          : formatDate(emp.endDate)}
                      </span>
                      {emp.noticePeriod && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {emp.noticePeriod}
                        </span>
                      )}
                    </div>
                    {emp.jobProfile && (
                      <p className="mt-2 text-sm text-gray-600">
                        {emp.jobProfile}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
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
        <EmploymentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialData={editingItem}
        />
      )}
    </>
  );
}
