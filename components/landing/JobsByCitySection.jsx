"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const cities = [
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
];

export default function JobsByCitySection() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-bold text-gray-900 text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Explore jobs in 400+ cities
        </motion.h2>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          {/* Scroll Arrows */}
          <motion.button
            onClick={() => scroll("left")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
          </motion.button>
          <motion.button
            onClick={() => scroll("right")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
          </motion.button>

          <motion.div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {cities.map((city, index) => (
              <motion.a
                key={index}
                href={`/jobs?city=${city.name}`}
                className="flex-shrink-0 group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                whileHover={{ y: -5 }}
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
                    <h3 className="font-semibold text-gray-900">{city.name}</h3>
                    <p className="text-sm text-red-500">{city.jobs} Jobs</p>
                  </div>
                </div>
              </motion.a>
            ))}

            {/* View All Cities Card */}
            <motion.a
              href="/cities"
              className="flex-shrink-0 w-44 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer"
              whileHover={{ y: -5 }}
            >
              <span className="text-red-500 font-medium">View all cities</span>
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
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.a
            href="/cities"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-50 rounded-full font-medium transition-colors"
          >
            View all cities
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
