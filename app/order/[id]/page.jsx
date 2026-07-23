"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
  FiAlertCircle,
  FiCheck,
  FiShoppingBag,
} from "react-icons/fi";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/PageHeader";
import { useProduct } from "@/components/ProductsProvider";
import { formatPrice } from "@/lib/utils";
import { validateOrder } from "@/lib/validation";

export default function OrderPage({ params }) {
  const { id } = use(params);
  const { product, loading } = useProduct(id);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    size: "",
    quantity: 1,
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState(null);
  const [ref, setRef] = useState(null);

  // Default the size to the middle option once the product is known.
  useEffect(() => {
    if (product?.sizes?.length) {
      setForm((f) => ({
        ...f,
        size: product.sizes[Math.floor(product.sizes.length / 2)],
      }));
    }
  }, [product?.id]);

  if (loading && !product) {
    return (
      <Container className="py-20 text-center">
        <p className="text-sm text-ink-900/70 dark:text-white/70">Loading…</p>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-20 text-center">
        <h1 className="h-display text-3xl">Product not found</h1>
        <p className="mt-3 text-sm text-ink-900/70 dark:text-white/70">
          The item you're trying to order doesn't exist.
        </p>
        <Link href="/collection" className="btn-primary mt-6">
          Browse the collection
        </Link>
      </Container>
    );
  }

  const set = (k) => (e) => {
    const v = k === "quantity" ? e.target.value.replace(/\D/g, "") : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const subtotal = product.price * (Number(form.quantity) || 0);
  // Per-product shipping charge (set in the admin panel).
  const shipping = Number(product.shippingCharge) || 0;
  const total = subtotal + shipping;

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    const payload = { ...form, quantity: Number(form.quantity), productId: product.id };
    const clientErrors = validateOrder(payload);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error || "Please check the highlighted fields.");
      }
      setRef(data.ref);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(err.message);
    }
  };

  // ---- Success confirmation ----
  if (status === "success") {
    return (
      <>
        <PageHeader eyebrow="Order" title="Order Placed Successfully" />
        <Container className="py-12">
          <div className="card animate-fade-up mx-auto max-w-xl p-8 text-center sm:p-10">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-lagoon text-white shadow-lagoon">
              <FiCheck size={36} />
            </div>
            <h2 className="h-display mt-6 text-2xl sm:text-3xl">
              Thank you for your order! 🎉
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-ink-900/70 dark:text-white/70">
              We've emailed a confirmation to you and notified our team. We'll
              reach out shortly to confirm payment and delivery.
            </p>

            {ref && (
              <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-lagoon-200 bg-lagoon-50 px-4 py-2 text-sm font-medium text-lagoon-700">
                Order reference: <b>{ref}</b>
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-beige-50 p-4 text-left text-sm dark:bg-white/5">
              <div className="flex items-center justify-between">
                <span className="text-ink-900/60 dark:text-white/60">Item</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-ink-900/60 dark:text-white/60">
                  Size · Qty
                </span>
                <span className="font-medium">
                  {form.size} · {form.quantity}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-ink-900/60 dark:text-white/60">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-ink-900/60 dark:text-white/60">Shipping</span>
                <span className="font-medium">{formatPrice(shipping)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-beige-200/70 pt-2 dark:border-white/10">
                <span className="text-ink-900/60 dark:text-white/60">Total</span>
                <span className="font-display text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/collection" className="btn-lagoon">
                Continue shopping
              </Link>
              <Link href="/" className="btn-ghost">
                Back to home
              </Link>
            </div>
          </div>
        </Container>
      </>
    );
  }

  // ---- Order form ----
  return (
    <>
      <PageHeader
        eyebrow="Place your order"
        title="Order details"
        subtitle="Fill in your details and we'll confirm your order over email."
      />

      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Product summary */}
          <div className="card animate-fade-up h-fit p-5 lg:col-span-2">
            <div className="flex gap-4">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-blush-50">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h2 className="h-display text-lg leading-snug">{product.name}</h2>
                <p className="mt-1 text-xs capitalize text-ink-900/60 dark:text-white/60">
                  {product.category}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-xl">
                    {formatPrice(product.price)}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-xs text-ink-900/40 line-through dark:text-white/40">
                      {formatPrice(product.mrp)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-beige-200/70 pt-4 text-sm dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-ink-900/60 dark:text-white/60">
                  {formatPrice(product.price)} × {form.quantity || 0}
                </span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-900/60 dark:text-white/60">Shipping</span>
                <span className="font-medium">{formatPrice(shipping)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-beige-200/70 pt-2 dark:border-white/10">
                <span className="font-medium">Total</span>
                <span className="font-display text-lg text-lagoon-600">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Order form */}
          <div className="card animate-fade-up p-6 sm:p-8 lg:col-span-3">
            <form onSubmit={onSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" icon={<FiUser />} error={errors.name}>
                  <input
                    className="input-lagoon pl-11"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={set("name")}
                  />
                </Field>
                <Field label="Email Address" icon={<FiMail />} error={errors.email}>
                  <input
                    type="email"
                    className="input-lagoon pl-11"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set("email")}
                  />
                </Field>
                <Field label="Phone Number" icon={<FiPhone />} error={errors.phone}>
                  <input
                    type="tel"
                    className="input-lagoon pl-11"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </Field>
                <Field label="Quantity" error={errors.quantity}>
                  <input
                    inputMode="numeric"
                    className="input"
                    value={form.quantity}
                    onChange={set("quantity")}
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field
                  label="Delivery Address"
                  icon={<FiMapPin />}
                  error={errors.address}
                  align="top"
                >
                  <textarea
                    rows={2}
                    className="input-lagoon min-h-[4.5rem] rounded-3xl pl-11 pt-3"
                    placeholder="House / street, city, state, pincode"
                    value={form.address}
                    onChange={set("address")}
                  />
                </Field>
              </div>

              {/* Size selector */}
              <div className="mt-4">
                <span className="text-sm font-medium text-ink-900 dark:text-white">
                  Size
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, size: s }))}
                      className={`h-10 min-w-10 rounded-full border px-3.5 text-sm font-medium transition ${
                        form.size === s
                          ? "border-lagoon-500 bg-lagoon-500 text-white"
                          : "border-blush-200 hover:border-lagoon-400 dark:border-white/10"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {errors.size && (
                  <span className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <FiAlertCircle size={12} /> {errors.size}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <Field
                  label="Note (optional)"
                  icon={<FiMessageSquare />}
                  align="top"
                >
                  <textarea
                    rows={2}
                    className="input-lagoon min-h-[4.5rem] rounded-3xl pl-11 pt-3"
                    placeholder="Any preferences or delivery instructions?"
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
                <FiShoppingBag size={16} />
                {status === "submitting"
                  ? "Placing order…"
                  : `Place order · ${formatPrice(total)}`}
              </button>
              <p className="mt-3 text-center text-xs text-ink-900/50 dark:text-white/50">
                No online payment now — we'll confirm payment & delivery by email.
              </p>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}

function Field({ label, icon, error, align = "center", children }) {
  return (
    <label className="block text-left">
      <span className="text-sm font-medium text-ink-900 dark:text-white">
        {label}
      </span>
      <span className="relative mt-2 block">
        {icon && (
          <span
            className={`pointer-events-none absolute left-4 text-lagoon-500 ${
              align === "top" ? "top-3.5" : "top-1/2 -translate-y-1/2"
            }`}
          >
            {icon}
          </span>
        )}
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
