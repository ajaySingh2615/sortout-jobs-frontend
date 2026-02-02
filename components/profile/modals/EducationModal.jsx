"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EducationModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  const [formData, setFormData] = useState({
    educationLevel: "",
    course: "",
    specialization: "",
    university: "",
    courseType: "",
    passingYear: "",
    gradingSystem: "",
    marks: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        educationLevel: initialData.educationLevel || "",
        course: initialData.course || "",
        specialization: initialData.specialization || "",
        university: initialData.university || "",
        courseType: initialData.courseType || "",
        passingYear: initialData.passingYear || "",
        gradingSystem: initialData.gradingSystem || "",
        marks: initialData.marks || "",
      });
    } else {
      setFormData({
        educationLevel: "",
        course: "",
        specialization: "",
        university: "",
        courseType: "",
        passingYear: "",
        gradingSystem: "",
        marks: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.educationLevel || !formData.university) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? "Edit Education" : "Add Education"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Education Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Education Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.educationLevel}
              onChange={(e) => handleChange("educationLevel", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select Level</option>
              <option value="BELOW_10TH">Below 10th</option>
              <option value="CLASS_10TH">10th</option>
              <option value="CLASS_12TH">12th</option>
              <option value="DIPLOMA">Diploma</option>
              <option value="GRADUATION">Graduation</option>
              <option value="POST_GRADUATION">Post Graduation</option>
              <option value="PHD">PhD</option>
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course/Degree
            </label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => handleChange("course", e.target.value)}
              placeholder="e.g., B.Tech, MBA, B.Com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => handleChange("specialization", e.target.value)}
              placeholder="e.g., Computer Science, Finance"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* University/Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University/Institution <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => handleChange("university", e.target.value)}
              placeholder="e.g., Delhi University"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* Course Type & Passing Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Type
              </label>
              <select
                value={formData.courseType}
                onChange={(e) => handleChange("courseType", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="DISTANCE">Distance Learning</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passing Year
              </label>
              <select
                value={formData.passingYear}
                onChange={(e) => handleChange("passingYear", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grading System & Marks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grading System
              </label>
              <select
                value={formData.gradingSystem}
                onChange={(e) => handleChange("gradingSystem", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select System</option>
                <option value="CGPA">CGPA</option>
                <option value="PERCENTAGE">Percentage</option>
                <option value="GRADE">Grade</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marks/CGPA
              </label>
              <input
                type="text"
                value={formData.marks}
                onChange={(e) => handleChange("marks", e.target.value)}
                placeholder="e.g., 8.5 or 85%"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
