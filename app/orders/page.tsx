"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ProductImage } from "@/components/products/ProductImage";
import Link from "next/link";
import { Package } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getOrders } from "@/lib/storage";
import { StaggerItem } from "@/components/animation/StaggerItem";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

function OrdersContent() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(() => {
    if (!user?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }
    const all = getOrders()
      .filter((o) => o.userId === user.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    setOrders(all);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    setLoading(true);
    loadOrders();
  }, [loadOrders, pathname]);

  useEffect(() => {
    const handleUpdate = () => loadOrders();
    window.addEventListener("orders-updated", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("orders-updated", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, [loadOrders]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Mes commandes</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aucune commande"
          description="Vous n'avez pas encore passé de commande."
          action={
            <Link
              href="/products"
              className="inline-flex rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white"
            >
              Commander maintenant
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <StaggerItem key={order.id} index={i}>
            <div className="card-lift rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">#{order.id}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {order.items.map((item) => (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg"
                  >
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
                <span className="text-xs text-gray-500">
                  {order.items.length} article(s)
                </span>
                <span className="font-bold text-gray-900">
                  {formatPrice(order.total)}
                </span>
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
