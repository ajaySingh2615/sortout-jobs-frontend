"use client";

import { useAuth } from "@/context/AuthContext";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

/**
 * Wraps admin pages: user must be authenticated AND have role "ADMIN".
 * Shows admin login form if not logged in as admin.
 */
export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in or not admin -> show admin login form
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <AdminLoginForm />;
  }

  return children;
}
