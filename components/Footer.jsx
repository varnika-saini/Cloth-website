import Link from "next/link";
import { Container } from "./ui/Container";

const cols = [
  {
    title: "Shop",
    links: [
      { href: "/collection", label: "All Kurtis" },
      { href: "/new-arrivals", label: "New Arrivals" },
      { href: "/collection?cat=festive", label: "Festive" },
      { href: "/collection?cat=casual", label: "Casual" },
      { href: "/collection?cat=embroidered", label: "Embroidered" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/about", label: "Shipping & Returns" },
      { href: "/about", label: "Size Guide" },
      { href: "/about", label: "Care Instructions" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/about", label: "Sustainability" },
      { href: "/about", label: "Press" },
      { href: "/contact", label: "Careers" },
      { href: "/about", label: "Privacy & Terms" },
      { href: "/admin", label: "Admin Panel" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-gradient-to-b from-transparent via-blush-50/60 to-blush-100/80 pt-16 dark:via-ink-900 dark:to-ink-900">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[60rem] -translate-x-1/2 rounded-[50%] bg-lavender-300/30 blur-3xl" />

      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blush-500 to-blush-700 text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M12 2c1.5 4 4 5 8 5-1 5-4 8-8 9-4-1-7-4-8-9 4 0 6.5-1 8-5z" />
                </svg>
              </span>
              <span className="font-display text-2xl">
                Short<span className="text-blush-600">Kurti</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-ink-900/70 dark:text-white/70">
              Effortlessly elegant short kurtis crafted with love. Soft
              fabrics, thoughtful prints, and timeless silhouettes for the
              modern woman.
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-lg">{c.title}</h4>
              <ul className="mt-4 space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-ink-900/70 transition hover:text-blush-600 dark:text-white/70"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-blush-200/40 pt-6 text-xs text-ink-900/60 dark:border-white/10 dark:text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} ShortKurti. All rights reserved.</p>
          <p>Designed by Varnika Arya 💫</p>
        </div>
      </Container>
    </footer>
  );
}
