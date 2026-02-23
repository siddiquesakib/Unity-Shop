"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FiTruck,
  FiShield,
  FiHeadphones,
  FiUsers,
  FiGlobe,
  FiPackage,
  FiArrowRight,
} from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const stats = [
  { value: "50K+", label: "Products", icon: FiPackage },
  { value: "1.2M+", label: "Happy Customers", icon: FiUsers },
  { value: "120+", label: "Countries", icon: FiGlobe },
  { value: "24/7", label: "Support", icon: FiHeadphones },
];

const values = [
  {
    icon: FiTruck,
    title: "Fast Delivery",
    desc: "Free shipping worldwide on orders $50+. Most orders arrive within 3-5 business days.",
  },
  {
    icon: FiShield,
    title: "Secure Shopping",
    desc: "Your payment info is always protected with end-to-end encryption and buyer protection.",
  },
  {
    icon: FiHeadphones,
    title: "Always Here",
    desc: "Real humans, real support. Reach us anytime via chat, email, or phone.",
  },
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "David Park",
    role: "Head of Product",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Amira Hassan",
    role: "Design Lead",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "James Liu",
    role: "CTO",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero - Clean & Compact */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-orange-50 via-white to-rose-50/30" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full mb-4">
              <FiGlobe size={12} /> Our Story
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
          >
            We make online{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-rose-500">
              shopping simple
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mt-4 max-w-2xl mx-auto text-gray-500 text-sm sm:text-base leading-relaxed"
          >
            UnityShop connects buyers and sellers worldwide with quality
            products, fast delivery, and shopping you can trust.
          </motion.p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial="hidden"
                  whileInView="visible"
                  custom={i}
                  variants={fadeUp}
                  viewport={{ once: true }}
                  className={`flex items-center gap-3 py-6 px-4 ${
                    i < stats.length - 1 ? "md:border-r border-gray-100" : ""
                  } ${i < 2 ? "border-b md:border-b-0 border-gray-100" : ""}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              What we stand for
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Built on trust, speed, and care
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {values.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  custom={i}
                  variants={fadeUp}
                  viewport={{ once: true }}
                  className="group bg-gray-50 hover:bg-white rounded-xl p-5 border border-transparent hover:border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-linear-to-br from-orange-500 to-rose-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 bg-gray-50/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true }}
            >
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
                Our Journey
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                From a small idea to a global marketplace
              </h2>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                Started in 2023, UnityShop was born from a simple idea —
                everyone deserves access to quality products at fair prices, no
                matter where they live.
              </p>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Today, we connect thousands of verified sellers with millions of
                buyers across 120+ countries, building a marketplace rooted in
                trust and community.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                Explore our marketplace <FiArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              custom={2}
              variants={fadeUp}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format"
                  alt="Our team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white rounded-lg shadow-md px-4 py-2.5 border border-gray-100">
                <p className="text-lg font-bold text-gray-900">2023</p>
                <p className="text-[11px] text-gray-400">Founded</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Meet the team
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              People behind UnityShop
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial="hidden"
                whileInView="visible"
                custom={i}
                variants={fadeUp}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-100 mb-3 ring-2 ring-gray-100 group-hover:ring-orange-200 transition-all">
                  <Image
                    src={member.img}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {member.name}
                </p>
                <p className="text-xs text-gray-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gray-900 rounded-2xl px-6 sm:px-10 py-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full -ml-12 -mb-12" />
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Start shopping today
              </h2>
              <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
                Join millions of customers who trust UnityShop for quality
                products and reliable service.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center mt-5">
                <Link
                  href="/register"
                  className="px-6 py-2.5 text-sm font-semibold text-gray-900 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Create Account
                </Link>
                <Link
                  href="/products"
                  className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-white/10 rounded-lg hover:bg-white/15 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
