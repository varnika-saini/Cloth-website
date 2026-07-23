// =====================================================================
// 🔐  ADMIN SESSION — server helper for Route Handlers (Node runtime)
// ---------------------------------------------------------------------
// Reads the signed session cookie and verifies it. Used by the product
// write endpoints (POST/PUT/DELETE) as defense-in-depth so they can
// never run unauthenticated, regardless of middleware.
//
// Kept separate from lib/adminAuth.js (which stays Edge-safe for the
// middleware) because this imports next/headers.
// =====================================================================
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/adminAuth";

// Returns the session payload if the caller is a logged-in admin, else null.
export async function getAdminSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySession(token);
}
