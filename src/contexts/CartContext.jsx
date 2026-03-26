'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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
    if (user?._id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${user._id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
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
            setCartGroups(Object.values(groups));
          }
        })
        .catch(err => console.error('Failed to sync cart:', err));
    }
  }, [user, hydrated]);

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
  const clearCheckoutItems = useCallback(() => {
    setCartGroups(prev => {
      const paidItemIds = new Set(
        checkoutGroups.flatMap(g => g.items.map(i => i.id)),
      );
      return prev
        .map(group => ({
          ...group,
          items: group.items.filter(item => !paidItemIds.has(item.id)),
        }))
        .filter(group => group.items.length > 0);
    });
    setCheckoutGroups([]);
    setCheckoutPromo(null);
  }, [checkoutGroups]);

  // ─── Clear Entire Cart ────────────────────────────────────────────────────────
  const clearCart = useCallback(() => {
    setCartGroups([]);
    setCheckoutGroups([]);
    setCheckoutPromo(null);
  }, []);

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
