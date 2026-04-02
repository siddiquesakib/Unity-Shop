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
import {
  Github,
  Globe,
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
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─── TEAM CARD ──────────────────────────────────────────── */
function TeamMemberCard({ member }) {
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - r.left - r.width / 2) / (r.width / 2));
    mouseY.set((e.clientY - r.top - r.height / 2) / (r.height / 2));
  };

  return (
    <motion.div variants={itemVariants} style={{ perspective: 1000 }}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
          setHovered(false);
        }}
        className="group relative"
      >
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-black/5">
          <div className="relative z-10 text-center">
            {/* avatar */}
            <div className="mb-5 flex justify-center">
              <div className="relative h-24 w-24 rounded-full p-[1px] bg-gray-200 group-hover:bg-gray-300 transition-colors duration-500 hover:scale-105">
                <div className="relative h-full w-full rounded-full overflow-hidden border-4 border-white">
                  <Image
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-black tracking-tight">
              {member.name}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 mt-1">
              {member.role}
            </p>

            <div className="mb-4 flex items-center justify-center gap-1 text-[11px] text-gray-400">
              <MapPin className="h-3 w-3" />
              <span>{member.location}</span>
            </div>

            <p className="mb-5 text-sm text-gray-500 leading-relaxed line-clamp-2">
              {member.bio}
            </p>

            {/* skills */}
            <div className="mb-6 flex flex-wrap justify-center gap-1.5">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-gray-50 border border-gray-200 px-3 py-1 text-[10px] font-semibold text-gray-500 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* socials */}
            <div className="flex justify-center gap-3">
              {[
                { Icon: Globe, href: member.social.portfolio },
                { Icon: Linkedin, href: member.social.linkedin },
                { Icon: Github, href: member.social.github },
                { Icon: Mail, href: `mailto:${member.social.email}` },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="text-gray-300 hover:text-black transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── DATA ───────────────────────────────────────────────── */
const stats = [
  { value: "50K+", label: "Products", icon: FiPackage },
  { value: "1.2M+", label: "Happy Customers", icon: FiUsers },
  { value: "120+", label: "Countries", icon: FiGlobe },
  { value: "24/7", label: "Support", icon: FiHeadphones },
];

const values = [
  { icon: FiTruck, title: "Fast Delivery", desc: "Free shipping worldwide on orders $50+. Arrives within 3-5 days." },
  { icon: FiShield, title: "Secure Shopping", desc: "Your payment info is protected with end-to-end encryption." },
  { icon: FiHeadphones, title: "Always Here", desc: "Real humans, real support. Reach us anytime via chat or email." },
  {
    icon: FiTruck,
    title: "Fast Delivery",
    desc: "Free shipping worldwide on orders $50+. Arrives within 3–5 days.",
  },
  {
    icon: FiShield,
    title: "Secure Shopping",
    desc: "Your payment info is protected with end-to-end encryption.",
  },
  {
    icon: FiHeadphones,
    title: "Always Here",
    desc: "Real humans, real support. Reach us anytime via chat or email.",
  },
];

const teamMembers = [
  {
    name: "Mohammad Siddique Sakib",
    role: "Team Lead",
    bio: "Leading with vision and passion.",
    image: "https://i.ibb.co.com/fzxZkrsw/Whats-App-Image-2026-04-02-at-2-40-06-PM.jpg",
    location: "Chattagram, Bangladesh",
    skills: ["Strategy", "Leadership"],
    social: {
      portfolio: "https://ssakib-portfolio.vercel.app",
      linkedin: "https://www.linkedin.com/in/mohammad-siddique-sakib",
      github: "https://github.com/siddiquesakib",
      email: "dmsakib1122@gmail.com",
    },
  },
  {
    name: "Abu Abdullah Mohammed Iqram",
    role: "Lead Dev",
    bio: "Building scalable web solutions.",
    image: "https://i.ibb.co.com/7xXp2bV8/dp-3.png",
    location: "Chittagram, Bangladesh",
    skills: ["React", "Node.js"],
    social: {
      portfolio: "https://portfolio-aami.vercel.app",
      linkedin: "https://www.linkedin.com/in/aam-iqram",
      github: "https://github.com/aamiqram",
      email: "aamiqram24@gmail.com ",
    },
  },
  {
    name: "Ahsan Habib",
    role: "Designer",
    bio: "Creating intuitive user interfaces.",
    image: "https://i.ibb.co/mrLxCxv7/ahsan-navy.png",
    location: "Rajshahi, Bangladesh",
    skills: ["Figma", "UI/UX"],
    social: {
      portfolio: "https://ahsan-habib0.netlify.app",
      linkedin: "https://www.linkedin.com/in/ahsan-habib01",
      github: "https://github.com/ahsan-habib01",
      email: "ahsanhabiib00@gmail.com",
    },
  },
  {
    name: "Md Ariful Islam",
    role: "Backend Developer",
    bio: "Ensuring server performance.",
    image:
      "https://i.ibb.co.com/DgTxGcbK/Whats-App-Image-2025-10-16-at-10-38-53-PM.jpg",
    location: "Dhaka, Bangladesh",
    skills: ["API", "MongoDB", "Express", "Node.js"],
    social: {
      portfolio: "https://arifulislam.iam.bd",
      linkedin: "https://www.linkedin.com/in/arifulislam-dev",
      github: "https://github.com/ArifulIslam016",
      email: "arifulq234@gmail.com",
    },
  },
  {
    name: "Rimi Ruma",
    role: "Frontend",
    bio: "Responsive web specialist.",
    image: "https://i.ibb.co/0jYQg1Kp/rimi-ruma.jpg",
    location: "Barishal, Bangladesh",
    skills: ["Tailwind", "Next.js"],
    social: {
      portfolio: "https://my-portfolio-client-omega.vercel.app",
      linkedin: "https://www.linkedin.com/in/rimi-ruma",
      github: "https://github.com/rimiruma",
      email: " rimiruma12@gmail.com",
    },
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-100 selection:text-black relative overflow-hidden">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gray-100 blur-[100px] -z-10" />

      {/* HERO */}
      <section className="relative pt-40 pb-24 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-gray-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
              Our Story
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
            >
              We build tools for the{" "}
              <span className="text-gray-400 italic font-light">
                next generation
              </span>{" "}
              of shopping.
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
            >
              UnityShop connects millions of buyers and sellers worldwide with a
              focus on trust, speed, and simplicity.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-gray-100 bg-white/60 backdrop-blur-3xl relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true }}
                className="flex flex-col items-center justify-center py-12 md:py-16 transition-colors hover:bg-gray-50/50"
              >
                <p className="text-4xl md:text-5xl font-extrabold tracking-tighter text-black">
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mt-3">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-24 px-6 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-8 border-b border-gray-100">
            <div className="max-w-lg mb-6 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-black">
                Why Choose UnityShop
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                We provide the best ecosystem for both buyers and sellers around the world, focusing on what matters most.
              </p>
            </div>
            <div className="hidden md:flex h-12 w-12 rounded-full border border-gray-200 items-center justify-center text-gray-300">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {values.slice(0, 3).map((val, i) => (
              <motion.div 
                key={i} 
                className="p-8 rounded-[2rem] bg-gray-50/50 border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="h-12 w-12 rounded-full bg-white border border-gray-100 text-black flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <val.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">{val.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{val.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-300 group-hover:text-black transition-colors duration-500 cursor-pointer">
                  Learn More <FiArrowRight className="h-4 w-4 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-24 px-6 relative z-10 border-t border-gray-100 bg-gray-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 pb-8 border-b border-gray-200/60">
            <div className="max-w-2xl mb-6 md:mb-0 text-center md:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-black shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <FiUsers className="h-3.5 w-3.5" /> Core Team
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-black">
                Meet the minds behind UnityShop.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                A passionate group of developers, designers, and strategists working together to redefine global commerce through elegant engineering.
              </p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="grid gap-8 sm:grid-cols-3">
              {teamMembers.slice(0, 3).map((member, i) => (
                <TeamMemberCard key={i} member={member} />
              ))}
            </div>
            <div className="grid gap-8 sm:grid-cols-2 sm:max-w-2xl sm:mx-auto">
              {teamMembers.slice(3, 5).map((member, i) => (
                <TeamMemberCard key={i + 3} member={member} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
