// =====================================================================
// /api/products
// ---------------------------------------------------------------------
//   GET  → public. Returns every product for the storefront.
//   POST → admin only. Creates a new product from the admin form.
// =====================================================================
import { NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/products";
import { validateProduct } from "@/lib/validation";
import { getAdminSession } from "@/lib/adminSession";
import { isDbConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // always reflect the latest DB state

function dbErrorResponse() {
  return NextResponse.json(
    {
      error:
        "Database is not configured. Set MONGODB_URI in .env.local (and Vercel), then restart the server.",
    },
    { status: 503 }
  );
}

export async function GET() {
  if (!isDbConfigured) return NextResponse.json({ products: [] });
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (err) {
    return NextResponse.json(
      { products: [], error: "Could not load products." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured) return dbErrorResponse();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const errors = validateProduct(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const product = await createProduct(body);
    return NextResponse.json({ ok: true, product }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Could not save the product. Please try again." },
      { status: 500 }
    );
  }
}
