"use client";
import dynamic from "next/dynamic";
import { useUI } from "@/store/uiStore";

const QuickView = dynamic(
  () => import("./QuickView").then((m) => m.QuickView),
  { ssr: false }
);

export function QuickViewMount() {
  const id = useUI((s) => s.quickViewId);
  if (!id) return null;
  return <QuickView />;
}
