// =====================================================================
// POST /api/admin/seed   (admin only)
// ---------------------------------------------------------------------
// One-time migration: copies the original 30 hand-authored products from
// data/products.js into MongoDB. Runs ONLY when the collection is empty,
// so it can never create duplicates. After seeding, the DB is the single
// source of truth and this route becomes a no-op.
// =====================================================================
import { NextResponse } from "next/server";
import { products as seedSource } from "@/data/products";
import { countProducts, insertManyProducts } from "@/lib/products";
import { getAdminSession } from "@/lib/adminSession";
import { isDbConfigured } from "@/lib/mongodb";
import { SHIPPING_FEE } from "@/data/settings";
import { calcDiscount } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_STOCK = 25;

export async function POST() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured) {
    return NextResponse.json(
      {
        error:
          "Database is not configured. Set MONGODB_URI in .env.local (and Vercel), then restart the server.",
      },
      { status: 503 }
    );
  }

  try {
    const existing = await countProducts();
    if (existing > 0) {
      return NextResponse.json({
        ok: true,
        seeded: 0,
        message: `Skipped — ${existing} products already in the database.`,
      });
    }

    const docs = seedSource.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      mrp: p.mrp,
      shippingCharge: SHIPPING_FEE,
      stock: DEFAULT_STOCK,
      discount: calcDiscount(p.price, p.mrp),
      sizes: p.sizes,
      colors: p.colors,
      images: p.images,
      featured: false,
      bestSeller: /best\s?seller/i.test(p.badge || ""),
      isNew: Boolean(p.isNew),
      badge: p.badge ?? null,
      rating: p.rating,
      reviews: p.reviews,
    }));

    const seeded = await insertManyProducts(docs);
    return NextResponse.json({
      ok: true,
      seeded,
      message: `Imported ${seeded} products into the database.`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Could not seed products. Please try again." },
      { status: 500 }
    );
  }
}
