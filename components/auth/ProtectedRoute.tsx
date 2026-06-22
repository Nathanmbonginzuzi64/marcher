"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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

  if (!initialized) return <LoadingSpinner />;
  if (requireAuth && !user) return <LoadingSpinner />;
  if (requireAdmin && user?.role !== "admin") return <LoadingSpinner />;

  return <>{children}</>;
}
