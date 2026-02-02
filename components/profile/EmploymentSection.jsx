"use client";

import { useState } from "react";
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
  const employments = initialEmployments || [];
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const calculateTotalExperience = () => {
    if (!employments || employments.length === 0) return null;

    let totalMonths = 0;
    const today = new Date();

    employments.forEach((emp) => {
      const startDate = new Date(emp.startDate);
      const endDate = emp.isCurrent ? today : new Date(emp.endDate);

      // Calculate months difference
      let yearsDiff = endDate.getFullYear() - startDate.getFullYear();
      let monthsDiff = endDate.getMonth() - startDate.getMonth();

      // Convert to total months
      let months = yearsDiff * 12 + monthsDiff;

      // Add 1 to include both start and end month (industry standard)
      months += 1;

      totalMonths += months;
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0 && months <= 1) return "1 month";
    if (years === 0) return `${months} months`;
    if (months === 0) return `${years} ${years > 1 ? "years" : "year"}`;
    return `${years} ${years > 1 ? "years" : "year"} ${months} ${
      months > 1 ? "months" : "month"
    }`;
  };

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

  const calculateJobDuration = (startDate, endDate, isCurrent) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate);

    let yearsDiff = end.getFullYear() - start.getFullYear();
    let monthsDiff = end.getMonth() - start.getMonth();

    // Convert to total months
    let totalMonths = yearsDiff * 12 + monthsDiff;

    // Add 1 to include both start and end month (industry standard)
    totalMonths += 1;

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0 && months <= 1) return "1 month";
    if (years === 0) return `${months} months`;
    if (months === 0) return `${years} ${years > 1 ? "years" : "year"}`;
    return `${years} ${years > 1 ? "years" : "year"} ${months} ${
      months > 1 ? "months" : "month"
    }`;
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
        {/* Total Experience Banner */}
        {employments.length > 0 && calculateTotalExperience() && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Total Experience: {calculateTotalExperience()}
              </span>
            </div>
          </div>
        )}

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
                    <p className="text-gray-600">{emp.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {emp.employmentType?.replace("_", " ")}
                      </span>
                      {emp.isCurrent && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          Currently Working
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(emp.startDate)} -{" "}
                          {emp.isCurrent ? "Present" : formatDate(emp.endDate)}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="font-medium text-gray-700">
                          {calculateJobDuration(
                            emp.startDate,
                            emp.endDate,
                            emp.isCurrent
                          )}
                        </span>
                      </div>
                      {emp.noticePeriod && emp.isCurrent && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Notice Period: {emp.noticePeriod}</span>
                        </div>
                      )}
                    </div>
                    {emp.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {emp.description}
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
          existingEmployments={employments}
        />
      )}
    </>
  );
}
