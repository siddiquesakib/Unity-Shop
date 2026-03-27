"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/contexts/SocketContext";
import { useCart } from "@/contexts/CartContext";
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiTrendingDown,
  FiAlertCircle,
  FiCheck,
  FiLoader,
  FiShoppingCart,
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const DEBUG_NEGOTIATION = process.env.NEXT_PUBLIC_DEBUG_NEGOTIATION === "true";

const statusToChatMessage = {
  accepted: "Seller accepted your offer! You can proceed to checkout.",
  rejected: "Seller declined this offer. You can submit a new offer.",
};

const normalizeObjectId = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (typeof value.$oid === "string") return value.$oid;
    if (typeof value.toString === "function") {
      const stringified = value.toString();
      if (stringified && stringified !== "[object Object]") return stringified;
    }
  }
  return null;
};

const AINegoBot = ({ product, sellerId }) => {
  const { user, token } = useAuth();
  const socket = useSocket();
  const router = useRouter();
  const { addToCart, cartGroups, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [negotiationStatus, setNegotiationStatus] = useState(null);
  const [negotiationData, setNegotiationData] = useState(null);
  const chatEndRef = useRef(null);
  const lastStatusRef = useRef(null);

  const acceptedOfferPrice =
    negotiationStatus === "accepted" &&
    Number.isFinite(Number(negotiationData?.offerPrice))
      ? Number(negotiationData.offerPrice)
      : null;

  const appendStatusMessage = useCallback((status, overrideMessage) => {
    if (!status || status === "pending") return;
    const content = overrideMessage || statusToChatMessage[status];
    if (!content) return;
    setMessages((prev) => {
      const alreadyAdded = prev.some(
        (msg) =>
          msg?.metaType === "negotiation_status" && msg?.status === status,
      );
      if (alreadyAdded) return prev;
      return [
        ...prev,
        {
          role: "assistant",
          content,
          timestamp: new Date(),
          metaType: "negotiation_status",
          status,
        },
      ];
    });
  }, []);

  const fetchNegotiationStatus = useCallback(async () => {
    if (!product?._id || !user?._id || !token) return;

    try {
      const url = `${API_BASE}/api/negotiations/user-product?productId=${product._id}&buyerId=${user._id}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      if (DEBUG_NEGOTIATION) {
        console.log("📡 Fetched negotiation data:", data);
      }
      setNegotiationData(data || null);
      if (!data?.status) return;

      setNegotiationStatus(data.status);

      const latestSystemStatusMessage = [...(data.messages || [])]
        .reverse()
        .find((m) => m?.system && typeof m.message === "string");

      if (data.status !== lastStatusRef.current) {
        appendStatusMessage(data.status, latestSystemStatusMessage?.message);
        lastStatusRef.current = data.status;
      }
    } catch (err) {
      if (DEBUG_NEGOTIATION) {
        console.error("Failed to fetch negotiation status:", err);
      }
    }
  }, [appendStatusMessage, product?._id, user?._id, token]);

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

  // Fetch existing negotiation status when modal opens
  useEffect(() => {
    if (!isOpen) return;
    fetchNegotiationStatus();
  }, [fetchNegotiationStatus, isOpen]);

  // Poll for status only in debug mode.
  useEffect(() => {
    if (!isOpen || !DEBUG_NEGOTIATION) return;
    const interval = setInterval(() => {
      fetchNegotiationStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchNegotiationStatus, isOpen]);

  // Real-time updates
  useEffect(() => {
    if (!socket || !isOpen || !product?._id) return;

    const productId = normalizeObjectId(product._id);

    const handleNegotiationStatusEvent = (payload) => {
      const payloadProductId = normalizeObjectId(payload?.productId);
      if (!payloadProductId || payloadProductId !== productId) return;
      if (!payload?.status) return;
      setNegotiationStatus(payload.status);
      setNegotiationData((prev) => ({
        ...(prev || {}),
        status: payload.status,
        offerPrice: payload.offerPrice ?? prev?.offerPrice,
        updatedAt: payload.updatedAt || new Date().toISOString(),
      }));
      if (payload.status !== lastStatusRef.current) {
        appendStatusMessage(payload.status, payload.message);
        lastStatusRef.current = payload.status;
      }
    };

    const handleNotificationEvent = (notification) => {
      if (!["offer_accepted", "offer_rejected"].includes(notification?.type))
        return;
      const notifProductId = normalizeObjectId(notification?.meta?.productId);
      if (notifProductId && notifProductId !== productId) return;
      const nextStatus =
        notification.type === "offer_accepted" ? "accepted" : "rejected";
      setNegotiationStatus(nextStatus);
      setNegotiationData((prev) => ({ ...(prev || {}), status: nextStatus }));
      if (nextStatus !== lastStatusRef.current) {
        appendStatusMessage(nextStatus, notification.message);
        lastStatusRef.current = nextStatus;
      }
      fetchNegotiationStatus(); // pull latest to get offerPrice
    };

    socket.on("negotiation_status_updated", handleNegotiationStatusEvent);
    socket.on("notification", handleNotificationEvent);

    return () => {
      socket.off("negotiation_status_updated", handleNegotiationStatusEvent);
      socket.off("notification", handleNotificationEvent);
    };
  }, [
    appendStatusMessage,
    fetchNegotiationStatus,
    isOpen,
    product?._id,
    socket,
  ]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

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
      const response = await fetch("/api/ai/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        if (data.offerSent) {
          setNegotiationStatus("pending");
          lastStatusRef.current = "pending";
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

  const handleBuyNow = () => {
    if (!acceptedOfferPrice || !Number.isFinite(acceptedOfferPrice)) return;

    const sellerKey = product.sellerId || product.sellerName || "general";
    const sellerName = product.sellerName || "UnityShop Seller";
    const productId = product._id || product.id;
    const productImage = Array.isArray(product.image)
      ? product.image[0] || ""
      : product.image || "";

    const existingItems = (cartGroups || []).flatMap((group) => group.items);
    existingItems
      .filter((item) => item.productId === productId)
      .filter((item) => Number(item.price) !== Number(acceptedOfferPrice))
      .forEach((item) => removeItem(item.id));

    addToCart(
      {
        ...product,
        image: productImage,
        sellerId: sellerKey,
        sellerName,
      },
      1,
      acceptedOfferPrice,
    );

    setIsOpen(false);
    router.push("/cart");
  };

  if (!user) return null;
  if (user._id === sellerId) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <FiMessageCircle size={18} />
        <span>Negotiate Price</span>
        <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
          AI Powered
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-4 rounded-t-2xl">
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

                {DEBUG_NEGOTIATION && (
                  <button
                    onClick={fetchNegotiationStatus}
                    className="mt-3 text-[10px] text-purple-100 underline hover:text-white"
                    type="button"
                  >
                    Check Status
                  </button>
                )}
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

              {/* Buy Now Button for Accepted Offers */}
              {negotiationStatus === "accepted" && acceptedOfferPrice && (
                <div className="px-5 py-3 border-b border-green-200 bg-green-50/70">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    <FiShoppingCart size={16} />
                    Buy Now at ${acceptedOfferPrice}
                  </button>
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
                        {new Date(msg.timestamp).toLocaleTimeString([], {
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
                    Your offer will be sent to the seller for review.
                    You&apos;ll be notified of their response.
                  </p>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
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
          </div>,
          document.body,
        )}
    </>
  );
};

export default AINegoBot;
