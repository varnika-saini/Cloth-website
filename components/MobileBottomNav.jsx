"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiGrid, FiStar, FiMail } from "react-icons/fi";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/collection", label: "Collection", icon: FiGrid },
  { href: "/new-arrivals", label: "New", icon: FiStar },
  { href: "/contact", label: "Contact", icon: FiMail },
];

export function MobileBottomNav() {
  const path = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-blush-100/70 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/90 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                  active
                    ? "text-blush-600"
                    : "text-ink-900/60 hover:text-blush-600 dark:text-white/70"
                )}
              >
                <Icon size={20} />
                <span>{label}</span>
                {active && (
                  <span className="absolute inset-x-6 top-0 h-[2px] rounded-full bg-blush-500" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
