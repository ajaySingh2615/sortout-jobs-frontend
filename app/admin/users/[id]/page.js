"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import adminService from "@/services/admin.service";
import {
  ArrowLeft,
  Save,
  Loader2,
  Mail,
  Phone,
  Shield,
  Calendar,
  Briefcase,
  Bookmark,
  Key,
  UserCheck,
  Trash2,
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/users")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>
      </div>

      {/* User Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
              {user.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold text-gray-500">
                  {(user.name || user.email || "?")[0].toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name || "No Name"}
                </h1>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded ${
                    ROLE_COLORS[user.role] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role}
                </span>
                {!user.isActive && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                    Disabled
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {user.email}
                  {user.emailVerified ? (
                    <CheckCircle className="w-4 h-4 ml-1 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 ml-1 text-yellow-500" />
                  )}
                </span>
                {user.phone && (
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {user.phone}
                  </span>
                )}
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {user.applicationsCount || 0} applications
                </span>
                <span className="flex items-center">
                  <Bookmark className="w-4 h-4 mr-1" />
                  {user.savedJobsCount || 0} saved jobs
                </span>
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  {user.authProvider}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {["details", "activity", "sessions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? "border-red-600 text-red-600"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Edit Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Edit User Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailVerified"
                    checked={formData.emailVerified}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Email Verified</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Account Active</span>
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions & Profile Summary */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!user.emailVerified && user.authProvider === "LOCAL" && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleVerifyEmail}
                    disabled={actionLoading === "verify"}
                  >
                    {actionLoading === "verify" ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <UserCheck className="w-4 h-4 mr-2" />
                    )}
                    Verify Email Manually
                  </Button>
                )}
                {user.authProvider === "LOCAL" && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleSendPasswordReset}
                    disabled={actionLoading === "password"}
                  >
                    {actionLoading === "password" ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4 mr-2" />
                    )}
                    Send Password Reset
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleRevokeAllSessions}
                  disabled={actionLoading === "sessions"}
                >
                  {actionLoading === "sessions" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4 mr-2" />
                  )}
                  Revoke All Sessions
                </Button>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            {user.profileSummary && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {user.profileSummary.fullName && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Full Name</span>
                      <span className="font-medium">
                        {user.profileSummary.fullName}
                      </span>
                    </div>
                  )}
                  {user.profileSummary.gender && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gender</span>
                      <span className="font-medium">
                        {user.profileSummary.gender}
                      </span>
                    </div>
                  )}
                  {user.profileSummary.educationLevel && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Education</span>
                      <span className="font-medium">
                        {user.profileSummary.educationLevel}
                      </span>
                    </div>
                  )}
                  {user.profileSummary.experienceLevel && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience</span>
                      <span className="font-medium">
                        {user.profileSummary.experienceLevel}
                      </span>
                    </div>
                  )}
                  {user.profileSummary.preferredCity && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Preferred City</span>
                      <span className="font-medium">
                        {user.profileSummary.preferredCity}
                      </span>
                    </div>
                  )}
                  {user.profileSummary.preferredRole && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Preferred Role</span>
                      <span className="font-medium">
                        {user.profileSummary.preferredRole}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-500">Profile Status</span>
                    <span
                      className={`font-medium ${
                        user.profileSummary.profileCompleted
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {user.profileSummary.profileCompleted
                        ? "Complete"
                        : "Incomplete"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  onClick={handleDelete}
                  disabled={actionLoading === "delete"}
                >
                  {actionLoading === "delete" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete User Account
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  This action cannot be undone. All user data will be
                  permanently deleted.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Job Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {user.recentApplications?.length > 0 ? (
              <div className="space-y-4">
                {user.recentApplications.map((app) => (
                  <div
                    key={app.applicationId}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {app.jobTitle}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {app.company}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Applied {formatDate(app.appliedAt)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
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
                <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No job applications yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "sessions" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Active Sessions ({user.activeSessionsCount || 0})
            </CardTitle>
            {user.activeSessions?.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevokeAllSessions}
                disabled={actionLoading === "sessions"}
              >
                {actionLoading === "sessions" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                Revoke All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {user.activeSessions?.length > 0 ? (
              <div className="space-y-3">
                {user.activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-mono text-sm text-gray-700">
                        Token: {session.tokenPreview}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Created: {formatDate(session.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Expires: {formatDate(session.expiryDate)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={actionLoading === `session-${session.id}`}
                      className="text-red-600 hover:bg-red-50"
                    >
                      {actionLoading === `session-${session.id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No active sessions</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
