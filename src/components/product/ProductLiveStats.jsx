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
    socket.emit('join-product', productId);
    socket.on('viewer-count', data => {
      if (data.productId === productId) setLiveViewers(data.viewers);
    });
    return () => {
      socket.emit('leave-product', productId);
      socket.off('viewer-count');
    };
  }, [productId]);

  return (
    <div className="flex flex-col gap-1.5 mt-3">
      {/* Live right now */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span>
          <strong>{liveViewers}</strong> people viewing this right now
        </span>
      </div>

      {/* Total views */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Eye size={14} />
        <span>
          <strong>{totalViews.toLocaleString()}</strong> 
        </span>
      </div>
    </div>
  );
}
