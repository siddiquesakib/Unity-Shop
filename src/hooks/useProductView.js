// src/hooks/useProductView.js
// ─────────────────────────────────────────────────────────────
// Fires once when a product page is opened.
// Increments the persistent view count in MongoDB.
// Returns the live view count to display in the UI.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function useProductView(productId, initialViews = 0) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    if (!productId) return;

    // Fire-and-forget — don't block the UI
    fetch(`${API_URL}/products/${productId}/view`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => {
        if (data.views !== undefined) {
          setViews(data.views);
        }
      })
      .catch(() => {
        // Silently fail — view count is non-critical
      });
  }, [productId]); // Only runs once per product page mount

  return views;
}
