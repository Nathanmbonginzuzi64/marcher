"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  requireAuth = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!initialized) return;

    if (requireAuth && !user) {
      router.replace("/login");
      return;
    }

    if (requireAdmin && user?.role !== "admin") {
      router.replace("/");
    }
  }, [initialized, user, requireAuth, requireAdmin, router]);

  if (!initialized) return null;
  if (requireAuth && !user) return null;
  if (requireAdmin && user?.role !== "admin") return null;

  return <>{children}</>;
}
