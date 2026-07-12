"use client";
import { useState } from "react";
import {
  FiMail,
  FiCopy,
  FiCheck,
  FiSend,
  FiUser,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
  FiAlertCircle,
} from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/PageHeader";
import { validateContact } from "@/lib/validation";

const EMAIL = "sainivarnika35@gmail.com";

const INSTAGRAM_HANDLE = "shortkurticollection";
const instagramUrl = `https://instagram.com/${INSTAGRAM_HANDLE}`;

const SUBJECT = "Kurti enquiry from ShortKurti website";
const BODY =
  "Hi Varnika,\n\nI saw your kurti store and I'd love to buy one. Here are the details:\n\n• Kurti name / item: \n• Size: \n• Color: \n• Quantity: \n• Delivery address: \n\nLooking forward to your reply!\n\nThanks,\n";

const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  EMAIL
)}&su=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`;

const EMPTY = { name: "", email: "", phone: "", address: "", message: "" };

export default function ContactPage() {
  const [copied, setCopied] = useState(false);

  // Contact form state
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState(null);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    const clientErrors = validateContact(form);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error || "Please check the highlighted fields.");
      }
      setStatus("success");
      setForm(EMPTY);
    } catch (err) {
      setStatus("error");
      setServerError(err.message);
    }
  };

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
        title="Contact us"
        subtitle="Send us a message and we'll get back to you — or reach out directly by email or Instagram."
      />

      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact form */}
          <div className="card animate-fade-up p-6 sm:p-8 lg:col-span-3">
            {status === "success" ? (
              <div className="py-10 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-lagoon text-white shadow-lagoon">
                  <FiCheck size={28} />
                </div>
                <h2 className="h-display mt-6 text-2xl">Message sent!</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-ink-900/70 dark:text-white/70">
                  Thank you for reaching out. We've received your message and
                  will reply to your email shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-ghost mt-6"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <h2 className="h-display text-2xl">Send a message</h2>
                <p className="mt-1 text-sm text-ink-900/60 dark:text-white/60">
                  Fill in your details and we'll get back to you.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Full Name"
                    icon={<FiUser />}
                    error={errors.name}
                  >
                    <input
                      className="input-lagoon pl-11"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={set("name")}
                    />
                  </Field>

                  <Field
                    label="Email Address"
                    icon={<FiMail />}
                    error={errors.email}
                  >
                    <input
                      type="email"
                      className="input-lagoon pl-11"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set("email")}
                    />
                  </Field>

                  <Field
                    label="Phone Number"
                    icon={<FiPhone />}
                    error={errors.phone}
                  >
                    <input
                      type="tel"
                      className="input-lagoon pl-11"
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={set("phone")}
                    />
                  </Field>

                  <Field
                    label="Address"
                    icon={<FiMapPin />}
                    error={errors.address}
                  >
                    <input
                      className="input-lagoon pl-11"
                      placeholder="City, area, pincode"
                      value={form.address}
                      onChange={set("address")}
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field
                    label="Message"
                    icon={<FiMessageSquare />}
                    error={errors.message}
                    align="top"
                  >
                    <textarea
                      rows={4}
                      className="input-lagoon min-h-[7rem] rounded-3xl pl-11 pt-3"
                      placeholder="How can we help you?"
                      value={form.message}
                      onChange={set("message")}
                    />
                  </Field>
                </div>

                {serverError && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-red-500">
                    <FiAlertCircle size={16} /> {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-lagoon mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiSend size={16} />
                  {status === "submitting" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>

          {/* Direct contact (existing options preserved) */}
          <div className="card animate-fade-up p-6 text-center sm:p-8 lg:col-span-2">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-blush-500 to-blush-700 text-white shadow-soft">
              <FiMail size={24} />
            </div>

            <h2 className="h-display mt-6 text-2xl">Email us</h2>
            <p className="mt-2 text-sm text-ink-900/70 dark:text-white/70">
              Prefer email? Reach us directly:
            </p>

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
              or follow us
              <span className="h-px flex-1 bg-blush-100 dark:bg-white/10" />
            </div>

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
        </div>
      </Container>
    </>
  );
}

// Labelled input wrapper with an icon and inline error message.
function Field({ label, icon, error, align = "center", children }) {
  return (
    <label className="block text-left">
      <span className="text-sm font-medium text-ink-900 dark:text-white">
        {label}
      </span>
      <span className="relative mt-2 block">
        <span
          className={`pointer-events-none absolute left-4 text-lagoon-500 ${
            align === "top" ? "top-3.5" : "top-1/2 -translate-y-1/2"
          }`}
        >
          {icon}
        </span>
        {children}
      </span>
      {error && (
        <span className="mt-1 flex items-center gap-1 text-xs text-red-500">
          <FiAlertCircle size={12} /> {error}
        </span>
      )}
    </label>
  );
}
