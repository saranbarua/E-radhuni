import { useEffect, useState } from "react";

export default function WelcomeSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // trigger animation after mount
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50/60 to-rose-50 py-12 md:py-20">
      {/* Soft background shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-rose-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row md:gap-14">
        {/* LEFT: Text Content */}
        <div
          className={`flex-1 space-y-5 transform transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-medium text-amber-700 shadow-sm border border-amber-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Modern Bengali Cooking Platform
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Welcome to <span className="text-amber-700">E-Radhuni</span>
          </h1>

          {/* Sub Title */}
          <p className="text-base md:text-lg text-gray-600 max-w-xl">
            Learn authentic Bangladeshi dishes in a clean, organized, and
            easy-to-follow way — guided by professional chefs.
          </p>

          {/* Main Body */}
          <div className="space-y-3 text-sm md:text-base text-gray-700 leading-relaxed">
            <p>
              E-Radhuni is a modern Bengali cooking website designed to help
              users learn authentic Bangladeshi dishes in a clean, organized,
              and easy-to-follow way. All recipes, videos, and cooking guides
              are created in-house by professional chefs, so the content stays
              consistent and reliable.
            </p>
            <p>
              The website offers step-by-step recipes, cooking fundamentals,
              kitchen hacks, and premium video lessons that make home cooking
              simple for beginners and efficient for regular cooks.
            </p>
            <p>
              The platform mainly serves Bangladeshi families, students, and
              food lovers who want to improve their cooking skills without
              getting overwhelmed. Basic recipes remain free for everyone, while
              advanced courses and specialized content are part of the{" "}
              <span className="font-semibold text-amber-800">
                E-Radhuni Pro
              </span>{" "}
              plan. Revenue will also come from grocery product sales integrated
              into the site.
            </p>
            <p>
              The mission is to build the most trusted online cooking
              destination for Bengalis — a digital cooking ecosystem that
              teaches the right techniques, saves time, and brings authentic
              Bangladeshi flavors to every home kitchen.
            </p>
          </div>

          {/* Highlights */}
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs md:text-sm text-gray-800 shadow-sm border border-gray-100">
              ✅ Step-by-step video recipes
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs md:text-sm text-gray-800 shadow-sm border border-gray-100">
              ✅ Cooking fundamentals & kitchen hacks
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs md:text-sm text-gray-800 shadow-sm border border-gray-100">
              ✅ E-Radhuni Pro for advanced learners
            </span>
          </div>
        </div>
      </div>

      {/* Simple keyframe (optional, if not in tailwind.config) */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
        `}
      </style>
    </section>
  );
}
