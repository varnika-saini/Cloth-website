"use client";
// =====================================================================
// 🖼️  CloudinaryUploader — multi-image upload with live preview
// ---------------------------------------------------------------------
// Secure signed-upload flow (API Secret never touches the browser):
//   1. Ask our own /api/sign-cloudinary route for a signature.
//   2. POST the file straight to Cloudinary with that signature.
//   3. Cloudinary returns a permanent secure_url we can copy/use.
//
// Reusable: pass onUploaded(list) to receive the uploaded images.
// =====================================================================
import { useCallback, useRef, useState } from "react";
import {
  FiUploadCloud,
  FiX,
  FiCopy,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { cn } from "@/lib/utils";

const ACCEPT = "image/png,image/jpeg,image/jpg,image/webp,image/avif";
const MAX_MB = 10;

let uid = 0;
const nextId = () => `img-${++uid}`;

export function CloudinaryUploader({ onUploaded, className }) {
  const [items, setItems] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const inputRef = useRef(null);

  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!files.length) return;

    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: nextId(),
        file,
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        status: file.size > MAX_MB * 1024 * 1024 ? "error" : "pending",
        progress: 0,
        url: null,
        error:
          file.size > MAX_MB * 1024 * 1024
            ? `File is larger than ${MAX_MB} MB`
            : null,
      })),
    ]);
  }, []);

  const patch = useCallback((id, changes) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...changes } : it))
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((it) => it.id !== id);
    });
  }, []);

  // Upload a single file via signed direct upload + XHR (for progress).
  const uploadOne = useCallback(
    (item) =>
      new Promise((resolve) => {
        patch(item.id, { status: "uploading", progress: 0, error: null });

        fetch("/api/sign-cloudinary", { method: "POST" })
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Could not sign upload");

            const form = new FormData();
            form.append("file", item.file);
            form.append("api_key", data.apiKey);
            form.append("timestamp", data.timestamp);
            form.append("signature", data.signature);
            form.append("folder", data.folder);

            const url = `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`;
            const xhr = new XMLHttpRequest();
            xhr.open("POST", url);

            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                patch(item.id, {
                  progress: Math.round((e.loaded / e.total) * 100),
                });
              }
            };

            xhr.onload = () => {
              try {
                const out = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                  patch(item.id, {
                    status: "done",
                    progress: 100,
                    url: out.secure_url,
                    publicId: out.public_id,
                  });
                  resolve({ url: out.secure_url, publicId: out.public_id });
                } else {
                  throw new Error(out?.error?.message || "Upload failed");
                }
              } catch (err) {
                patch(item.id, { status: "error", error: err.message });
                resolve(null);
              }
            };

            xhr.onerror = () => {
              patch(item.id, {
                status: "error",
                error: "Network error during upload",
              });
              resolve(null);
            };

            xhr.send(form);
          })
          .catch((err) => {
            patch(item.id, { status: "error", error: err.message });
            resolve(null);
          });
      }),
    [patch]
  );

  const uploadAll = useCallback(async () => {
    // Snapshot the pending items, upload them, then report results.
    const pending = items.filter((it) => it.status === "pending");
    const results = [];
    for (const it of pending) {
      const r = await uploadOne(it);
      if (r) results.push(r);
    }
    if (results.length && onUploaded) onUploaded(results);
  }, [items, uploadOne, onUploaded]);

  const copyUrl = useCallback(async (id, url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* clipboard blocked — ignore */
    }
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const pendingCount = items.filter((it) => it.status === "pending").length;
  const doneCount = items.filter((it) => it.status === "done").length;

  return (
    <div className={cn("w-full", className)}>
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
        }
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-12 text-center transition",
          dragging
            ? "border-blush-500 bg-blush-50 dark:bg-white/10"
            : "border-blush-200 bg-blush-50/40 hover:border-blush-400 hover:bg-blush-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        )}
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blush-500 to-blush-700 text-white shadow-soft">
          <FiUploadCloud size={24} />
        </div>
        <p className="mt-4 text-sm font-medium text-ink-900 dark:text-white">
          Drag &amp; drop images here, or click to browse
        </p>
        <p className="mt-1 text-xs text-ink-900/50 dark:text-white/50">
          PNG, JPG, WEBP or AVIF · up to {MAX_MB} MB each · multiple allowed
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = ""; // allow re-picking the same file
          }}
        />
      </div>

      {/* Actions */}
      {items.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-900/60 dark:text-white/60">
            {items.length} selected · {doneCount} uploaded
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                items.forEach(
                  (it) => it.previewUrl && URL.revokeObjectURL(it.previewUrl)
                );
                setItems([]);
              }}
              className="btn-ghost"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={uploadAll}
              disabled={pendingCount === 0}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiUploadCloud size={16} />
              Upload{pendingCount ? ` ${pendingCount}` : ""}
            </button>
          </div>
        </div>
      )}

      {/* Preview grid */}
      {items.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.id} className="card overflow-hidden">
              <div className="relative aspect-square bg-beige-100 dark:bg-white/5">
                {/* Local/remote preview — plain <img> avoids next/image host config */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.url || it.previewUrl}
                  alt={it.name}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  aria-label="Remove image"
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                >
                  <FiX size={14} />
                </button>

                {/* Upload progress overlay */}
                {it.status === "uploading" && (
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/20">
                    <div
                      className="h-full bg-blush-500 transition-all"
                      style={{ width: `${it.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="p-3">
                <p className="truncate text-xs font-medium text-ink-900 dark:text-white">
                  {it.name}
                </p>

                {it.status === "pending" && (
                  <p className="mt-1 text-xs text-ink-900/50 dark:text-white/50">
                    Ready to upload
                  </p>
                )}
                {it.status === "uploading" && (
                  <p className="mt-1 text-xs text-blush-600">
                    Uploading… {it.progress}%
                  </p>
                )}
                {it.status === "error" && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <FiAlertCircle size={12} /> {it.error}
                  </p>
                )}
                {it.status === "done" && (
                  <button
                    type="button"
                    onClick={() => copyUrl(it.id, it.url)}
                    className="mt-1 flex items-center gap-1 text-xs font-medium text-blush-600 hover:text-blush-700"
                  >
                    {copiedId === it.id ? (
                      <>
                        <FiCheck size={12} /> Copied URL
                      </>
                    ) : (
                      <>
                        <FiCopy size={12} /> Copy image URL
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
