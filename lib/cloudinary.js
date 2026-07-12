// =====================================================================
// ☁️  CLOUDINARY — server-side config (SECRET stays on the server)
// ---------------------------------------------------------------------
// Imported ONLY by server code (app/api/sign-cloudinary/route.js).
// The API Secret is read from process.env on the server and is never
// bundled into client JavaScript. See .env.local for the variables.
// =====================================================================
import { v2 as cloudinary } from "cloudinary";

export const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
export const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Folder that uploaded product images land in (created automatically by
// Cloudinary on first upload — no dashboard step needed).
export const UPLOAD_FOLDER =
  process.env.CLOUDINARY_UPLOAD_FOLDER || "short-kurti-store/products";

// True only when all three credentials are present.
export const isConfigured = Boolean(cloudName && apiKey && apiSecret);

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export { cloudinary };
