"use client";

import { useLayoutEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import {
  setStorageCache,
  STORAGE_CACHE_KEYS,
} from "@/lib/storageCache";
import { STORAGE_EVENTS } from "@/lib/storageEvents";
import { getOrders, getProducts, getUsers } from "@/lib/storage";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((s) => s.init);
  const initCart = useCartStore((s) => s.init);
  const syncCart = useCartStore((s) => s.syncFromStorage);
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  useLayoutEffect(() => {
    setStorageCache(STORAGE_CACHE_KEYS.products, getProducts());
    setStorageCache(STORAGE_CACHE_KEYS.orders, getOrders());
    setStorageCache(STORAGE_CACHE_KEYS.users, getUsers());
    initAuth();
  }, [initAuth]);

  useLayoutEffect(() => {
    if (initialized) {
      initCart(user?.id);
    }
  }, [initialized, user?.id, initCart]);

  useLayoutEffect(() => {
    const onProductsUpdated = () => syncCart();
    window.addEventListener(STORAGE_EVENTS.products, onProductsUpdated);
    return () =>
      window.removeEventListener(STORAGE_EVENTS.products, onProductsUpdated);
  }, [syncCart]);

  return <>{children}</>;
}
