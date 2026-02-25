"use client";

import { motion } from "framer-motion";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiHeadphones,
  FiSend,
  FiArrowRight,
  FiMessageCircle,
} from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const contactInfo = [
  {
    icon: FiPhone,
    title: "Phone",
    info: "+880 1234 567 890",
    desc: "Mon-Fri, 9am-6pm",
  },
  {
    icon: FiMail,
    title: "Email",
    info: "support@unityshop.com",
    desc: "We reply within 24 hours",
  },
  {
    icon: FiMapPin,
    title: "Location",
    info: "Dhaka, Bangladesh",
    desc: "Head office",
  },
  {
    icon: FiHeadphones,
    title: "Live Support",
    info: "24/7 Available",
    desc: "Chat with our team",
  },
];

const ContactPage = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        <div className="absolute top-[-10%] left-[30%] w-96 h-96 bg-gray-200/30 rounded-full blur-[100px]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-14 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white text-xs font-bold rounded-full mb-5">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Get in Touch
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-black leading-[1.05] tracking-tight"
          >
            We&apos;d love to
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">hear from you</span>
              <span className="absolute bottom-1.5 left-0 w-full h-3 sm:h-4 bg-gray-300/60 -skew-x-3 rounded-sm" />
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mt-5 max-w-2xl mx-auto text-gray-500 text-base sm:text-lg leading-relaxed"
          >
            Have a question, suggestion, or just want to say hello? Our team is
            always here to help.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Strip */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  custom={i}
                  variants={fadeUp}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 sm:gap-4 py-6"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-black rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black leading-tight">
                      {item.info}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form + Side Info */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-5 gap-10">
            {/* Form — takes 3 cols */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true }}
              className="md:col-span-3"
            >
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Send a Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-black mt-2 mb-8 tracking-tight">
                Drop us a line
              </h2>

              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Tell us more..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold text-white bg-black rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Send Message <FiSend size={14} />
                </button>
              </form>
            </motion.div>

            {/* Right Side — takes 2 cols */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              custom={2}
              variants={fadeUp}
              viewport={{ once: true }}
              className="md:col-span-2 flex flex-col gap-6"
            >
              {/* FAQ */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex-1">
                <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
                  <FiMessageCircle size={16} /> Frequently Asked
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      q: "How long does shipping take?",
                      a: "Most orders arrive within 3-5 business days.",
                    },
                    {
                      q: "What is your return policy?",
                      a: "30-day hassle-free returns on all items.",
                    },
                    {
                      q: "How do I become a seller?",
                      a: "Sign up and request seller access from your dashboard.",
                    },
                  ].map((faq, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-4 border border-gray-100"
                    >
                      <p className="text-xs font-semibold text-black">
                        {faq.q}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgent Help CTA */}
              <div className="bg-black rounded-2xl p-6 text-center">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <FiPhone className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Need urgent help?
                </h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Our support team is available around the clock
                </p>
                <a
                  href="tel:+8801234567890"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Call us now <FiArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
