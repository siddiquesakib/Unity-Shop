"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Twitter,
} from "lucide-react";
import { useState } from "react";

import {
  FiTruck,
  FiShield,
  FiHeadphones,
  FiUsers,
  FiGlobe,
  FiPackage,
  FiArrowRight,
} from "react-icons/fi";

/* ─── VARIANTS ───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── DATA ───────────────────────────────────────────────── */
const stats = [
  { value: "50K+",  label: "Products",        icon: FiPackage    },
  { value: "1.2M+", label: "Happy Customers", icon: FiUsers      },
  { value: "120+",  label: "Countries",       icon: FiGlobe      },
  { value: "24/7",  label: "Support",         icon: FiHeadphones },
];

const values = [
  {
    icon: FiTruck,
    title: "Fast Delivery",
    desc: "Free shipping worldwide on orders $50+. Most orders arrive within 3–5 business days.",
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

const teamMembers = [
  {
    name: "Member Name 1",
    role: "Team Leader / CEO",
    bio: "Leading the team with vision and passion for innovation.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Member1",
    location: "Dhaka, Bangladesh",
    skills: ["Leadership", "Strategy", "Management"],
    social: { twitter: "#", linkedin: "#", github: "#", email: "member1@example.com" },
  },
  {
    name: "Member Name 2",
    role: "Lead Developer",
    bio: "Full-stack expert building scalable and robust solutions.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Member2",
    location: "Chittagong, Bangladesh",
    skills: ["Full Stack", "React", "Node.js"],
    social: { twitter: "#", linkedin: "#", github: "#", email: "member2@example.com" },
  },
  {
    name: "Member Name 3",
    role: "UI/UX Designer",
    bio: "Creating beautiful and intuitive user interfaces.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Member3",
    location: "Sylhet, Bangladesh",
    skills: ["UI Design", "UX Research", "Figma"],
    social: { twitter: "#", linkedin: "#", github: "#", email: "member3@example.com" },
  },
  {
    name: "Member Name 4",
    role: "Backend Engineer",
    bio: "Ensuring server performance and database security.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Member4",
    location: "Khulna, Bangladesh",
    skills: ["Database", "API", "Security"],
    social: { twitter: "#", linkedin: "#", github: "#", email: "member4@example.com" },
  },
  {
    name: "Member Name 5",
    role: "Frontend Developer",
    bio: "Building responsive and interactive web applications.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Member5",
    location: "Rajshahi, Bangladesh",
    skills: ["React", "Next.js", "Tailwind"],
    social: { twitter: "#", linkedin: "#", github: "#", email: "member5@example.com" },
  },
];

/* ─── TEAM CARD ──────────────────────────────────────────── */
function TeamMemberCard({ member }) {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left - r.width / 2) / (r.width / 2));
    mouseY.set((e.clientY - r.top - r.height / 2) / (r.height / 2));
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); setHovered(false); };

  return (
    <motion.div variants={itemVariants} style={{ perspective: 1000 }}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="group"
      >
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:shadow-black/8 group-hover:-translate-y-1">

          {/* subtle hover overlay */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* sparkle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-4 z-10"
          >
            <Sparkles className="h-4 w-4 text-black/20" />
          </motion.div>

          <div className="relative z-10 p-7">
            {/* avatar */}
            <div className="mb-5 flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="h-24 w-24 overflow-hidden rounded-full border border-gray-100 ring-2 ring-gray-100 ring-offset-2 transition-all duration-300 group-hover:ring-gray-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
            </div>

            {/* text */}
            <div className="text-center">
              <h3 className="mb-1 text-[17px] font-semibold tracking-tight text-gray-900">
                {member.name}
              </h3>

              <Badge
                variant="secondary"
                className="mb-2 bg-gray-100 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500"
              >
                {member.role}
              </Badge>

              <div className="mb-3 flex items-center justify-center gap-1 text-xs text-gray-400">
                <MapPin className="h-3 w-3" />
                <span>{member.location}</span>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-gray-500">{member.bio}</p>

              {/* skills */}
              <div className="mb-5 flex flex-wrap justify-center gap-1.5">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-0.5 text-[11px] text-gray-500 transition-colors duration-200 group-hover:border-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* socials */}
              <div className="flex justify-center gap-2">
                {[
                  { Icon: Twitter,  href: member.social.twitter },
                  { Icon: Linkedin, href: member.social.linkedin },
                  { Icon: Github,   href: member.social.github },
                  { Icon: Mail,     href: `mailto:${member.social.email}` },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-400 transition-all duration-200 hover:border-gray-800 hover:bg-black hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── PAGE ───────────────────────────────────────────────── */
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f6f3] text-black">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        {/* dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-500 shadow-sm mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
                Our Story
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-black leading-[1.07] tracking-tight mb-5"
            >
              We make online
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">shopping simple</span>
                <span className="absolute bottom-1.5 left-0 w-full h-3 bg-gray-200/70 -skew-x-2 rounded" />
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto max-w-2xl text-base sm:text-lg text-gray-500 leading-relaxed"
            >
              UnityShop connects buyers and sellers worldwide with quality
              products, fast delivery, and shopping you can trust.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-[#f7f6f3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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
                  className="flex items-center gap-3 sm:gap-4 py-7"
                >
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-black leading-tight">{stat.value}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="mb-10"
          >
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Our Values</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-black mt-2 tracking-tight">What we stand for</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
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
                  className="group p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-black mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#f7f6f3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true }}
            >
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Our Journey</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-black mt-2 tracking-tight">
                From a small idea to a global marketplace
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mt-4 leading-relaxed">
                Started in 2023, UnityShop was born from a simple idea — everyone deserves
                access to quality products at fair prices, no matter where they live.
              </p>
              <p className="text-sm sm:text-base text-gray-500 mt-3 leading-relaxed">
                Today, we connect thousands of verified sellers with millions of buyers
                across 120+ countries, building a marketplace rooted in trust and community.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 mt-7 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Explore Products <FiArrowRight size={14} />
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
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 shadow-xl shadow-black/10">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format"
                  alt="Our team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-black text-white rounded-xl px-5 py-3 shadow-lg">
                <p className="text-xl font-bold">2023</p>
                <p className="text-[11px] text-gray-400">Founded</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <Badge className="gap-2 bg-black text-white mb-5" variant="secondary">
              <Sparkles className="h-3 w-3" />
              Our Dream Team
            </Badge>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-black mb-4">
              Meet the people behind
              <br />
              <span className="text-gray-400">our success</span>
            </h2>

            <p className="mx-auto max-w-xl text-base text-gray-500">
              A diverse team of talented individuals working together to build
              amazing products and deliver exceptional results.
            </p>
          </motion.div>

          {/* 3 + 2 layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-3">
              {teamMembers.slice(0, 3).map((member, i) => (
                <TeamMemberCard key={i} member={member} />
              ))}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 sm:max-w-xl sm:mx-auto">
              {teamMembers.slice(3, 5).map((member, i) => (
                <TeamMemberCard key={i + 3} member={member} />
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col items-center gap-5 rounded-2xl border border-gray-100 bg-white px-10 py-8 shadow-lg shadow-black/5">
              <h3 className="text-2xl font-bold text-black">Join Our Amazing Team</h3>
              <p className="max-w-xs text-sm text-gray-500">
                We&apos;re always looking for talented people to join our mission
              </p>
              <Button
                size="lg"
                className="rounded-xl bg-black px-8 text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                View Open Positions
                <FiArrowRight className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;