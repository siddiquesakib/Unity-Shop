'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function WishlistButton({ product, className = '' }) {
  const { user, token } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initial check (can be improved by passing global state or checking specific context)
  useEffect(() => {
    if (!user || !token) return;

    // Ideally, a global hook loads the wishlist and we just check here. 
    // For simplicity locally fetching to check if it's there. 
    // In a prod app, you might inject a prop `inWishlist` directly from the parent or context.
    const checkWishlistStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setIsWishlisted(data.some(item => item.productId === product._id));
        }
      } catch (err) {
        console.error("Failed to fetch wishlist status", err);
      }
    };
    checkWishlistStatus();
  }, [user, token, product._id]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    // Optimistic UI update
    const prevStatus = isWishlisted;
    setIsWishlisted(!prevStatus);
    setLoading(true);

    try {
      if (prevStatus) {
        // Remove from wishlist
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/remove/${user._id}/${product._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          toast.success('Removed from wishlist');
        } else {
          throw new Error('Failed to remove');
        }
      } else {
        // Add to wishlist
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userId: user._id, productId: product._id }),
        });
        if (res.ok) {
          toast.success('Added to wishlist ❤️');
        } else {
          throw new Error('Failed to add');
        }
      }
    } catch (error) {
      // Revert Optimistic Update
      setIsWishlisted(prevStatus);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={toggleWishlist}
      disabled={loading}
      className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 transition-all hover:bg-white hover:shadow-md z-10 ${className}`}
      aria-label="Toggle Wishlist"
    >
      <Heart
        size={18}
        className={`transition-colors duration-300 ${isWishlisted ? 'fill-black text-black' : 'text-gray-600'}`}
      />
    </motion.button>
  );
}
