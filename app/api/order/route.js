// =====================================================================
// POST /api/order — place an order.
// ---------------------------------------------------------------------
// Validates the order, then sends TWO emails:
//   • confirmation to the customer
//   • new-order notification to the owner (OWNER_EMAIL)
// Returns an order reference the success screen can show.
// =====================================================================
import { NextResponse } from "next/server";
import { validateOrder } from "@/lib/validation";
import { findProduct } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import {
  sendEmail,
  isEmailConfigured,
  OWNER_EMAIL,
  layout,
  row,
  esc,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req) {
  if (!isEmailConfigured || !OWNER_EMAIL) {
    return NextResponse.json(
      {
        error:
          "Email is not configured. Add RESEND_API_KEY and OWNER_EMAIL to .env.local, then restart the server.",
      },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const errors = validateOrder(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  // Resolve the product server-side so pricing can't be tampered with.
  const product = findProduct(body.productId);
  if (!product) {
    return NextResponse.json(
      { errors: { productId: "That product could not be found." } },
      { status: 400 }
    );
  }

  const { name, email, phone, address, size, message } = body;
  const quantity = Number(body.quantity);
  const total = product.price * quantity;
  const ref = `SK-${Date.now().toString(36).toUpperCase()}`;

  const summary = `<table style="width:100%;border-collapse:collapse;">
    ${row("Order ref", ref)}
    ${row("Product", product.name)}
    ${row("Size", size)}
    ${row("Quantity", String(quantity))}
    ${row("Unit price", formatPrice(product.price))}
    ${row("Total", formatPrice(total))}
  </table>`;

  const customerDetails = `<table style="width:100%;border-collapse:collapse;margin-top:8px;">
    ${row("Name", name)}
    ${row("Email", email)}
    ${row("Phone", phone)}
    ${row("Address", address)}
    ${message ? row("Note", message) : ""}
  </table>`;

  // 1) Customer confirmation
  const customerHtml = layout(
    "Your order is placed! 🎉",
    `<p style="font-size:14px;line-height:1.6;margin:0 0 16px;">
      Hi ${esc(name)}, thank you for your order! We've received it and will
      contact you shortly on your phone/email to confirm payment and delivery.
     </p>
     <div style="background:#f6efe5;border-radius:14px;padding:16px;">${summary}</div>
     <p style="font-size:13px;color:#8a7f78;margin-top:16px;">
       Keep your order reference <b>${esc(ref)}</b> handy for any questions.
     </p>`
  );

  // 2) Owner notification
  const ownerHtml = layout(
    "🛍️ New order received",
    `<div style="background:#f6efe5;border-radius:14px;padding:16px;">${summary}</div>
     <h2 style="font-size:15px;margin:20px 0 4px;">Customer details</h2>
     ${customerDetails}`
  );

  try {
    // Owner email is the critical one; send it first.
    await sendEmail({
      to: OWNER_EMAIL,
      subject: `New order ${ref} — ${esc(product.name)}`,
      html: ownerHtml,
      replyTo: email,
    });
    await sendEmail({
      to: email,
      subject: `Your ShortKurti order ${ref} is confirmed`,
      html: customerHtml,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Could not place your order right now. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, ref });
}
