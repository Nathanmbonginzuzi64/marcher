"use client";

import { useEffect, useMemo, useState } from "react";
import { create } from "zustand";
import { getCart, getProducts, saveCart } from "@/lib/storage";
import { STORAGE_EVENTS } from "@/lib/storageEvents";
import type { CartItem, Product } from "@/lib/types";

export interface CartLine extends CartItem {
  product: Product;
}

interface CartState {
  items: CartItem[];
  userId: string | null;
  init: (userId?: string | null) => void;
  syncFromStorage: () => void;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

function persist(items: CartItem[], userId: string | null) {
  saveCart(items, userId);
}

export function buildCartLines(items: CartItem[]): CartLine[] {
  const products = getProducts();
  return items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter((line): line is CartLine => line !== null);
}

export function computeCartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
}

export function computeItemCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  userId: null,

  init: (userId) => {
    const items = getCart(userId);
    set({ items, userId: userId ?? null });
  },

  syncFromStorage: () => {
    const { userId } = get();
    const items = getCart(userId);
    set({ items });
  },

  addItem: (productId) => {
    const products = getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product || product.stock <= 0) return;

    const { items, userId } = get();
    const existing = items.find((i) => i.productId === productId);
    let updated: CartItem[];

    if (existing) {
      if (existing.quantity >= product.stock) return;
      updated = items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updated = [...items, { productId, quantity: 1 }];
    }

    persist(updated, userId);
    set({ items: updated });
  },

  removeItem: (productId) => {
    const { items, userId } = get();
    const updated = items.filter((i) => i.productId !== productId);
    persist(updated, userId);
    set({ items: updated });
  },

  updateQuantity: (productId, quantity) => {
    const products = getProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const { items, userId } = get();
    let updated: CartItem[];

    if (quantity <= 0) {
      updated = items.filter((i) => i.productId !== productId);
    } else {
      const qty = Math.min(quantity, product.stock);
      updated = items.map((i) =>
        i.productId === productId ? { ...i, quantity: qty } : i
      );
    }

    persist(updated, userId);
    set({ items: updated });
  },

  clearCart: () => {
    const { userId } = get();
    persist([], userId);
    set({ items: [] });
  },
}));

export function useCartLines(): CartLine[] {
  const items = useCartStore((s) => s.items);
  const [productsRevision, setProductsRevision] = useState(0);

  useEffect(() => {
    const refresh = () => setProductsRevision((revision) => revision + 1);
    window.addEventListener(STORAGE_EVENTS.products, refresh);
    return () => window.removeEventListener(STORAGE_EVENTS.products, refresh);
  }, []);

  return useMemo(() => buildCartLines(items), [items, productsRevision]);
}

export function useCartTotal(): number {
  const lines = useCartLines();
  return useMemo(() => computeCartTotal(lines), [lines]);
}

export function useCartItemCount(): number {
  const items = useCartStore((s) => s.items);
  return useMemo(() => computeItemCount(items), [items]);
}
