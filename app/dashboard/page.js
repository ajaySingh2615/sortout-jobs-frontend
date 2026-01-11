"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Dummy job data
const dummyJobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp India",
    location: "Bangalore, Karnataka",
    salary: "₹15-25 LPA",
    type: "Full-time",
    posted: "2 days ago",
    tags: ["React", "JavaScript", "Node.js"],
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Startup Hub",
    location: "Mumbai, Maharashtra",
    salary: "₹20-30 LPA",
    type: "Full-time",
    posted: "3 days ago",
    tags: ["Product", "Agile", "Leadership"],
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Labs",
    location: "Remote",
    salary: "₹10-18 LPA",
    type: "Full-time",
    posted: "1 day ago",
    tags: ["Figma", "UI Design", "Prototyping"],
  },
  {
    id: 4,
    title: "Backend Engineer",
    company: "FinTech Solutions",
    location: "Hyderabad, Telangana",
    salary: "₹12-22 LPA",
    type: "Full-time",
    posted: "5 days ago",
    tags: ["Java", "Spring Boot", "PostgreSQL"],
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "DataDriven Co",
    location: "Delhi NCR",
    salary: "₹8-15 LPA",
    type: "Full-time",
    posted: "1 week ago",
    tags: ["Python", "SQL", "Tableau"],
  },
];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />

        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back! 👋
              </h1>
              <p className="text-gray-600">
                Here are the latest job opportunities for you
              </p>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search jobs by title, company, or keyword..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                    <option>All Locations</option>
                    <option>Remote</option>
                    <option>Bangalore</option>
                    <option>Mumbai</option>
                    <option>Delhi</option>
                  </select>
                  <Button className="bg-red-600 hover:bg-red-700 px-6">
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-500">New Jobs Today</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-500">Applications Sent</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-500">Saved Jobs</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-500">Interview Calls</div>
              </div>
            </div>

            {/* Job Listings */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recommended Jobs
            </h2>
            <div className="space-y-4">
              {dummyJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-500 font-bold">
                              {job.company.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600">
                              {job.title}
                            </h3>
                            <p className="text-gray-600">{job.company}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                {job.location}
                              </span>
                              <span>•</span>
                              <span>{job.salary}</span>
                              <span>•</span>
                              <span>{job.type}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {job.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end gap-2">
                        <span className="text-sm text-gray-500">
                          {job.posted}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Save
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" className="px-8">
                Load More Jobs
              </Button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
