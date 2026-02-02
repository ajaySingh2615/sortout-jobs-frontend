"use client";

import { motion } from "framer-motion";

const companies = [
  { name: "uber", label: "Uber", headline: "Ride with us", jobs: 45 },
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
  { name: "cars24", label: "Cars24", headline: "Drive your career", jobs: 22 },
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
  { name: "rapido", label: "Revv", headline: "Drive innovation", jobs: 8 },
];

export default function TopCompaniesSection() {
  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">
            Top Hiring Companies
          </h2>
          <a
            href="/companies"
            className="text-red-500 hover:text-red-600 font-medium text-sm"
          >
            View All →
          </a>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <motion.div
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {companies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
