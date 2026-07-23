// =====================================================================
// ✅  VALIDATION — shared by client forms AND server API routes
// ---------------------------------------------------------------------
// Same rules run in the browser (instant feedback) and on the server
// (never trust the client). Each validate* function returns an object
// of { field: message }; empty object === valid.
// =====================================================================

export const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

export const isPhone = (v) => {
  const digits = String(v || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
};

const required = (v, min = 1) => String(v || "").trim().length >= min;

export function validateContact(data = {}) {
  const e = {};
  if (!required(data.name, 2)) e.name = "Please enter your full name.";
  if (!isEmail(data.email)) e.email = "Please enter a valid email address.";
  if (!isPhone(data.phone)) e.phone = "Please enter a valid phone number.";
  if (!required(data.address, 5)) e.address = "Please enter your address.";
  if (!required(data.message, 5))
    e.message = "Please enter a message (at least 5 characters).";
  return e;
}

export function validateOrder(data = {}) {
  const e = {};
  if (!required(data.name, 2)) e.name = "Please enter your full name.";
  if (!isEmail(data.email)) e.email = "Please enter a valid email address.";
  if (!isPhone(data.phone)) e.phone = "Please enter a valid phone number.";
  if (!required(data.address, 5))
    e.address = "Please enter your delivery address.";
  if (!required(data.size)) e.size = "Please select a size.";
  const qty = Number(data.quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 20)
    e.quantity = "Quantity must be between 1 and 20.";
  return e;
}

// ---------------------------------------------------------------------
// Admin: new / edited product. Runs in the admin form (instant feedback)
// AND in the API route (never trust the client).
// ---------------------------------------------------------------------
const isNum = (v) => Number.isFinite(Number(v)) && String(v).trim() !== "";

export function validateProduct(data = {}) {
  const e = {};
  if (!required(data.name, 2)) e.name = "Please enter a product name.";
  if (!required(data.description, 5))
    e.description = "Please enter a product description.";
  if (!required(data.category)) e.category = "Please choose a category.";

  if (!isNum(data.price) || Number(data.price) <= 0)
    e.price = "Enter a price greater than 0.";

  // Original price is optional, but if given it must beat the selling price.
  if (String(data.mrp ?? "").trim() !== "") {
    if (!isNum(data.mrp) || Number(data.mrp) < 0)
      e.mrp = "Original price must be a valid number.";
    else if (Number(data.mrp) > 0 && Number(data.mrp) < Number(data.price))
      e.mrp = "Original price should be higher than the selling price.";
  }

  if (!isNum(data.shippingCharge) || Number(data.shippingCharge) < 0)
    e.shippingCharge = "Enter a shipping charge (0 or more).";

  if (
    !isNum(data.stock) ||
    Number(data.stock) < 0 ||
    !Number.isInteger(Number(data.stock))
  )
    e.stock = "Enter stock quantity (whole number, 0 or more).";

  if (String(data.discount ?? "").trim() !== "") {
    const d = Number(data.discount);
    if (!isNum(data.discount) || d < 0 || d > 100)
      e.discount = "Discount must be between 0 and 100.";
  }

  if (!Array.isArray(data.sizes) || data.sizes.length === 0)
    e.sizes = "Select at least one size.";

  if (!Array.isArray(data.colors) || data.colors.filter(Boolean).length === 0)
    e.colors = "Add at least one colour.";

  if (!Array.isArray(data.images) || data.images.filter(Boolean).length === 0)
    e.images = "Upload at least one product image.";

  return e;
}
