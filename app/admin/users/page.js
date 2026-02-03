"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import adminService from "@/services/admin.service";
import {
  Search,
  Eye,
  Trash2,
  Loader2,
  Users,
  UserCheck,
  UserX,
  Shield,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  Filter,
} from "lucide-react";

const ROLE_COLORS = {
  ADMIN: "bg-red-100 text-red-700",
  RECRUITER: "bg-blue-100 text-blue-700",
  JOB_SEEKER: "bg-green-100 text-green-700",
};

const ROLE_LABELS = {
  ADMIN: "Admin",
  RECRUITER: "Recruiter",
  JOB_SEEKER: "Job Seeker",
};

const AUTH_PROVIDER_LABELS = {
  LOCAL: "Email",
  GOOGLE: "Google",
  PHONE: "Phone",
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers({
        search: searchTerm,
        role: roleFilter,
        isActive: statusFilter,
        page,
        size: 10,
      });
      const data = response.data.data;
      setUsers(data.users || []);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setActionLoading(userId);
    try {
      await adminService.toggleUserStatus(userId, !currentStatus);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
      toast.success(currentStatus ? "User disabled" : "User activated");
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update user status"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;

    setActionLoading(userId);
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600">{totalElements} total users</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </form>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setPage(0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">All Roles</option>
                    <option value="JOB_SEEKER">Job Seekers</option>
                    <option value="RECRUITER">Recruiters</option>
                    <option value="ADMIN">Admins</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRoleFilter("");
                    setStatusFilter("");
                    setSearchTerm("");
                    setPage(0);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-500">
              {searchTerm || roleFilter || statusFilter
                ? "Try different search criteria"
                : "No users registered yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className={!user.isActive ? "opacity-60" : ""}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* User Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden relative">
                      {user.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt={user.name || "User"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-xl font-semibold text-gray-500">
                          {(user.name || user.email || "?")[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {user.name || "No Name"}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${
                            ROLE_COLORS[user.role] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {ROLE_LABELS[user.role] || user.role}
                        </span>
                        {!user.isActive && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                            Disabled
                          </span>
                        )}
                        {!user.emailVerified &&
                          user.authProvider === "LOCAL" && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                              Unverified
                            </span>
                          )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center truncate">
                          <Mail className="w-4 h-4 mr-1 shrink-0" />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1 shrink-0" />
                            {user.phone}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 shrink-0" />
                          Joined {formatDate(user.createdAt)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {user.applicationsCount || 0} applications
                        </span>
                        <span className="flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          {AUTH_PROVIDER_LABELS[user.authProvider] ||
                            user.authProvider}
                        </span>
                        <span className="flex items-center">
                          {user.activeSessionsCount || 0} active sessions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(user.id, user.isActive)}
                      disabled={actionLoading === user.id}
                      title={user.isActive ? "Disable User" : "Enable User"}
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : user.isActive ? (
                        <UserX className="w-4 h-4" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      disabled={actionLoading === user.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete User"
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
