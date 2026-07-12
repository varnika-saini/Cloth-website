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
        title="Product image uploads"
        subtitle="Add multiple product photos at once. They upload securely to Cloudinary and return a permanent link."
      />

      <Container className="py-12">
        <div className="mx-auto mb-6 flex max-w-4xl justify-end">
          <button type="button" onClick={logout} className="btn-ghost">
            <FiLogOut size={16} />
            Log out
          </button>
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
