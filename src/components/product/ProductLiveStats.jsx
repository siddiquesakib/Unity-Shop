'use client';

// src/components/product/ProductLiveStats.jsx
// Shows: live concurrent viewers (socket) + total views (MongoDB)

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { Eye, TrendingUp } from 'lucide-react';
import { useProductView } from '@/hooks/useProductView';

export default function ProductLiveStats({ productId, initialViews = 0 }) {
  const [liveViewers, setLiveViewers] = useState(0);

  // Fires POST /products/:id/view on mount → increments MongoDB → returns new total
  const totalViews = useProductView(productId, initialViews);

  // Real-time concurrent viewer count via Socket.IO
  useEffect(() => {
    if (!productId) return;

    const onViewerCount = data => {
      if (data.productId === productId) setLiveViewers(data.viewers);
    };

    socket.emit('join-product', productId);
    socket.on('viewer-count', onViewerCount);

    return () => {
      socket.emit('leave-product', productId);
      socket.off('viewer-count', onViewerCount);
    };
  }, [productId]);

  return (
    <div className="flex items-center flex-wrap gap-3 sm:gap-4 md:mt-0">
      {/* Live right now */}
      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500">
        <span className="relative flex h-2 w-2 mr-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-black">{liveViewers}</span> viewing
      </div>

      {/* Total views */}
      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500">
        <Eye size={12} strokeWidth={3} className="text-black" />
        <span className="text-black">{totalViews.toLocaleString()}</span> views
      </div>
    </div>
  );
}
