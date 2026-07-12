// =====================================================================
// POST /api/sign-cloudinary
// ---------------------------------------------------------------------
// Returns a short-lived signature so the browser can upload an image
// directly to Cloudinary WITHOUT ever seeing the API Secret.
//
// Why this is the secure approach:
//   • The API Secret never leaves the server — it is used here only to
//     compute a SHA-1 signature over the (non-secret) upload params.
//   • No unsigned upload preset is required, so uploads can't be abused
//     by anyone who inspects the client code.
//   • Files go browser → Cloudinary directly, so they don't count
//     against serverless request-body size limits.
// =====================================================================
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  cloudinary,
  cloudName,
  apiKey,
  isConfigured,
  UPLOAD_FOLDER,
} from "@/lib/cloudinary";
import { verifySession, SESSION_COOKIE } from "@/lib/adminAuth";

// Cloudinary SDK needs Node crypto — force the Node.js runtime.
export const runtime = "nodejs";

export async function POST() {
  // Defense in depth: middleware already guards this route, but we also
  // verify the admin session here so it can never sign an upload unauthenticated.
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isConfigured) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env.local, then restart the dev server.",
      },
      { status: 500 }
    );
  }

  // Only non-secret params are signed. The client MUST send back exactly
  // these same values (timestamp + folder) with the upload.
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder: UPLOAD_FOLDER };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  return NextResponse.json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder: UPLOAD_FOLDER,
  });
}
