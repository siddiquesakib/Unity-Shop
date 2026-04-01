"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiShoppingCart,
  FiHeart,
  FiMinus,
  FiPlus,
  FiStar,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiChevronRight,
  FiShare2,
  FiCheck,
  FiLock,
  FiPlay,
  FiUser,
  FiClock,
  FiThumbsUp,
  FiThumbsDown,
  FiCheckCircle,
  FiPackage,
  FiAward,
  FiZap,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiImage,
  FiX,
  FiMessageCircle,
  FiSend,
  FiMoreHorizontal,
  FiCornerDownRight,
} from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import AINegoBot from "@/components/ai/AINegoBot";
import AISupportBot from "@/components/ai/AISupportBot";
import GroupBuyUI from "@/components/product/GroupBuyUI";
import PostaBId from "../bidrelatedComponents/postForBid";
import ProductLiveStats from "./ProductLiveStats";
import DOMPurify from "dompurify";

/* ──────────────────── Helpers ──────────────────── */
const PLACEHOLDER = "https://via.placeholder.com/800x800?text=Product+Image";
const safeUrl = (u) => {
  if (!u || !u.trim?.()) return PLACEHOLDER;
  try {
    if (u.startsWith("/") || u.startsWith("data:")) return u;
    new URL(u);
    return u;
  } catch {
    return PLACEHOLDER;
  }
};
const getProductImages = (p) => {
  const multi = Array.isArray(p?.images) ? p.images : [];
  const legacy = Array.isArray(p?.image)
    ? p.image
    : typeof p?.image === "string"
      ? [p.image]
      : [];

  const merged = [...multi, ...legacy].filter(
    (img) => typeof img === "string" && img.trim(),
  );
  const unique = [...new Set(merged)];

  return unique.length ? unique : [PLACEHOLDER];
};
const gallery = (p) => {
  return getProductImages(p);
};

/* ── Time-ago formatter ── */
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};
const verdict = (r) =>
  r >= 4.5
    ? "Excellent"
    : r >= 4
      ? "Very Good"
      : r >= 3.5
        ? "Good"
        : r >= 3
          ? "Average"
          : r >= 2
            ? "Below Avg"
            : "Poor";
const verdictColor = (r) =>
  r >= 4
    ? "bg-green-100 text-green-700"
    : r >= 3
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

/* Recently viewed — localStorage */
const RV_KEY = "unityshop_rv";
const saveRV = (p) => {
  if (typeof window === "undefined") return;
  try {
    const list = JSON.parse(localStorage.getItem(RV_KEY) || "[]").filter(
      (i) => i._id !== (p._id || p.id),
    );
    list.unshift({
      _id: p._id || p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: getProductImages(p)[0],
      rating: p.rating,
    });
    localStorage.setItem(RV_KEY, JSON.stringify(list.slice(0, 10)));
  } catch {}
};
const getRV = (id) => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RV_KEY) || "[]").filter(
      (i) => i._id !== id,
    );
  } catch {
    return [];
  }
};

/* ──────────── Image compression helper ──────────── */
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const compressImage = (file) =>
  new Promise((resolve) => {
    if (file.size <= MAX_FILE_SIZE) return resolve(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);

        let lo = 0.1,
          hi = 0.92,
          bestBlob = null;
        const tryQuality = (q) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              if (blob.size <= MAX_FILE_SIZE) bestBlob = blob;
              if (hi - lo < 0.05 || blob.size <= MAX_FILE_SIZE) {
                const final = bestBlob || blob;
                resolve(new File([final], file.name, { type: "image/jpeg" }));
              } else {
                if (blob.size > MAX_FILE_SIZE) hi = q;
                else lo = q;
                tryQuality((lo + hi) / 2);
              }
            },
            "image/jpeg",
            q,
          );
        };
        tryQuality(0.7);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

/* Star component */
const Stars = ({ value = 0, size = 14, interactive = false, onChange }) => (
  <div className="flex gap-px">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onChange?.(s)}
        className={
          interactive
            ? "cursor-pointer hover:scale-110 transition-transform"
            : "cursor-default"
        }
      >
        <FiStar
          size={size}
          className={
            s <= Math.round(value)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200"
          }
        />
      </button>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                       */
