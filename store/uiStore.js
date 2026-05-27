"use client";
import { create } from "zustand";

export const useUI = create((set) => ({
  quickViewId: null,
  setQuickView: (id) => set({ quickViewId: id }),
  closeQuickView: () => set({ quickViewId: null }),
}));
