// =====================================================================
// POST /api/contact — validates the contact form and emails the owner.
// =====================================================================
import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validation";
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

  // Server-side validation — never trust the client.
  const errors = validateContact(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const { name, email, phone, address, message } = body;

  const html = layout(
    "New contact message",
    `<table style="width:100%;border-collapse:collapse;">
      ${row("Name", name)}
      ${row("Email", email)}
      ${row("Phone", phone)}
      ${row("Address", address)}
    </table>
    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #ede2cf;">
      <div style="color:#8a7f78;font-size:13px;margin-bottom:6px;">Message</div>
      <div style="font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(message)}</div>
    </div>`
  );

  try {
    await sendEmail({
      to: OWNER_EMAIL,
      subject: `New enquiry from ${esc(name)}`,
      html,
      replyTo: email, // reply goes straight to the customer
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Could not send your message. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
