import Image from "next/image";
import Link from "next/link";
import { Container } from "./ui/Container";
import { categories } from "@/data/categories";

export function TrendingCategories() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blush-600">
              Trending now
            </p>
            <h2 className="h-display mt-2 text-3xl sm:text-4xl">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/collection"
            className="hidden text-sm font-medium text-blush-700 hover:underline sm:inline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/collection?cat=${c.slug}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  loading="lazy"
                  quality={65}
                  sizes="(max-width:768px) 50vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <div className="font-display text-base sm:text-lg">
                    {c.name}
                  </div>
                  <div className="text-[10px] opacity-80">{c.tagline}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
