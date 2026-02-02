"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ITSkillModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    proficiency: "BEGINNER",
    experienceMonths: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        proficiency: initialData.proficiency || "BEGINNER",
        experienceMonths: initialData.experienceMonths != null ? String(initialData.experienceMonths) : "",
      });
    } else {
      setFormData({
        name: "",
        proficiency: "BEGINNER",
        experienceMonths: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      alert("Please enter a skill name");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        proficiency: formData.proficiency || "BEGINNER",
        experienceMonths: formData.experienceMonths
          ? parseInt(formData.experienceMonths, 10)
          : null,
      };
      await onSave(payload);
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
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? "Edit IT Skill" : "Add IT Skill"}
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
          {/* Skill Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Java, React, Python"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* Proficiency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proficiency
            </label>
            <select
              value={formData.proficiency}
              onChange={(e) => handleChange("proficiency", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>

          {/* Experience (months) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience (in months)
            </label>
            <input
              type="number"
              value={formData.experienceMonths}
              onChange={(e) => handleChange("experienceMonths", e.target.value)}
              placeholder="e.g., 24 for 2 years"
              min="0"
              max="600"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.experienceMonths
                ? `${Math.floor(Number(formData.experienceMonths) / 12)} years ${
                    Number(formData.experienceMonths) % 12
                  } months`
                : "Enter experience in months"}
            </p>
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
