"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Floating Job Cards Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-16 h-20 bg-gray-100 rounded-lg opacity-20 animate-bounce"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-40 right-20 w-20 h-24 bg-red-100 rounded-lg opacity-20 animate-bounce"
          style={{ animationDuration: "5s", animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-14 h-18 bg-gray-100 rounded-lg opacity-20 animate-bounce"
          style={{ animationDuration: "6s", animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-1/3 w-18 h-22 bg-red-100 rounded-lg opacity-20 animate-bounce"
          style={{ animationDuration: "4.5s", animationDelay: "0.5s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Searching Animation */}
        <div className="mb-8 relative inline-block">
          <div className="w-24 h-24 border-4 border-gray-200 rounded-full mx-auto relative">
            <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Still Searching...
        </h1>
        <p className="text-gray-500 mb-2 text-lg">
          This page is not on our job board yet!
        </p>
        <p className="text-gray-400 text-sm mb-10">
          But don't worry, we're hiring developers to build it 😉
        </p>

        {/* CTA Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Find Your Way Home
        </Link>
      </div>
    </div>
  );
}
