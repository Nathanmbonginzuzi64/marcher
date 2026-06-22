"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((s) => s.init);
  const initCart = useCartStore((s) => s.init);
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (initialized) {
      initCart(user?.id);
    }
  }, [initialized, user?.id, initCart]);

  return <>{children}</>;
}
