"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiSearch, FiMail, FiMenu, FiX } from "react-icons/fi";
import { Container } from "./ui/Container";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/collection?q=${encodeURIComponent(q.trim())}`);
      setSearchOpen(false);
      setQ("");
    }
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-white/40 bg-white/80 backdrop-blur-xl dark:bg-ink-900/70 dark:border-white/10"
            : "bg-transparent"
        )}
      >
        <Container className="flex h-16 items-center justify-between sm:h-20">
          <Link href="/" className="group flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blush-500 to-blush-700 text-white shadow-soft">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M12 2c1.5 4 4 5 8 5-1 5-4 8-8 9-4-1-7-4-8-9 4 0 6.5-1 8-5z" />
              </svg>
            </span>
            <span className="font-display text-xl tracking-tight sm:text-2xl">
              Short<span className="text-blush-600">Kurti</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => {
              const active = path === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors",
                    active
                      ? "text-blush-700 dark:text-blush-200"
                      : "text-ink-900/80 hover:text-blush-600 dark:text-white/80"
                  )}
                >
                  {l.label}
                  {active && (
                    <span className="absolute -bottom-1.5 left-0 right-0 mx-auto h-[3px] w-6 rounded-full bg-gradient-to-r from-blush-500 to-blush-700" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-blush-100/70 bg-white/80 backdrop-blur transition hover:scale-105 dark:border-white/10 dark:bg-white/5 sm:inline-flex"
            >
              <FiSearch size={16} />
            </button>

            <ThemeToggle />

            <Link
              href="/contact"
              aria-label="Contact"
              className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-blush-100/70 bg-white/80 backdrop-blur transition hover:scale-105 dark:border-white/10 dark:bg-white/5 sm:inline-flex"
            >
              <FiMail size={16} />
            </Link>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-blush-100/70 bg-white/80 lg:hidden dark:border-white/10 dark:bg-white/5"
            >
              <FiMenu size={18} />
            </button>
          </div>
        </Container>
      </header>

      {searchOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-[60] bg-ink-900/50 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={onSearch}
            className="animate-fade-up mx-auto mt-24 flex w-[92%] max-w-2xl items-center gap-2 rounded-full bg-white p-2 shadow-glow dark:bg-ink-900"
          >
            <FiSearch className="ml-3 text-blush-500" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search kurtis, colors, occasions…"
              className="flex-1 bg-transparent px-2 py-2 text-sm outline-none"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-blush-50"
              aria-label="Close search"
            >
              <FiX />
            </button>
          </form>
        </div>
      )}

      {open && (
        <div
          className="animate-fade-in fixed inset-0 z-[70] bg-ink-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="ml-auto flex h-full w-[82%] max-w-sm translate-x-0 flex-col bg-gradient-blush p-6 shadow-glow dark:bg-ink-900"
            style={{ animation: "fadeUp 0.25s ease-out both" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/80 dark:bg-white/10"
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>

            <form
              onSubmit={onSearch}
              className="mt-6 flex items-center gap-2 rounded-full bg-white p-1.5 shadow-soft dark:bg-white/10"
            >
              <FiSearch className="ml-3 text-blush-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none"
              />
            </form>

            <nav className="mt-8 flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-base font-medium transition",
                    path === l.href
                      ? "bg-white/80 text-blush-700 shadow-soft dark:bg-white/10"
                      : "hover:bg-white/60 dark:hover:bg-white/5"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6">
              <Link href="/contact" className="btn-primary w-full justify-center">
                <FiMail /> Contact
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
