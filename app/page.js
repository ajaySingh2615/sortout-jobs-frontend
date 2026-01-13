"use client";

import { useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PhoneLoginForm from "@/components/auth/PhoneLoginForm";

export default function Home() {
  const cityScrollRef = useRef(null);

  const scrollCities = (direction) => {
    if (cityScrollRef.current) {
      const scrollAmount = 300;
      cityScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Full Image Background */}
      <section className="relative h-[60vh] min-h-[400px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-image.webp')" }}
        />
      </section>

      {/* Floating Login Card - 90% in hero, 10% below */}
      <div className="relative z-20 -mt-56 pb-16">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Heading */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Find Your Dream Job
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Quick login to explore opportunities
            </p>

            {/* Phone Login Form */}
            <PhoneLoginForm />
          </div>
        </div>
      </div>

      {/* USP Section - Minimal */}
      <section className="py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-3 bg-gray-100 px-6 py-4 rounded-2xl">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-gray-800 font-medium">
                100% FREE & Verified
              </span>
            </div>
            <div className="flex items-center gap-3 bg-gray-100 px-6 py-4 rounded-2xl">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-500"
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
              </div>
              <span className="text-gray-800 font-medium">
                Jobs in your locality
              </span>
            </div>
            <div className="flex items-center gap-3 bg-gray-100 px-6 py-4 rounded-2xl">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <span className="text-gray-800 font-medium">Direct HR calls</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top Hiring Companies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Top Hiring Companies
            </h2>
            <a
              href="/companies"
              className="text-red-500 hover:text-red-600 font-medium text-sm"
            >
              View All →
            </a>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[
              {
                name: "uber",
                label: "Uber",
                headline: "Ride with us",
                jobs: 45,
              },
              {
                name: "rapido",
                label: "Rapido",
                headline: "Be a Delivery Captain",
                jobs: 32,
              },
              {
                name: "bigbasket",
                label: "BigBasket",
                headline: "Fresh careers await",
                jobs: 28,
              },
              {
                name: "blinkit",
                label: "Blinkit",
                headline: "10-min delivery heroes",
                jobs: 15,
              },
              {
                name: "cars24",
                label: "Cars24",
                headline: "Drive your career",
                jobs: 22,
              },
              {
                name: "delhivery",
                label: "Delhivery",
                headline: "Deliver excellence",
                jobs: 18,
              },
              {
                name: "urban-company",
                label: "Urban Company",
                headline: "Service with smile",
                jobs: 35,
              },
              {
                name: "no-broker",
                label: "NoBroker",
                headline: "Real estate careers",
                jobs: 12,
              },
              {
                name: "tata-motors",
                label: "Tata Motors",
                headline: "Build the future",
                jobs: 25,
              },
              {
                name: "rapido",
                label: "Revv",
                headline: "Drive innovation",
                jobs: 8,
              },
            ].map((company, index) => (
              <div
                key={index}
                className="group flex-shrink-0 w-80 bg-white rounded-2xl p-10 border border-gray-100 hover:shadow-xl hover:border-red-200 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={`/images/featured-companies/${company.name}.svg`}
                  alt={company.label}
                  className="h-12 w-auto mb-5"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {company.label}
                </h3>
                <p className="text-gray-500 mb-6">{company.headline}</p>
                <a
                  href={`/jobs?company=${company.name}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-500 bg-red-50 group-hover:bg-red-500 group-hover:text-white transition-all duration-300"
                >
                  View {company.jobs} Jobs
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Explore Jobs by Category
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              {
                name: "IT & Software",
                jobs: 500,
                icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
              },
              {
                name: "Marketing",
                jobs: 320,
                icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
              },
              {
                name: "Sales",
                jobs: 280,
                icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
              },
              {
                name: "Finance",
                jobs: 150,
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                name: "HR",
                jobs: 120,
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
              },
              {
                name: "Operations",
                jobs: 200,
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
              },
              {
                name: "Customer Support",
                jobs: 180,
                icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
              },
              {
                name: "Content",
                jobs: 160,
                icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
              },
              {
                name: "Data Analytics",
                jobs: 140,
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              },
              {
                name: "Design",
                jobs: 100,
                icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
              },
              {
                name: "Engineering",
                jobs: 250,
                icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
              },
              {
                name: "Legal",
                jobs: 80,
                icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
              },
            ].map((category, index) => (
              <a
                key={index}
                href={`/jobs?category=${category.name}`}
                className="group flex items-center gap-3 px-6 py-4 bg-gray-100 hover:bg-red-500 rounded-full transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
              >
                <svg
                  className="w-6 h-6 text-red-500 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={category.icon}
                  />
                </svg>
                <span className="font-medium text-gray-700 group-hover:text-white transition-colors">
                  {category.name}
                </span>
                <span className="text-sm text-gray-500 group-hover:text-red-100 transition-colors">
                  ({category.jobs}+)
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs by City Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Explore jobs in 400+ cities
          </h2>

          {/* Horizontal Scroll Container */}
          <div className="relative">
            {/* Scroll Arrows */}
            <button
              onClick={() => scrollCities("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors hidden md:flex cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => scrollCities("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors hidden md:flex cursor-pointer"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div
              ref={cityScrollRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            >
              {[
                { name: "Delhi", image: "delhi.jpg", jobs: "15K+" },
                { name: "Mumbai", image: "Mumbai.jpg", jobs: "12K+" },
                { name: "Bangalore", image: "Bangalore.jpg", jobs: "14K+" },
                { name: "Hyderabad", image: "Hydrabad.jpg", jobs: "10K+" },
                { name: "Chennai", image: "Chennai.jpg", jobs: "8K+" },
                { name: "Pune", image: "Pune.jpg", jobs: "7K+" },
                { name: "Kolkata", image: "Kolkata.jpg", jobs: "6K+" },
                { name: "Ahmedabad", image: "Ahmedabad.jpg", jobs: "5K+" },
                { name: "Jaipur", image: "Jaipur.jpg", jobs: "4K+" },
                { name: "Lucknow", image: "Lucknow.jpg", jobs: "3K+" },
                { name: "Gurugram", image: "gurugram.jpg", jobs: "9K+" },
                { name: "Noida", image: "noida.jpg", jobs: "8K+" },
                { name: "Indore", image: "Indore.jpg", jobs: "2K+" },
              ].map((city, index) => (
                <a
                  key={index}
                  href={`/jobs?city=${city.name}`}
                  className="flex-shrink-0 group cursor-pointer"
                >
                  <div className="w-44 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                    <div className="h-32 overflow-hidden">
                      <img
                        src={`/images/featured-cities/${city.image}`}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900">
                        {city.name}
                      </h3>
                      <p className="text-sm text-red-500">{city.jobs} Jobs</p>
                    </div>
                  </div>
                </a>
              ))}

              {/* View All Cities Card */}
              <a
                href="/cities"
                className="flex-shrink-0 w-44 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer"
              >
                <span className="text-red-500 font-medium">
                  View all cities
                </span>
                <svg
                  className="w-5 h-5 text-red-500 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-center mt-10">
            <a
              href="/cities"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-50 rounded-full font-medium transition-colors"
            >
              View all cities
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SortOut Jobs?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make job searching simple, fast, and effective
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quick Apply
              </h3>
              <p className="text-gray-600">
                Apply to multiple jobs with just one click. Save time and reach
                more employers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Verified Companies
              </h3>
              <p className="text-gray-600">
                All companies on our platform are verified. No scams, only
                genuine opportunities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant Alerts
              </h3>
              <p className="text-gray-600">
                Get notified about new jobs that match your skills and
                preferences instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Three simple steps to your dream job
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Login with Phone
              </h3>
              <p className="text-gray-600">
                Enter your phone number and verify with OTP. Quick and secure.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Browse Jobs
              </h3>
              <p className="text-gray-600">
                Explore thousands of job listings from top companies across
                India.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Apply & Get Hired
              </h3>
              <p className="text-gray-600">
                Apply with one click and get responses directly from employers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have already found their perfect
            opportunity through SortOut Jobs.
          </p>
          <a
            href="#"
            className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
