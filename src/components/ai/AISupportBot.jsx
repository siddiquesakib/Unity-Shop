"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { FiHelpCircle, FiX, FiSend, FiLoader } from "react-icons/fi";

const AISupportBot = ({ order, product }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const chatEndRef = useRef(null);

  // Load initial message when modal opens
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

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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
        if (data.products && data.products.length) {
          setRecommendations(data.products);
        } else {
          setRecommendations([]);
        }
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
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl font-semibold shadow-lg hover:bg-black/80 transition-all"
      >
        <FiHelpCircle size={18} />
        <span>Support</span>
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-blue-600 text-white px-5 py-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiHelpCircle size={20} />
                  <h3 className="font-bold">Shopping Assistant</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-blue-500 rounded-full"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div key={idx}>
                    <div
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : msg.isError
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-white shadow-sm border border-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className="text-[10px] mt-1 opacity-70">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Show product recommendations after the assistant's message */}
                    {msg.role === "assistant" &&
                      idx === messages.length - 1 &&
                      recommendations.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            Recommended for you:
                          </p>
                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {recommendations.map((prod) => (
                              <Link
                                key={prod._id}
                                href={prod.url}
                                className="shrink-0 w-28 bg-white rounded-lg border border-gray-200 p-2 hover:shadow-md transition"
                                onClick={() => setIsOpen(false)}
                              >
                                <div className="relative aspect-square bg-gray-50 rounded mb-2 overflow-hidden">
                                  <Image
                                    src={prod.image || "/placeholder.png"}
                                    alt={prod.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <h4 className="text-xs font-medium truncate">
                                  {prod.name}
                                </h4>
                                <p className="text-xs font-bold">
                                  ${prod.price}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl px-4 py-3">
                      <FiLoader
                        size={18}
                        className="animate-spin text-blue-600"
                      />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
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
                    placeholder="Type your question..."
                    className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
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
