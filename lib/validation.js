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
