"use client";
// =====================================================================
// 🧰  PRODUCT MANAGER — add / edit / delete products from the admin panel
// ---------------------------------------------------------------------
// One form captures every product detail (including a Cloudinary image
// upload) and saves it to MongoDB in a single submit. The list below
// shows all products with Edit / Delete. Everything reads through the
// shared ProductsProvider, so changes appear across the storefront as
// soon as the data refreshes.
// =====================================================================
import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiSave,
  FiDownloadCloud,
} from "react-icons/fi";
import { CloudinaryUploader } from "@/components/admin/CloudinaryUploader";
import { useProducts } from "@/components/ProductsProvider";
import { categories } from "@/data/categories";
import { SHIPPING_FEE } from "@/data/settings";
import { validateProduct } from "@/lib/validation";
import { formatPrice } from "@/lib/utils";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

const EMPTY = {
  name: "",
  description: "",
  category: "",
  price: "",
  mrp: "",
  shippingCharge: String(SHIPPING_FEE),
  stock: "",
  discount: "",
  sizes: [],
  colors: [],
  images: [],
  featured: false,
  bestSeller: false,
};

// Turn a saved product into editable form values (numbers → strings).
function productToForm(p) {
  return {
    name: p.name || "",
    description: p.description || "",
    category: p.category || "",
    price: p.price != null ? String(p.price) : "",
    mrp: p.mrp ? String(p.mrp) : "",
    shippingCharge: p.shippingCharge != null ? String(p.shippingCharge) : "0",
    stock: p.stock != null ? String(p.stock) : "",
    discount: p.discount ? String(p.discount) : "",
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    colors: Array.isArray(p.colors) ? p.colors : [],
    images: Array.isArray(p.images) ? p.images : [],
    featured: Boolean(p.featured),
    bestSeller: Boolean(p.bestSeller),
  };
}

