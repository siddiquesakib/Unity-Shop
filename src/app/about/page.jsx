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
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-gray-50 ring-2 ring-gray-100 group-hover:ring-black transition-all duration-500">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-black tracking-tight">
              {member.name}
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
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
                  className="rounded-full bg-gray-50 border border-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-500"
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
    image: "https://i.ibb.co/C50XzpB0/sakib.png",
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
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50/50 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-gray-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Our Story
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[0.95]"
            >
              We build tools for the{" "}
              <span className="text-gray-300 italic font-medium">
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
      <section className="border-y border-gray-100 bg-gray-50/30">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true }}
                className="text-center md:text-left"
              >
                <p className="text-3xl font-bold tracking-tighter">
                  {stat.value}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              The people behind the pixels
            </h2>
            <p className="text-gray-500 max-w-md">
              Our team is a small group of thinkers and makers dedicated to
              building the best commerce experience.
            </p>
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
