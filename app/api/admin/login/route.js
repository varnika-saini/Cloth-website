// =====================================================================
// POST /api/admin/login   { email, password }
// ---------------------------------------------------------------------
// Verifies credentials against ADMIN_EMAIL / ADMIN_PASSWORD (server-only)
// and, on success, sets a signed httpOnly session cookie.
// =====================================================================
import { NextResponse } from "next/server";
import {
  signSession,
  safeEqual,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (!adminEmail || !adminPassword || !secret) {
    return NextResponse.json(
      {
        error:
          "Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and SESSION_SECRET in .env.local, then restart the server.",
      },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  // Constant-time checks; combine so neither field short-circuits.
  const emailOk = safeEqual(email, adminEmail.trim().toLowerCase());
  const passOk = safeEqual(password, adminPassword);

  if (!emailOk || !passOk) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const expMs = Date.now() + SESSION_MAX_AGE * 1000;
  const token = await signSession(adminEmail.trim().toLowerCase(), expMs);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
