import { cn } from "@/lib/utils";

export function Badge({ children, tone = "blush", className }) {
  const tones = {
    blush:
      "bg-blush-100 text-blush-700 dark:bg-blush-500/15 dark:text-blush-200",
    lavender:
      "bg-lavender-100 text-lavender-700 dark:bg-lavender-500/15 dark:text-lavender-200",
    beige:
      "bg-beige-100 text-beige-500 dark:bg-beige-300/15 dark:text-beige-200",
    dark: "bg-ink-900 text-white",
    success: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
