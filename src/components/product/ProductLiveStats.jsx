'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { Eye } from 'lucide-react';

export default function ProductLiveStats({ productId }) {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    if (!productId) return;

    socket.emit('join-product', productId);

    socket.on('viewer-count', data => {
      if (data.productId === productId) {
        setViewers(data.viewers);
      }
    });

    return () => {
      socket.emit('leave-product', productId);
      socket.off('viewer-count');
    };
  }, [productId]);

  return (
    <div className="flex items-center gap-2 mt-3 text-sm text-gray-700">
      <Eye size={16} />
      <span>
        <strong>{viewers}</strong> people viewing this right now
      </span>
    </div>
  );
}
