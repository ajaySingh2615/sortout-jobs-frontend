"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Live search: debounce search term so we refetch after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roleFilter, statusFilter, debouncedSearch]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers({
        search: debouncedSearch,
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
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-baseline justify-between gap-2">
        <h1 className="text-lg font-semibold text-gray-900">Users</h1>
        <span className="text-xs text-gray-500">{totalElements} total</span>
      </div>

      {/* Search & Filters */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0 border-gray-200"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="rounded border border-gray-200 bg-white p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                  Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(0);
                  }}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">All</option>
                  <option value="JOB_SEEKER">Job Seekers</option>
                  <option value="RECRUITER">Recruiters</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-600 h-7"
                onClick={() => {
                  setRoleFilter("");
                  setStatusFilter("");
                  setSearchTerm("");
                  setPage(0);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
        </div>
      ) : users.length === 0 ? (
        <div className="rounded border border-gray-200 bg-white py-12 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">No users found</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {searchTerm || roleFilter || statusFilter
              ? "Try different filters"
              : "No users yet"}
          </p>
        </div>
      ) : (
        <div className="rounded border border-gray-200 bg-white overflow-hidden">
          <div className="divide-y divide-gray-100">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors ${
                  user.isActive === false ? "opacity-70" : ""
                }`}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden relative">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt={user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-500">
                      {(user.name || user.email || "?")[0].toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {user.name || "No Name"}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                        ROLE_COLORS[user.role] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                    {user.isActive === false && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded">
                        Disabled
                      </span>
                    )}
                    {!user.emailVerified && user.authProvider === "LOCAL" && (
                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-medium rounded">
                        Unverified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 truncate">
                    <span className="truncate">{user.email}</span>
                    {user.phone && <span>· {user.phone}</span>}
                    <span>· {formatDate(user.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                    disabled={actionLoading === user.id}
                    title={
                      user.isActive === false ? "Enable user" : "Disable user"
                    }
                  >
                    {actionLoading === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : user.isActive === false ? (
                      <UserCheck className="w-4 h-4" />
                    ) : (
                      <UserX className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(user.id)}
                    disabled={actionLoading === user.id}
                    title="Delete"
                  >
                    {actionLoading === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-2 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-gray-600"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-xs text-gray-500">
                {page + 1} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-gray-600"
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
