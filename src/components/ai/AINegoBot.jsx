// src/components/ai/AINegoBot.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiTrendingDown,
  FiAlertCircle,
  FiCheck,
  FiLoader,
} from "react-icons/fi";

/**
 * AI-Powered Negotiation Bot
 *
 * USAGE:
 * import AINegoBot from "@/components/ai/AINegoBot";
 *
 * <AINegoBot
 *   product={product}        // Product object with price, name, etc.
 *   sellerId={product.seller._id}
 * />
 *
 * FEATURES:
 * - Chat interface for price negotiation
 * - AI suggests reasonable counter-offers
 * - Sends negotiation request to seller
 * - Shows negotiation history
 * - Works standalone without affecting other components
 */

const AINegoBot = ({ product, sellerId }) => {
  const { user, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [negotiationStatus, setNegotiationStatus] = useState(null); // null, 'pending', 'accepted', 'rejected'
  const chatEndRef = useRef(null);

  // Initialize welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hi! I'm your negotiation assistant. The current price for "${product.name}" is $${product.price}. What price would you like to offer?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, product]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle negotiation
  const handleSendMessage = async () => {
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
      // Call AI API to analyze offer
      const response = await fetch("/api/ai/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          productId: product._id,
          productPrice: product.price,
          productName: product.name,
          userMessage: input,
          conversationHistory: messages,
          userId: user._id,
          sellerId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add AI response
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
            suggestion: data.suggestion,
            offerPrice: data.offerPrice,
          },
        ]);

        // Update negotiation status if offer was sent
        if (data.offerSent) {
          setNegotiationStatus("pending");
        }
      } else {
        throw new Error(data.error || "Failed to process");
      }
    } catch (error) {
      console.error("Negotiation error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Don't show for non-logged-in users
  if (!user) return null;

  // Don't show for own products
  if (user._id === sellerId) return null;

  return (
    <>
      {/* Floating Button - Positioned absolutely or can be inline */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <FiMessageCircle size={18} />
        <span>Negotiate Price</span>
        <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
          AI Powered
        </span>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          {/* Modal Container */}
          <div className="relative w-full sm:max-w-md h-[85vh] sm:h-[600px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col animate-slide-up">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-4 rounded-t-3xl sm:rounded-t-2xl">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <FiX size={20} />
              </button>

              <div className="pr-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <h3 className="font-bold text-lg">
                    AI Negotiation Assistant
                  </h3>
                </div>
                <p className="text-xs text-purple-100">
                  Powered by AI • Real-time assistance
                </p>
              </div>

              {/* Product Info Bar */}
              <div className="mt-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-100">Negotiating for</p>
                    <p className="font-semibold truncate max-w-[200px]">
                      {product.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-100">List Price</p>
                    <p className="font-bold text-lg">${product.price}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Banner */}
            {negotiationStatus && (
              <div
                className={`px-5 py-3 text-sm font-medium ${
                  negotiationStatus === "pending"
                    ? "bg-yellow-50 text-yellow-800 border-b border-yellow-200"
                    : negotiationStatus === "accepted"
                      ? "bg-green-50 text-green-800 border-b border-green-200"
                      : "bg-red-50 text-red-800 border-b border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {negotiationStatus === "pending" && (
                    <>
                      <FiLoader className="animate-spin" size={16} />
                      Offer sent to seller • Awaiting response
                    </>
                  )}
                  {negotiationStatus === "accepted" && (
                    <>
                      <FiCheck size={16} />
                      Seller accepted your offer!
                    </>
                  )}
                  {negotiationStatus === "rejected" && (
                    <>
                      <FiX size={16} />
                      Seller declined this offer
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        : msg.isError
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-white shadow-sm border border-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>

                    {/* AI Suggestion Box */}
                    {msg.suggestion && (
                      <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                        <div className="flex items-start gap-2">
                          <FiTrendingDown
                            className="text-purple-600 mt-0.5 shrink-0"
                            size={16}
                          />
                          <div>
                            <p className="text-xs font-semibold text-purple-900 mb-1">
                              AI Recommendation
                            </p>
                            <p className="text-xs text-purple-700">
                              {msg.suggestion}
                            </p>
                            {msg.offerPrice && (
                              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">
                                <span>Suggested Offer:</span>
                                <span>${msg.offerPrice}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-[10px] mt-2 opacity-70">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Info Footer */}
            <div className="px-5 py-2 bg-blue-50 border-t border-blue-100">
              <div className="flex items-start gap-2">
                <FiAlertCircle
                  className="text-blue-600 mt-0.5 shrink-0"
                  size={14}
                />
                <p className="text-xs text-blue-700">
                  Your offer will be sent to the seller for review. You'll be
                  notified of their response.
                </p>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200 rounded-b-3xl sm:rounded-b-2xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your offer or question..."
                  className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  <FiSend size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add required styles inline to avoid conflicts */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AINegoBot;
