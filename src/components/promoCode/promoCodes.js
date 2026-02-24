// lib/promoCodes.js
//
// ─── PROMO CODE CONFIGURATION ────────────────────────────────────────────────
//
// Add / edit / remove codes here. Two discount types are supported:
//
//   type: "percentage"  → discounts by X% of the subtotal
//   type: "fixed"       → subtracts a flat $ amount
//
// Optional fields:
//   minOrder  — minimum subtotal required to use the code
//   expiresAt — ISO date string; code is invalid after this date
//   description — shown to the user after applying
//
// ─────────────────────────────────────────────────────────────────────────────

export const PROMO_CODES = {
  // 10% off, no minimum
  UNITY10: {
    type: 'percentage',
    value: 10,
    description: '10% off your order',
  },

  // 20% off, minimum $100 order
  UNITY20: {
    type: 'percentage',
    value: 20,
    minOrder: 100,
    description: '20% off orders over $100',
  },

  // Flat $15 off, minimum $50 order
  SAVE15: {
    type: 'fixed',
    value: 15,
    minOrder: 50,
    description: '$15 off orders over $50',
  },

  // Flat $5 off, no minimum — welcome code
  WELCOME5: {
    type: 'fixed',
    value: 5,
    description: '$5 off your first order',
  },

  // 30% off, expires a specific date — seasonal example
  SALE30: {
    type: 'percentage',
    value: 30,
    expiresAt: '2026-12-31T23:59:59Z',
    description: '30% off — seasonal sale',
  },
};

// ─── Helper: validate a code and return result ───────────────────────────────
//
// Returns:
//   { valid: true,  promo, discount }   — on success
//   { valid: false, error }             — on failure

export function applyPromoCode(code, subtotal) {
  const promo = PROMO_CODES[code.trim().toUpperCase()];

  // Code not found
  if (!promo) {
    return { valid: false, error: 'Invalid promo code. Please try again.' };
  }

  // Expired
  if (promo.expiresAt && new Date() > new Date(promo.expiresAt)) {
    return { valid: false, error: 'This promo code has expired.' };
  }

  // Minimum order not met
  if (promo.minOrder && subtotal < promo.minOrder) {
    return {
      valid: false,
      error: `Minimum order of $${promo.minOrder.toFixed(2)} required for this code.`,
    };
  }

  // Calculate discount amount
  const discount =
    promo.type === 'percentage'
      ? parseFloat(((subtotal * promo.value) / 100).toFixed(2))
      : Math.min(promo.value, subtotal); // fixed: never discount more than subtotal

  return { valid: true, promo, discount };
}
