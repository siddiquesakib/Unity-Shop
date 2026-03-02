// components/home/Testimonials.jsx
"use client";

import { useState, useEffect } from "react";
import {
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiMessageSquare,
} from "react-icons/fi";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/home/testimonials`,
        );
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-advance
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const visibleCount = 3;
  const getVisible = () => {
    if (testimonials.length === 0) return [];
    const result = [];
    for (let i = 0; i < Math.min(visibleCount, testimonials.length); i++) {
      result.push(testimonials[(current + i) % testimonials.length]);
    }
    return result;
  };

  if (!loading && testimonials.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-[#f7f6f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-block w-8 h-1 rounded-full bg-black" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-600">
              Testimonials
            </span>
            <span className="inline-block w-8 h-1 rounded-full bg-black" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black">
            What Our Customers Say
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real reviews from real shoppers
          </p>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded-full w-24" />
                    <div className="h-2.5 bg-gray-100 rounded-full w-16" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded-full w-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-5/6" />
                  <div className="h-3 bg-gray-50 rounded-full w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getVisible().map((t, i) => (
                <div
                  key={t._id || i}
                  className="relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                >
                  {/* Quote mark */}
                  <FiMessageSquare className="absolute top-4 right-4 w-6 h-6 text-gray-200" />

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <FiStar
                        key={j}
                        className={`w-3.5 h-3.5 ${
                          j < (t.rating || 5)
                            ? "text-black fill-black"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {t.avatar || t.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            {testimonials.length > visibleCount && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() =>
                    setCurrent(
                      (p) =>
                        (p - 1 + testimonials.length) % testimonials.length,
                    )
                  }
                  className="p-1.5 rounded-full border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === current
                        ? "bg-black w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
                <button
                  onClick={() =>
                    setCurrent((p) => (p + 1) % testimonials.length)
                  }
                  className="p-1.5 rounded-full border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-all"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
