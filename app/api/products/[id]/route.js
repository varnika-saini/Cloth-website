// =====================================================================
// /api/products/[id]
// ---------------------------------------------------------------------
//   GET    → public. Single product by its slug id.
//   PUT    → admin only. Update all fields.
//   DELETE → admin only. Remove the product.
// =====================================================================
import { NextResponse } from "next/server";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/lib/products";
import { validateProduct } from "@/lib/validation";
import { getAdminSession } from "@/lib/adminSession";
import { isDbConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function dbErrorResponse() {
  return NextResponse.json(
    {
      error:
        "Database is not configured. Set MONGODB_URI in .env.local (and Vercel), then restart the server.",
    },
    { status: 503 }
  );
}

export async function GET(_req, { params }) {
  const { id } = await params;
  if (!isDbConfigured) return dbErrorResponse();
  try {
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { error: "Could not load product." },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured) return dbErrorResponse();

  const { id } = await params;
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
    const product = await updateProduct(id, body);
    if (!product) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, product });
  } catch {
    return NextResponse.json(
      { error: "Could not update the product. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req, { params }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured) return dbErrorResponse();

  const { id } = await params;
  try {
    const ok = await deleteProduct(id);
    if (!ok) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete the product. Please try again." },
      { status: 500 }
    );
  }
}
