import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] bg-gradient-hero py-24">
      <Container className="text-center">
        <p className="font-display text-7xl text-blush-600">4·0·4</p>
        <h1 className="h-display mt-4 text-3xl">
          This page wandered off the runway.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-900/70">
          The page you're looking for doesn't exist. Try going back to the
          collection.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn-primary">
            Go home
          </Link>
          <Link href="/collection" className="btn-ghost">
            Browse collection
          </Link>
        </div>
      </Container>
    </section>
  );
}
