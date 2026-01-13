import PhoneLoginForm from "@/components/auth/PhoneLoginForm";

export default function HeroSection() {
  return (
    <>
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
    </>
  );
}
