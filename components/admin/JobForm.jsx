"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import adminService from "@/services/admin.service";
import { Loader2, ArrowLeft, Save } from "lucide-react";

const LOCATION_TYPES = [
  { value: "ONSITE", label: "On-site" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
];

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
];

const EDUCATION_LEVELS = [
  { value: "", label: "Any" },
  { value: "BELOW_10TH", label: "Below 10th" },
  { value: "PASS_10TH", label: "10th Pass" },
  { value: "PASS_12TH", label: "12th Pass" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "GRADUATE", label: "Graduate" },
  { value: "POST_GRADUATE", label: "Post Graduate" },
];

export default function JobForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loadingMaster, setLoadingMaster] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    companyLogo: "",
    description: "",
    requirements: "",
    cityId: "",
    address: "",
    locationType: "ONSITE",
    salaryMin: "",
    salaryMax: "",
    isSalaryDisclosed: true,
    employmentType: "FULL_TIME",
    experienceMinYears: "0",
    experienceMaxYears: "",
    minEducation: "",
    roleId: "",
    skillIds: [],
    vacancies: "1",
    applicationDeadline: "",
    isFeatured: false,
  });

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        company: initialData.company || "",
        companyLogo: initialData.companyLogo || "",
        description: initialData.description || "",
        requirements: initialData.requirements || "",
        cityId: initialData.cityId?.toString() || "",
        address: initialData.address || "",
        locationType: initialData.locationType || "ONSITE",
        salaryMin: initialData.salaryMin?.toString() || "",
        salaryMax: initialData.salaryMax?.toString() || "",
        isSalaryDisclosed: initialData.isSalaryDisclosed ?? true,
        employmentType: initialData.employmentType || "FULL_TIME",
        experienceMinYears: initialData.experienceMinYears?.toString() || "0",
        experienceMaxYears: initialData.experienceMaxYears?.toString() || "",
        minEducation: initialData.minEducation || "",
        roleId: initialData.roleId?.toString() || "",
        skillIds: initialData.requiredSkills?.map((s) => s.id) || [],
        vacancies: initialData.vacancies?.toString() || "1",
        applicationDeadline: initialData.applicationDeadline || "",
        isFeatured: initialData.isFeatured || false,
      });

      // Load skills for the selected role
      if (initialData.roleId) {
        fetchSkillsForRole(initialData.roleId);
      }
    }
  }, [initialData]);

  const fetchMasterData = async () => {
    try {
      setLoadingMaster(true);
      const [citiesRes, rolesRes] = await Promise.all([
        adminService.getCities(),
        adminService.getRoles(),
      ]);
      setCities(citiesRes.data.data || []);
      setRoles(rolesRes.data.data || []);
    } catch (error) {
      console.error("Error fetching master data:", error);
      toast.error("Failed to load form data");
    } finally {
      setLoadingMaster(false);
    }
  };

  const fetchSkillsForRole = async (roleId) => {
    try {
      const response = await adminService.getSkillsByRole(roleId);
      setSkills(response.data.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Load skills when role changes
    if (name === "roleId" && value) {
      fetchSkillsForRole(value);
      setFormData((prev) => ({ ...prev, skillIds: [] }));
    }
  };

  const handleSkillToggle = (skillId) => {
    setFormData((prev) => ({
      ...prev,
      skillIds: prev.skillIds.includes(skillId)
        ? prev.skillIds.filter((id) => id !== skillId)
        : [...prev.skillIds, skillId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!formData.company.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!formData.roleId) {
      toast.error("Please select a job role");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        companyLogo: formData.companyLogo.trim() || null,
        description: formData.description.trim() || null,
        requirements: formData.requirements.trim() || null,
        cityId: formData.cityId ? parseInt(formData.cityId) : null,
        address: formData.address.trim() || null,
        locationType: formData.locationType,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        isSalaryDisclosed: formData.isSalaryDisclosed,
        employmentType: formData.employmentType,
        experienceMinYears: parseInt(formData.experienceMinYears) || 0,
        experienceMaxYears: formData.experienceMaxYears
          ? parseInt(formData.experienceMaxYears)
          : null,
        minEducation: formData.minEducation || null,
        roleId: parseInt(formData.roleId),
        skillIds: formData.skillIds.length > 0 ? formData.skillIds : null,
        vacancies: parseInt(formData.vacancies) || 1,
        applicationDeadline: formData.applicationDeadline || null,
        isFeatured: formData.isFeatured,
      };

      if (isEdit && initialData?.id) {
        await adminService.updateJob(initialData.id, payload);
        toast.success("Job updated successfully");
      } else {
        await adminService.createJob(user.id, payload);
        toast.success("Job created successfully");
      }

      router.push("/admin/jobs");
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error(error.response?.data?.message || "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  if (loadingMaster) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Job" : "Post New Job"}
            </h1>
            <p className="text-gray-600">
              {isEdit ? "Update job details" : "Create a new job posting"}
            </p>
          </div>
        </div>
        <Button
          type="submit"
          className="bg-red-600 hover:bg-red-700"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isEdit ? "Update Job" : "Post Job"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior React Developer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g., TechCorp India"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo URL
                </label>
                <input
                  type="url"
                  name="companyLogo"
                  value={formData.companyLogo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the job responsibilities, day-to-day activities..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Required qualifications, skills, experience..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Employment */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Employment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="locationType"
                    value={formData.locationType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {LOCATION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}, {city.state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address / Area
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g., Koramangala, Near Sony Signal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vacancies
                  </label>
                  <input
                    type="number"
                    name="vacancies"
                    value={formData.vacancies}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compensation */}
          <Card>
            <CardHeader>
              <CardTitle>Compensation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isSalaryDisclosed"
                  name="isSalaryDisclosed"
                  checked={formData.isSalaryDisclosed}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label
                  htmlFor="isSalaryDisclosed"
                  className="text-sm text-gray-700"
                >
                  Disclose salary to applicants
                </label>
              </div>

              {formData.isSalaryDisclosed && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Salary (Annual in ₹)
                    </label>
                    <input
                      type="number"
                      name="salaryMin"
                      value={formData.salaryMin}
                      onChange={handleChange}
                      placeholder="e.g., 1500000 (15 LPA)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.salaryMin
                        ? `₹${(formData.salaryMin / 100000).toFixed(1)} LPA`
                        : "Enter amount in rupees"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Salary (Annual in ₹)
                    </label>
                    <input
                      type="number"
                      name="salaryMax"
                      value={formData.salaryMax}
                      onChange={handleChange}
                      placeholder="e.g., 2500000 (25 LPA)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.salaryMax
                        ? `₹${(formData.salaryMax / 100000).toFixed(1)} LPA`
                        : "Enter amount in rupees"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experienceMinYears"
                    value={formData.experienceMinYears}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Experience
                  </label>
                  <input
                    type="number"
                    name="experienceMaxYears"
                    value={formData.experienceMaxYears}
                    onChange={handleChange}
                    min="0"
                    placeholder="Any"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Education
                </label>
                <select
                  name="minEducation"
                  value={formData.minEducation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Category & Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Category & Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} ({role.category})
                    </option>
                  ))}
                </select>
              </div>

              {skills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleSkillToggle(skill.id)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                          formData.skillIds.includes(skill.id)
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-red-600"
                        }`}
                      >
                        {skill.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="isFeatured" className="text-sm text-gray-700">
                  Mark as Featured Job
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Featured jobs appear at the top of search results
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
