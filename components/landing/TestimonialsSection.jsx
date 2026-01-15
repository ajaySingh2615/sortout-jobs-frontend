"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Got my dream job within 2 days! The platform is incredibly fast.",
    name: "Rahul Kumar",
    role: "Software Developer",
    city: "Delhi",
    rating: 5,
  },
  {
    quote:
      "The direct HR contact feature saved me so much time. No more waiting for callbacks from consultancies!",
    name: "Priya Sharma",
    role: "Marketing Executive",
    city: "Bangalore",
    rating: 5,
  },
  {
    quote:
      "100% free platform with genuine opportunities. Highly recommended for freshers!",
    name: "Amit Singh",
    role: "Data Analyst",
    city: "Mumbai",
    rating: 5,
  },
  {
    quote:
      "The locality-based search is amazing. Found a job just 2 km from my home!",
    name: "Neha Gupta",
    role: "HR Executive",
    city: "Pune",
    rating: 5,
  },
  {
    quote:
      "Quick response from HRs. Got interview call within hours of applying.",
    name: "Rajesh Verma",
    role: "Sales Manager",
    city: "Hyderabad",
    rating: 5,
  },
  {
    quote:
      "Best platform for career changers. The verified jobs gave me confidence to apply.",
    name: "Sita Patel",
    role: "Content Writer",
    city: "Ahmedabad",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-bold text-gray-900 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          ❝ What People Say ❞
        </motion.h2>

        {/* Masonry Grid */}
        <motion.div
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="break-inside-avoid bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.svg
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i, duration: 0.3 }}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}, {testimonial.city}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
