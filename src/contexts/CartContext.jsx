"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { useNotifications } from "@/contexts/NotificationContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartGroups, setCartGroups] = useState([]);
  const [checkoutGroups, setCheckoutGroups] = useState([]);
  const [checkoutPromo, setCheckoutPromo] = useState(null); // { code, discount, description } | null
  const [hydrated, setHydrated] = useState(false);
  const { createNotification } = useNotifications() || {};

  // Load cart from localStorage on mount

  useEffect(() => {
    try {
      const saved = localStorage.getItem("unityshop_cart");
      if (saved) setCartGroups(JSON.parse(saved));
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("unityshop_cart", JSON.stringify(cartGroups));
    }
  }, [cartGroups, hydrated]);

  // ─── Add to Cart ─────────────────────────────────────────────────────────────
  const addToCart = useCallback(
    (product, quantity = 1) => {
      const sellerId = product.sellerId || product.sellerName || "general";
      const sellerName = product.sellerName || "UnityShop Seller";
      const moq = product.moq || 1;

      setCartGroups((prev) => {
        const groups = prev.map((g) => ({ ...g, items: [...g.items] }));
        const groupIdx = groups.findIndex((g) => g.seller.id === sellerId);

        const newItem = {
          id: `${product._id || product.id}-${sellerId}`,
          productId: product._id || product.id,
          name: product.name,
          image: product.image || "",
          price: product.price,
          quantity,
          moq,
          maxQuantity: product.stock || 9999,
          variant: product.variant || product.category || "—",
          stock: product.stock || 9999,
          sellerName,
          sellerEmail: product.sellerEmail || "",
        };

        if (groupIdx !== -1) {
          const itemIdx = groups[groupIdx].items.findIndex(
            (i) => i.productId === newItem.productId,
          );
          if (itemIdx !== -1) {
            const existing = groups[groupIdx].items[itemIdx];
            groups[groupIdx].items[itemIdx] = {
              ...existing,
              quantity: Math.min(
                existing.quantity + quantity,
                existing.maxQuantity,
              ),
            };
            toast.success("Updated item quantity in cart!");
          } else {
            groups[groupIdx].items.push(newItem);
          }
        } else {
          groups.push({
            id: `group-${sellerId}`,
            seller: {
              id: sellerId,
              name: sellerName,
              email: product.sellerEmail || "",
              verified: product.sellerVerified || false,
            },
            items: [newItem],
          });
        }

        return groups;
      });

      toast.success("Added to cart!");
      if (createNotification) {
        createNotification({
          type: "cart_add",
          title: "Added to Cart",
          message: `Added ${product.name} to your cart.`,
        });
      }
    },
    [createNotification],
  );

  // ─── Remove Item ─────────────────────────────────────────────────────────────
  const removeItem = useCallback((itemId) => {
    setCartGroups((prev) =>
      prev
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.id !== itemId),
        }))
        .filter((group) => group.items.length > 0),
    );
  }, []);

  // ─── Update Quantity ──────────────────────────────────────────────────────────
  const updateQuantity = useCallback((itemId, newQty) => {
    setCartGroups((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) => {
          if (item.id !== itemId) return item;
          const clamped = Math.min(
            Math.max(newQty, item.moq),
            item.maxQuantity,
          );
          return { ...item, quantity: clamped };
        }),
      })),
    );
  }, []);

  // ─── Prepare Checkout ─────────────────────────────────────────────────────────
  // Called by the cart page with only the SELECTED groups/items before navigating to /checkout
  const prepareCheckout = useCallback((selectedGroups) => {
  // promo: { code, discount, description } | null
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
        checkoutGroups,
        checkoutPromo,
        addToCart,
        removeItem,
        updateQuantity,
        prepareCheckout,
        clearCheckoutItems,
        clearCart,
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
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
