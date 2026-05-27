"use client";
import Image from "next/image";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { Rating } from "./ui/Rating";
import { Badge } from "./ui/Badge";
import { useUI } from "@/store/uiStore";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product, index = 0 }) {
  const setQuickView = useUI((s) => s.setQuickView);
  const eager = index < 4;

  return (
    <div className="group relative">
      <div className="card overflow-hidden">
        <Link href={`/product/${product.id}`} className="relative block">
          <div className="relative aspect-[3/4] overflow-hidden bg-blush-50 dark:bg-white/5">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              quality={65}
              loading={eager ? "eager" : "lazy"}
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {product.badge && <Badge tone="dark">{product.badge}</Badge>}
              {product.isNew && <Badge tone="lavender">New</Badge>}
            </div>

            <div className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-end gap-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuickView(product.id);
                }}
                aria-label="Quick view"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-medium text-ink-900 shadow-soft hover:bg-blush-100"
              >
                <FiEye size={14} /> Quick view
              </button>
            </div>
          </div>
        </Link>

        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/product/${product.id}`}
              className="line-clamp-1 text-sm font-medium hover:text-blush-600"
            >
              {product.name}
            </Link>
            <div className="flex shrink-0 gap-1">
              {product.colors.slice(0, 3).map((c, i) => (
                <span
                  key={i}
                  style={{ background: c }}
                  className="h-3 w-3 rounded-full border border-black/10"
                />
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold">{formatPrice(product.price)}</span>
              {product.mrp > product.price && (
                <span className="text-xs text-ink-900/40 line-through dark:text-white/40">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>
            <Rating value={product.rating} size={11} />
          </div>
        </div>
      </div>
    </div>
  );
}
