import type { OrderStatus } from "@/lib/types";
import { getOrderStatusLabel } from "@/lib/format";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-gray-100 text-gray-600",
  preparing: "bg-orange-100 text-orange-700",
  delivering: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}
    >
      {getOrderStatusLabel(status)}
    </span>
  );
}
