"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import {
  FiHelpCircle,
  FiX,
  FiSend,
  FiLoader,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

const AISupportBot = ({ order, product }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const chatEndRef = useRef(null);

  // Load initial message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      let intro = "Hello! I'm your UnityShop shopping assistant. ";
      if (order) {
        intro += `I see you have an order (ID: ${order._id}). How can I help you with it?`;
      } else if (product) {
        intro += `How can I assist you regarding ${product.name}?`;
      } else {
        intro += "How can I help you today?";
      }
      setMessages([
        {
          role: "assistant",
          content: intro,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, order, product]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          orderId: order?._id,
          productId: product?._id,
          userId: user?._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
          },
        ]);
        setRecommendations(data.products || []);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Support error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble right now. Please try again later.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-black text-white rounded-xl border-2 border-black font-black text-[11px] sm:text-xs uppercase tracking-widest hover:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <FiHelpCircle size={16} strokeWidth={2.5} className="relative z-10 shrink-0" />
        <span className="relative z-10 whitespace-nowrap">Support</span>
        <span className="relative z-10 ml-0.5 text-[9px] font-black bg-white/20 px-1.5 py-0.5 rounded-md">
          AI
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header – Premium with subtle gradient */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black text-white px-6 py-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                      <FiHelpCircle size={20} />
                    </div>
                    <h3 className="font-semibold text-lg tracking-tight">
                      Shopping Assistant
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <p className="text-xs text-gray-300 mt-1 relative z-10">
                  Powered by AI • Instant answers
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300">
                {messages.map((msg, idx) => (
                  <div key={idx}>
                    <div
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-message-in`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                          msg.role === "user"
                            ? "bg-black text-white rounded-br-none"
                            : msg.isError
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className="text-[10px] mt-1 opacity-60">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {msg.role === "assistant" &&
                      idx === messages.length - 1 &&
                      recommendations.length > 0 && (
                        <div className="mt-4 animate-fade-in">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Recommended for you
                          </p>
                          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                            {recommendations.map((prod) => (
                              <Link
                                key={prod._id}
                                href={prod.url}
                                className="shrink-0 w-28 group bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
                                onClick={() => setIsOpen(false)}
                              >
                                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                  <Image
                                    src={prod.image || "/placeholder.png"}
                                    alt={prod.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="p-2">
                                  <h4 className="text-xs font-medium truncate">
                                    {prod.name}
                                  </h4>
                                  <p className="text-xs font-bold mt-0.5">
                                    ${prod.price}
                                  </p>
                                  {!prod.inStock && (
                                    <span className="text-[10px] text-red-500 mt-1 block">
                                      Out of stock
                                    </span>
                                  )}
                                  {prod.inStock && prod.stock < 5 && (
                                    <span className="text-[10px] text-amber-600 mt-1 block">
                                      Only {prod.stock} left
                                    </span>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl px-4 py-3">
                      <FiLoader size={18} className="animate-spin text-black" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything about products, orders, or policies..."
                    className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-full text-sm focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="p-3 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <FiSend size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default AISupportBot;
