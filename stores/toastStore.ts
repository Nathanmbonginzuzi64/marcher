"use client";

import { create } from "zustand";
import type { ToastMessage } from "@/lib/types";

interface ToastState {
  toasts: ToastMessage[];
  show: (message: string, type?: ToastMessage["type"]) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  show: (message, type = "success") => {
    const id = `toast-${Date.now()}`;
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => get().dismiss(id), 3000);
  },

  dismiss: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));
