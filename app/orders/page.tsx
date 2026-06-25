"use client";

import { useEffect, useMemo } from "react";
import { ProductImage } from "@/components/products/ProductImage";
import Link from "next/link";
import { Package } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStorageState } from "@/hooks/useStorageState";
import { getOrders } from "@/lib/storage";
import { STORAGE_CACHE_KEYS } from "@/lib/storageCache";
import { StaggerItem } from "@/components/animation/StaggerItem";
import { formatDate, formatPrice } from "@/lib/format";

function OrdersContent() {
  const user = useAuthStore((s) => s.user);
  const [allOrders, setAllOrders, ready] = useStorageState(
    getOrders,
    [],
    STORAGE_CACHE_KEYS.orders
  );

  const orders = useMemo(() => {
    if (!user?.id) return [];
    return allOrders
      .filter((o) => o.userId === user.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [allOrders, user?.id]);

  useEffect(() => {
    const refresh = () => setAllOrders(getOrders());
    window.addEventListener("orders-updated", refresh);
    return () => window.removeEventListener("orders-updated", refresh);
  }, [setAllOrders]);

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Mes commandes</h1>

      {!ready ? null : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aucune commande"
          description="Vous n'avez pas encore passé de commande."
          action={
            <Link
              href="/products"
              className="inline-flex rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white"
            >
              Commander
            </Link>
          }
        />
      ) : (
        <div className="space-y-3 pb-4">
          {orders.map((order, i) => (
            <StaggerItem key={order.id} index={i}>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                <div className="flex items-start gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                    <ProductImage
                      src={order.items[0]?.image ?? "/icons/icon.svg"}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-gray-900">#{order.id}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="mt-2 text-sm font-bold text-emerald-600">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
