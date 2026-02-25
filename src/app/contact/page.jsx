"use client";

import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";

const ContactPage = () => {
  return (
    <div className="bg-gradient-to-b from-orange-50 via-white to-orange-100 min-h-screen overflow-hidden">

      {/* ========== HERO SECTION ========== */}
      <section className="text-center py-24 px-6 relative">

        {/* Glow Effect */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>

        <motion.h1
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent"
        >
          Contact Unity Shope ✨
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-6 max-w-2xl mx-auto text-gray-600 text-lg"
        >
          We would love to hear from you. Reach out to us anytime!
        </motion.p>
      </section>

      {/* ========== CONTACT SECTION ========== */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">

        {/* Contact Info Cards */}
        <div className="space-y-8">

          {[
            {
              icon: <FaPhoneAlt />,
              title: "Phone",
              info: "+880 1234 567 890",
            },
            {
              icon: <FaEnvelope />,
              title: "Email",
              info: "support@unityshope.com",
            },
            {
              icon: <FaMapMarkerAlt />,
              title: "Location",
              info: "Dhaka, Bangladesh",
            },
            {
              icon: <MdSupportAgent />,
              title: "Customer Support",
              info: "24/7 Available",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/70 backdrop-blur-xl border border-orange-200 shadow-2xl rounded-3xl p-6 flex items-center gap-6"
            >
              <div className="text-3xl text-orange-500 bg-orange-100 p-4 rounded-full">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-600">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.info}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl border border-orange-200 shadow-2xl rounded-3xl p-10"
        >
          <h2 className="text-3xl font-bold text-orange-600 mb-8">
            Send Us a Message 💌
          </h2>

          <form className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full p-4 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition duration-300 shadow-lg"
            >
              Send Message 🚀
            </button>
          </form>
        </motion.div>

      </section>

    </div>
  );
};

export default ContactPage;
