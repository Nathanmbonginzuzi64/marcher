"use client";

import { useEffect, useState } from "react";
import { ProductImage } from "@/components/products/ProductImage";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToastStore } from "@/stores/toastStore";
import { getOrders, saveOrders } from "@/lib/storage";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = [
  "pending",
  "preparing",
  "delivering",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const showToast = useToastStore((s) => s.show);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setOrders(getOrders());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = (orderId: string, status: OrderStatus) => {
    const updated = getOrders().map((o) =>
      o.id === orderId ? { ...o, status } : o
    );
    saveOrders(updated);
    showToast("Statut mis à jour");
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <AdminHeader title="Gestion des commandes" />

      <div className="space-y-3 p-4 lg:p-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">#{order.id}</p>
                <p className="text-xs text-gray-500">
                  {order.userName} · {formatDate(order.createdAt)}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="mt-3 space-y-2">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="flex-1 text-xs text-gray-600">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-xs font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
              <span className="font-bold">{formatPrice(order.total)}</span>
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order.id, e.target.value as OrderStatus)
                }
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs outline-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
