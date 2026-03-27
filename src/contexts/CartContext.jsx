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
import { useAuth } from "@/contexts/AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartGroups, setCartGroups] = useState([]);
  const [savedItems, setSavedItems] = useState([]); // saved-for-later flat array
  const [checkoutGroups, setCheckoutGroups] = useState([]);
  const [checkoutPromo, setCheckoutPromo] = useState(null); // { code, discount, description } | null
  const [hydrated, setHydrated] = useState(false);
  const { createNotification } = useNotifications() || {};
  const { user } = useAuth();

  const getAuthToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  useEffect(() => {
    // Initial local load
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("unityshop_cart");
        if (saved) {
          setCartGroups(JSON.parse(saved));
        }
        const savedLater = localStorage.getItem("unityshop_saved");
        if (savedLater) {
          setSavedItems(JSON.parse(savedLater));
        }
      }
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
    }
    setHydrated(true);
  }, []);

  // Backend sync when user logs in
  useEffect(() => {
    if (user?._id) {
      const token = getAuthToken();
      if (!token) return;

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 401 || res.status === 403) return [];
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            // Group the flat items by seller
            const groups = {};
            data.forEach((item) => {
              const sellerId = item.sellerId || "general";
              if (!groups[sellerId]) {
                groups[sellerId] = {
                  id: `group-${sellerId}`,
                  seller: {
                    id: sellerId,
                    name: item.sellerName || "UnityShop Seller",
                    email: item.sellerEmail || "",
                    verified: item.sellerVerified || false,
                  },
                  items: [],
                };
              }
              groups[sellerId].items.push({
                id: `${item.productId}-${sellerId}`,
                productId: item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                stock: item.stock,
                moq: item.moq,
                maxQuantity: item.stock || 9999,
                variant: item.category || "—",
                sellerName: item.sellerName,
                sellerEmail: item.sellerEmail,
              });
            });
            setCartGroups(Object.values(groups));
          }
        })
        .catch((err) => console.error("Failed to sync cart:", err));
    }
  }, [user, hydrated]);

  // Persist cart + saved to localStorage on every change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("unityshop_cart", JSON.stringify(cartGroups));
    }
  }, [cartGroups, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("unityshop_saved", JSON.stringify(savedItems));
    }
  }, [savedItems, hydrated]);

  // ─── Save for Later ────────────────────────────────────────────────────────
  const moveToSaved = useCallback((itemId) => {
    let found = null;
    setCartGroups((prev) => {
      const next = prev.map((g) => {
        const item = g.items.find((i) => i.id === itemId);
        if (item) found = { ...item };
        return { ...g, items: g.items.filter((i) => i.id !== itemId) };
      }).filter((g) => g.items.length > 0);
      return next;
    });
    if (found) {
      setSavedItems((prev) => {
        if (prev.some((i) => i.id === found.id)) return prev;
        return [...prev, found];
      });
      toast.success("Saved for later");
    }
  }, []);

  const moveToCart = useCallback((itemId) => {
    let found = null;
    setSavedItems((prev) => {
      found = prev.find((i) => i.id === itemId);
      return prev.filter((i) => i.id !== itemId);
    });
    // Re-add via addToCart-like logic
    if (found) {
      setCartGroups((prev) => {
        const sellerId = found.sellerName || "general";
        const groups = prev.map((g) => ({ ...g, items: [...g.items] }));
        const gIdx = groups.findIndex((g) => g.seller.id === sellerId);
        if (gIdx !== -1) {
          const eIdx = groups[gIdx].items.findIndex((i) => i.productId === found.productId);
          if (eIdx !== -1) {
            groups[gIdx].items[eIdx] = { ...groups[gIdx].items[eIdx], quantity: groups[gIdx].items[eIdx].quantity + found.quantity };
          } else {
            groups[gIdx].items.push(found);
          }
        } else {
          groups.push({ id: `group-${sellerId}`, seller: { id: sellerId, name: found.sellerName || "UnityShop Seller", email: found.sellerEmail || "", verified: false }, items: [found] });
        }
        return groups;
      });
      toast.success("Moved back to cart");
    }
  }, []);

  const removeSavedItem = useCallback((itemId) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  // ─── Add to Cart ─────────────────────────────────────────────────────────────
  const addToCart = useCallback(
    (product, quantity = 1) => {
      const sellerId = product.sellerId || product.sellerName || "general";
      const sellerName = product.sellerName || "UnityShop Seller";
      const moq = product.moq || 1;

      // Optimistic update
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

      // Sync with backend
      if (user?._id) {
        const token = getAuthToken();
        if (!token) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            productId: product._id || product.id,
            quantity,
          }),
        }).catch((err) => console.error("Failed to add to cart backend:", err));
      }

      toast.success("Added to cart!");

      if (createNotification) {
        createNotification({
          type: "cart_add",
          title: "Added to Cart",
          message: `Added ${product.name} to your cart.`,
        });
      }
    },
    [createNotification, getAuthToken, user],
  );

  // ─── Remove Item ─────────────────────────────────────────────────────────────
  const removeItem = useCallback(
    (itemId) => {
      // Find item to get productId for backend call
      let productIdToRemove = null;
      if (user?._id) {
        for (const group of cartGroups) {
          const item = group.items.find((i) => i.id === itemId);
          if (item) {
            productIdToRemove = item.productId;
            break;
          }
        }
      }

      setCartGroups((prev) =>
        prev
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => item.id !== itemId),
          }))
          .filter((group) => group.items.length > 0),
      );

      // Sync with backend
      if (user?._id && productIdToRemove) {
        const token = getAuthToken();
        if (!token) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            productId: productIdToRemove,
          }),
        }).catch((err) =>
          console.error("Failed to remove item from backend:", err),
        );
      }
    },
    [cartGroups, getAuthToken, user],
  );

  // ─── Update Quantity ──────────────────────────────────────────────────────────
  const updateQuantity = useCallback(
    (itemId, newQty) => {
      let productIdToUpdate = null;
      let finalQuantity = newQty;

      // Find item to calculate clamped quantity and get ID
      if (user?._id) {
        for (const group of cartGroups) {
          const item = group.items.find((i) => i.id === itemId);
          if (item) {
            productIdToUpdate = item.productId;
            finalQuantity = Math.min(
              Math.max(newQty, item.moq),
              item.maxQuantity,
            );
            break;
          }
        }
      }

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

      // Sync with backend using the correct clamped quantity
      if (user?._id && productIdToUpdate) {
        const token = getAuthToken();
        if (!token) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            productId: productIdToUpdate,
            quantity: finalQuantity,
          }),
        }).catch((err) =>
          console.error("Failed to update quantity on backend:", err),
        );
      }
    },
    [cartGroups, getAuthToken, user],
  );

  // ─── Prepare Checkout ─────────────────────────────────────────────────────────
  // Called by the cart page with only the SELECTED groups/items before navigating to /checkout
  // promo: { code, discount, description } | null
  const prepareCheckout = useCallback((selectedGroups, promo = null) => {
    const normalized = Array.isArray(selectedGroups)
      ? selectedGroups.map((group) => ({
          ...group,
          items: Array.isArray(group.items) ? [...group.items] : [],
        }))
      : [];

    setCheckoutGroups(normalized);
    setCheckoutPromo(promo);
  }, []);

  // Dedicated checkout (buy-now) also writes to the same checkout source-of-truth.
  const startDirectCheckout = useCallback((product, quantity = 1) => {
    if (!product) return;

    const sellerId = product.sellerId || product.sellerName || "general";
    const item = {
      id: `${product._id || product.id}-${sellerId}-direct`,
      productId: product._id || product.id,
      name: product.name,
      image: product.image || "",
      price: product.price,
      quantity: Number(quantity) > 0 ? Number(quantity) : 1,
      moq: product.moq || 1,
      maxQuantity: product.stock || 9999,
      variant: product.variant || product.category || "—",
      stock: product.stock || 9999,
      sellerName: product.sellerName || "UnityShop Seller",
      sellerEmail: product.sellerEmail || "",
    };

    setCheckoutGroups([
      {
        id: `checkout-${sellerId}`,
        seller: {
          id: sellerId,
          name: product.sellerName || "UnityShop Seller",
          email: product.sellerEmail || "",
          verified: !!product.sellerVerified,
        },
        items: [item],
      },
    ]);
    setCheckoutPromo(null);
  }, []);

  // ─── Clear Checkout Items ─────────────────────────────────────────────────────
  const clearCheckoutItems = useCallback(() => {
    setCartGroups((prev) => {
      const paidItemIds = new Set(
        checkoutGroups.flatMap((g) => g.items.map((i) => i.id)),
      );
      return prev
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => !paidItemIds.has(item.id)),
        }))
        .filter((group) => group.items.length > 0);
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
        startDirectCheckout,
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
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
