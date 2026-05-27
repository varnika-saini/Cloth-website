import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/PageHeader";
import { HERO_IMAGE } from "@/data/images";

export const metadata = { title: "About" };

const values = [
  {
    title: "Crafted, not mass-produced",
    body: "Every kurti is stitched in small batches by skilled artisans we know by name.",
    icon: "🪡",
  },
  {
    title: "Soft on you, soft on the planet",
    body: "Breathable, natural fabrics with low-impact dyes and recyclable packaging.",
    icon: "🌿",
  },
  {
    title: "Designed for real lives",
    body: "Pockets, breathable cuts, and forgiving fits — clothes that work as hard as you do.",
    icon: "✨",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Beautifully made, beautifully worn"
        subtitle="ShortKurti began as a love letter to everyday elegance — a small studio dreaming up kurtis you'll keep reaching for."
      />

      <Container className="grid gap-12 py-16 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Image
            src={HERO_IMAGE}
            alt="Our atelier"
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="self-center">
          <p className="text-xs uppercase tracking-[0.3em] text-blush-600">
            The studio
          </p>
          <h2 className="h-display mt-3 text-3xl sm:text-4xl">
            A quiet little atelier, full of color.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-900/70 dark:text-white/70">
            We started in 2021 with three sewing machines, a box of swatches,
            and a stubborn belief that everyday clothes deserve thought, care
            and craft. Today our short kurtis are worn by thousands of women
            across India — and we still pick every print, button and trim by
            hand.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-900/70 dark:text-white/70">
            Our mission is simple: make beautifully crafted, comfortable
            clothing that feels personal, fits real bodies, and lasts beyond
            a single season.
          </p>
        </div>
      </Container>

      <section className="bg-gradient-blush py-16 dark:bg-ink-900">
        <Container>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-blush-600">
              What we stand for
            </p>
            <h2 className="h-display mt-2 text-3xl sm:text-4xl">
              Values stitched into every seam
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <div className="text-4xl">{v.icon}</div>
                <h3 className="h-display mt-3 text-xl">{v.title}</h3>
                <p className="mt-2 text-sm text-ink-900/70 dark:text-white/70">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-20 text-center">
        <h2 className="h-display text-3xl sm:text-4xl">
          Ready to find your favourite?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-900/70 dark:text-white/70">
          Explore the collection — handpicked styles for every mood.
        </p>
        <Link href="/collection" className="btn-primary mt-6">
          Shop the collection
        </Link>
      </Container>
    </>
  );
}
