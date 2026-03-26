'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import toast from 'react-hot-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

const CartContext = createContext(null);

// ─── Sanitize every numeric field on any item from ANY source ────────────────
// Handles: strings ("2"), undefined, null, objects, NaN — all become safe numbers
const sanitizeItem = item => ({
  ...item,
  quantity: Math.max(1, Number(item.quantity) || 1),
  price: Math.max(0, Number(item.price) || 0),
  moq: Math.max(1, Number(item.moq) || 1),
  maxQuantity: Math.max(1, Number(item.maxQuantity) || 9999),
  stock: Math.max(0, Number(item.stock) || 0),
});

// Sanitize an entire groups array (used when loading from localStorage or backend)
const sanitizeGroups = groups =>
  Array.isArray(groups)
    ? groups.map(g => ({
        ...g,
        items: Array.isArray(g.items) ? g.items.map(sanitizeItem) : [],
      }))
    : [];

export function CartProvider({ children }) {
  const [cartGroups, setCartGroups] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [checkoutGroups, setCheckoutGroups] = useState([]);
  const [checkoutPromo, setCheckoutPromo] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const { createNotification } = useNotifications() || {};
  const { user } = useAuth();

  // Track which user we've already synced with backend to prevent duplicate syncs
  const lastSyncedUserRef = useRef(null);

  // Flag to prevent syncing right after clearing cart
  const isJustClearedRef = useRef(false);

  // ─── Initial load from localStorage ────────────────────────────────────────
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('unityshop_cart');
        if (saved) {
          // sanitizeGroups fixes any stale string/undefined fields from old schema
          setCartGroups(sanitizeGroups(JSON.parse(saved)));
        }
        const savedLater = localStorage.getItem('unityshop_saved');
        if (savedLater) {
          setSavedItems((JSON.parse(savedLater) || []).map(sanitizeItem));
        }
      }
    } catch (e) {
      console.error('Failed to load cart from local storage', e);
    }
    setHydrated(true);
  }, []);

  // ─── Backend sync when user logs in ─────────────────────────────────────────
  useEffect(() => {
    // Only sync if the user ID actually changed, not every time hydration happens
    // AND don't sync if we just cleared the cart
    if (
      user?._id &&
      lastSyncedUserRef.current !== user._id &&
      !isJustClearedRef.current
    ) {
      lastSyncedUserRef.current = user._id;
      console.log(
        '[CartContext] Syncing cart with backend for user:',
        user._id,
      );
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${user._id}`)
        .then(res => {
          console.log(
            '[CartContext] Backend response status:',
            res.status,
            res.statusText,
          );
          return res.json();
        })
        .then(data => {
          console.log('[CartContext] Backend cart data:', data);
          console.log(
            '[CartContext] Data is array?',
            Array.isArray(data),
            'Length:',
            Array.isArray(data) ? data.length : 'N/A',
          );
          if (Array.isArray(data) && data.length > 0) {
            console.log(
              '[CartContext] Cart has',
              data.length,
              'items from backend',
            );
            const groups = {};
            data.forEach(item => {
              const sellerId = item.sellerId || 'general';
              if (!groups[sellerId]) {
                groups[sellerId] = {
                  id: `group-${sellerId}`,
                  seller: {
                    id: sellerId,
                    name: item.sellerName || 'UnityShop Seller',
                    email: item.sellerEmail || '',
                    verified: item.sellerVerified || false,
                  },
                  items: [],
                };
              }
              // sanitizeItem here — backend may return numbers as strings
              groups[sellerId].items.push(
                sanitizeItem({
                  id: `${item.productId}-${sellerId}`,
                  productId: item.productId,
                  name: item.name,
                  image: item.image,
                  price: item.price,
                  quantity: item.quantity,
                  stock: item.stock,
                  moq: item.moq,
                  maxQuantity: item.stock || 9999,
                  variant: item.category || '—',
                  sellerName: item.sellerName,
                  sellerEmail: item.sellerEmail,
                }),
              );
            });
            console.log(
              '[CartContext] Setting cart groups:',
              Object.values(groups),
            );
            setCartGroups(Object.values(groups));
          } else {
            console.log('[CartContext] Backend cart is empty or not an array');
          }
        })
        .catch(err => console.error('[CartContext] Failed to sync cart:', err));
    } else if (!user?._id) {
      // Clear ref when user logs out
      lastSyncedUserRef.current = null;
    }
  }, [user?._id]);

  // ─── Persist to localStorage ─────────────────────────────────────────────────
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('unityshop_cart', JSON.stringify(cartGroups));
    }
  }, [cartGroups, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('unityshop_saved', JSON.stringify(savedItems));
    }
  }, [savedItems, hydrated]);

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const moveToSaved = useCallback(itemId => {
    let found = null;
    setCartGroups(prev => {
      const next = prev
        .map(g => {
          const item = g.items.find(i => i.id === itemId);
          if (item) found = { ...item };
          return { ...g, items: g.items.filter(i => i.id !== itemId) };
        })
        .filter(g => g.items.length > 0);
      return next;
    });
    if (found) {
      setSavedItems(prev => {
        if (prev.some(i => i.id === found.id)) return prev;
        return [...prev, sanitizeItem(found)];
      });
      toast.success('Saved for later');
    }
  }, []);

  const moveToCart = useCallback(itemId => {
    let found = null;
    setSavedItems(prev => {
      found = prev.find(i => i.id === itemId);
      return prev.filter(i => i.id !== itemId);
    });
    if (found) {
      const safeFound = sanitizeItem(found);
      setCartGroups(prev => {
        const sellerId = safeFound.sellerName || 'general';
        const groups = prev.map(g => ({ ...g, items: [...g.items] }));
        const gIdx = groups.findIndex(g => g.seller.id === sellerId);
        if (gIdx !== -1) {
          const eIdx = groups[gIdx].items.findIndex(
            i => i.productId === safeFound.productId,
          );
          if (eIdx !== -1) {
            const existing = groups[gIdx].items[eIdx];
            groups[gIdx].items[eIdx] = {
              ...existing,
              quantity: Math.min(
                Number(existing.quantity) + Number(safeFound.quantity),
                Number(existing.maxQuantity) || 9999,
              ),
            };
          } else {
            groups[gIdx].items.push(safeFound);
          }
        } else {
          groups.push({
            id: `group-${sellerId}`,
            seller: {
              id: sellerId,
              name: safeFound.sellerName || 'UnityShop Seller',
              email: safeFound.sellerEmail || '',
              verified: false,
            },
            items: [safeFound],
          });
        }
        return groups;
      });
      toast.success('Moved back to cart');
    }
  }, []);

  const removeSavedItem = useCallback(itemId => {
    setSavedItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  // ─── Add to Cart ─────────────────────────────────────────────────────────────
  const addToCart = useCallback(
    (product, quantity = 1) => {
      const sellerId = product.sellerId || product.sellerName || 'general';
      const sellerName = product.sellerName || 'UnityShop Seller';

      // sanitizeItem on the new item so it enters state clean
      const newItem = sanitizeItem({
        id: `${product._id || product.id}-${sellerId}`,
        productId: product._id || product.id,
        name: product.name,
        image: product.image || '',
        price: product.price,
        quantity: Number(quantity) || 1,
        moq: product.moq,
        maxQuantity: product.stock || 9999,
        variant: product.variant || product.category || '—',
        stock: product.stock || 9999,
        sellerName,
        sellerEmail: product.sellerEmail || '',
      });

      setCartGroups(prev => {
        const groups = prev.map(g => ({ ...g, items: [...g.items] }));
        const groupIdx = groups.findIndex(g => g.seller.id === sellerId);

        if (groupIdx !== -1) {
          const itemIdx = groups[groupIdx].items.findIndex(
            i => i.productId === newItem.productId,
          );
          if (itemIdx !== -1) {
            const existing = groups[groupIdx].items[itemIdx];
            groups[groupIdx].items[itemIdx] = {
              ...existing,
              quantity: Math.min(
                Number(existing.quantity) + Number(newItem.quantity),
                Number(existing.maxQuantity) || 9999,
              ),
            };
            toast.success('Updated item quantity in cart!');
          } else {
            groups[groupIdx].items.push(newItem);
          }
        } else {
          groups.push({
            id: `group-${sellerId}`,
            seller: {
              id: sellerId,
              name: sellerName,
              email: product.sellerEmail || '',
              verified: product.sellerVerified || false,
            },
            items: [newItem],
          });
        }
        return groups;
      });

      if (user?._id) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            productId: product._id || product.id,
            quantity: Number(quantity) || 1,
          }),
        }).catch(err => console.error('Failed to add to cart backend:', err));
      }

      toast.success('Added to cart!');

      if (createNotification) {
        createNotification({
          type: 'cart_add',
          title: 'Added to Cart',
          message: `Added ${product.name} to your cart.`,
        });
      }
    },
    [createNotification, user],
  );

  // ─── Remove Item ─────────────────────────────────────────────────────────────
  const removeItem = useCallback(
    itemId => {
      let productIdToRemove = null;
      if (user?._id) {
        for (const group of cartGroups) {
          const item = group.items.find(i => i.id === itemId);
          if (item) {
            productIdToRemove = item.productId;
            break;
          }
        }
      }

      setCartGroups(prev =>
        prev
          .map(group => ({
            ...group,
            items: group.items.filter(item => item.id !== itemId),
          }))
          .filter(group => group.items.length > 0),
      );

      if (user?._id && productIdToRemove) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            productId: productIdToRemove,
          }),
        }).catch(err =>
          console.error('Failed to remove item from backend:', err),
        );
      }
    },
    [cartGroups, user],
  );

  // ─── Update Quantity ──────────────────────────────────────────────────────────
  const updateQuantity = useCallback(
    (itemId, newQty) => {
      // Always coerce newQty first — it may arrive as NaN from a bad caller
      const safeQty = Number(newQty) || 1;

      let productIdToUpdate = null;
      let finalQuantity = safeQty;

      if (user?._id) {
        for (const group of cartGroups) {
          const item = group.items.find(i => i.id === itemId);
          if (item) {
            productIdToUpdate = item.productId;
            finalQuantity = Math.min(
              Math.max(safeQty, Number(item.moq) || 1),
              Number(item.maxQuantity) || 9999,
            );
            break;
          }
        }
      }

      setCartGroups(prev =>
        prev.map(group => ({
          ...group,
          items: group.items.map(item => {
            if (item.id !== itemId) return item;
            const clamped = Math.min(
              Math.max(safeQty, Number(item.moq) || 1),
              Number(item.maxQuantity) || 9999,
            );
            return { ...item, quantity: clamped };
          }),
        })),
      );

      if (user?._id && productIdToUpdate) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            productId: productIdToUpdate,
            quantity: finalQuantity,
          }),
        }).catch(err =>
          console.error('Failed to update quantity on backend:', err),
        );
      }
    },
    [cartGroups, user],
  );

  // ─── Prepare Checkout ─────────────────────────────────────────────────────────
  const prepareCheckout = useCallback((selectedGroups, promo = null) => {
    setCheckoutGroups(selectedGroups);
    setCheckoutPromo(promo);
  }, []);

  // ─── Clear Checkout Items ─────────────────────────────────────────────────────
  const clearCheckoutItems = useCallback(async () => {
    // Snapshot the paid item IDs + productIds before mutating state
    const paidItems = checkoutGroups.flatMap(g =>
      g.items.map(i => ({ id: i.id, productId: i.productId })),
    );
    const paidItemIds = new Set(paidItems.map(i => i.id));

    // 1. Clear from local state (same as before)
    setCartGroups(prev =>
      prev
        .map(group => ({
          ...group,
          items: group.items.filter(item => !paidItemIds.has(item.id)),
        }))
        .filter(group => group.items.length > 0),
    );
    setCheckoutGroups([]);
    setCheckoutPromo(null);

    // 2. Delete every paid item from the backend so a page refresh
    //    doesn't re-populate the cart via the sync useEffect.
    if (user?._id && paidItems.length > 0) {
      // Wait for all DELETE requests to complete before returning
      try {
        await Promise.all(
          paidItems.map(async ({ productId }) => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/cart/remove`,
              {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, productId }),
              },
            );
            if (!res.ok) {
              throw new Error(
                `Failed to remove product ${productId}: ${res.statusText}`,
              );
            }
          }),
        );
      } catch (err) {
        console.error('Error removing paid items from backend:', err);
      }
    }
  }, [checkoutGroups, user]);

  // ─── Clear Entire Cart ────────────────────────────────────────────────────────
  const clearCart = useCallback(
    async (userIdOverride = null) => {
      console.log('[clearCart] Called with userIdOverride:', userIdOverride);

      // Set flag to prevent sync right after clearing
      isJustClearedRef.current = true;
      console.log(
        '[clearCart] Set isJustClearedRef to true - will prevent sync',
      );

      // 1. Snapshot all items from BOTH cartGroups and checkoutGroups
      // (checkout items should be in cart, but just to be safe)
      const cartItems = cartGroups.flatMap(g => g.items.map(i => i.productId));
      const checkoutItems = checkoutGroups.flatMap(g =>
        g.items.map(i => i.productId),
      );

      // Combine and deduplicate
      const allProductIds = [...new Set([...cartItems, ...checkoutItems])];

      // Use provided user ID (from payment flow) or fall back to context user
      const userId = userIdOverride || user?._id;

      console.log(
        `[clearCart] Removing ${allProductIds.length} products for user ${userId}:`,
        allProductIds,
      );

      // 2. Clear local state immediately (keeps the UI snappy)
      setCartGroups([]);
      setCheckoutGroups([]);
      setCheckoutPromo(null);
      console.log('[clearCart] Local state cleared');

      // 3. Also explicitly clear localStorage to be safe
      if (typeof window !== 'undefined') {
        localStorage.removeItem('unityshop_cart');
        localStorage.removeItem('unityshop_saved');
        console.log('[clearCart] localStorage cleared');
      }

      // 4. Delete every item from the backend so the GET /cart sync on
      //    refresh finds nothing and does not repopulate the cart.
      if (userId && allProductIds.length > 0) {
        // Wait for all DELETE requests to complete before returning
        try {
          await Promise.all(
            allProductIds.map(async productId => {
              console.log(
                `[clearCart] Deleting product ${productId} from backend...`,
              );
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/cart/remove`,
                {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId, productId }),
                },
              );
              if (!res.ok) {
                const errorText = await res.text();
                console.error(
                  `[clearCart] ✗ Failed to delete product ${productId}: ${res.status} ${res.statusText}`,
                  errorText,
                );
                throw new Error(
                  `Failed to remove product ${productId}: ${res.statusText}`,
                );
              }
              console.log(
                `[clearCart] ✓ Product ${productId} deleted from backend`,
              );
            }),
          );
          console.log(
            '[clearCart] ✓✓✓ All products successfully removed from backend',
          );
        } catch (err) {
          console.error(
            'Error removing items from backend during clearCart:',
            err,
          );
          throw new Error(`Failed to clear cart from backend: ${err.message}`);
        }
      } else {
        console.warn(
          '[clearCart] Skipped backend deletion: no userId or products',
        );
      }

      // Reset the flag only after a reasonable delay to ensure network requests
      // complete and prevent re-population race condition
      setTimeout(() => {
        isJustClearedRef.current = false;
        console.log(
          '[clearCart] Reset isJustClearedRef to false - sync allowed again',
        );
      }, 2000);
    },
    [cartGroups, checkoutGroups, user],
  );

  // ─── Derived values ───────────────────────────────────────────────────────────
  const totalUniqueItems = cartGroups.reduce(
    (sum, g) => sum + g.items.length,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartGroups,
        savedItems,
        checkoutGroups,
        checkoutPromo,
        addToCart,
        removeItem,
        updateQuantity,
        prepareCheckout,
        clearCheckoutItems,
        clearCart,
        moveToSaved,
        moveToCart,
        removeSavedItem,
        totalUniqueItems,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
