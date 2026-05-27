import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { Container } from "./ui/Container";
import { HERO_IMAGE } from "@/data/images";



export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-10 sm:pt-16">
      <div className="pointer-events-none absolute -left-10 top-20 h-72 w-72 rounded-full bg-blush-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 top-40 h-80 w-80 rounded-full bg-lavender-200/40 blur-3xl" />

      <Container className="relative grid items-center gap-10 pb-20 sm:pb-28 lg:grid-cols-2">
        <div className="animate-fade-up">
          <div className="chip">✨ New collection · Summer Bloom</div>

          <h1 className="h-display mt-5 text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            Elegant{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blush-600 via-lavender-500 to-blush-500 bg-clip-text text-transparent">
                Short Kurtis
              </span>
              <svg
                className="absolute -bottom-2 left-0 h-3 w-full"
                viewBox="0 0 200 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 10 Q 100 -4 198 10"
                  stroke="#b76e79"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <br />
            for Every Occasion
          </h1>

          <p className="mt-5 max-w-xl text-base text-ink-900/70 dark:text-white/70 sm:text-lg">
            Soft fabrics, dreamy prints, and silhouettes designed to make
            every day feel like a celebration. Discover handcrafted kurtis
            you'll love wearing.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/collection" className="btn-primary group">
              Shop Now
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/new-arrivals" className="btn-ghost">
              Explore Collection
            </Link>
          </div>

          
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md animate-fade-in">
          <div className="absolute inset-0 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-blush-300/60 to-lavender-300/60 blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border border-white/40 shadow-glow">
            <Image
              src={HERO_IMAGE}
              alt="Featured kurti"
              fill
              priority
              quality={70}
              sizes="(max-width:768px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
