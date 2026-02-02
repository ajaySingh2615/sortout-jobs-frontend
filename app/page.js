"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  HeroSection,
  USPSection,
  TopCompaniesSection,
  JobCategoriesSection,
  JobsByCitySection,
  TestimonialsSection,
} from "@/components/landing";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <USPSection />
      <TopCompaniesSection />
      <JobCategoriesSection />
      <JobsByCitySection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
