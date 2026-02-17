"use client";

import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="bg-gradient-to-b from-orange-50 via-white to-orange-100 min-h-screen overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative text-center py-10 px-6">

        {/* Floating Background Glow */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>

        <motion.h1
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent"
        >
          Welcome to Unity Shope ✨
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-8 max-w-3xl mx-auto text-gray-600 text-xl"
        >
          Your one-stop destination for quality products, fast delivery,
          and secure shopping experience.
        </motion.p>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10">

        {[
          {
            title: "Lightning Fast Delivery 🚚",
            desc: "Experience super-fast and reliable shipping anywhere.",
          },
          {
            title: "100% Secure Payment 🔐",
            desc: "Advanced encryption ensures safe transactions.",
          },
          {
            title: "24/7 Customer Support 💬",
            desc: "We are always here to help you anytime.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.08 }}
            className="bg-white/60 backdrop-blur-xl border border-orange-200 shadow-2xl rounded-3xl p-10 text-center"
          >
            <h3 className="text-2xl font-bold text-orange-500 mb-4">
              {item.title}
            </h3>
            <p className="text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </section>

    </div>
  );
};

export default AboutPage;
