"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function EmploymentModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingEmployments = [],
}) {
  const [formData, setFormData] = useState({
    designation: "",
    company: "",
    employmentType: "FULL_TIME",
    isCurrent: false,
    startDate: "",
    endDate: "",
    description: "",
    noticePeriod: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        designation: initialData.designation || "",
        company: initialData.company || "",
        employmentType: initialData.employmentType || "FULL_TIME",
        isCurrent: initialData.isCurrent || false,
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        description: initialData.description || "",
        noticePeriod: initialData.noticePeriod || "",
      });
    } else {
      setFormData({
        designation: "",
        company: "",
        employmentType: "FULL_TIME",
        isCurrent: false,
        startDate: "",
        endDate: "",
        description: "",
        noticePeriod: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Clear end date when marking as current employment
      if (field === "isCurrent" && value === true) {
        updated.endDate = "";
      }

      return updated;
    });

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateDates = () => {
    const newErrors = {};
    const startDate = new Date(formData.startDate);
    const endDate = formData.endDate ? new Date(formData.endDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate start date not in future
    if (startDate > today) {
      newErrors.startDate = "Start date cannot be in the future";
    }

    // Validate end date
    if (!formData.isCurrent && endDate) {
      if (endDate > today) {
        newErrors.endDate = "End date cannot be in the future";
      }
      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    // Check for overlapping dates with existing employments (excluding current one being edited)
    const otherEmployments = existingEmployments.filter(
      (emp) => emp.id !== initialData?.id
    );

    for (const emp of otherEmployments) {
      const empStart = new Date(emp.startDate);
      const empEnd = emp.endDate ? new Date(emp.endDate) : today;

      // Check if dates overlap
      const currentEnd = formData.isCurrent ? today : endDate;

      if (
        currentEnd &&
        ((startDate >= empStart && startDate <= empEnd) ||
          (currentEnd >= empStart && currentEnd <= empEnd) ||
          (startDate <= empStart && currentEnd >= empEnd))
      ) {
        newErrors.startDate = `Date range overlaps with ${emp.designation} at ${emp.company}`;
        break;
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.designation || !formData.company || !formData.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate dates
    const dateErrors = validateDates();
    if (Object.keys(dateErrors).length > 0) {
      setErrors(dateErrors);
      toast.error("Please fix date validation errors");
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

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="e.g., Google Inc."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => handleChange("employmentType", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FREELANCE">Freelance</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>

          {/* Current Employment Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isCurrent}
              onChange={(e) => handleChange("isCurrent", e.target.checked)}
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
                max={new Date().toISOString().split("T")[0]}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date{" "}
                {!formData.isCurrent && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                disabled={formData.isCurrent}
                max={new Date().toISOString().split("T")[0]}
                min={formData.startDate}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
                required={!formData.isCurrent}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Notice Period */}
          {formData.isCurrent && (
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

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
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
