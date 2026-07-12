// =====================================================================
// 🛡️  MIDDLEWARE — gate every /admin route + the upload API
// ---------------------------------------------------------------------
// Runs before the matched routes render. Unauthenticated visitors are
// redirected to /admin/login (or get a 401 for API calls). Only the
// login page and the login/logout endpoints are public. The rest of the
// site is NOT matched, so existing pages are completely unaffected.
// =====================================================================
import { NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/adminAuth";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Public: the login page and the auth endpoints (so you can log in).
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    // API calls get a clean 401 instead of an HTML redirect.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Only these paths run through the middleware — nothing else on the site.
  matcher: ["/admin", "/admin/:path*", "/api/sign-cloudinary"],
};
