"use client";
// =====================================================================
// 🛠️  ADMIN PANEL — /admin
// ---------------------------------------------------------------------
// Upload multiple product images to Cloudinary with live preview.
// Uploaded images return a permanent secure URL you can drop into
// data/images.js (LOCAL_IMAGES) or a product's `images` array.
// =====================================================================
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiImage, FiList, FiLogOut } from "react-icons/fi";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/PageHeader";
import { CloudinaryUploader } from "@/components/admin/CloudinaryUploader";
import { ProductManager } from "@/components/admin/ProductManager";

export default function AdminPage() {
  const router = useRouter();
  const [uploaded, setUploaded] = useState([]);

  const handleUploaded = (list) => {
    // Append the newly uploaded images to the running session log.
    setUploaded((prev) => [...prev, ...list]);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Manage products"
        subtitle="Add, edit and remove products — with images, pricing, shipping and stock — all in one place."
      />

      <Container className="py-12">
        <div className="mx-auto mb-6 flex max-w-4xl justify-end">
          <button type="button" onClick={logout} className="btn-ghost">
            <FiLogOut size={16} />
            Log out
          </button>
        </div>

        {/* Full product management: create / edit / delete */}
        <ProductManager />

        {/* Standalone image uploader — kept as a handy tool for grabbing
            Cloudinary URLs on their own (e.g. for other pages). */}
        <div className="mx-auto mt-12 max-w-4xl border-t border-beige-200/60 pt-10 dark:border-white/10">
          <h2 className="h-display mb-1 text-xl">Standalone image uploader</h2>
          <p className="mb-6 text-sm text-ink-900/60 dark:text-white/60">
            Upload images on their own and copy their permanent Cloudinary links.
          </p>
        </div>

        <div className="card mx-auto max-w-4xl p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2 text-sm font-medium text-ink-900 dark:text-white">
            <FiImage className="text-blush-600" />
            Upload images
          </div>

          <CloudinaryUploader onUploaded={handleUploaded} />
        </div>

        {/* Session log — every URL uploaded this visit, easy to copy in bulk */}
        {uploaded.length > 0 && (
          <div className="card mx-auto mt-8 max-w-4xl p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-ink-900 dark:text-white">
              <FiList className="text-blush-600" />
              Uploaded this session ({uploaded.length})
            </div>
            <ul className="space-y-2">
              {uploaded.map((img) => (
                <li
                  key={img.publicId || img.url}
                  className="truncate rounded-2xl border border-beige-200/60 bg-beige-50/60 px-4 py-2 text-xs text-ink-900/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                >
                  <a
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blush-600"
                  >
                    {img.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </>
  );
}
