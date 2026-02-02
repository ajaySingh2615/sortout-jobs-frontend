"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import onboardingService from "@/services/onboarding.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const EDUCATION_LEVELS = [
  { value: "BELOW_10TH", label: "Below 10th" },
  { value: "PASS_10TH", label: "10th Pass" },
  { value: "PASS_12TH", label: "12th Pass" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "GRADUATE", label: "Graduate" },
  { value: "POST_GRADUATE", label: "Post Graduate" },
];

const EXPERIENCE_LEVELS = [
  { value: "FRESHER", label: "Fresher" },
  { value: "MONTHS_1_6", label: "1-6 Months" },
  { value: "YEAR_1", label: "1 Year" },
  { value: "YEARS_2", label: "2 Years" },
  { value: "YEARS_3", label: "3 Years" },
  { value: "YEARS_4", label: "4 Years" },
  { value: "YEARS_5_PLUS", label: "5+ Years" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    educationLevel: "",
    hasExperience: null,
    experienceLevel: "",
    currentSalary: "",
    preferredCityId: "",
    preferredLocalityId: "",
    whatsappUpdates: true,
    preferredRoleId: "",
    skillIds: [],
  });

  // Master data
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [citiesRes, rolesRes] = await Promise.all([
          onboardingService.getCities(),
          onboardingService.getRoles(),
        ]);
        setCities(citiesRes.data.data || []);
        setRoles(rolesRes.data.data || []);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setPageLoading(false);
      }
    };
    loadMasterData();
  }, []);

  useEffect(() => {
    if (formData.preferredCityId) {
      onboardingService
        .getLocalitiesByCity(formData.preferredCityId)
        .then((res) => setLocalities(res.data.data || []))
        .catch(() => setLocalities([]));
    }
  }, [formData.preferredCityId]);

  useEffect(() => {
    if (formData.preferredRoleId) {
      onboardingService
        .getSkillsByRole(formData.preferredRoleId)
        .then((res) => setSkills(res.data.data || []))
        .catch(() => setSkills([]));
    }
  }, [formData.preferredRoleId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skillId) => {
    setFormData((prev) => ({
      ...prev,
      skillIds: prev.skillIds.includes(skillId)
        ? prev.skillIds.filter((id) => id !== skillId)
        : [...prev.skillIds, skillId],
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    setIsLoading(true);
    try {
      await onboardingService.saveProfile(user.id, {
        fullName: formData.fullName,
        gender: formData.gender,
        educationLevel: formData.educationLevel,
        hasExperience: formData.hasExperience,
        experienceLevel: formData.hasExperience
          ? formData.experienceLevel
          : null,
        currentSalary: formData.hasExperience
          ? parseInt(formData.currentSalary)
          : null,
        preferredCityId: parseInt(formData.preferredCityId),
        preferredLocalityId: parseInt(formData.preferredLocalityId),
        whatsappUpdates: formData.whatsappUpdates,
      });

      await onboardingService.savePreferences(user.id, {
        preferredRoleId: parseInt(formData.preferredRoleId),
        skillIds: formData.skillIds,
      });

      toast.success("Profile completed!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading skeleton
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="w-48 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const stepInfo = [
    {
      num: 1,
      title: "Let's start with your name",
      subtitle: "What should we call you?",
    },
    {
      num: 2,
      title: "Your experience",
      subtitle: "Tell us about your work history",
    },
    {
      num: 3,
      title: "Where do you want to work?",
      subtitle: "Select your preferred location",
    },
    {
      num: 4,
      title: "What role interests you?",
      subtitle: "Choose your desired job type",
    },
    {
      num: 5,
      title: "Show off your skills",
      subtitle: "Select all that apply",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <div
          className="h-full bg-red-500 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Step indicator */}
          <p className="text-sm text-gray-400 mb-2">Step {currentStep} of 5</p>

          {/* Title */}
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {stepInfo[currentStep - 1].title}
          </h1>
          <p className="text-gray-500 mb-12">
            {stepInfo[currentStep - 1].subtitle}
          </p>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Full Name
                </label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className="h-14 text-lg border-gray-200 focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Gender
                </label>
                <div className="flex gap-3">
                  {["MALE", "FEMALE", "OTHER"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleChange("gender", g)}
                      className={`flex-1 py-4 rounded-xl border-2 transition-all ${
                        formData.gender === g
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {g.charAt(0) + g.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Education Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {EDUCATION_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() =>
                        handleChange("educationLevel", level.value)
                      }
                      className={`py-4 px-4 rounded-xl border-2 transition-all text-left ${
                        formData.educationLevel === level.value
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Do you have work experience?
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleChange("hasExperience", true)}
                    className={`flex-1 py-6 rounded-xl border-2 transition-all ${
                      formData.hasExperience === true
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">💼</div>
                    <div className="font-medium">Yes, I have experience</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("hasExperience", false)}
                    className={`flex-1 py-6 rounded-xl border-2 transition-all ${
                      formData.hasExperience === false
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">🎓</div>
                    <div className="font-medium">I'm a fresher</div>
                  </button>
                </div>
              </div>

              {formData.hasExperience === true && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Experience Duration
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {EXPERIENCE_LEVELS.filter(
                        (e) => e.value !== "FRESHER"
                      ).map((exp) => (
                        <button
                          key={exp.value}
                          type="button"
                          onClick={() =>
                            handleChange("experienceLevel", exp.value)
                          }
                          className={`py-4 rounded-xl border-2 transition-all ${
                            formData.experienceLevel === exp.value
                              ? "border-red-500 bg-red-50 text-red-600"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {exp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Current/Last Monthly Salary
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                        ₹
                      </span>
                      <Input
                        type="number"
                        value={formData.currentSalary}
                        onChange={(e) =>
                          handleChange("currentSalary", e.target.value)
                        }
                        placeholder="25000"
                        className="h-14 text-lg pl-10 border-gray-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred City
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleChange("preferredCityId", city.id)}
                      className={`py-4 px-4 rounded-xl border-2 transition-all text-left ${
                        formData.preferredCityId === city.id
                          ? "border-red-500 bg-red-50 text-red-600"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm opacity-60">{city.state}</div>
                    </button>
                  ))}
                </div>
              </div>

              {localities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Locality
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {localities.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() =>
                          handleChange("preferredLocalityId", loc.id)
                        }
                        className={`py-4 rounded-xl border-2 transition-all ${
                          formData.preferredLocalityId === loc.id
                            ? "border-red-500 bg-red-50 text-red-600"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-6 p-4 rounded-xl bg-green-50 border border-green-200">
                <input
                  type="checkbox"
                  id="whatsapp"
                  checked={formData.whatsappUpdates}
                  onChange={(e) =>
                    handleChange("whatsappUpdates", e.target.checked)
                  }
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label
                  htmlFor="whatsapp"
                  className="flex items-center gap-2 text-gray-700 cursor-pointer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-green-500 fill-current"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Get job updates on WhatsApp
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Role */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleChange("preferredRoleId", role.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      formData.preferredRoleId === role.id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`font-semibold text-lg ${
                        formData.preferredRoleId === role.id
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {role.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {role.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Skills */}
          {currentStep === 5 && (
            <div className="space-y-8">
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => handleSkillToggle(skill.id)}
                      className={`px-6 py-3 rounded-full border-2 transition-all ${
                        formData.skillIds.includes(skill.id)
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12">
                  Please select a job role first
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="border-t border-gray-100 px-6 py-4">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-base"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || formData.skillIds.length === 0}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-base disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Complete Profile"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
