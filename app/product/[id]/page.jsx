"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiShoppingBag } from "react-icons/fi";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ProductCard";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProduct, useRelated } from "@/components/ProductsProvider";
import { formatPrice, cn } from "@/lib/utils";

export default function ProductDetails({ params }) {
  const { id } = use(params);
  const { product, loading } = useProduct(id);
  const { related } = useRelated(id, 4);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState("M");
  const [tab, setTab] = useState("desc");

  useEffect(() => {
    if (product?.sizes?.length)
      setSize(product.sizes[Math.floor(product.sizes.length / 2)]);
  }, [product?.id]);

  // While products are still loading we can't know if this id exists yet.
  if (loading && !product) {
    return (
      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
        </div>
      </Container>
    );
  }

  if (!product) return notFound();

  return (
    <>
      <Container className="py-10">
        <nav className="mb-6 flex items-center gap-2 text-xs text-ink-900/60 dark:text-white/60">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/collection">Collection</Link>
          <span>/</span>
          <span className="text-blush-700">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div
              key={activeImg}
              className="animate-fade-in relative aspect-[4/5] overflow-hidden rounded-3xl bg-blush-50"
            >
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                priority
                quality={75}
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute left-4 top-4 flex gap-2">
                {product.badge && <Badge tone="dark">{product.badge}</Badge>}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-xl border-2 transition",
                    activeImg === i
                      ? "border-blush-500"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="h-display text-3xl sm:text-4xl">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <Rating value={product.rating} count={product.reviews} />
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl">
                {formatPrice(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-sm text-ink-900/40 line-through dark:text-white/40">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-ink-900/60 dark:text-white/60">
              Inclusive of all taxes
            </p>

            <p className="mt-6 text-sm leading-relaxed text-ink-900/80 dark:text-white/80">
              {product.description}
            </p>

            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider">
                Color
              </div>
              <div className="mt-2 flex gap-3">
                {product.colors.map((c, i) => (
                  <span
                    key={i}
                    style={{ background: c }}
                    className="h-9 w-9 rounded-full border border-black/10 shadow-sm"
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wider">
                  Size
                </div>
                <button className="text-xs font-medium text-blush-700 hover:underline">
                  Size guide
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-10 min-w-10 rounded-full border px-3.5 text-sm font-medium transition",
                      size === s
                        ? "border-blush-500 bg-blush-500 text-white"
                        : "border-blush-200 hover:border-blush-400 dark:border-white/10"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Link
                href={`/order/${product.id}`}
                className="btn-lagoon w-full justify-center"
              >
                <FiShoppingBag /> Buy now
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex gap-2 border-b border-blush-100 dark:border-white/10">
            {[
              { k: "desc", l: "Description" },
              { k: "details", l: "Details & Care" },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition",
                  tab === t.k
                    ? "text-blush-700"
                    : "text-ink-900/60 hover:text-blush-600 dark:text-white/60"
                )}
              >
                {t.l}
                {tab === t.k && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-blush-500" />
                )}
              </button>
            ))}
          </div>

          <div
            key={tab}
            className="animate-fade-in py-6 text-sm text-ink-900/80 dark:text-white/80"
          >
            {tab === "desc" && <p>{product.description}</p>}
            {tab === "details" && (
              <ul className="grid gap-2 sm:grid-cols-2">
                <li>• Fabric: Soft viscose / cotton blend</li>
                <li>• Length: Short (knee length)</li>
                <li>• Wash: Gentle machine wash cold</li>
                <li>• Iron: Low to medium heat</li>
                <li>• Fit: Relaxed, true to size</li>
                <li>• Country of origin: India</li>
              </ul>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="h-display text-2xl sm:text-3xl">You may also love</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
