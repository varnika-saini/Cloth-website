"use client";
// Client grid for the New Arrivals page — reads products from the shared
// provider (MongoDB) and shows the ones flagged "new".
import { ProductCard } from "@/components/ProductCard";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import { useProducts } from "@/components/ProductsProvider";

export function NewArrivalsGrid() {
  const { products, loading } = useProducts();
  const list = products.filter((p) => p.isNew);

  if (!loading && list.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-ink-900/60 dark:text-white/60">
        No new arrivals right now — check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
        : list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
    </div>
  );
}
