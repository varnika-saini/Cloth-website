import { kurtiImage } from "./images";

const baseSizes = ["XS", "S", "M", "L", "XL"];

const defs = [
  // FLORAL — 5
  { name: "Blush Bloom Floral Kurti", category: "floral", price: 1299, mrp: 2199, rating: 4.7, reviews: 128, badge: "Bestseller", isNew: true, colors: ["#fbb1bd", "#ece4ff", "#faf3ea"], desc: "A dreamy A-line short kurti in soft cotton with delicate floral prints, V-neck, and three-quarter sleeves.", manualPrice: 250 },
  { name: "Peach Dream Floral Kurti", category: "floral", price: 1399, mrp: 2299, rating: 4.7, reviews: 88, badge: "Loved", isNew: true, colors: ["#fdcfd6", "#f4e6d2", "#fff5f6"], desc: "Peach-toned floral kurti with ruffle hem and balloon sleeves. Romance, distilled.", manualPrice: 250 },
  { name: "Daisy Whisper Floral Kurti", category: "floral", price: 1099, mrp: 1799, rating: 4.5, reviews: 152, badge: "Trending", colors: ["#fff5f6", "#fbb1bd", "#cf975e"], desc: "Daisy-print cotton kurti with notch neckline and a softly flared hem.", manualPrice: 200 },
  { name: "Jasmine Breeze Floral Kurti", category: "floral", price: 1249, mrp: 1999, rating: 4.6, reviews: 96, badge: "New", isNew: true, colors: ["#fdfaf6", "#f48aa1", "#ecd2ae"], desc: "Tiny jasmine motifs across a light viscose base. Cool, airy, and effortlessly pretty.", manualPrice: 250 },
  { name: "Pink Lotus Floral Kurti", category: "floral", price: 1499, mrp: 2399, rating: 4.8, reviews: 64, badge: "Editor's pick", colors: ["#f48aa1", "#bda6f7", "#fdfaf6"], desc: "Lotus blooms on rose-pink rayon with a delicate scalloped hem.", manualPrice: 200 },

  // EMBROIDERED — 5
  { name: "Lavender Mist Embroidered Kurti", category: "embroidered", price: 1599, mrp: 2599, rating: 4.8, reviews: 96, badge: "New", isNew: true, colors: ["#d8c8ff", "#fff5f6", "#f4e6d2"], desc: "Hand-embroidered thread work on breathable rayon with intricate motifs at neckline and hem.", manualPrice: 200 },
  { name: "Amber Thread Embroidered Kurti", category: "embroidered", price: 1799, mrp: 2899, rating: 4.9, reviews: 76, badge: "Editor's pick", isNew: true, colors: ["#cf975e", "#fdcfd6", "#171724"], desc: "Warm amber threads tracing a delicate vine pattern across a soft cream base.", manualPrice: 200 },
  { name: "Pearl Gota Embroidered Kurti", category: "embroidered", price: 1999, mrp: 3299, rating: 4.8, reviews: 54, badge: "Premium", colors: ["#fff5f6", "#ecd2ae", "#d8c8ff"], desc: "Pearl beadwork and dainty gota patti on a soft chiffon. Made for sangeet evenings.", manualPrice: 280 },
  { name: "Mirror Magic Embroidered Kurti", category: "embroidered", price: 1899, mrp: 3099, rating: 4.7, reviews: 89, badge: "Trending", colors: ["#a93857", "#cf975e", "#171724"], desc: "Tiny mirror work scattered across a rich rust kurti with a tasselled tie-up.", manualPrice: 200 },
  { name: "Zari Whisper Kurti", category: "embroidered", price: 1699, mrp: 2799, rating: 4.6, reviews: 120, badge: "Loved", colors: ["#ecd2ae", "#fff5f6", "#7b2942"], desc: "Subtle zari embroidery framing the yoke of a flowy cream kurti.", manualPrice: 200 },

  // FESTIVE — 5
  { name: "Festive Glow Zari Kurti", category: "festive", price: 1899, mrp: 3499, rating: 4.9, reviews: 64, badge: "Festive", colors: ["#d24c6f", "#7d62da", "#cf975e"], desc: "A glowing festive kurti with zari embroidery and sequin highlights.", manualPrice: 200 },
  { name: "Royal Velvet Festive Kurti", category: "festive", price: 2299, mrp: 3999, rating: 4.8, reviews: 54, badge: "Premium", colors: ["#4b3892", "#7b2942", "#cf975e"], desc: "Plush velvet kurti with mirror work and dori tassels. Made for the spotlight.", manualPrice: 250 },
  { name: "Maharani Gold Festive Kurti", category: "festive", price: 2499, mrp: 4299, rating: 4.9, reviews: 38, badge: "Premium", isNew: true, colors: ["#cf975e", "#a93857", "#171724"], desc: "Regal gold zari on burgundy silk — the showstopper of every occasion.", manualPrice: 400 },
  { name: "Diwali Sparkle Festive Kurti", category: "festive", price: 2099, mrp: 3599, rating: 4.7, reviews: 71, badge: "Festive", colors: ["#a93857", "#cf975e", "#fff5f6"], desc: "Sequins, zari and shine — built for the brightest night of the year.", manualPrice: 400 },
  { name: "Sangeet Shine Kurti", category: "festive", price: 1999, mrp: 3299, rating: 4.7, reviews: 82, badge: "Trending", isNew: true, colors: ["#7d62da", "#fbb1bd", "#cf975e"], desc: "Lightweight sequinned kurti you can dance the night away in.", manualPrice: 400 },

  // CASUAL — 5
  { name: "Breeze Casual Cotton Kurti", category: "casual", price: 799, mrp: 1499, rating: 4.4, reviews: 302, badge: "Steal", colors: ["#ece4ff", "#fff5f6", "#faf3ea"], desc: "Soft cotton with breathable weave. The everyday short kurti you'll keep reaching for.", manualPrice: 400 },
  { name: "Minimal Mint Casual Kurti", category: "casual", price: 899, mrp: 1599, rating: 4.3, reviews: 110, badge: "Steal", colors: ["#cfeee0", "#fff5f6", "#faf3ea"], desc: "Clean lines, mint freshness and a relaxed fit. Everyday minimalism, done right.", manualPrice: 380 },
  { name: "Sunday Linen Casual Kurti", category: "casual", price: 1099, mrp: 1899, rating: 4.6, reviews: 178, badge: "Loved", isNew: true, colors: ["#fdfaf6", "#ecd2ae", "#fbb1bd"], desc: "Easy linen kurti for slow Sunday mornings and impromptu lunches.", manualPrice: 450 },
  { name: "Coffee Date Casual Kurti", category: "casual", price: 999, mrp: 1799, rating: 4.5, reviews: 140, badge: "Trending", colors: ["#cf975e", "#fdfaf6", "#7b2942"], desc: "Warm caramel hues, neat tailoring and pockets — yes, real pockets.", manualPrice: 450 },
  { name: "Morning Sun Casual Kurti", category: "casual", price: 849, mrp: 1499, rating: 4.4, reviews: 220, colors: ["#fff5f6", "#fdcfd6", "#ecd2ae"], desc: "A soft yellow cotton kurti that feels like a sunbeam through the window.", manualPrice: 500 },

  // SOLID — 5
  { name: "Ivory Grace Solid Kurti", category: "solid", price: 999, mrp: 1799, rating: 4.5, reviews: 212, badge: "Trending", colors: ["#faf3ea", "#fdcfd6", "#171724"], desc: "A minimalist ivory short kurti with mandarin collar and side slits.", manualPrice: 400 },
  { name: "Moonlit Mauve Solid Kurti", category: "solid", price: 1499, mrp: 2499, rating: 4.6, reviews: 142, badge: "New", colors: ["#bda6f7", "#fdcfd6", "#171724"], desc: "A mauve solid kurti with pleated front and pearl buttons.", manualPrice: 500 },
  { name: "Midnight Charcoal Solid Kurti", category: "solid", price: 1299, mrp: 2199, rating: 4.7, reviews: 98, colors: ["#2d2a32", "#fff5f6", "#cf975e"], desc: "Deep charcoal cotton-silk with a clean V-neckline. Always elegant.", manualPrice: 400 },
  { name: "Olive Whisper Solid Kurti", category: "solid", price: 1149, mrp: 1949, rating: 4.5, reviews: 124, badge: "Loved", colors: ["#7a7a4a", "#fdfaf6", "#cf975e"], desc: "An olive-toned everyday kurti with neat side slits and a relaxed silhouette.", manualPrice: 250 },
  { name: "Sage Silk Solid Kurti", category: "solid", price: 1399, mrp: 2299, rating: 4.6, reviews: 88, badge: "New", isNew: true, colors: ["#b6c7a8", "#fdfaf6", "#cf975e"], desc: "Soft sage silk with a quiet sheen. Understated, refined.", manualPrice: 200 },

  // PRINTED — 5
  { name: "Rose Petals Printed Kurti", category: "printed", price: 1199, mrp: 1999, rating: 4.6, reviews: 174, badge: "Hot", colors: ["#f48aa1", "#fdcfd6", "#ece4ff"], desc: "Soft viscose with rose petal prints, gathered yoke and bell sleeves.", manualPrice: 150 },
  { name: "Sunset Bloom Printed Kurti", category: "printed", price: 1099, mrp: 1899, rating: 4.5, reviews: 198, badge: "Trending", colors: ["#cf975e", "#f48aa1", "#ece4ff"], desc: "Sunset hues meet ditsy florals on a soft rayon base.", manualPrice: 200 },
  { name: "Paisley Dream Printed Kurti", category: "printed", price: 1349, mrp: 2199, rating: 4.7, reviews: 102, badge: "New", isNew: true, colors: ["#7b2942", "#cf975e", "#fff5f6"], desc: "Classic paisley motifs on a warm rust base. A timeless print, freshly cut.", manualPrice: 200 },
  { name: "Ikat Charm Printed Kurti", category: "printed", price: 1499, mrp: 2399, rating: 4.7, reviews: 84, badge: "Loved", colors: ["#4b3892", "#fdfaf6", "#cf975e"], desc: "Hand-loomed ikat print on soft cotton — bold, graphic and grounded.", manualPrice: 200 },
  { name: "Bandhani Joy Printed Kurti", category: "printed", price: 1249, mrp: 2049, rating: 4.6, reviews: 144, badge: "Trending", colors: ["#a93857", "#fdfaf6", "#cf975e"], desc: "Tiny bandhani dots dancing across a deep rose base.", manualPrice: 180 },
];

