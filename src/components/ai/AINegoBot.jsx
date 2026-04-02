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
      if (DEBUG_NEGOTIATION) console.log("📡 Fetched negotiation data:", data);
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
      if (DEBUG_NEGOTIATION)
        console.error("Failed to fetch negotiation status:", err);
    }
  }, [appendStatusMessage, product?._id, user?._id, token]);

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

  useEffect(() => {
    if (!isOpen) return;
    fetchNegotiationStatus();
  }, [fetchNegotiationStatus, isOpen]);

  useEffect(() => {
    if (!isOpen || !DEBUG_NEGOTIATION) return;
    const interval = setInterval(() => fetchNegotiationStatus(), 10000);
    return () => clearInterval(interval);
  }, [fetchNegotiationStatus, isOpen]);

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
      fetchNegotiationStatus();
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
        className="group relative flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl border-2 border-black font-black text-[11px] sm:text-xs uppercase tracking-widest hover:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 active:scale-95 overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <FiMessageCircle size={16} strokeWidth={2.5} className="relative z-10 shrink-0" />
        <span className="relative z-10 whitespace-nowrap">Negotiate Price</span>
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
              {/* Header */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black text-white px-6 py-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/10 rounded-lg">
                      <FiMessageCircle size={20} />
                    </div>
                    <h3 className="font-semibold text-lg tracking-tight">
                      Negotiation Assistant
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
                  Powered by Unity-Shop • Real‑time assistance
                </p>
                <div className="mt-3 p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Negotiating for</p>
                      <p className="font-medium truncate max-w-[180px]">
                        {product.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">List Price</p>
                      <p className="font-bold text-lg">${product.price}</p>
                    </div>
                  </div>
                </div>
                {DEBUG_NEGOTIATION && (
                  <button
                    onClick={fetchNegotiationStatus}
                    className="mt-3 text-[10px] text-gray-300 underline hover:text-white"
                  >
                    Check Status
                  </button>
                )}
              </div>

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
                        <FiLoader className="animate-spin" size={16} /> Offer
                        sent to seller • Awaiting response
                      </>
                    )}
                    {negotiationStatus === "accepted" && (
                      <>
                        <FiCheck size={16} /> Seller accepted your offer!
                      </>
                    )}
                    {negotiationStatus === "rejected" && (
                      <>
                        <FiX size={16} /> Seller declined this offer
                      </>
                    )}
                  </div>
                </div>
              )}

              {negotiationStatus === "accepted" && acceptedOfferPrice && (
                <div className="px-5 py-3 border-b border-green-200 bg-green-50/70">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-all shadow-md"
                  >
                    <FiShoppingCart size={16} />
                    Buy Now at ${acceptedOfferPrice}
                  </button>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
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
                      {msg.suggestion && (
                        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                          <div className="flex items-start gap-2">
                            <FiTrendingDown
                              className="text-gray-600 mt-0.5 shrink-0"
                              size={16}
                            />
                            <div>
                              <p className="text-xs font-semibold text-gray-800 mb-1">
                                AI Recommendation
                              </p>
                              <p className="text-xs text-gray-600">
                                {msg.suggestion}
                              </p>
                              {msg.offerPrice && (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-white rounded-full text-xs font-bold">
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
                  <div className="flex justify-start animate-pulse">
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

              <div className="px-5 py-2 bg-gray-100 border-t border-gray-200">
                <div className="flex items-start gap-2">
                  <FiAlertCircle
                    className="text-gray-600 mt-0.5 shrink-0"
                    size={14}
                  />
                  <p className="text-xs text-gray-600">
                    Your offer will be sent to the seller for review. You'll be
                    notified of their response.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-gray-100">
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
                    className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-full text-sm focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="p-3 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition-all duration-200 shadow-md"
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
