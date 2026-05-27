import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa6";
import { Container } from "./ui/Container";
import { Rating } from "./ui/Rating";
import { reviews } from "@/data/products";

export function Reviews() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blush-50/80 via-beige-100/40 to-transparent dark:from-ink-900 dark:via-ink-900" />

      <Container>
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-blush-600">
            Loved by you
          </p>
          <h2 className="h-display mt-2 text-3xl sm:text-4xl">
            What our customers say
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <div key={i} className="card relative p-6">
              <FaQuoteLeft className="text-blush-200" size={26} />
              <p className="mt-3 text-sm leading-relaxed text-ink-900/80 dark:text-white/80">
                {r.text}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={r.avatar}
                    alt={r.name}
                    fill
                    loading="lazy"
                    quality={60}
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <Rating value={r.rating} size={10} />
                </div>
              </div>
              <div className="mt-3 text-[10px] uppercase tracking-wider text-blush-700">
                Bought · {r.product}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
