"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              SortOut<span className="text-red-500">Jobs</span>
            </span>
          </Link>

          {/* Simple Nav Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-red-500 font-medium transition-colors text-sm"
            >
              Find Jobs
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-red-500 font-medium transition-colors text-sm hidden sm:block"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-red-500 font-medium transition-colors text-sm hidden sm:block"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
