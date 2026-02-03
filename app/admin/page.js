"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import adminService from "@/services/admin.service";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAdminStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to the admin panel</p>
        </div>
        <Button
          className="bg-red-600 hover:bg-red-700"
          onClick={() => router.push("/admin/jobs/new")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats?.totalJobs || 0}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {stats?.activeJobs || 0} active
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats?.totalApplications || 0}
                </p>
                <p className="text-sm text-yellow-600 mt-1">
                  {stats?.pendingApplications || 0} pending
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats?.totalUsers || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">Registered users</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats?.newJobsThisWeek || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">New jobs posted</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => router.push("/admin/jobs/new")}
            >
              <span className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Post a New Job
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => router.push("/admin/jobs")}
            >
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Manage Jobs
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => router.push("/admin/applications")}
            >
              <span className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                View Applications
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">
                  {stats?.newApplicationsThisWeek || 0} new applications this week
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  {stats?.newJobsThisWeek || 0} jobs posted this week
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">
                  {stats?.pendingApplications || 0} applications pending review
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
