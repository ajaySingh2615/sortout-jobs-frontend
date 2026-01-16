"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EmploymentModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  const [formData, setFormData] = useState({
    designation: "",
    organization: "",
    isCurrentEmployment: false,
    startDate: "",
    endDate: "",
    jobProfile: "",
    noticePeriod: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        designation: initialData.designation || "",
        organization: initialData.organization || "",
        isCurrentEmployment: initialData.isCurrentEmployment || false,
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        jobProfile: initialData.jobProfile || "",
        noticePeriod: initialData.noticePeriod || "",
      });
    } else {
      setFormData({
        designation: "",
        organization: "",
        isCurrentEmployment: false,
        startDate: "",
        endDate: "",
        jobProfile: "",
        noticePeriod: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.designation ||
      !formData.organization ||
      !formData.startDate
    ) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? "Edit Employment" : "Add Employment"}
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
          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              placeholder="e.g., Software Engineer"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => handleChange("organization", e.target.value)}
              placeholder="e.g., Google Inc."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* Current Employment Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isCurrentEmployment}
              onChange={(e) =>
                handleChange("isCurrentEmployment", e.target.checked)
              }
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">I currently work here</span>
          </label>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                disabled={formData.isCurrentEmployment}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Notice Period */}
          {formData.isCurrentEmployment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notice Period
              </label>
              <select
                value={formData.noticePeriod}
                onChange={(e) => handleChange("noticePeriod", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Notice Period</option>
                <option value="Immediate">Immediate</option>
                <option value="15 days">15 days</option>
                <option value="30 days">30 days</option>
                <option value="60 days">60 days</option>
                <option value="90 days">90 days</option>
                <option value="More than 90 days">More than 90 days</option>
              </select>
            </div>
          )}

          {/* Job Profile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Profile
            </label>
            <textarea
              value={formData.jobProfile}
              onChange={(e) => handleChange("jobProfile", e.target.value)}
              placeholder="Describe your role and responsibilities..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
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
