"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import onboardingService from "@/services/onboarding.service";

export default function BasicDetailsModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    cityId: "",
    localityId: "",
    hasExperience: false,
    experienceLevel: "",
    currentSalary: "",
    noticePeriod: "",
    headline: "",
  });

  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCities();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        cityId: initialData.cityId || "",
        localityId: initialData.localityId || "",
        hasExperience: initialData.hasExperience || false,
        experienceLevel: initialData?.experienceLevel || "",
        currentSalary: initialData?.currentSalary || "",
        noticePeriod: initialData?.noticePeriod || "",
        headline: initialData?.resumeHeadline || "",
      });

      if (initialData.cityId) {
        loadLocalities(initialData.cityId);
      }
    }
  }, [initialData, isOpen]);

  const loadCities = async () => {
    try {
      const response = await onboardingService.getCities();
      setCities(response.data.data);
    } catch (error) {
      console.error("Failed to load cities", error);
    }
  };

  const loadLocalities = async (cityId) => {
    setLoadingLoc(true);
    try {
      const response = await onboardingService.getLocalitiesByCity(cityId);
      setLocalities(response.data.data);
    } catch (error) {
      console.error("Failed to load localities", error);
    } finally {
      setLoadingLoc(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "cityId") {
      setFormData((prev) => ({ ...prev, localityId: "" }));
      if (value) {
        loadLocalities(value);
      } else {
        setLocalities([]);
      }
    }

    // Clear experience-related fields when unchecking "hasExperience"
    if (field === "hasExperience" && !value) {
      setFormData((prev) => ({
        ...prev,
        hasExperience: false,
        experienceLevel: "",
        currentSalary: "",
        noticePeriod: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        cityId: formData.cityId ? parseInt(formData.cityId) : null,
        localityId: formData.localityId ? parseInt(formData.localityId) : null,
        hasExperience: formData.hasExperience,
        experienceLevel:
          formData.hasExperience && formData.experienceLevel
            ? formData.experienceLevel
            : null,
        currentSalary:
          formData.hasExperience && formData.currentSalary
            ? parseInt(formData.currentSalary)
            : null,
        noticePeriod:
          formData.hasExperience && formData.noticePeriod
            ? formData.noticePeriod
            : null,
        headline: formData.headline.trim() || null,
      };

      await onSave(payload);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Edit Basic Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                value={formData.cityId}
                onChange={(e) => handleChange("cityId", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Locality
              </label>
              <select
                value={formData.localityId}
                onChange={(e) => handleChange("localityId", e.target.value)}
                disabled={!formData.cityId || loadingLoc}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none disabled:bg-gray-50"
              >
                <option value="">Select Locality</option>
                {localities.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasExperience}
                onChange={(e) =>
                  handleChange("hasExperience", e.target.checked)
                }
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">
                I have work experience
              </span>
            </label>

            {formData.hasExperience && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) =>
                        handleChange("experienceLevel", e.target.value)
                      }
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    >
                      <option value="">Select Level</option>
                      <option value="FRESHER">Fresher</option>
                      <option value="MONTHS_1_6">1-6 Months</option>
                      <option value="YEAR_1">1 Year</option>
                      <option value="YEARS_2">2 Years</option>
                      <option value="YEARS_3">3 Years</option>
                      <option value="YEARS_4">4 Years</option>
                      <option value="YEARS_5_PLUS">5+ Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Salary (Monthly ₹)
                    </label>
                    <input
                      type="number"
                      value={formData.currentSalary}
                      onChange={(e) =>
                        handleChange("currentSalary", e.target.value)
                      }
                      placeholder="e.g. 50000"
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>

                {/* Notice Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Period
                  </label>
                  <select
                    value={formData.noticePeriod}
                    onChange={(e) =>
                      handleChange("noticePeriod", e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="">Select Notice Period</option>
                    <option value="15 Days or less">15 Days or less</option>
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months+">3 Months+</option>
                    <option value="Serving Notice Period">
                      Serving Notice Period
                    </option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Resume Headline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume Headline
            </label>
            <textarea
              value={formData.headline}
              onChange={(e) => handleChange("headline", e.target.value)}
              placeholder="Brief summary of your profile..."
              rows="3"
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {formData.headline.length}/250
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
