// app/checkout/page.jsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiChevronLeft,
  FiAlertCircle,
  FiPackage,
  FiInfo,
  FiShield,
  FiLock,
  FiCheck,
} from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import PaymentButton from "@/components/common/payment-button/PaymentButton";
import PromoCodeInput from "@/components/promoCode/PromoCodeInput";
import ShippingForm from "@/components/checkout/ShippingForm"; // Import ShippingForm

const SHOP_EMAIL = process.env.NEXT_PUBLIC_SHOP_EMAIL || "shop@unityshop.com";
const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME || "UnityShop";


export default function CheckoutPage() {
  const { checkoutGroups, checkoutPromo } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";

  useEffect(() => {
    if (checkoutGroups.length === 0) {
      router.replace("/cart");
    }
  }, [checkoutGroups, router]);

  if (checkoutGroups.length === 0) return null;

  // ── Local promo state (pre-filled from cart if available) ──────────────
  const [appliedPromo, setAppliedPromo] = useState(checkoutPromo || null);
  const [shippingInfo, setShippingInfo] = useState(null); // Added Shipping Info State


  // ── Compute totals ────────────────────────────────────────────────────────
  const subtotal = checkoutGroups.reduce(
    (total, group) =>
      total + group.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0,
  );

  const discountAmount = appliedPromo
    ? Math.min(appliedPromo.discount, subtotal)
    : 0;

  // ── Calculate International Costs (Phase 2) ─────────────────────────────
  // Assumes all items are international for now or checks flags if available
  const totalWeight = checkoutGroups.reduce(
    (w, group) =>
      w +
      group.items.reduce(
        (wg, i) => wg + (Number(i.weight) || 0.5) * i.quantity,
        0,
      ),
    0,
  );

  // Simple Shipping Model: $15 base + $10/kg over 1kg
  const shippingCost =
    totalWeight > 0 ? 15 + Math.max(0, Math.ceil(totalWeight - 1)) * 10 : 0;

  const customsFee = subtotal * 0.15; // 15% Estimated
  const platformFee = subtotal * 0.05; // 5% Platform Fee

  const grandTotal = Math.max(
    0,
    subtotal - discountAmount + shippingCost + customsFee + platformFee,
  );

  const totalQty = checkoutGroups.reduce(
    (total, group) => total + group.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );

  const totalUniqueProducts = checkoutGroups.reduce(
    (n, g) => n + g.items.length,
    0,
  );

  const productSummary = checkoutGroups
    .flatMap((g) => g.items.map((i) => `${i.name} (×${i.quantity})`))
    .join(", ");

  const allProductIds = checkoutGroups
    .flatMap((g) => g.items.map((i) => i.productId))
    .join(",");

  const steps = [
    { label: "Cart", done: true },
    { label: "Checkout", active: true },
    { label: "Payment", done: false },
    { label: "Confirmation", done: false },
  ];

  return (<div />);
}
