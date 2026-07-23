// =====================================================================
// 🛍️  PRODUCTS — server-side data access (MongoDB)
// ---------------------------------------------------------------------
// The single source of truth for products at runtime. Storefront reads
// come through the /api/products route (which calls getAllProducts);
// admin create/edit/delete and the order route call these helpers too.
//
// normalize() turns a raw Mongo document into the exact public shape the
// UI expects (no _id, safe defaults) so the frontend never breaks on a
// missing field.
// =====================================================================
import { getProductsCollection } from "@/lib/mongodb";

// ---- helpers ----
const num = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const arr = (v) => (Array.isArray(v) ? v : []);

export function slugify(name = "") {
  return (
    String(name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "product"
  );
}

// Badge shown on cards — derived from the bestSeller / featured flags
// unless an explicit badge was stored (existing seeded products keep theirs).
function deriveBadge({ badge, bestSeller, featured }) {
  if (badge) return badge;
  if (bestSeller) return "Bestseller";
  if (featured) return "Featured";
  return null;
}

// Raw Mongo doc → public product object (exact shape the UI consumes).
export function normalize(doc) {
  if (!doc) return null;
  return {
    id: doc.id,
    name: doc.name || "",
    description: doc.description || "",
    category: doc.category || "",
    price: num(doc.price),
    mrp: num(doc.mrp),
    shippingCharge: num(doc.shippingCharge),
    stock: num(doc.stock),
    discount: num(doc.discount),
    sizes: arr(doc.sizes),
    colors: arr(doc.colors),
    images: arr(doc.images),
    featured: Boolean(doc.featured),
    bestSeller: Boolean(doc.bestSeller),
    isNew: Boolean(doc.isNew),
    badge: doc.badge ?? null,
    rating: num(doc.rating),
    reviews: num(doc.reviews),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
  };
}

// Build a Mongo document from validated form input.
// `existing` (on edit) preserves fields the form doesn't manage.
function toDoc(input, existing = null) {
  const featured = Boolean(input.featured);
  const bestSeller = Boolean(input.bestSeller);
  return {
    name: String(input.name).trim(),
    description: String(input.description).trim(),
    category: String(input.category).trim(),
    price: num(input.price),
    mrp: num(input.mrp),
    shippingCharge: num(input.shippingCharge),
    stock: Math.max(0, Math.round(num(input.stock))),
    discount: Math.max(0, Math.min(100, num(input.discount))),
    sizes: arr(input.sizes).map(String),
    colors: arr(input.colors).map(String).filter(Boolean),
    images: arr(input.images).map(String).filter(Boolean),
    featured,
    bestSeller,
    // Freshly created products are "new"; keep the flag on edit.
    isNew: existing ? Boolean(existing.isNew) : true,
    badge: deriveBadge({ badge: null, bestSeller, featured }),
    // Ratings aren't set from the form — preserve on edit, default on create.
    rating: existing ? num(existing.rating) : 0,
    reviews: existing ? num(existing.reviews) : 0,
  };
}

// Find a slug not already taken (appends -2, -3, … on collision).
async function uniqueId(base) {
  const col = await getProductsCollection();
  let candidate = base;
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await col.findOne({ id: candidate }, { projection: { _id: 1 } })) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}

// ---- reads ----
export async function getAllProducts() {
  const col = await getProductsCollection();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(normalize);
}

export async function getProductById(id) {
  const col = await getProductsCollection();
  return normalize(await col.findOne({ id }));
}

export async function getRelated(id, limit = 4) {
  const current = await getProductById(id);
  if (!current) return [];
  const col = await getProductsCollection();
  const docs = await col
    .find({ id: { $ne: id }, category: current.category })
    .limit(limit)
    .toArray();
  return docs.map(normalize);
}

export async function countProducts() {
  const col = await getProductsCollection();
  return col.countDocuments();
}

// ---- writes ----
export async function createProduct(input) {
  const col = await getProductsCollection();
  const doc = toDoc(input);
  doc.id = await uniqueId(slugify(doc.name));
  const now = new Date();
  doc.createdAt = now;
  doc.updatedAt = now;
  await col.insertOne(doc);
  return normalize(doc);
}

export async function updateProduct(id, input) {
  const col = await getProductsCollection();
  const existing = await col.findOne({ id });
  if (!existing) return null;
  const doc = toDoc(input, existing);
  doc.updatedAt = new Date();
  await col.updateOne({ id }, { $set: doc });
  return normalize({ ...existing, ...doc });
}

export async function deleteProduct(id) {
  const col = await getProductsCollection();
  const res = await col.deleteOne({ id });
  return res.deletedCount > 0;
}

// Insert many docs (used by the one-time seed). Skips if given nothing.
export async function insertManyProducts(docs) {
  if (!docs?.length) return 0;
  const col = await getProductsCollection();
  const now = new Date();
  const prepared = docs.map((d, i) => ({
    ...d,
    createdAt: new Date(now.getTime() + i), // preserve given order, newest last
    updatedAt: now,
  }));
  const res = await col.insertMany(prepared);
  return res.insertedCount;
}
