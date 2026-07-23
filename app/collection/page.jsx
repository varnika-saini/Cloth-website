"use client";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FiFilter, FiX } from "react-icons/fi";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ProductCard";
import { PageHeader } from "@/components/PageHeader";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import { useProducts } from "@/components/ProductsProvider";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];
const COLOR_DOTS = [
  { name: "Blush", value: "#fbb1bd" },
  { name: "Lavender", value: "#bda6f7" },
  { name: "Ivory", value: "#faf3ea" },
  { name: "Peach", value: "#fdcfd6" },
  { name: "Amber", value: "#cf975e" },
  { name: "Ink", value: "#171724" },
];
const SORTS = [
  { key: "latest", label: "Latest" },
  { key: "asc", label: "Price: Low to High" },
  { key: "desc", label: "Price: High to Low" },
  { key: "rating", label: "Top rated" },
];

function CollectionInner() {
  const sp = useSearchParams();
  const initialCat = sp.get("cat") || "";
  const initialQ = sp.get("q") || "";

  const [cat, setCat] = useState(initialCat);
  const [q, setQ] = useState(initialQ);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [price, setPrice] = useState(4000);
  const [sort, setSort] = useState("latest");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { products, loading: dataLoading } = useProducts();
  // Show skeletons while data loads OR while filters settle.
  const showLoading = loading || dataLoading;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [cat, q, sizes, colors, price, sort]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat) list = list.filter((p) => p.category === cat);
    if (q)
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase())
      );
    if (sizes.length)
      list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)));
    if (colors.length)
      list = list.filter((p) =>
        p.colors.some((c) =>
          colors.some((cc) => c.toLowerCase() === cc.toLowerCase())
        )
      );
    list = list.filter((p) => p.price <= price);

    switch (sort) {
      case "asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return list;
  }, [products, cat, q, sizes, colors, price, sort]);

  const toggleArr = (arr, setter, v) =>
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const clearAll = () => {
    setCat("");
    setQ("");
    setSizes([]);
    setColors([]);
    setPrice(4000);
    setSort("latest");
  };

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider">
          Category
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCat("")}
            className={cn(
              "chip",
              !cat && "bg-blush-500 text-white border-blush-500"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCat(c.slug)}
              className={cn(
                "chip",
                cat === c.slug && "bg-blush-500 text-white border-blush-500"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider">
          Size
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleArr(sizes, setSizes, s)}
              className={cn(
                "h-9 min-w-9 rounded-full border px-3 text-xs font-medium transition",
                sizes.includes(s)
                  ? "border-blush-500 bg-blush-500 text-white"
                  : "border-blush-200 hover:border-blush-400 dark:border-white/10"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider">
          Color
        </div>
        <div className="flex flex-wrap gap-2">
          {COLOR_DOTS.map((c) => (
            <button
              key={c.value}
              title={c.name}
              onClick={() => toggleArr(colors, setColors, c.value)}
              className={cn(
                "relative h-8 w-8 rounded-full border border-black/10 transition",
                colors.includes(c.value) &&
                  "ring-2 ring-blush-500 ring-offset-2"
              )}
              style={{ background: c.value }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
          <span>Max price</span>
          <span className="text-blush-600">₹{price}</span>
        </div>
        <input
          type="range"
          min={500}
          max={4000}
          step={100}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-blush-500"
        />
      </div>

      <button onClick={clearAll} className="btn-ghost w-full justify-center">
        Clear filters
      </button>
    </div>
  );

  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title="Shop the entire wardrobe"
        subtitle="Hand-picked short kurtis crafted in soft, breathable fabrics. Filter, sort, and find your favourite."
      />

      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="card sticky top-28 p-6">
              <h3 className="font-display text-lg">Filters</h3>
              <div className="mt-5">{FilterPanel}</div>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="text-sm text-ink-900/70 dark:text-white/70">
                {showLoading ? "Loading…" : `${filtered.length} products`}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(true)}
                  className="btn-ghost lg:hidden"
                >
                  <FiFilter /> Filters
                </button>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-full border border-blush-100 bg-white/70 px-4 py-2 text-sm outline-none focus:border-blush-300 dark:border-white/10 dark:bg-white/5"
                >
                  {SORTS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
              {showLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))
                : filtered.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
            </div>

            {!showLoading && filtered.length === 0 && (
              <div className="card mt-10 p-10 text-center">
                <p className="font-display text-xl">No products match your filters.</p>
                <button onClick={clearAll} className="btn-primary mt-4">
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-[70] bg-ink-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-up h-full w-[85%] max-w-sm overflow-y-auto bg-white p-6 dark:bg-ink-900"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Filters</h3>
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-blush-50"
              >
                <FiX />
              </button>
            </div>
            <div className="mt-6">{FilterPanel}</div>
          </aside>
        </div>
      )}
    </>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={null}>
      <CollectionInner />
    </Suspense>
  );
}
