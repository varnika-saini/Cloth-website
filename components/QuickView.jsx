"use client";
import Image from "next/image";
import Link from "next/link";
import { FiX } from "react-icons/fi";
import { useUI } from "@/store/uiStore";
import { useProduct } from "@/components/ProductsProvider";
import { Rating } from "./ui/Rating";
import { Badge } from "./ui/Badge";
import { formatPrice } from "@/lib/utils";
import { useState, useEffect } from "react";

export function QuickView() {
  const id = useUI((s) => s.quickViewId);
  const close = useUI((s) => s.closeQuickView);
  const { product } = useProduct(id);
  const [size, setSize] = useState("M");

  useEffect(() => {
    if (product?.sizes?.length)
      setSize(product.sizes[Math.floor(product.sizes.length / 2)]);
  }, [product]);

  if (!product) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[80] flex items-center justify-center bg-ink-900/50 px-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up relative grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-glow dark:bg-ink-900 md:grid-cols-2"
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur"
          aria-label="Close"
        >
          <FiX />
        </button>

        <div className="relative aspect-[3/4] bg-blush-50 md:aspect-auto">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            quality={70}
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            {product.badge && <Badge tone="dark">{product.badge}</Badge>}
          </div>
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <h3 className="h-display text-2xl">{product.name}</h3>
          <div className="mt-2 flex items-center gap-3">
            <Rating value={product.rating} count={product.reviews} />
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl">
              {formatPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-sm text-ink-900/40 line-through dark:text-white/40">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm text-ink-900/70 dark:text-white/70">
            {product.description}
          </p>

          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wider">
              Size
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-9 min-w-9 rounded-full border px-3 text-xs font-medium transition ${
                    size === s
                      ? "border-blush-500 bg-blush-500 text-white"
                      : "border-blush-200 hover:border-blush-400 dark:border-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <Link
              href={`/product/${product.id}`}
              className="btn-primary w-full justify-center"
              onClick={close}
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
