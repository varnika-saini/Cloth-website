"use client";
import Link from "next/link";
import { useState } from "react";
import { Container } from "./ui/Container";
import { ProductCard } from "./ProductCard";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "all", label: "All" },
  { key: "floral", label: "Floral" },
  { key: "embroidered", label: "Embroidered" },
  { key: "festive", label: "Festive" },
  { key: "casual", label: "Casual" },
];

export function FeaturedProducts() {
  const [tab, setTab] = useState("all");
  const list = (tab === "all"
    ? products
    : products.filter((p) => p.category === tab)
  ).slice(0, 8);

  return (
    <section className="py-20">
      <Container>
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blush-600">
              Editor's picks
            </p>
            <h2 className="h-display mt-2 text-3xl sm:text-4xl">
              Featured Products
            </h2>
          </div>

          <div className="hide-scrollbar -mx-2 flex max-w-full overflow-x-auto px-2">
            <div className="flex gap-1 rounded-full border border-blush-100 bg-white/80 p-1 backdrop-blur dark:border-white/10 dark:bg-white/5">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300",
                    tab === t.key
                      ? "bg-gradient-to-r from-blush-500 to-blush-600 text-white shadow-soft"
                      : "text-ink-900/70 hover:text-blush-600 dark:text-white/70"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          key={tab}
          className="animate-fade-in grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
        >
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/collection" className="btn-ghost">
            View entire collection
          </Link>
        </div>
      </Container>
    </section>
  );
}
