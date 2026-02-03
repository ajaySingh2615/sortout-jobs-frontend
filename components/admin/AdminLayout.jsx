"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  PlusCircle,
} from "lucide-react";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs",
    href: "/admin/jobs",
    icon: Briefcase,
    subItems: [
      { name: "All Jobs", href: "/admin/jobs" },
      { name: "Add New Job", href: "/admin/jobs/new" },
    ],
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    subItems: [{ name: "All Users", href: "/admin/users" }],
  },
  {
    name: "Applications",
    href: "/admin/applications",
    icon: FileText,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="font-bold text-gray-900">Admin Panel</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            {sidebarOpen && (
              <span className="text-lg font-bold text-gray-900">
                Admin<span className="text-red-600">Panel</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${
                !sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? "bg-red-50 text-red-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>

                {/* Sub items */}
                {item.subItems && sidebarOpen && active && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          pathname === subItem.href
                            ? "text-red-600 bg-red-50"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div
            className={`flex items-center gap-3 ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-red-600 font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || user?.email || "Admin"}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } pt-16 lg:pt-0`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
