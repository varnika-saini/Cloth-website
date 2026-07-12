// =====================================================================
// 🔐  ADMIN AUTH — stateless, signed session cookie
// ---------------------------------------------------------------------
// A tiny JWT-style token: base64url(payload).base64url(HMAC-SHA256).
// Built on the Web Crypto API (globalThis.crypto.subtle) so the SAME
// code runs in Edge middleware AND Node route handlers — no extra deps.
//
// The ADMIN_EMAIL / ADMIN_PASSWORD are checked only in the login route;
// they never leave the server. The cookie holds only the email + expiry,
// signed with SESSION_SECRET so it can't be forged or tampered with.
// =====================================================================

export const SESSION_COOKIE = "sk_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

const enc = new TextEncoder();
const dec = new TextDecoder();

const secret = () => process.env.SESSION_SECRET || "";

// ---- base64url helpers (Buffer-free, work on Edge + Node) ----
function bytesToB64url(bytes) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToBytes(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = str.length % 4 ? 4 - (str.length % 4) : 0;
  str += "=".repeat(pad);
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacKey() {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Sign a session for `email`, valid until `expMs`.
export async function signSession(email, expMs) {
  if (!secret()) throw new Error("SESSION_SECRET is not set");
  const payload = bytesToB64url(enc.encode(JSON.stringify({ sub: email, exp: expMs })));
  const key = await hmacKey();
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return `${payload}.${bytesToB64url(new Uint8Array(sigBuf))}`;
}

// Verify a token. Returns the payload if valid & unexpired, else null.
export async function verifySession(token) {
  if (!token || !secret()) return null;
  const dot = token.indexOf(".");
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  try {
    const key = await hmacKey();
    // subtle.verify is constant-time — safe against timing attacks.
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64urlToBytes(sig),
      enc.encode(payload)
    );
    if (!ok) return null;
    const data = JSON.parse(dec.decode(b64urlToBytes(payload)));
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

// Constant-time string comparison for credential checks.
export function safeEqual(a = "", b = "") {
  const ea = enc.encode(a);
  const eb = enc.encode(b);
  // Compare against a fixed length to avoid early-exit length leaks.
  const len = Math.max(ea.length, eb.length);
  let diff = ea.length ^ eb.length;
  for (let i = 0; i < len; i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}
