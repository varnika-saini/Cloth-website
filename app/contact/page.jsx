"use client";
import { useState } from "react";
import { FiMail, FiCopy, FiCheck, FiSend, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/PageHeader";

const EMAIL = "sainivarnika35@gmail.com";

// Phone — keep digits only for tel:/wa.me links; PHONE_DISPLAY is what users see.
const PHONE_INTL = "919568202651"; // 91 = India country code
const PHONE_DISPLAY = "+91 95682 02651";

const SUBJECT = "Kurti enquiry from ShortKurti website";
const BODY =
  "Hi Varnika,\n\nI saw your kurti store and I'd love to buy one. Here are the details:\n\n• Kurti name / item: \n• Size: \n• Color: \n• Quantity: \n• Delivery address: \n\nLooking forward to your reply!\n\nThanks,\n";

const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  EMAIL
)}&su=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

const whatsappUrl = `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(
  "Hi Varnika! If you want to buy some kurti — I'd like to order one. Could you share the details?"
)}`;

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
      document.body.removeChild(ta);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="If you want to buy some kurti just call me"
        subtitle="Call or WhatsApp me directly, or drop me an email — whatever's easiest for you."
      />

      <Container className="py-12">
        <div className="card animate-fade-up mx-auto max-w-xl p-8 text-center sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-blush-500 to-blush-700 text-white shadow-soft">
            <FiPhone size={24} />
          </div>

          <h2 className="h-display mt-6 text-2xl sm:text-3xl">Call me</h2>
          <p className="mt-2 text-sm text-ink-900/70 dark:text-white/70">
            If you want to buy some kurti just call me:
          </p>

          {/* Phone number — tap to call */}
          <a
            href={`tel:+${PHONE_INTL}`}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-blush-200 bg-blush-50 px-6 py-3 text-base font-semibold text-ink-900 transition hover:scale-105 hover:border-blush-500 hover:bg-blush-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            aria-label="Call this number"
          >
            <FiPhone size={18} className="shrink-0 text-blush-600" />
            {PHONE_DISPLAY}
          </a>

          {/* Call + WhatsApp buttons */}
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={`tel:+${PHONE_INTL}`} className="btn-primary">
              <FiPhone /> Call now
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ borderColor: "#25D366", color: "#128C7E" }}
            >
              <FaWhatsapp size={18} /> WhatsApp
            </a>
          </div>

          <div className="my-8 flex items-center gap-3 text-xs text-ink-900/40 dark:text-white/40">
            <span className="h-px flex-1 bg-blush-100 dark:bg-white/10" />
            or email me
            <span className="h-px flex-1 bg-blush-100 dark:bg-white/10" />
          </div>

          {/* Email */}
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex max-w-full items-center gap-2 rounded-full border border-blush-200 bg-blush-50 px-5 py-3 text-sm font-medium text-ink-900 transition hover:scale-105 hover:border-blush-500 hover:bg-blush-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            aria-label="Send email"
          >
            <FiMail size={16} className="shrink-0 text-blush-600" />
            <span className="truncate">{EMAIL}</span>
            <FiSend
              size={14}
              className="shrink-0 text-blush-600 transition-transform group-hover:translate-x-0.5"
            />
          </a>

          <div className="mt-4 flex justify-center">
            <button
              onClick={copyEmail}
              className="btn-ghost"
              aria-label="Copy email address"
            >
              {copied ? (
                <>
                  <FiCheck /> Copied!
                </>
              ) : (
                <>
                  <FiCopy /> Copy email
                </>
              )}
            </button>
          </div>
        </div>
      </Container>
    </>
  );
}