/* ══════════════════════════════════════════════════════ */
export default function ProductDetailClient({ product, relatedProducts = [] }) {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const { addToCart, startDirectCheckout } = useCart();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const videoRef = useRef(null);

  /* ── Local state ─────────────────────────────────── */
  const [selImg, setSelImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [wish, setWish] = useState(false);
  const [imgErr, setImgErr] = useState({});
  const [cartOk, setCartOk] = useState(false);
  const [tab, setTab] = useState(product.description ? "desc" : "reviews");
  const [selColor, setSelColor] = useState(null);
  const [selSize, setSelSize] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [rv, setRv] = useState([]);

  /* ── Review state ────────────────────────────────── */
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewMeta, setReviewMeta] = useState({
    totalCount: 0,
    totalPages: 1,
    hasMore: false,
  });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewPreviews, setReviewPreviews] = useState([]);
  const [keepImages, setKeepImages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [reviewSort, setReviewSort] = useState("newest");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [lightbox, setLightbox] = useState({
    open: false,
    images: [],
    index: 0,
  });
  const imgInputRef = useRef(null);

  const openLightbox = (images, index = 0) =>
    setLightbox({ open: true, images, index });
  const closeLightbox = () =>
    setLightbox({ open: false, images: [], index: 0 });
  const lbPrev = () =>
    setLightbox((p) => ({
      ...p,
      index: (p.index - 1 + p.images.length) % p.images.length,
    }));
  const lbNext = () =>
    setLightbox((p) => ({ ...p, index: (p.index + 1) % p.images.length }));

  /* ── Derived ─────────────────────────────────────── */
  const imgs = gallery(product);
  const pid = product._id || product.id;
  const rating = product.rating || 0;
  const reviewCount = product.reviews || 0;
  const disc =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;
  const savings = disc ? product.originalPrice - product.price : 0;
  const colors = Array.isArray(product.colors)
    ? product.colors
    : product.color
      ? [product.color]
      : [];
  const sizes = Array.isArray(product.sizes)
    ? product.sizes
    : product.size
      ? [product.size]
      : [];
  const vendor = {
    name: product.sellerName || "UnityShop Seller",
    email: product.sellerEmail || "",
    verified: true,
    trust: 92,
    response: "< 2h",
    fulfillment: "97%",
    since: "2023",
    products: 156,
  };
  const fbt = relatedProducts.slice(0, 3);
  const emi = [3, 6, 12];
  const imgSrc = (i) => (imgErr[i] ? PLACEHOLDER : safeUrl(imgs[i]));

  /* ── "Who is this for" ──────────────────────────── */
  const whoFor = (() => {
    const c = (product.category || "").toLowerCase();
    if (c.includes("electr") || c.includes("tech"))
      return ["Tech enthusiasts", "Working professionals", "Gift buyers"];
    if (c.includes("fashion") || c.includes("cloth"))
      return [
        "Fashion-forward shoppers",
        "Everyday wardrobe builders",
        "Style-conscious gifters",
      ];
    if (c.includes("home") || c.includes("furni") || c.includes("living"))
      return ["Home upgraders", "Interior design lovers", "New homeowners"];
    if (c.includes("beauty") || c.includes("health"))
      return [
        "Self-care enthusiasts",
        "Daily routine upgraders",
        "Special occasion gifters",
      ];
    return ["Quality seekers", "Smart shoppers", "Gift buyers"];
  })();

  /* ── Effects ─────────────────────────────────────── */
  useEffect(() => {
    saveRV(product);
    setRv(getRV(pid));
  }, [pid]);

  useEffect(() => {
    if (colors.length && !selColor) setSelColor(colors[0]);
    if (sizes.length && !selSize) setSelSize(sizes[0]);
  }, [product]);

  /* ── Fetch reviews (paginated) ───────────────────── */
  const fetchReviews = useCallback(
    async (page = 1) => {
      setReviewLoading(true);
      try {
        const res = await fetch(`${API}/reviews/${pid}?page=${page}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setReviews((prev) =>
            page === 1 ? data.reviews : [...prev, ...data.reviews],
          );
          setReviewMeta(data.pagination);
          setReviewPage(page);
          if (user?._id) {
            const mine = data.reviews.find((r) => r.userId === user._id);
            if (mine) setUserReview(mine);
          }
        }
      } catch {
      } finally {
        setReviewLoading(false);
      }
    },
    [API, pid, user],
  );

  useEffect(() => {
    fetchReviews(1);
    if (user?._id) {
      fetch(`${API}/reviews/${pid}?page=1&limit=100`)
        .then((r) => r.json())
        .then((d) => {
          const mine = d.reviews?.find((r) => r.userId === user._id);
          if (mine) {
            setUserReview(mine);
            setMyRating(mine.rating);
            setMyComment(mine.comment);
          }
        })
        .catch(() => {});
    }
  }, [pid, user]);

  /* ── Handlers ────────────────────────────────────── */
  const qtyChange = (d) => {
    const n = qty + d;
    if (n >= 1 && n <= (product.stock || 999)) setQty(n);
  };
  const addCart = () => {
    addToCart(
      { ...product, selectedColor: selColor, selectedSize: selSize },
      qty,
    );
    setCartOk(true);
    setTimeout(() => setCartOk(false), 2000);
  };
  const buyNow = () => {
    startDirectCheckout(
      { ...product, selectedColor: selColor, selectedSize: selSize },
      qty,
    );
    router.push("/checkout");
  };

  /* ── Image picker handler ─────────────────────── */
  const handleImagePick = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const totalAllowed = 5 - keepImages.length - reviewImages.length;
    if (totalAllowed <= 0) return alert("Maximum 5 images allowed");
    const picked = files.slice(0, totalAllowed);
    const compressed = await Promise.all(picked.map(compressImage));
    const previews = await Promise.all(
      compressed.map((f) => {
        return new Promise((res) => {
          const r = new FileReader();
          r.onload = (e) => res(e.target.result);
          r.readAsDataURL(f);
        });
      }),
    );
    setReviewImages((prev) => [...prev, ...compressed]);
    setReviewPreviews((prev) => [...prev, ...previews]);
    e.target.value = "";
  };
  const removeNewImage = (idx) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== idx));
    setReviewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };
  const removeKeptImage = (url) =>
    setKeepImages((prev) => prev.filter((u) => u !== url));

  const resetReviewForm = () => {
    setMyRating(0);
    setMyComment("");
    setReviewImages([]);
    setReviewPreviews([]);
    setKeepImages([]);
    setEditingId(null);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return router.push("/login");
    if (!myRating) return;
    setSubmitting(true);
    try {
      const isEdit = !!editingId;
      const url = isEdit ? `${API}/reviews/${editingId}` : `${API}/reviews`;
      const method = isEdit ? "PUT" : "POST";

      const fd = new FormData();
      if (!isEdit) {
        fd.append("productId", pid);
        fd.append("userName", user.name || "");
        fd.append("userEmail", user.email || "");
        fd.append("userImage", user.image || "");
      }
      fd.append("userId", user._id);
      fd.append("rating", myRating);
      fd.append("comment", myComment);
      if (isEdit) fd.append("keepImages", JSON.stringify(keepImages));
      reviewImages.forEach((f) => fd.append("images", f));

      const res = await fetch(url, { method, body: fd });
      if (res.ok) {
        resetReviewForm();
        await fetchReviews(1);
        const d = await (
          await fetch(`${API}/reviews/${pid}?page=1&limit=100`)
        ).json();
        const mine = d.reviews?.find((r) => r.userId === user._id);
        setUserReview(mine || null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to submit review");
      }
    } catch {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm("Delete your review?")) return;
    try {
      const res = await fetch(`${API}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      if (res.ok) {
        setUserReview(null);
        resetReviewForm();
        await fetchReviews(1);
      }
    } catch {}
  };

  const startEdit = (r) => {
    setEditingId(r._id);
    setMyRating(r.rating);
    setMyComment(r.comment);
    setKeepImages(r.images || []);
    setReviewImages([]);
    setReviewPreviews([]);
    setTab("reviews");
  };

  /* ── Like a review ── */
  const toggleLike = async (reviewId) => {
    if (!user) return router.push("/login");
    try {
      const res = await fetch(`${API}/reviews/${reviewId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      if (res.ok) {
        const data = await res.json();
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId
              ? {
                  ...r,
                  likes: data.liked
                    ? [...(r.likes || []), user._id]
                    : (r.likes || []).filter((id) => id !== user._id),
                }
              : r,
          ),
        );
      }
    } catch {}
  };

  /* ── Reply to a review ── */
  const submitReply = async (reviewId) => {
    if (!user) return router.push("/login");
    if (!replyText.trim()) return;
    setReplySubmitting(true);
    try {
      const res = await fetch(`${API}/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          userName: user.name || "Anonymous",
          userImage: user.image || "",
          comment: replyText.trim(),
        }),
      });
      if (res.ok) {
        const reply = await res.json();
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId
              ? { ...r, replies: [...(r.replies || []), reply] }
              : r,
          ),
        );
        setReplyText("");
        setReplyingTo(null);
        setExpandedReplies((p) => ({ ...p, [reviewId]: true }));
      }
    } catch {}
    setReplySubmitting(false);
  };

  /* ── Sorted reviews ── */
  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === "top")
      return (b.likes || []).length - (a.likes || []).length;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  /* ═══════════ RENDER ═══════════ */
  return (
    <div className="space-y-6">
      {/* Breadcrumb & Live Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400 overflow-x-auto no-scrollbar max-w-full">
          <Link href="/" className="hover:text-black whitespace-nowrap shrink-0">
            Home
          </Link>
          <FiChevronRight size={12} className="shrink-0" />
          <Link href="/products" className="hover:text-black whitespace-nowrap shrink-0">
            Products
          </Link>
          {product.category && (
            <>
              <FiChevronRight size={12} className="shrink-0" />
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="hover:text-black whitespace-nowrap shrink-0 max-w-[100px] truncate"
              >
                {product.category}
              </Link>
            </>
          )}
          <FiChevronRight size={12} className="shrink-0" />
          <span className="text-black whitespace-nowrap truncate max-w-[120px] sm:max-w-[200px]">
            {product.name}
          </span>
        </nav>
        <div className="shrink-0">
          <ProductLiveStats
            productId={product._id}
            initialViews={product.views ?? 0}
          />
        </div>
      </div>

      {/* ══════ MAIN 2-COL ══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* LEFT — Gallery */}
        <div className="space-y-2">
          <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden group">
            <div className="relative aspect-square">
              {showVideo && product.video ? (
                <video
                  ref={videoRef}
                  src={product.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-contain p-3 cursor-pointer"
                  onClick={() => setShowVideo(false)}
                />
              ) : (
                <Image
                  src={imgSrc(selImg)}
                  alt={product.name}
                  fill
                  unoptimized={true}
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                  sizes="(max-width:768px) 100vw, 50vw"
                  onError={() => setImgErr((p) => ({ ...p, [selImg]: true }))}
                  priority
                  onClick={() => openLightbox(imgs, selImg)}
                />
              )}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {disc && (
                  <span className="px-2 py-1 bg-red-600 text-white text-[16px] sm:text-xs font-bold rounded">
                    -{disc}%
                  </span>
                )}
                {product.badge && (
                  <span className="px-2 py-1 bg-white text-black text-[16px] sm:text-xs font-bold rounded border border-gray-200">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                <button
                  onClick={() => setWish(!wish)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${wish ? "bg-red-500 text-white" : "bg-white/90 text-gray-500 border border-gray-200 hover:bg-red-500 hover:text-white"}`}
                >
                  <FiHeart size={14} className={wish ? "fill-current" : ""} />
                </button>
                <button
                  onClick={() =>
                    navigator.clipboard?.writeText(window.location.href)
                  }
                  className="w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-all"
                >
                  <FiShare2 size={14} />
                </button>
              </div>
              {product.video && !showVideo && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute bottom-3 right-3 z-10 bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black"
                >
                  <FiPlay size={16} className="ml-0.5" />
                </button>
              )}
            </div>
          </div>
          {/* Thumbs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x my-1">
            {imgs.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelImg(i);
                  setShowVideo(false);
                }}
                className={`snap-start shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl border-2 bg-white overflow-hidden transition-all duration-300 ${selImg === i && !showVideo ? "border-black scale-[1.02]" : "border-gray-100 hover:border-gray-300 hover:scale-100"}`}
              >
                <Image
                  src={safeUrl(img)}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized={true}
                  className="object-contain w-full h-full p-1"
                  onError={() => setImgErr((p) => ({ ...p, [i]: true }))}
                />
              </button>
            ))}
            {product.video && (
              <button
                onClick={() => setShowVideo(true)}
                className={`snap-start shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl border-2 bg-black flex items-center justify-center transition-all ${showVideo ? "border-black scale-[1.02]" : "border-transparent opacity-80 hover:opacity-100"}`}
              >
                <FiPlay size={18} className="text-white" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — Info */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
          {/* Cat + Brand */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400">
            {product.category && (
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="hover:text-black"
              >
                {product.category}
              </Link>
            )}
            {product.category && product.brand && (
              <span className="w-1 h-1 rounded-full bg-gray-300" />
            )}
            {product.brand && <span>{product.brand}</span>}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-black leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 flex-wrap">
            <Stars value={rating} size={14} />
            <span className="text-xs sm:text-sm font-black text-black">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-400">
              ({reviewCount})
            </span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${verdictColor(rating)}`}
            >
              {verdict(rating)}
            </span>
          </div>

          {/* Price */}
          <div className="py-4 border-y-2 border-gray-100 space-y-1.5 flex flex-col items-start">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-black">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm font-bold text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {disc && (
                <span className="px-2 py-1 bg-rose-50 text-rose-600 text-[10px] uppercase font-black tracking-widest rounded-md">
                  SAVE {disc}%
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide">
                You save {formatPrice(savings)}
              </p>
            )}
            {product.price >= 50 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {emi.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-1 rounded-md font-black"
                  >
                    {formatPrice(+(product.price / m).toFixed(2))}/mo × {m}
                  </span>
                ))}
              </div>
            )}
          </div>

          {product.category?.toLowerCase() !== "auction" && (
            <GroupBuyUI productId={pid} user={user} formatPrice={formatPrice} />
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                Color:{" "}
                <span className="text-black uppercase">{selColor}</span>
              </span>
              <div className="flex gap-2 flex-wrap">
                {colors.map((c) => {
                  const map = {
                    black: "#000",
                    white: "#fff",
                    red: "#ef4444",
                    blue: "#3b82f6",
                    green: "#22c55e",
                    yellow: "#eab308",
                    pink: "#ec4899",
                    purple: "#a855f7",
                    orange: "#f97316",
                    gray: "#6b7280",
                    brown: "#92400e",
                    navy: "#1e3a5f",
                    beige: "#d4b896",
                  };
                  return (
                    <button
                      key={c}
                      onClick={() => setSelColor(c)}
                      title={c}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selColor === c ? "border-black ring-2 ring-black ring-offset-2 scale-110" : "border-gray-200 hover:border-gray-400"}`}
                      style={{ backgroundColor: map[c.toLowerCase()] || c }}
                    >
                      {selColor === c && (
                        <FiCheck
                          size={14}
                          strokeWidth={3}
                          className={
                            ["white", "yellow", "beige"].includes(
                              c.toLowerCase(),
                            )
                              ? "text-black"
                              : "text-white"
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                Size: <span className="text-black uppercase">{selSize}</span>
              </span>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelSize(s)}
                    className={`min-w-[3rem] px-3 h-9 rounded-lg border-2 text-xs font-black uppercase transition-all ${selSize === s ? "border-black bg-black text-white" : "border-gray-200 text-gray-700 hover:border-black"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          {product.stock !== undefined && (
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500 animate-pulse" : "bg-gray-300"}`}
              />
              <span className="text-xs font-black text-gray-600 uppercase tracking-wider">
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                    ? `Only ${product.stock} left`
                    : "Out of Stock"}
              </span>
            </div>
          )}

          {/* Qty */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white h-12">
              <button
                onClick={() => qtyChange(-1)}
                disabled={qty <= 1}
                className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-white transition-colors disabled:opacity-30"
              >
                <FiMinus size={14} strokeWidth={3} />
              </button>
              <input
                type="number"
                value={qty}
                onChange={(e) =>
                  setQty(
                    Math.max(
                      1,
                      Math.min(product.stock || 999, +e.target.value),
                    ),
                  )
                }
                className="w-14 text-center text-sm font-black bg-transparent h-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => qtyChange(1)}
                disabled={qty >= (product.stock || 999)}
                className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-white transition-colors disabled:opacity-30"
              >
                <FiPlus size={14} strokeWidth={3} />
              </button>
            </div>
            <span className="text-2xl font-black text-black tracking-tight">
              {formatPrice(product.price * qty)}
            </span>
          </div>

          {/* Buttons */}
          <div className="pt-4">
            {product.category?.toLowerCase() === "auction" ? (
              <PostaBId product={product} />
            ) : (
              <div className="flex flex-row gap-2">
                  <button
                    onClick={addCart}
                    disabled={product.stock === 0 || cartOk}
                    className="flex-1 h-12 bg-white border-2 border-black text-black font-bold text-[10px] sm:text-[12px] uppercase tracking-widest rounded-lg hover:bg-black hover:text-white active:scale-95 transition-colors duration-300 flex items-center justify-center gap-1.5 sm:gap-2 px-1 sm:px-0 disabled:opacity-40 group"
                  >
                    {cartOk ? <FiCheck strokeWidth={3} size={15} className="sm:w-[18px] sm:h-[18px]" /> : <FiShoppingCart strokeWidth={3} size={15} className="sm:w-[18px] sm:h-[18px]" />}
                    <span className="whitespace-nowrap group-hover:text-white transition-colors">{cartOk ? "Added" : "Add to Cart"}</span>
                  </button>
                  <button
                    onClick={buyNow}
                    disabled={product.stock === 0}
                    className="flex-1 h-12 bg-black border-2 border-black text-white font-bold text-[10px] sm:text-[12px] uppercase tracking-widest rounded-lg hover:bg-transparent hover:text-black active:scale-95 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 px-1 sm:px-0 disabled:opacity-40 group"
                  >
                    <FiZap size={15} strokeWidth={3} className="sm:w-[18px] sm:h-[18px] group-hover:text-black transition-colors" /> 
                    <span className="whitespace-nowrap group-hover:text-black transition-colors">Buy Now</span>
                  </button>
                <button
                  onClick={() => setWish(!wish)}
                  className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center shrink-0 transition-colors ${wish ? "bg-rose-50 border-rose-500 text-rose-500" : "bg-white border-black text-black hover:bg-black hover:text-white group"}`}
                >
                  <FiHeart size={16} strokeWidth={wish ? 0 : 2.5} className={wish ? "fill-current" : "sm:w-[18px] sm:h-[18px]"} />
                </button>
              </div>
            )}
          </div>

          {/* AI Bots (only for logged-in buyers who are not the seller) */}
          {user && user._id !== product.seller?._id && (
            <div className="flex flex-row flex-wrap justify-between sm:justify-center gap-2 sm:gap-3 pt-3">
              <AINegoBot product={product} sellerId={product.seller?._id} />
              <AISupportBot product={product} />
            </div>
          )}

          {/* Trust */}
          <div className="grid grid-cols-4 gap-2 pt-6 border-t-2 border-gray-100 mt-6">
            {[
              { icon: FiTruck, label: "Free Ship", color: "text-black" },
              {
                icon: FiRefreshCw,
                label: "30d Return",
                color: "text-black",
              },
              { icon: FiShield, label: "Guarantee", color: "text-black" },
              { icon: FiLock, label: "Secure", color: "text-black" },
            ].map(({ icon: I, label, color }) => (
              <div key={label} className="text-center py-3 flex flex-col items-center gap-1.5 border-2 border-gray-100 rounded-xl hover:border-black transition-colors group">
                <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors ${color}`}>
                  <I size={18} strokeWidth={2.5} />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Seller */}
          {product.sellerName && (
            <div className="flex items-center gap-4 pt-6 mt-2">
              <div className="w-12 h-12 rounded-xl bg-black border-2 border-black flex items-center justify-center text-white text-lg font-black shrink-0">
                {product.sellerName[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-black truncate tracking-wide">
                    {product.sellerName}
                  </span>
                  <FiCheckCircle size={14} className="text-black shrink-0" strokeWidth={3} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-0.5 block">
                  Verified Seller
                </span>
              </div>
              <Link
                href={`/products?seller=${encodeURIComponent(product.sellerEmail || "")}`}
                className="px-4 py-2 border-2 border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-wide text-black hover:border-black hover:bg-black hover:text-white transition-all whitespace-nowrap"
              >
                Store →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ══════ WHO IS THIS FOR ══════ */}
      <div className="bg-white rounded-xl border-2 border-gray-100 p-5 mt-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-black mb-4 flex items-center gap-2">
          <FiUser size={14} strokeWidth={3} /> Who is this for?
        </h2>
        <div className="flex flex-wrap gap-2">
          {whoFor.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border-2 border-transparent hover:border-black transition-colors"
            >
              <span className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-black shrink-0">
                {i + 1}
              </span>
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════ TABS ══════ */}
      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden mt-6">
        <div className="flex border-b-2 border-gray-100 overflow-x-auto no-scrollbar">
          {[
            ...(product.description
              ? [{ id: "desc", label: "Description" }]
              : []),
            { id: "vendor", label: "Vendor" },
            { id: "shipping", label: "Shipping" },
            {
              id: "reviews",
              label: `Reviews (${reviewMeta.totalCount || reviewCount})`,
            },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-4 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider relative whitespace-nowrap shrink-0 transition-colors ${tab === t.id ? "text-black bg-gray-50" : "text-gray-400 hover:text-black hover:bg-gray-50"}`}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-8 bg-gray-50">
          {/* ── REVIEWS TAB ──────── */}
          {tab === "reviews" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  Comments
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  {["newest", "top"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setReviewSort(s)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${reviewSort === s ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-700"}`}
                    >
                      {s === "newest" ? "Newest" : "Top"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment input box */}
              {(!userReview || editingId) && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    {user ? (
                      user.image ? (
                        <Image
                          src={safeUrl(user.image)}
                          alt=""
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shrink-0">
                          {(user.name || "U")[0].toUpperCase()}
                        </div>
                      )
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                        <FiUser size={16} className="text-gray-400" />
                      </div>
                    )}

                    <div className="flex-1">
                      {!user ? (
                        <p className="text-sm text-gray-500 py-2">
                          Please{" "}
                          <Link
                            href="/login"
                            className="text-black underline font-bold"
                          >
                            sign in
                          </Link>{" "}
                          to write a review.
                        </p>
                      ) : (
                        <form onSubmit={submitReview}>
                          <textarea
                            value={myComment}
                            onChange={(e) => setMyComment(e.target.value)}
                            placeholder="What are your thoughts?"
                            rows={2}
                            className="w-full text-sm bg-transparent border-none outline-none resize-none placeholder:text-gray-400 text-gray-800"
                          />

                          <div className="flex items-center gap-2 mt-1 mb-2">
                            <span className="text-xs text-gray-400">
                              Rating:
                            </span>
                            <Stars
                              value={myRating}
                              size={16}
                              interactive
                              onChange={setMyRating}
                            />
                            {myRating > 0 && (
                              <span className="text-xs font-bold text-gray-500">
                                {myRating}/5
                              </span>
                            )}
                          </div>

                          {(keepImages.length > 0 ||
                            reviewPreviews.length > 0) && (
                            <div className="flex gap-1.5 flex-wrap mb-2">
                              {keepImages.map((url) => (
                                <div
                                  key={url}
                                  className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 group"
                                >
                                  <Image
                                    src={url}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeKeptImage(url)}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <FiX size={10} />
                                  </button>
                                </div>
                              ))}
                              {reviewPreviews.map((src, i) => (
                                <div
                                  key={i}
                                  className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 group"
                                >
                                  <Image
                                    src={src}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeNewImage(i)}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <FiX size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-1">
                              <input
                                ref={imgInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImagePick}
                              />
                              {keepImages.length + reviewImages.length < 5 && (
                                <button
                                  type="button"
                                  onClick={() => imgInputRef.current?.click()}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                                  title="Add photos"
                                >
                                  <FiImage size={16} />
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {editingId && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    resetReviewForm();
                                    setMyRating(userReview?.rating || 0);
                                    setMyComment(userReview?.comment || "");
                                    setKeepImages(userReview?.images || []);
                                  }}
                                  className="px-3 py-1.5 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                type="submit"
                                disabled={!myRating || submitting}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-black disabled:opacity-40 transition-colors"
                              >
                                {submitting
                                  ? "Posting..."
                                  : editingId
                                    ? "Update"
                                    : "Post"}
                                <FiSend size={12} />
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Comments list */}
              <div className="space-y-0 divide-y divide-gray-100">
                {sortedReviews.map((r) => {
                  const isLiked = (r.likes || []).includes(user?._id);
                  const likeCount = (r.likes || []).length;
                  const replies = r.replies || [];
                  const showReplies = expandedReplies[r._id];
                  const isOwn = user?._id === r.userId;

                  return (
                    <div key={r._id} className="py-5 first:pt-0">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        {r.userImage ? (
                          <Image
                            src={safeUrl(r.userImage)}
                            alt=""
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                            {(r.userName || "A")[0].toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-gray-900">
                              {r.userName || "Anonymous"}
                            </span>
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500">
                              <FiStar
                                size={10}
                                className="text-amber-400 fill-amber-400"
                              />
                              {r.rating}
                            </span>
                            <span className="text-xs text-gray-400">
                              · {timeAgo(r.createdAt)}
                            </span>
                            {isOwn && (
                              <div className="relative ml-auto">
                                <button
                                  onClick={() =>
                                    setOpenMenuId(
                                      openMenuId === r._id ? null : r._id,
                                    )
                                  }
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                  <FiMoreHorizontal size={16} />
                                </button>
                                {openMenuId === r._id && (
                                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20 min-w-[120px]">
                                    <button
                                      onClick={() => {
                                        startEdit(r);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <FiEdit2 size={12} /> Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        deleteReview(r._id);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                                    >
                                      <FiTrash2 size={12} /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {r.comment && (
                            <p className="text-sm text-gray-700 leading-relaxed mt-1.5">
                              {r.comment}
                            </p>
                          )}

                          {r.images && r.images.length > 0 && (
                            <div className="flex gap-1.5 flex-wrap mt-2.5">
                              {r.images.map((img, i) => (
                                <button
                                  key={i}
                                  onClick={() => openLightbox(r.images, i)}
                                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors cursor-zoom-in"
                                >
                                  <Image
                                    src={img}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Action bar */}
                          <div className="flex items-center gap-4 mt-3">
                            <button
                              onClick={() => toggleLike(r._id)}
                              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isLiked ? "text-red-500" : "text-gray-400 hover:text-gray-700"}`}
                            >
                              <FiHeart
                                size={14}
                                className={isLiked ? "fill-current" : ""}
                              />
                              {likeCount > 0 && likeCount}
                            </button>
                            <button
                              onClick={() =>
                                setReplyingTo(
                                  replyingTo === r._id ? null : r._id,
                                )
                              }
                              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
                            >
                              <FiMessageCircle size={14} /> Reply
                            </button>
                            <button
                              onClick={() =>
                                navigator.clipboard?.writeText(
                                  window.location.href,
                                )
                              }
                              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
                            >
                              <FiShare2 size={14} /> Share
                            </button>
                          </div>

                          {/* Reply input */}
                          {replyingTo === r._id && user && (
                            <div className="flex items-start gap-2 mt-3 pl-2">
                              {user.image ? (
                                <Image
                                  src={safeUrl(user.image)}
                                  alt=""
                                  width={28}
                                  height={28}
                                  className="w-7 h-7 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                                  {(user.name || "U")[0].toUpperCase()}
                                </div>
                              )}
                              <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200 focus-within:border-gray-400 transition-colors">
                                <input
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    !e.shiftKey &&
                                    (e.preventDefault(), submitReply(r._id))
                                  }
                                  placeholder="Write a reply..."
                                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
                                />
                                <button
                                  onClick={() => submitReply(r._id)}
                                  disabled={
                                    !replyText.trim() || replySubmitting
                                  }
                                  className="text-gray-400 hover:text-black disabled:opacity-30 transition-colors"
                                >
                                  <FiSend size={14} />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Replies */}
                          {replies.length > 0 && (
                            <div className="mt-3">
                              {!showReplies && (
                                <button
                                  onClick={() =>
                                    setExpandedReplies((p) => ({
                                      ...p,
                                      [r._id]: true,
                                    }))
                                  }
                                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                                >
                                  <span className="w-6 h-px bg-gray-300" />
                                  {replies.length === 1
                                    ? "Show 1 reply"
                                    : `Show ${replies.length} replies`}
                                </button>
                              )}
                              {showReplies && (
                                <div className="space-y-3 pl-2 border-l-2 border-gray-100 ml-1">
                                  {replies.map((reply) => (
                                    <div
                                      key={reply._id}
                                      className="flex items-start gap-2.5 pl-3"
                                    >
                                      {reply.userImage ? (
                                        <Image
                                          src={safeUrl(reply.userImage)}
                                          alt=""
                                          width={28}
                                          height={28}
                                          className="w-7 h-7 rounded-full object-cover shrink-0"
                                        />
                                      ) : (
                                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                                          {(reply.userName ||
                                            "A")[0].toUpperCase()}
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-bold text-gray-900">
                                            {reply.userName || "Anonymous"}
                                          </span>
                                          <span className="text-[11px] text-gray-400">
                                            · {timeAgo(reply.createdAt)}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                                          {reply.comment}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() =>
                                      setExpandedReplies((p) => ({
                                        ...p,
                                        [r._id]: false,
                                      }))
                                    }
                                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors pl-3"
                                  >
                                    <span className="w-6 h-px bg-gray-300" />
                                    Hide replies
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Loading / Empty / Load more */}
              {reviewLoading && (
                <p className="text-sm text-gray-400 text-center py-3">
                  Loading...
                </p>
              )}
              {!reviewLoading && reviews.length === 0 && (
                <div className="text-center py-8">
                  <FiMessageCircle
                    size={32}
                    className="mx-auto text-gray-200 mb-2"
                  />
                  <p className="text-sm text-gray-400">
                    No reviews yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
              {reviewMeta.hasMore && !reviewLoading && (
                <button
                  onClick={() => fetchReviews(reviewPage + 1)}
                  className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-black hover:text-black flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FiChevronDown size={14} /> Load More Comments
                </button>
              )}
            </div>
          )}

          {/* ── VENDOR TAB ──────── */}
          {tab === "vendor" && (
            <div className="max-w-xl">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white text-lg font-bold">
                    {vendor.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[16px] sm:text-base font-black">
                        {vendor.name}
                      </h3>
                      {vendor.verified && (
                        <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <FiCheckCircle size={9} /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[16px] sm:text-xs text-gray-400">
                      Since {vendor.since} · {vendor.products} products
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    {
                      icon: <FiAward size={16} className="text-amber-500" />,
                      val: `${vendor.trust}/100`,
                      lbl: "Trust",
                    },
                    {
                      icon: <FiClock size={16} className="text-blue-500" />,
                      val: vendor.response,
                      lbl: "Response",
                    },
                    {
                      icon: <FiPackage size={16} className="text-green-500" />,
                      val: vendor.fulfillment,
                      lbl: "Fulfillment",
                    },
                    {
                      icon: (
                        <FiStar
                          size={16}
                          className="text-amber-400 fill-amber-400"
                        />
                      ),
                      val: `${rating.toFixed(1)}/5`,
                      lbl: "Rating",
                    },
                  ].map(({ icon, val, lbl }) => (
                    <div
                      key={lbl}
                      className="bg-white rounded-lg p-2.5 text-center border border-gray-100"
                    >
                      <div className="flex justify-center mb-1">{icon}</div>
                      <p className="text-[16px] sm:text-base font-black">
                        {val}
                      </p>
                      <p className="text-[16px] sm:text-xs text-gray-400">
                        {lbl}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/products?seller=${encodeURIComponent(vendor.email)}`}
                    className="flex-1 h-9 bg-black text-white text-[16px] sm:text-[16px] sm:text-base font-bold rounded-lg flex items-center justify-center hover:bg-gray-800"
                  >
                    All Products
                  </Link>
                  <button className="flex-1 h-9 border border-gray-200 text-[16px] sm:text-[16px] sm:text-base font-bold rounded-lg hover:border-black">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── SHIPPING TAB ──────── */}
          {tab === "shipping" && (
            <div className="max-w-xl space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="text-[16px] sm:text-[16px] sm:text-base font-bold flex items-center gap-1.5">
                  <FiTruck size={14} className="text-green-600" /> Shipping
                </h3>
                {[
                  "Free Standard — 5-7 business days (orders $50+)",
                  "Express — $9.99, 2-3 business days",
                  "International — rates at checkout",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2">
                    <FiCheck
                      size={12}
                      className="text-green-500 mt-0.5 shrink-0"
                    />
                    <span className="text-[16px] sm:text-[16px] sm:text-base text-gray-600">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="text-[16px] sm:text-[16px] sm:text-base font-bold flex items-center gap-1.5">
                  <FiRefreshCw size={14} className="text-blue-600" /> Returns
                </h3>
                {[
                  "30-day full refund policy",
                  "Free return shipping for defective items",
                  "Easy process from your dashboard",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2">
                    <FiCheck
                      size={12}
                      className="text-blue-500 mt-0.5 shrink-0"
                    />
                    <span className="text-[16px] sm:text-[16px] sm:text-base text-gray-600">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 flex items-start gap-2">
                <FiShield
                  size={16}
                  className="text-purple-600 shrink-0 mt-0.5"
                />
                <div>
                  <h3 className="text-[16px] sm:text-[16px] sm:text-base font-bold">
                    Buyer Protection
                  </h3>
                  <p className="text-[16px] sm:text-xs text-gray-600 mt-0.5">
                    Full refund if item doesn&apos;t arrive or doesn&apos;t
                    match description.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── DESC TAB ──────── */}
          {tab === "desc" && product.description && (
            <div className="max-w-2xl">
              <div
                className="product-description text-gray-600 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description),
                }}
              />
              <div className="mt-4 space-y-0">
                {[
                  product.brand && { l: "Brand", v: product.brand },
                  product.category && { l: "Category", v: product.category },
                  product.stock !== undefined && {
                    l: "Stock",
                    v: `${product.stock}`,
                  },
                ]
                  .filter(Boolean)
                  .map(({ l, v }, i) => (
                    <div
                      key={l}
                      className={`flex justify-between py-2 text-[16px] sm:text-[16px] sm:text-base ${i ? "border-t border-gray-100" : ""}`}
                    >
                      <span className="text-gray-400">{l}</span>
                      <span className="font-bold capitalize">{v}</span>
                    </div>
                  ))}
              </div>
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {product.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-[16px] sm:text-xs font-semibold rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══════ FREQUENTLY BOUGHT TOGETHER ══════ */}
      {fbt.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-[16px] sm:text-base font-black mb-3 flex items-center gap-1.5">
            <FiPackage size={16} /> Frequently Bought Together
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-16 h-16 rounded-lg border-2 border-black bg-white overflow-hidden shrink-0">
              <Image
                src={imgSrc(0)}
                alt={product.name}
                width={64}
                height={64}
                className="w-full h-full object-contain p-1"
              />
            </div>
            {fbt.map((it, i) => (
              <div key={it._id || i} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-300">+</span>
                <Link
                  href={`/products/${it._id || it.id}`}
                  className="w-16 h-16 rounded-lg border border-gray-200 bg-white overflow-hidden shrink-0 hover:border-black"
                >
                  <Image
                    src={safeUrl(
                      Array.isArray(it.image) ? it.image[0] : it.image,
                    )}
                    alt={it.name || ""}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain p-1"
                  />
                </Link>
              </div>
            ))}
            <div className="ml-auto text-right">
              <p className="text-lg font-black">
                {formatPrice(
                  (product.price +
                    fbt.reduce((s, p) => s + (p.price || 0), 0)) *
                    0.9,
                )}
              </p>
              <span className="text-[16px] sm:text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                Save 10%
              </span>
              <button
                onClick={() => {
                  addToCart(product, 1);
                  fbt.forEach((p) => addToCart(p, 1));
                }}
                className="mt-1 block px-4 h-7 bg-black text-white text-[16px] sm:text-xs font-bold uppercase rounded hover:bg-gray-800"
              >
                Add All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════ RECENTLY VIEWED ══════ */}
      {rv.length > 0 && (
        <div>
          <h2 className="text-[16px] sm:text-base font-black mb-3 flex items-center gap-1.5">
            <FiClock size={16} /> Recently Viewed
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {rv.slice(0, 6).map((it) => (
              <Link
                key={it._id}
                href={`/products/${it._id}`}
                className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    src={safeUrl(it.image)}
                    alt={it.name || ""}
                    fill
                    sizes="(max-width:768px) 33vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-[16px] sm:text-xs font-bold text-gray-900 line-clamp-1">
                    {it.name}
                  </h3>
                  <span className="text-[16px] sm:text-[16px] sm:text-base font-black">
                    {formatPrice(it.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ══════ MOBILE STICKY BAR ══════ */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] z-50 lg:hidden">
        <div className="flex items-center gap-2 px-3 py-2.5 max-w-lg mx-auto">
          <div className="shrink-0">
            <span className="text-[16px] sm:text-base font-black">
              {formatPrice(product.price)}
            </span>
            {disc && (
              <span className="text-[9px] text-red-500 font-bold ml-0.5">
                -{disc}%
              </span>
            )}
          </div>
          <button
            onClick={addCart}
            disabled={product.stock === 0 || cartOk}
            className="flex-1 h-9 bg-black text-white font-bold text-[16px] sm:text-xs uppercase rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            {cartOk ? (
              <>
                <FiCheck size={12} /> Added
              </>
            ) : (
              <>
                <FiShoppingCart size={12} /> Cart
              </>
            )}
          </button>
          <button
            onClick={buyNow}
            disabled={product.stock === 0}
            className="flex-1 h-9 bg-black text-white font-bold text-[16px] sm:text-xs uppercase rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <FiZap size={12} /> Buy Now
          </button>
        </div>
      </div>
      <div className="h-14 lg:hidden" />

      {/* ══════ LIGHTBOX MODAL ══════ */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <FiX size={20} />
          </button>
          <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-[16px] sm:text-[16px] sm:text-base font-bold">
            {lightbox.index + 1} / {lightbox.images.length}
          </span>
          {lightbox.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                lbPrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            >
              <FiChevronRight size={20} className="rotate-180" />
            </button>
          )}
          <div
            className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.images[lightbox.index]}
              alt="Review photo"
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          {lightbox.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                lbNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            >
              <FiChevronRight size={20} />
            </button>
          )}
          {lightbox.images.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 rounded-lg p-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox((p) => ({ ...p, index: i }))}
                  className={`relative w-10 h-10 rounded overflow-hidden border-2 transition-colors ${i === lightbox.index ? "border-white" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}



