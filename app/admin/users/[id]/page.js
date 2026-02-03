"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import adminService from "@/services/admin.service";
import {
  ArrowLeft,
  Save,
  Loader2,
  Shield,
  Briefcase,
  Key,
  UserCheck,
  Trash2,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const ROLE_OPTIONS = [
  { value: "JOB_SEEKER", label: "Job Seeker" },
  { value: "RECRUITER", label: "Recruiter" },
  { value: "ADMIN", label: "Admin" },
];

const ROLE_COLORS = {
  ADMIN: "bg-red-100 text-red-700",
  RECRUITER: "bg-blue-100 text-blue-700",
  JOB_SEEKER: "bg-green-100 text-green-700",
};

const APPLICATION_STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-700",
  REVIEWING: "bg-blue-100 text-blue-700",
  SHORTLISTED: "bg-purple-100 text-purple-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  WITHDRAWN: "bg-gray-100 text-gray-700",
};

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    emailVerified: false,
    isActive: true,
  });

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUserDetail(userId);
      const data = response.data.data;
      setUser(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "JOB_SEEKER",
        emailVerified: data.emailVerified || false,
        isActive: data.isActive !== false,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user details");
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await adminService.updateUser(userId, formData);
      setUser((prev) => ({ ...prev, ...response.data.data }));
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyEmail = async () => {
    setActionLoading("verify");
    try {
      await adminService.verifyUserEmail(userId);
      setUser((prev) => ({ ...prev, emailVerified: true }));
      setFormData((prev) => ({ ...prev, emailVerified: true }));
      toast.success("Email verified successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify email");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendPasswordReset = async () => {
    setActionLoading("password");
    try {
      await adminService.sendPasswordReset(userId);
      toast.success("Password reset email sent");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send password reset"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (
      !confirm("Revoke all sessions? User will be logged out from all devices.")
    )
      return;
    setActionLoading("sessions");
    try {
      await adminService.revokeAllSessions(userId);
      setUser((prev) => ({
        ...prev,
        activeSessions: [],
        activeSessionsCount: 0,
      }));
      toast.success("All sessions revoked");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to revoke sessions");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    setActionLoading(`session-${sessionId}`);
    try {
      await adminService.revokeSession(userId, sessionId);
      setUser((prev) => ({
        ...prev,
        activeSessions: prev.activeSessions.filter((s) => s.id !== sessionId),
        activeSessionsCount: Math.max(0, (prev.activeSessionsCount || 1) - 1),
      }));
      toast.success("Session revoked");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to revoke session");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;
    setActionLoading("delete");
    try {
      await adminService.deleteUser(userId);
      toast.success("User deleted successfully");
      router.push("/admin/users");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-sm text-gray-600 -ml-1"
          onClick={() => router.push("/admin/users")}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </div>

      {/* User Header */}
      <div className="rounded border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative shrink-0">
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt={user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-500">
                {(user.name || user.email || "?")[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-lg font-semibold text-gray-900">
                {user.name || "No Name"}
              </h1>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                  ROLE_COLORS[user.role] || "bg-gray-100 text-gray-700"
                }`}
              >
                {user.role}
              </span>
              {!user.isActive && (
                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded">
                  Disabled
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-0.5 text-xs text-gray-500">
              <span className="truncate">
                {user.email}
                {user.emailVerified ? (
                  <CheckCircle className="w-3.5 h-3.5 inline ml-0.5 text-green-500 align-middle" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 inline ml-0.5 text-amber-500 align-middle" />
                )}
              </span>
              {user.phone && <span>· {user.phone}</span>}
              <span>· Joined {formatDate(user.createdAt)}</span>
              <span>· {user.applicationsCount || 0} applications</span>
              <span>· {user.savedJobsCount || 0} saved</span>
              <span>· {user.authProvider}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-2">
          {["details", "activity", "sessions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-2 border-b-2 text-sm capitalize transition-colors ${
                activeTab === tab
                  ? "border-red-600 text-red-600 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "details" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Edit Form */}
          <div className="lg:col-span-2 rounded border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Edit User Details
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailVerified"
                    checked={formData.emailVerified}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-xs text-gray-700">Email Verified</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-xs text-gray-700">Account Active</span>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1.5" />
                  )}
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            {/* Quick Actions */}
            <div className="rounded border border-gray-200 bg-white p-3">
              <h2 className="text-xs font-semibold text-gray-900 mb-2">
                Quick Actions
              </h2>
              <div className="space-y-1.5">
                {!user.emailVerified && user.authProvider === "LOCAL" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-8 text-xs border-gray-200"
                    onClick={handleVerifyEmail}
                    disabled={actionLoading === "verify"}
                  >
                    {actionLoading === "verify" ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Verify Email
                  </Button>
                )}
                {user.authProvider === "LOCAL" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-8 text-xs border-gray-200"
                    onClick={handleSendPasswordReset}
                    disabled={actionLoading === "password"}
                  >
                    {actionLoading === "password" ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Key className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Password Reset
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-8 text-xs border-gray-200"
                  onClick={handleRevokeAllSessions}
                  disabled={actionLoading === "sessions"}
                >
                  {actionLoading === "sessions" ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  Revoke All Sessions
                </Button>
              </div>
            </div>

            {/* Profile Summary */}
            {user.profileSummary && (
              <div className="rounded border border-gray-200 bg-white p-3">
                <h2 className="text-xs font-semibold text-gray-900 mb-2">
                  Profile Summary
                </h2>
                <div className="space-y-1.5 text-xs">
                  {user.profileSummary.fullName && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500">Full Name</span>
                      <span className="font-medium text-right truncate">
                        {user.profileSummary.fullName}
                      </span>
                    </div>
                  )}
                  {user.profileSummary.gender && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500">Gender</span>
                      <span className="font-medium">
                        {user.profileSummary.gender}
                      </span>
                    </div>
                  )}
                  {user.profileSummary.educationLevel && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500">Education</span>
                      <span className="font-medium">
                        {user.profileSummary.educationLevel}
                      </span>
                    </div>
                  )}
                  {user.profileSummary.experienceLevel && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500">Experience</span>
                      <span className="font-medium">
                        {user.profileSummary.experienceLevel}
                      </span>
                    </div>
                  )}
                  {user.profileSummary.preferredCity && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500">City</span>
                      <span className="font-medium truncate">
                        {user.profileSummary.preferredCity}
                      </span>
                    </div>
                  )}
                  {user.profileSummary.preferredRole && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500">Role</span>
                      <span className="font-medium truncate">
                        {user.profileSummary.preferredRole}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2 pt-1.5 border-t border-gray-100">
                    <span className="text-gray-500">Status</span>
                    <span
                      className={`font-medium ${
                        user.profileSummary.profileCompleted
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    >
                      {user.profileSummary.profileCompleted
                        ? "Complete"
                        : "Incomplete"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="rounded border border-red-200 bg-white p-3">
              <h2 className="text-xs font-semibold text-red-600 mb-2">
                Danger Zone
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={actionLoading === "delete"}
              >
                {actionLoading === "delete" ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                )}
                Delete User
              </Button>
              <p className="text-[10px] text-gray-500 mt-1.5">
                Permanent. Cannot be undone.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="rounded border border-gray-200 bg-white overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              Recent Job Applications
            </h2>
          </div>
          <div className="p-3">
            {user.recentApplications?.length > 0 ? (
              <div className="space-y-2">
                {user.recentApplications.map((app) => (
                  <div
                    key={app.applicationId}
                    className="flex items-center justify-between py-2.5 px-3 border border-gray-100 rounded hover:bg-gray-50/80"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {app.jobTitle}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {app.company} · Applied {formatDate(app.appliedAt)}
                      </p>
                    </div>
                    <span
                      className={`ml-2 px-2 py-0.5 text-[10px] font-medium rounded shrink-0 ${
                        APPLICATION_STATUS_COLORS[app.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-10 h-10 mx-auto text-gray-300 mb-1.5" />
                <p className="text-sm">No job applications yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "sessions" && (
        <div className="rounded border border-gray-200 bg-white overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Active Sessions ({user.activeSessionsCount || 0})
            </h2>
            {user.activeSessions?.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-gray-200"
                onClick={handleRevokeAllSessions}
                disabled={actionLoading === "sessions"}
              >
                {actionLoading === "sessions" ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                ) : (
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                )}
                Revoke All
              </Button>
            )}
          </div>
          <div className="p-3">
            {user.activeSessions?.length > 0 ? (
              <div className="space-y-2">
                {user.activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between py-2.5 px-3 border border-gray-100 rounded hover:bg-gray-50/80"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-gray-700 truncate">
                        {session.tokenPreview}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Created {formatDate(session.createdAt)} · Expires{" "}
                        {formatDate(session.expiryDate)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 ml-2 text-red-600 hover:bg-red-50 shrink-0"
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={actionLoading === `session-${session.id}`}
                    >
                      {actionLoading === `session-${session.id}` ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-10 h-10 mx-auto text-gray-300 mb-1.5" />
                <p className="text-sm">No active sessions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
