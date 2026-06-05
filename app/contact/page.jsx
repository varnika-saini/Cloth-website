"use client";
import { useState } from "react";
import { FiMail, FiCopy, FiCheck, FiSend } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/PageHeader";

const EMAIL = "sainivarnika35@gmail.com";

const INSTAGRAM_HANDLE = "shortkurticollection";
const instagramUrl = `https://instagram.com/${INSTAGRAM_HANDLE}`;

const SUBJECT = "Kurti enquiry from ShortKurti website";
const BODY =
  "Hi Varnika,\n\nI saw your kurti store and I'd love to buy one. Here are the details:\n\n• Kurti name / item: \n• Size: \n• Color: \n• Quantity: \n• Delivery address: \n\nLooking forward to your reply!\n\nThanks,\n";

const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  EMAIL
)}&su=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

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
        title="If you want to buy some kurti just email me"
        subtitle="Drop me an email and I'll get back to you with all the details."
      />

      <Container className="py-12">
        <div className="card animate-fade-up mx-auto max-w-xl p-8 text-center sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-blush-500 to-blush-700 text-white shadow-soft">
            <FiMail size={24} />
          </div>

          <h2 className="h-display mt-6 text-2xl sm:text-3xl">Email me</h2>
          <p className="mt-2 text-sm text-ink-900/70 dark:text-white/70">
            If you want to buy some kurti just email me:
          </p>

          {/* Email */}
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-blush-200 bg-blush-50 px-5 py-3 text-sm font-medium text-ink-900 transition hover:scale-105 hover:border-blush-500 hover:bg-blush-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
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

          <div className="my-8 flex items-center gap-3 text-xs text-ink-900/40 dark:text-white/40">
            <span className="h-px flex-1 bg-blush-100 dark:bg-white/10" />
            or follow me
            <span className="h-px flex-1 bg-blush-100 dark:bg-white/10" />
          </div>

          {/* Instagram */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex max-w-full items-center gap-2 rounded-full border border-blush-200 bg-blush-50 px-5 py-3 text-sm font-medium text-ink-900 transition hover:scale-105 hover:border-blush-500 hover:bg-blush-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            aria-label="Open Instagram profile"
          >
            <FaInstagram size={16} className="shrink-0 text-blush-600" />
            <span className="truncate">@{INSTAGRAM_HANDLE}</span>
          </a>
        </div>
      </Container>
    </>
  );
}
