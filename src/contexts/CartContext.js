// contexts/CartContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cartItems));

    // Calculate totals
    const items = cartItems.reduce(
      (acc, sellerGroup) =>
        acc + sellerGroup.items.reduce((sum, item) => sum + item.quantity, 0),
      0,
    );
    const price = cartItems.reduce(
      (acc, sellerGroup) =>
        acc +
        sellerGroup.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
      0,
    );

    setTotalItems(items);
    setTotalPrice(price);
  }, [cartItems]);

  const addToCart = (product, quantity, variant = null) => {
    // Find if product already exists from same seller
    const sellerId = product.supplier?.id || "unknown";
    const existingSellerIndex = cartItems.findIndex(
      (g) => g.seller.id === sellerId,
    );

    if (existingSellerIndex >= 0) {
      // Check if product already in seller's items
      const existingItemIndex = cartItems[existingSellerIndex].items.findIndex(
        (item) => item.productId === product.id && item.variant === variant,
      );

      if (existingItemIndex >= 0) {
        // Update quantity
        const updatedCart = [...cartItems];
        updatedCart[existingSellerIndex].items[existingItemIndex].quantity +=
          quantity;
        setCartItems(updatedCart);
      } else {
        // Add new item to existing seller
        const updatedCart = [...cartItems];
        updatedCart[existingSellerIndex].items.push({
          id: `item-${Date.now()}`,
          productId: product.id,
          name: product.name,
          image: product.images[0],
          price: product.priceTiers[0].price,
          quantity,
          moq: product.moq,
          maxQuantity: product.stock,
          variant,
          stock: product.stock,
        });
        setCartItems(updatedCart);
      }
    } else {
      // Create new seller group
      setCartItems([
        ...cartItems,
        {
          id: `cart-${Date.now()}`,
          seller: {
            id: sellerId,
            name: product.supplier?.name || "Supplier",
            verified: product.supplier?.verified || false,
          },
          items: [
            {
              id: `item-${Date.now()}`,
              productId: product.id,
              name: product.name,
              image: product.images[0],
              price: product.priceTiers[0].price,
              quantity,
              moq: product.moq,
              maxQuantity: product.stock,
              variant,
              stock: product.stock,
            },
          ],
        },
      ]);
    }
  };

  const removeFromCart = (sellerIndex, itemIndex) => {
    const updatedCart = [...cartItems];
    updatedCart[sellerIndex].items.splice(itemIndex, 1);
    if (updatedCart[sellerIndex].items.length === 0) {
      updatedCart.splice(sellerIndex, 1);
    }
    setCartItems(updatedCart);
  };

  const updateQuantity = (sellerIndex, itemIndex, newQuantity) => {
    const updatedCart = [...cartItems];
    updatedCart[sellerIndex].items[itemIndex].quantity = newQuantity;
    setCartItems(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
