// =====================================================================
// 🧾  STORE SETTINGS — the numbers YOU control
// ---------------------------------------------------------------------
// Edit a value below, save the file, then redeploy (or restart the dev
// server). No other code needs to change — the checkout page, the order
// success screen, and the confirmation emails all read from here.
//
//   • Product PRICES live per-kurti in data/products.js (the `manualPrice`
//     field on each item). This file does NOT touch prices.
//   • SHIPPING is a single flat charge added to every order, set below.
// =====================================================================

// Flat shipping charge (in ₹) added to every order. Set to 0 for free
// shipping — the checkout will then show "Shipping ₹0".
export const SHIPPING_FEE = 50;

// Shipping charged for an order total (subtotal). Flat fee whenever the
// order has at least one item; ₹0 for an empty order. Keeping the rule in
// one helper means the whole app stays consistent — change it here and it
// updates everywhere (checkout, success screen, emails).
export function calcShipping(subtotal) {
  return subtotal > 0 ? SHIPPING_FEE : 0;
}
