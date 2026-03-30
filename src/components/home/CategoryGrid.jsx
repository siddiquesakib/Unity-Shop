"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Button from "@/components/common/Button";

/* ━━━━━ Category Data ━━━━━ */
const categories = [
  {
    id: "Fashion",
    label: "Fashion",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "Electronics",
    label: "Electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "Home & Living",
    label: "Home",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "Beauty",
    label: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "Watches",
    label: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "Toys & Baby",
    label: "Gifts",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238f7e1?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "Mobiles",
    label: "Mobiles",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "Gaming",
    label: "Gaming",
    image:
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "Sports",
    label: "Sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "Books",
    label: "Books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "Grocery",
    label: "Grocery",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "Health",
    label: "Health",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=400&fit=crop&q=80",
  },
];

/* ━━━━━ Single Card ━━━━━ */
const CategoryCard = ({ cat, count, index }) => {
  const cardRef = useRef(null);
  const shimmerRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rX = ((y - cy) / cy) * -8;
    const rY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(600px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.05,1.05,1.05)`;
    if (shimmerRef.current) {
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      shimmerRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.28) 0%, transparent 60%)`;
      shimmerRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform =
        "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    if (shimmerRef.current) shimmerRef.current.style.opacity = "0";
  };

  return (
    <Link
      href={`/products?category=${encodeURIComponent(cat.id)}`}
      className="cat-card-link"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div
        ref={cardRef}
        className="cat-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={cat.image}
          alt={cat.label}
          fill
          sizes="140px"
          className="cat-card-img"
        />
        <div className="cat-card-overlay" />
        <div ref={shimmerRef} className="cat-card-shimmer" />
        <div className="cat-card-glow" />
        <div className="cat-card-glass-label">
          <span className="cat-card-name">{cat.label}</span>
          {count > 0 && <span className="cat-card-badge">{count}+</span>}
        </div>
        <div className="cat-card-arrow-btn">
          <FiArrowUpRight size={11} strokeWidth={2.5} />
        </div>
      </div>
    </Link>
  );
};

