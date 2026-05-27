// =====================================================================
// 🎨  ALL IMAGES — your own photos from /public/images
// ---------------------------------------------------------------------
// To add or change a photo:
//   1. Drop the file into  D:\Short-kurti-store\public\images
//   2. Add its filename to LOCAL_IMAGES below, e.g. "/images/img24.jpg"
// Filenames are case-sensitive and must match exactly (Vercel is Linux).
// =====================================================================

// Every photo currently in /public/images, in order.
const LOCAL_IMAGES = [
  "/images/img1.webp",
  "/images/img2.avif",
  "/images/img3.jpg",
  "/images/img4.jpg",
  "/images/img5.webp",
  "/images/img6.jpg",
  "/images/img7.jpg",
  "/images/img8.jpg",
  "/images/img9.jpg",
  "/images/img10.webp",
  "/images/img11.jpg",
  "/images/img12.jpg",
  "/images/img13.webp",
  "/images/img14.jpg",
  "/images/img15.jpg",
  "/images/img16.webp",
  "/images/img17.webp",
  "/images/img18.webp",
  "/images/img19.webp",
  "/images/img20.webp",
  "/images/img21.jpg",
  "/images/img22.avif",
  "/images/img23.webp",
];

// 1️⃣  HERO — big homepage picture (first photo).
export const HERO_IMAGE = LOCAL_IMAGES[0];

// 2️⃣  KURTI IMAGES — one per product (30). Cycles through your photos
//      so every kurti shows one of YOUR images (no stock photos).
export const KURTI_IMAGES = Array.from(
  { length: 30 },
  (_, i) => LOCAL_IMAGES[i % LOCAL_IMAGES.length]
);

// 3️⃣  CATEGORY IMAGES — six category tiles.
const CATEGORY_SLUGS = [
  "floral",
  "embroidered",
  "festive",
  "casual",
  "solid",
  "printed",
];
export const CATEGORY_IMAGES = Object.fromEntries(
  CATEGORY_SLUGS.map((slug, i) => [slug, LOCAL_IMAGES[i % LOCAL_IMAGES.length]])
);

// ---------------------------------------------------------------------
// Helpers used by the rest of the site. (Don't need to edit.)
// ---------------------------------------------------------------------
export const kurtiImage = (index) =>
  KURTI_IMAGES[index] || LOCAL_IMAGES[index % LOCAL_IMAGES.length];

export const categoryImage = (slug) =>
  CATEGORY_IMAGES[slug] || LOCAL_IMAGES[0];
