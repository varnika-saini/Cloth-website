import { Container } from "./ui/Container";

export function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-16 sm:py-24">
      <div className="pointer-events-none absolute -left-10 top-10 h-60 w-60 rounded-full bg-blush-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-lavender-200/40 blur-3xl" />
      <Container className="relative text-center">
        {eyebrow && (
          <p className="animate-fade-up text-xs uppercase tracking-[0.4em] text-blush-600">
            {eyebrow}
          </p>
        )}
        <h1 className="h-display animate-fade-up mt-3 text-4xl sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="animate-fade-up mx-auto mt-4 max-w-2xl text-base text-ink-900/70 dark:text-white/70">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
