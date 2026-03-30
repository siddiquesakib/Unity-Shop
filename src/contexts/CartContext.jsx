"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import toast from "react-hot-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";

const CartContext = createContext(null);

// ─── Sanitize every numeric field on any item from ANY source ────────────────
// Handles: strings ("2"), undefined, null, objects, NaN — all become safe numbers
const sanitizeItem = (item) => ({
  ...item,
  quantity: Math.max(1, Number(item.quantity) || 1),
  price: Math.max(0, Number(item.price) || 0),
  moq: Math.max(1, Number(item.moq) || 1),
  maxQuantity: Math.max(1, Number(item.maxQuantity) || 9999),
  stock: Math.max(0, Number(item.stock) || 0),
});

// Sanitize an entire groups array (used when loading from localStorage or backend)
const sanitizeGroups = (groups) =>
  Array.isArray(groups)
    ? groups.map((g) => ({
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
  const getAuthToken = useCallback(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("unityshop_cart");
        if (saved) {
          // sanitizeGroups fixes any stale string/undefined fields from old schema
          setCartGroups(sanitizeGroups(JSON.parse(saved)));
        }
        const savedLater = localStorage.getItem("unityshop_saved");
        if (savedLater) {
          setSavedItems((JSON.parse(savedLater) || []).map(sanitizeItem));
        }

        const savedCheckout = localStorage.getItem("unityshop_checkout");
        if (savedCheckout) {
          setCheckoutGroups(JSON.parse(savedCheckout));
        }

        const savedCheckoutPromo = localStorage.getItem(
          "unityshop_checkout_promo",
        );
        if (savedCheckoutPromo) {
          setCheckoutPromo(JSON.parse(savedCheckoutPromo));
        }
      }
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
    }
    setHydrated(true);
  }, []);

  // ─── Backend sync when user logs in ─────────────────────────────────────────
  useEffect(() => {
    // Only sync if the user ID actually changed and we didn't just clear the cart.
    if (
      user?._id &&
      lastSyncedUserRef.current !== user._id &&
      !isJustClearedRef.current
    ) {
      lastSyncedUserRef.current = user._id;

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
          if (Array.isArray(data) && data.length > 0) {
            const groups = {};
            data.forEach((item) => {
              const sellerId = item.sellerId || "general";
              const priceTag =
                item.pricingType === "negotiated"
                  ? `-offer-${Number(item.price)}`
                  : "";

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

              const newItem = sanitizeItem({
                id: `${item.productId}-${sellerId}${priceTag}`,
                productId: item.productId,
                name: item.name,
                image: item.image,
                price: item.price,
                originalPrice: item.originalPrice || item.price,
                quantity: item.quantity,
                stock: item.stock,
                moq: item.moq,
                maxQuantity: item.stock || 9999,
                variant: item.category || "—",
                sellerName: item.sellerName,
                sellerEmail: item.sellerEmail,
                pricingType: item.pricingType || "standard",
              });

              groups[sellerId].items.push(newItem);
            });

            setCartGroups(Object.values(groups));
          }
        })
        .catch((err) =>
          console.error("[CartContext] Failed to sync cart:", err),
        );
    } else if (!user?._id) {
      // Clear ref when user logs out
      lastSyncedUserRef.current = null;
    }
  }, [getAuthToken, user?._id]);

  // ─── Persist to localStorage ─────────────────────────────────────────────────
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

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(
        "unityshop_checkout",
        JSON.stringify(checkoutGroups),
      );
    }
  }, [checkoutGroups, hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(
        "unityshop_checkout_promo",
        JSON.stringify(checkoutPromo),
      );
    }
  }, [checkoutPromo, hydrated]);

  // ─── Save for Later ──────────────────────────────────────────────────────────
  const moveToSaved = useCallback((itemId) => {
    let found = null;
    setCartGroups((prev) => {
      const next = prev
        .map((g) => {
          const item = g.items.find((i) => i.id === itemId);
          if (item) found = { ...item };
          return { ...g, items: g.items.filter((i) => i.id !== itemId) };
        })
        .filter((g) => g.items.length > 0);
      return next;
    });
    if (found) {
      setSavedItems((prev) => {
        if (prev.some((i) => i.id === found.id)) return prev;
        return [...prev, sanitizeItem(found)];
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
    if (found) {
      const safeFound = sanitizeItem(found);
      setCartGroups((prev) => {
        const sellerId =
          safeFound.sellerId || safeFound.sellerName || "general";
        const groups = prev.map((g) => ({ ...g, items: [...g.items] }));
        const gIdx = groups.findIndex((g) => g.seller.id === sellerId);
        if (gIdx !== -1) {
          const eIdx = groups[gIdx].items.findIndex(
            (i) =>
              i.productId === safeFound.productId &&
              Number(i.price) === Number(safeFound.price),
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
              name: safeFound.sellerName || "UnityShop Seller",
              email: safeFound.sellerEmail || "",
              verified: false,
            },
            items: [safeFound],
          });
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
    (product, quantity = 1, overridePrice = null) => {
      const sellerId = product.sellerId || product.sellerName || "general";
      const sellerName = product.sellerName || "UnityShop Seller";
      const moq = product.moq || 1;
      const parsedOverridePrice =
        overridePrice !== null && overridePrice !== undefined
          ? Number(overridePrice)
          : null;
      const hasOverridePrice =
        parsedOverridePrice !== null &&
        Number.isFinite(parsedOverridePrice) &&
        parsedOverridePrice > 0;
      const finalPrice = hasOverridePrice
        ? parsedOverridePrice
        : Number(product.price);
      const baseProductPrice = Number(product.price);
      const pricingType = hasOverridePrice ? "negotiated" : "standard";
      const itemId = hasOverridePrice
        ? `${product._id || product.id}-${sellerId}-offer-${finalPrice}`
        : `${product._id || product.id}-${sellerId}`;

      // Optimistic update
      setCartGroups((prev) => {
        const groups = prev.map((g) => ({ ...g, items: [...g.items] }));
        const groupIdx = groups.findIndex((g) => g.seller.id === sellerId);

        const newItem = {
          id: itemId,
          productId: product._id || product.id,
          name: product.name,
          image: product.image || "",
          price: finalPrice,
          originalPrice: baseProductPrice,
          quantity,
          moq,
          maxQuantity: product.stock || 9999,
          variant: product.variant || product.category || "—",
          stock: product.stock || 9999,
          sellerName,
          sellerEmail: product.sellerEmail || "",
          pricingType,
        };

        if (groupIdx !== -1) {
          const itemIdx = groups[groupIdx].items.findIndex(
            (i) =>
              i.productId === newItem.productId &&
              Number(i.price) === Number(newItem.price),
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
            overridePrice: hasOverridePrice ? finalPrice : null,
            originalPrice: hasOverridePrice ? baseProductPrice : null,
            pricingType,
          }),
        }).catch((err) => console.error("Failed to add to cart backend:", err));
      }

      toast.success("Added to cart!");

      if (createNotification) {
        createNotification({
          type: "cart_add",
          title: "Added to Cart",
          message: hasOverridePrice
            ? `Added ${product.name} to your cart at negotiated price $${finalPrice}.`
            : `Added ${product.name} to your cart.`,
        });
      }
    },
    [createNotification, getAuthToken, user],
  );

  // ─── Remove Item ─────────────────────────────────────────────────────────────
  const removeItem = useCallback(
    (itemId) => {
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
      // Always coerce newQty first — it may arrive as NaN from a bad caller
      const safeQty = Number(newQty) || 1;

      let productIdToUpdate = null;
      let finalQuantity = safeQty;

      if (user?._id) {
        for (const group of cartGroups) {
          const item = group.items.find((i) => i.id === itemId);
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

      setCartGroups((prev) =>
        prev.map((group) => ({
          ...group,
          items: group.items.map((item) => {
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
  const prepareCheckout = useCallback((selectedGroups, promo = null) => {
    const normalized = Array.isArray(selectedGroups)
      ? selectedGroups.map((group) => ({
          ...group,
          items: Array.isArray(group.items) ? [...group.items] : [],
        }))
      : [];

    setCheckoutGroups(normalized);
    setCheckoutPromo(promo);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "unityshop_checkout",
        JSON.stringify(selectedGroups),
      );
      localStorage.setItem("unityshop_checkout_promo", JSON.stringify(promo));
    }
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
  const clearCheckoutItems = useCallback(async () => {
    // Snapshot the paid item IDs + productIds before mutating state
    const paidItems = checkoutGroups.flatMap((g) =>
      g.items.map((i) => ({ id: i.id, productId: i.productId })),
    );
    const paidItemIds = new Set(paidItems.map((i) => i.id));

    // 1. Clear from local state (same as before)
    setCartGroups((prev) =>
      prev
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => !paidItemIds.has(item.id)),
        }))
        .filter((group) => group.items.length > 0),
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
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
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
        console.error("Error removing paid items from backend:", err);
      }
    }
  }, [checkoutGroups, user]);

  // ─── Clear Entire Cart ────────────────────────────────────────────────────────
  const clearCart = useCallback(
    async (userIdOverride = null) => {
      console.log("[clearCart] Called with userIdOverride:", userIdOverride);

      // Set flag to prevent sync right after clearing
      isJustClearedRef.current = true;
      console.log(
        "[clearCart] Set isJustClearedRef to true - will prevent sync",
      );

      // 1. Snapshot all items from BOTH cartGroups and checkoutGroups
      // (checkout items should be in cart, but just to be safe)
      const cartItems = cartGroups.flatMap((g) =>
        g.items.map((i) => i.productId),
      );
      const checkoutItems = checkoutGroups.flatMap((g) =>
        g.items.map((i) => i.productId),
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
      console.log("[clearCart] Local state cleared");

      // 3. Also explicitly clear localStorage to be safe
      if (typeof window !== "undefined") {
        localStorage.removeItem("unityshop_cart");
        localStorage.removeItem("unityshop_saved");
        console.log("[clearCart] localStorage cleared");
      }

      // 4. Delete every item from the backend so the GET /cart sync on
      //    refresh finds nothing and does not repopulate the cart.
      if (userId && allProductIds.length > 0) {
        // Wait for all DELETE requests to complete before returning
        try {
          await Promise.all(
            allProductIds.map(async (productId) => {
              console.log(
                `[clearCart] Deleting product ${productId} from backend...`,
              );
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/cart/remove`,
                {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
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
            "[clearCart] ✓✓✓ All products successfully removed from backend",
          );
        } catch (err) {
          console.error(
            "Error removing items from backend during clearCart:",
            err,
          );
          throw new Error(`Failed to clear cart from backend: ${err.message}`);
        }
      } else {
        console.warn(
          "[clearCart] Skipped backend deletion: no userId or products",
        );
      }

      // Reset the flag only after a reasonable delay to ensure network requests
      // complete and prevent re-population race condition
      setTimeout(() => {
        isJustClearedRef.current = false;
        console.log(
          "[clearCart] Reset isJustClearedRef to false - sync allowed again",
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