export function ProductManager() {
  const { products, loading, refresh } = useProducts();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', msg }
  const [colorDraft, setColorDraft] = useState("#fbb1bd");
  const [seeding, setSeeding] = useState(false);
  const formRef = useRef(null);

  const isEditing = Boolean(editingId);

  const setField = (key) => (e) => {
    const value =
      e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const toggleSize = (s) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s)
        ? f.sizes.filter((x) => x !== s)
        : [...f.sizes, s],
    }));
    setErrors((prev) => (prev.sizes ? { ...prev, sizes: undefined } : prev));
  };

  const addColor = () => {
    const c = colorDraft.trim();
    if (!c) return;
    setForm((f) =>
      f.colors.includes(c) ? f : { ...f, colors: [...f.colors, c] }
    );
    setErrors((prev) => (prev.colors ? { ...prev, colors: undefined } : prev));
  };

  const removeColor = (c) =>
    setForm((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) }));

  const onImagesUploaded = useCallback((list) => {
    const urls = (list || []).map((x) => x.url).filter(Boolean);
    if (!urls.length) return;
    setForm((f) => ({
      ...f,
      images: [...f.images, ...urls.filter((u) => !f.images.includes(u))],
    }));
    setErrors((prev) => (prev.images ? { ...prev, images: undefined } : prev));
  }, []);

  const removeImage = (url) =>
    setForm((f) => ({ ...f, images: f.images.filter((x) => x !== url) }));

  const resetForm = () => {
    setForm(EMPTY);
    setErrors({});
    setEditingId(null);
  };

  const startEdit = (p) => {
    setForm(productToForm(p));
    setEditingId(p.id);
    setErrors({});
    setFeedback(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const payload = {
      ...form,
      price: Number(form.price),
      mrp: form.mrp === "" ? 0 : Number(form.mrp),
      shippingCharge: Number(form.shippingCharge),
      stock: Number(form.stock),
      discount: form.discount === "" ? 0 : Number(form.discount),
    };

    const clientErrors = validateProduct(payload);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setFeedback({ type: "error", msg: "Please fix the highlighted fields." });
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `/api/products/${editingId}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error || "Could not save the product.");
      }
      setFeedback({
        type: "success",
        msg: isEditing
          ? "Product updated successfully!"
          : "Product added successfully!",
      });
      resetForm();
      await refresh();
    } catch (err) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setFeedback(null);
    try {
      const res = await fetch(`/api/products/${p.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete.");
      if (editingId === p.id) resetForm();
      setFeedback({ type: "success", msg: "Product deleted." });
      await refresh();
    } catch (err) {
      setFeedback({ type: "error", msg: err.message });
    }
  };

  const importExisting = async () => {
    setSeeding(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not import products.");
      setFeedback({ type: "success", msg: data.message || "Imported." });
      await refresh();
    } catch (err) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setSeeding(false);
    }
  };

  const sortedProducts = useMemo(() => products, [products]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Feedback banner */}
      {feedback && (
        <div
          className={
            "flex items-center gap-2 rounded-2xl px-4 py-3 text-sm " +
            (feedback.type === "success"
              ? "bg-lagoon-50 text-lagoon-700 border border-lagoon-200"
              : "bg-red-50 text-red-600 border border-red-200")
          }
          role="status"
        >
          {feedback.type === "success" ? (
            <FiCheckCircle size={16} />
          ) : (
            <FiAlertCircle size={16} />
          )}
          {feedback.msg}
        </div>
      )}

      {/* ---- Product form ---- */}
      <div ref={formRef} className="card p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-ink-900 dark:text-white">
            {isEditing ? <FiEdit2 className="text-blush-600" /> : <FiPlus className="text-blush-600" />}
            {isEditing ? "Edit product" : "Add a new product"}
          </div>
          {isEditing && (
            <button type="button" onClick={resetForm} className="btn-ghost">
              <FiX size={16} /> Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Product Name" error={errors.name}>
              <input
                className="input"
                placeholder="e.g. Blush Bloom Floral Kurti"
                value={form.name}
                onChange={setField("name")}
              />
            </FormField>

            <FormField label="Category" error={errors.category}>
              <select
                className="input"
                value={form.category}
                onChange={setField("category")}
              >
                <option value="">Choose a category…</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Product Description" error={errors.description}>
            <textarea
              rows={3}
              className="input min-h-[5rem] rounded-3xl"
              placeholder="Fabric, fit, styling notes…"
              value={form.description}
              onChange={setField("description")}
            />
          </FormField>

          {/* Prices row */}
          <div className="grid gap-5 sm:grid-cols-3">
            <FormField label="Price (₹)" error={errors.price}>
              <input
                type="number"
                min="0"
                step="1"
                className="input"
                placeholder="799"
                value={form.price}
                onChange={setField("price")}
              />
            </FormField>
            <FormField label="Original Price (₹, optional)" error={errors.mrp}>
              <input
                type="number"
                min="0"
                step="1"
                className="input"
                placeholder="1499"
                value={form.mrp}
                onChange={setField("mrp")}
              />
            </FormField>
            <FormField label="Shipping Charge (₹)" error={errors.shippingCharge}>
              <input
                type="number"
                min="0"
                step="1"
                className="input"
                placeholder={String(SHIPPING_FEE)}
                value={form.shippingCharge}
                onChange={setField("shippingCharge")}
              />
            </FormField>
          </div>

          {/* Stock + discount */}
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Stock Quantity" error={errors.stock}>
              <input
                type="number"
                min="0"
                step="1"
                className="input"
                placeholder="25"
                value={form.stock}
                onChange={setField("stock")}
              />
            </FormField>
            <FormField label="Discount (%, optional)" error={errors.discount}>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                className="input"
                placeholder="0"
                value={form.discount}
                onChange={setField("discount")}
              />
            </FormField>
          </div>

          {/* Sizes */}
          <FormField label="Sizes" error={errors.sizes}>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={
                    "h-10 min-w-11 rounded-full border px-3.5 text-sm font-medium transition " +
                    (form.sizes.includes(s)
                      ? "border-blush-500 bg-blush-500 text-white"
                      : "border-blush-200 hover:border-blush-400 dark:border-white/10")
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </FormField>

          {/* Colors */}
          <FormField label="Product Colour(s)" error={errors.colors}>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="color"
                value={/^#/.test(colorDraft) ? colorDraft : "#fbb1bd"}
                onChange={(e) => setColorDraft(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-lg border border-blush-200 bg-transparent dark:border-white/10"
                aria-label="Pick a colour"
              />
              <input
                className="input max-w-[10rem]"
                placeholder="#fbb1bd or 'Blush'"
                value={colorDraft}
                onChange={(e) => setColorDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addColor();
                  }
                }}
              />
              <button type="button" onClick={addColor} className="btn-ghost">
                <FiPlus size={16} /> Add colour
              </button>
            </div>
            {form.colors.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.colors.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-2 rounded-full border border-beige-200/70 bg-beige-50/70 py-1 pl-1.5 pr-2 text-xs dark:border-white/10 dark:bg-white/5"
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-black/10"
                      style={{ background: c }}
                    />
                    {c}
                    <button
                      type="button"
                      onClick={() => removeColor(c)}
                      aria-label={`Remove ${c}`}
                      className="grid h-4 w-4 place-items-center rounded-full bg-black/10 hover:bg-black/20"
                    >
                      <FiX size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </FormField>

          {/* Images (Cloudinary) */}
          <FormField label="Product Image(s)" error={errors.images}>
            <CloudinaryUploader onUploaded={onImagesUploaded} />
            {form.images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {form.images.map((url) => (
                  <div
                    key={url}
                    className="relative aspect-square overflow-hidden rounded-2xl border border-beige-200/70 dark:border-white/10"
                  >
                    <Image
                      src={url}
                      alt="Product image"
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      aria-label="Remove image"
                      className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormField>

          {/* Flags */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-beige-200/70 bg-beige-50/50 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5">
              <input
                type="checkbox"
                className="h-4 w-4 accent-blush-500"
                checked={form.featured}
                onChange={setField("featured")}
              />
              <span className="font-medium">Featured Product</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-beige-200/70 bg-beige-50/50 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5">
              <input
                type="checkbox"
                className="h-4 w-4 accent-blush-500"
                checked={form.bestSeller}
                onChange={setField("bestSeller")}
              />
              <span className="font-medium">Best Seller</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-lagoon justify-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSave size={16} />
              {saving
                ? "Saving…"
                : isEditing
                  ? "Update product"
                  : "Add product"}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="btn-ghost">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ---- Product list ---- */}
      <div className="card p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-ink-900 dark:text-white">
            Products{" "}
            <span className="text-ink-900/50 dark:text-white/50">
              ({products.length})
            </span>
          </h3>
          {!loading && products.length === 0 && (
            <button
              type="button"
              onClick={importExisting}
              disabled={seeding}
              className="btn-primary disabled:opacity-60"
            >
              <FiDownloadCloud size={16} />
              {seeding ? "Importing…" : "Import existing 30 products"}
            </button>
          )}
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-ink-900/60 dark:text-white/60">
            Loading products…
          </p>
        ) : products.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-900/60 dark:text-white/60">
            No products yet. Add one above, or import your existing catalogue.
          </p>
        ) : (
          <ul className="divide-y divide-beige-200/60 dark:divide-white/10">
            {sortedProducts.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-blush-50">
                  {p.images?.[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900 dark:text-white">
                    {p.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs capitalize text-ink-900/60 dark:text-white/60">
                    {p.category} · {formatPrice(p.price)} · Stock {p.stock}
                    {p.featured ? " · Featured" : ""}
                    {p.bestSeller ? " · Best seller" : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-beige-200/70 text-ink-900/70 transition hover:border-lagoon-400 hover:text-lagoon-600 dark:border-white/10 dark:text-white/70"
                    aria-label={`Edit ${p.name}`}
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-beige-200/70 text-ink-900/70 transition hover:border-red-400 hover:text-red-500 dark:border-white/10 dark:text-white/70"
                    aria-label={`Delete ${p.name}`}
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <label className="block text-left">
      <span className="text-sm font-medium text-ink-900 dark:text-white">
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
      {error && (
        <span className="mt-1 flex items-center gap-1 text-xs text-red-500">
          <FiAlertCircle size={12} /> {error}
        </span>
      )}
    </label>
  );
}
