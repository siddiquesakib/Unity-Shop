"use client";

import { motion } from "framer-motion";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiHeadphones,
  FiSend,
  FiArrowUpRight,
  FiMessageCircle,
} from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const ContactPage = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans selection:bg-black selection:text-white">
      
      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                <span className="w-1 h-1 bg-black rounded-full animate-ping" />
                Available 24/7
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-black tracking-tighter leading-[0.9] mb-8">
              Let&apos;s build <br /> 
              <span className="text-gray-300">something </span> 
              <span className="italic font-medium">together.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
              Have a question or just want to say hi? We’re always open to new ideas and opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* CONTACT FORM CARD */}
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              variants={fadeUp}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-black/[0.03] border border-gray-50"
            >
              <h2 className="text-2xl font-bold mb-10 tracking-tight">Send a message</h2>
              
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="group space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none"
                    />
                  </div>
                  <div className="group space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="group space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 group-focus-within:text-black transition-colors">Message</label>
                  <textarea
                    rows="5"
                    placeholder="Tell us about your project..."
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <button className="w-full md:w-auto px-10 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                  Send Inquiry <FiSend className="opacity-50" />
                </button>
              </form>
            </motion.div>

            {/* SIDEBAR INFO */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* CONTACT STRIP */}
              <motion.div 
                initial="hidden" whileInView="visible" variants={fadeUp} custom={1} viewport={{ once: true }}
                className="bg-black rounded-[32px] p-10 text-white relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-8">Contact Details</h3>
                  <div className="space-y-6">
                    {[
                      { icon: FiMail, label: "Email", val: "hi@unityshop.com" },
                      { icon: FiPhone, label: "Phone", val: "+880 1234 567 89" },
                      { icon: FiMapPin, label: "Location", val: "Dhaka, Bangladesh" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 group/item cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover/item:bg-white group-hover/item:text-black transition-all">
                          <item.icon size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{item.label}</p>
                          <p className="text-sm font-medium">{item.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
              </motion.div>

              {/* QUICK FAQ / HELP */}
              <motion.div 
                initial="hidden" whileInView="visible" variants={fadeUp} custom={2} viewport={{ once: true }}
                className="bg-white rounded-[32px] p-8 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Quick Links</h3>
                  <FiMessageCircle className="text-gray-300" />
                </div>
                <div className="space-y-2">
                  {[
                    "Track your order status",
                    "Return & Exchange policy",
                    "Become a verified seller"
                  ].map((link, i) => (
                    <a key={i} href="#" className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                      <span className="text-sm font-medium text-black/70 group-hover:text-black">{link}</span>
                      <FiArrowUpRight className="text-gray-300 group-hover:text-black transition-colors" />
                    </a>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;