/* ━━━━━ Main ━━━━━ */
const CategoryGrid = () => {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/categories`,
        );
        if (res.ok) {
          const data = await res.json();
          const counts = {};
          data.forEach((c) => {
            counts[c.name] = c.count;
          });
          setCategoryCounts(counts);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600;700&display=swap');

        .cat-section {
          padding: 52px 0 60px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin: 1rem;
          border-radius: 1.5rem;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .cat-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 28px;
        }

        /* Header */
        .cat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .cat-header-left {
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }
        .cat-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(1.35rem, 2.4vw, 1.9rem);
          font-weight: 400;
          color: #0f0f0f;
          letter-spacing: -0.025em;
          line-height: 1;
          margin: 0;
        }
        .cat-title em {
          font-style: italic;
          color: #888;
        }
        .cat-count-pill {
          font-family: 'Geist', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          color: #999;
          background: #eeeeed;
          border-radius: 999px;
          padding: 3px 9px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .cat-view-all-btn {
          font-family: 'Geist', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #111;
          background: #fff;
          border: 1.5px solid #ddd;
          border-radius: 999px;
          padding: 7px 15px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.18s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .cat-view-all-btn:hover {
          background: #0f0f0f;
          color: #fff;
          border-color: #0f0f0f;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }

        /* Divider */
        .cat-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e2e2e0 20%, #e2e2e0 80%, transparent);
          margin-bottom: 24px;
        }

        /* Grid — auto-fill so any number of items fills naturally */
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
        }
        @media (min-width: 480px)  { .cat-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); } }
        @media (min-width: 768px)  { .cat-grid { grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 11px; } }
        @media (min-width: 1024px) { .cat-grid { grid-template-columns: repeat(auto-fill, minmax(126px, 1fr)); gap: 12px; } }

        /* Card link */
        .cat-card-link {
          display: block;
          text-decoration: none;
          animation: cardReveal 0.38s ease both;
        }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Card */
        .cat-card {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: 14px;
          overflow: hidden;
          background: #ddddd9;
          cursor: pointer;
          will-change: transform;
          transition: transform 0.12s ease, box-shadow 0.22s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04);
        }
        .cat-card:hover {
          box-shadow:
            0 14px 40px rgba(0,0,0,0.15),
            0 0 0 1.5px rgba(255,255,255,0.85) inset;
        }
        .cat-card-img {
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .cat-card:hover .cat-card-img { transform: scale(1.08); }

        .cat-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, transparent 25%, rgba(0,0,0,0.58) 100%);
          z-index: 1;
        }
        .cat-card-shimmer {
          position: absolute; inset: 0; opacity: 0; z-index: 2;
          pointer-events: none; transition: opacity 0.15s ease;
        }
        .cat-card-glow {
          position: absolute; inset: 0; border-radius: 14px; opacity: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.45) 0%, transparent 55%);
          z-index: 3; pointer-events: none; transition: opacity 0.28s ease;
        }
        .cat-card:hover .cat-card-glow {
          opacity: 1;
          animation: glowBreath 2s ease-in-out infinite;
        }
        @keyframes glowBreath {
          0%,100% { opacity: 0.6; } 50% { opacity: 1; }
        }

        /* Arrow */
        .cat-card-arrow-btn {
          position: absolute; top: 8px; right: 8px; z-index: 5;
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.38);
          display: flex; align-items: center; justify-content: center;
          color: #fff; opacity: 0; transform: scale(0.6);
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .cat-card:hover .cat-card-arrow-btn { opacity: 1; transform: scale(1); }

        /* Glass label */
        .cat-card-glass-label {
          position: absolute;
          bottom: 7px; left: 7px; right: 7px;
          z-index: 5;
          display: flex; align-items: center; justify-content: space-between; gap: 3px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(14px) saturate(1.6);
          -webkit-backdrop-filter: blur(14px) saturate(1.6);
          border: 1px solid rgba(255,255,255,0.32);
          border-radius: 8px;
          padding: 4px 7px;
        }
        .cat-card-name {
          font-family: 'Geist', sans-serif;
          font-size: 0.65rem; font-weight: 700;
          color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.22);
          letter-spacing: 0.01em;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cat-card-badge {
          font-family: 'Geist', sans-serif;
          font-size: 0.52rem; font-weight: 600;
          color: rgba(255,255,255,0.78);
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px; padding: 1px 4px; flex-shrink: 0;
        }

        /* Skeleton */
        .cat-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
        }
        .cat-skeleton-card {
          aspect-ratio: 1/1; border-radius: 14px;
          background: linear-gradient(90deg, #eeeeed 25%, #e6e6e4 50%, #eeeeed 75%);
          background-size: 300% 100%;
          animation: skelShimmer 1.4s ease infinite;
        }
        @keyframes skelShimmer {
          0%   { background-position: 300% 0; }
          100% { background-position: -300% 0; }
        }

        /* Marquee */
        .cat-marquee-wrap {
          margin-top: 20px;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%);
        }
        .cat-marquee-track {
          display: flex; gap: 7px;
          width: max-content;
          animation: marqueeScroll 30s linear infinite;
        }
        .cat-marquee-track:hover { animation-play-state: paused; }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .cat-marquee-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 999px;
          background: #fff; border: 1px solid #e6e6e4;
          text-decoration: none; white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: all 0.16s ease;
          font-family: 'Geist', sans-serif;
          font-size: 0.72rem; font-weight: 600; color: #444;
          flex-shrink: 0;
        }
        .cat-marquee-pill:hover {
          background: #0f0f0f; color: #fff; border-color: #0f0f0f;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        .cat-marquee-sep {
          width: 3px; height: 3px; border-radius: 50%;
          background: currentColor; opacity: 0.3; flex-shrink: 0;
        }
      `}</style>

      <section className="cat-section">
        <div className="cat-inner">
          {/* Header */}
          <div className="cat-header">
            <div className="cat-header-left">
              <h2 className="cat-title">
                Shop <em>by</em> Category
              </h2>
              <span className="cat-count-pill">
                {categories.length} collections
              </span>
            </div>
            <Button href="/products" className="!rounded-full !px-4 !py-1.5 !text-xs !border-[#ddd] hover:!border-black">
              Browse All
            </Button>
          </div>

          <div className="cat-divider" />

          {/* Grid or Skeleton */}
          {loading ? (
            <div className="cat-skeleton-grid">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="cat-skeleton-card"
                  style={{ animationDelay: `${i * 0.06}s` }}
                />
              ))}
            </div>
          ) : (
            <div className="cat-grid">
              {categories.map((cat, i) => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  count={categoryCounts[cat.id] || 0}
                  index={i}
                />
              ))}
            </div>
          )}

          {/* Marquee pill strip */}
          {!loading && (
            <div className="cat-marquee-wrap">
              <div className="cat-marquee-track">
                {[...categories, ...categories].map((cat, i) => (
                  <Link
                    key={i}
                    href={`/products?category=${encodeURIComponent(cat.id)}`}
                    className="cat-marquee-pill"
                  >
                    {cat.label}
                    <span className="cat-marquee-sep" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CategoryGrid;
