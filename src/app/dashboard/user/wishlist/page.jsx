'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartCrack, ShoppingCart, Trash2, Loader2, ArrowRight, Share2, TrendingDown, AlertTriangle } from 'lucide-react';
import Button from '@/components/common/Button';

export default function WishlistPage() {
  const { user, token } = useAuth();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setWishlistItems(data);
        }
      } catch (error) {
        console.error("Failed to load wishlist:", error);
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, token]);

  const handleRemove = async (itemId, productId) => {
    const prevItems = [...wishlistItems];
    setWishlistItems(items => items.filter(i => i._id !== itemId));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Removed from wishlist');
    } catch (error) {
      setWishlistItems(prevItems);
      toast.error('Could not remove item');
    }
  };

  const handleMoveToCart = (item) => {
    if (!item.product) return;
    addToCart(item.product, 1);
    toast.success('Added to cart!');
    handleRemove(item._id, item.productId);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Wishlist link copied to clipboard!');
  };

  const clearWishlist = async () => {
    if (!confirm('Are you sure you want to clear your wishlist?')) return;
    
    const prevItems = [...wishlistItems];
    setWishlistItems([]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/clear/${user._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to clear');
      toast.success('Wishlist cleared');
    } catch (error) {
      setWishlistItems(prevItems);
      toast.error('Could not clear wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            My Wishlist
          </h1>
          <p className="text-gray-500 mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        
        {wishlistItems.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200"
            >
              <Share2 size={16} />
              Share
            </button>
            <button
              onClick={clearWishlist}
              className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center max-w-2xl mx-auto mt-10"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <HeartCrack className="text-gray-300" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty 💔</h2>
          <p className="text-gray-500 mb-8 max-w-md">
            Looks like you haven&apos;t added anything to your wishlist yet. Explore our store and find something you love!
          </p>
          <Link href="/products" passHref>
            <Button className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform duration-300">
              Explore Products
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item) => {
              const product = item.product;
              if (!product) return null; // Defensive check

              // Resolution logic matching ProductCard.jsx
              const images = Array.isArray(product.images) ? product.images : [];
              const legacy = Array.isArray(product.image) ? product.image : (typeof product.image === "string" ? [product.image] : []);
              const allImages = [...new Set([...images, ...legacy])].filter(i => typeof i === "string" && i.trim());
              const image = allImages.length > 0 ? allImages[0] : "https://via.placeholder.com/400x400?text=No+Image";

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image container */}
                  <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                    <Link href={`/products/${product._id || product.id}`}>
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    </Link>

                    {/* Placeholder Badges based on probability for demo */}
                    {Math.random() > 0.7 && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full tracking-wide shadow-sm flex items-center gap-1">
                        <TrendingDown size={12} /> Price Dropped
                      </span>
                    )}
                    {Math.random() > 0.8 && (
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-yellow-500 text-white text-[10px] font-bold rounded-full tracking-wide shadow-sm flex items-center gap-1">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    )}

                    <button
                      onClick={() => handleRemove(item._id, product._id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/products/${product._id || product.id}`}>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-gray-600 transition-colors mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="mt-auto pt-4">
                      <div className="flex items-end justify-between mb-4">
                        <span className="text-xl font-black text-black">
                          {formatPrice(product.price, product.currency || "USD")}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-all hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} />
                        Move to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
