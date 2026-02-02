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
    degree: "",
    specialization: "",
    institution: "",
    passOutYear: "",
    gradeType: "",
    grade: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        degree: initialData.degree || "",
        specialization: initialData.specialization || "",
        institution: initialData.institution || "",
        passOutYear:
          initialData.passOutYear != null
            ? String(initialData.passOutYear)
            : "",
        gradeType: initialData.gradeType || "",
        grade: initialData.grade || "",
      });
    } else {
      setFormData({
        degree: "",
        specialization: "",
        institution: "",
        passOutYear: "",
        gradeType: "",
        grade: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.degree || !formData.institution) {
      alert("Please fill in Degree/Course and Institution");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        degree: formData.degree.trim(),
        specialization: formData.specialization.trim() || null,
        institution: formData.institution.trim(),
        passOutYear: formData.passOutYear
          ? parseInt(formData.passOutYear, 10)
          : null,
        gradeType: formData.gradeType || null,
        grade: formData.grade.trim() || null,
      };
      await onSave(payload);
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
          {/* Degree/Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Degree/Course <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => handleChange("degree", e.target.value)}
              placeholder="e.g., B.Tech, MBA, 12th, B.Com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
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

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School/University/Institution{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => handleChange("institution", e.target.value)}
              placeholder="e.g., Delhi University, IIT Delhi"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* Passing Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passing Year
            </label>
            <select
              value={formData.passOutYear}
              onChange={(e) => handleChange("passOutYear", e.target.value)}
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

          {/* Grade Type & Grade */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grading System
              </label>
              <select
                value={formData.gradeType}
                onChange={(e) => handleChange("gradeType", e.target.value)}
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
                Marks/Grade
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => handleChange("grade", e.target.value)}
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
