"use client";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "@/hooks/useTheme";
import { useMounted } from "@/hooks/useMounted";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-blush-100/70 bg-white/80 backdrop-blur transition hover:scale-105 dark:border-white/10 dark:bg-white/5"
    >
      <span className="text-blush-700 transition-transform duration-300 dark:text-lavender-200">
        {isDark ? <FiMoon size={16} /> : <FiSun size={16} />}
      </span>
    </button>
  );
}