// Every kurti now uses an explicit manualPrice (₹150–₹500). The auto-scaling
// formula below is the fallback for any def without one. The crossed-out MRP
// is derived as price + ~₹99 (rounded to a "₹x9" ending) so it always sits
// above the selling price; manualMrp can override it per kurti.
const MAX_DEF_PRICE = 2499;
const nice = (n) => Math.round(n / 10) * 10 - 1; // "₹x9" retail ending
const sellPrice = (orig) => nice((orig / MAX_DEF_PRICE) * 200 + 149);
const mrpPrice = (price) => nice(price + 99);

export const products = defs.map((d, i) => {
  // manualPrice/manualMrp override the auto-scaling formula for that kurti
  const price = d.manualPrice ?? sellPrice(d.price);
  return {
    id: `${d.category}-${String(i + 1).padStart(2, "0")}`,
    name: d.name,
    price,
    mrp: d.manualMrp ?? mrpPrice(price),
    rating: d.rating,
    reviews: d.reviews,
    category: d.category,
    colors: d.colors,
    sizes: i % 5 === 0 ? ["S", "M", "L", "XL"] : baseSizes,
    badge: d.badge,
    isNew: d.isNew || false,
    description: d.desc,
    images: [kurtiImage(i)],
  };
});

export const findProduct = (id) => products.find((p) => p.id === id);

export const getRelated = (id, limit = 4) => {
  const current = findProduct(id);
  if (!current) return [];
  return products
    .filter((p) => p.id !== id && p.category === current.category)
    .slice(0, limit);
};

export const reviews = [
  {
    name: "Aanya M.",
    avatar: "https://i.pravatar.cc/120?img=47",
    rating: 5,
    text: "The fabric is buttery soft and the fit is just perfect. I keep getting compliments!",
    product: "Blush Bloom Floral Kurti",
  },
  {
    name: "Sneha R.",
    avatar: "https://i.pravatar.cc/120?img=32",
    rating: 5,
    text: "Beautifully crafted embroidery. Feels premium and the colors are exactly as shown.",
    product: "Lavender Mist Embroidered Kurti",
  },
  {
    name: "Priya K.",
    avatar: "https://i.pravatar.cc/120?img=15",
    rating: 4,
    text: "Lightweight, breathable, and so easy to style. My new favourite for office days.",
    product: "Ivory Grace Solid Kurti",
  },
  {
    name: "Kavya S.",
    avatar: "https://i.pravatar.cc/120?img=49",
    rating: 5,
    text: "Festive glow is *the* outfit. Compliments all evening.",
    product: "Festive Glow Zari Kurti",
  },
];
