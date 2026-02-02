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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      return;
    }

    setLoading(true);
    try {
      // Experience comes from Employment section - pass through existing values so they are not changed
      const payload = {
        fullName: formData.fullName.trim(),
        cityId: formData.cityId ? parseInt(formData.cityId) : null,
        localityId: formData.localityId ? parseInt(formData.localityId) : null,
        hasExperience: initialData?.hasExperience ?? false,
        experienceLevel: initialData?.experienceLevel || null,
        currentSalary: initialData?.currentSalary ?? null,
        noticePeriod: initialData?.noticePeriod || null,
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

          {/* Experience is calculated from Employment section - not editable here */}

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
