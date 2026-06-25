import type { Order, Product } from "@/lib/types";
import { formatPrice } from "./format";

export type AdminNotificationType =
  | "pending_order"
  | "out_of_stock"
  | "low_stock";

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  subtitle: string;
  href: string;
  timestamp: string;
}

const LOW_STOCK_THRESHOLD = 5;

export function buildAdminNotifications(
  orders: Order[],
  products: Product[]
): AdminNotification[] {
  const items: AdminNotification[] = [];

  orders
    .filter((order) => order.status === "pending")
    .forEach((order) => {
      items.push({
        id: `order-${order.id}`,
        type: "pending_order",
        title: `Commande ${order.id}`,
        subtitle: `${order.userName} · ${formatPrice(order.total)}`,
        href: "/admin/orders",
        timestamp: order.createdAt,
      });
    });

  products
    .filter((product) => product.stock === 0)
    .forEach((product) => {
      items.push({
        id: `stock-out-${product.id}`,
        type: "out_of_stock",
        title: `${product.name} en rupture`,
        subtitle: "Réapprovisionner le stock",
        href: "/admin/products",
        timestamp: "",
      });
    });

  products
    .filter(
      (product) => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD
    )
    .forEach((product) => {
      items.push({
        id: `stock-low-${product.id}`,
        type: "low_stock",
        title: `Stock faible : ${product.name}`,
        subtitle: `${product.stock} unité(s) restante(s)`,
        href: "/admin/products",
        timestamp: "",
      });
    });

  return items.sort((a, b) => {
    if (a.timestamp && b.timestamp) {
      return (
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }
    if (a.timestamp) return -1;
    if (b.timestamp) return 1;
    return a.title.localeCompare(b.title, "fr");
  });
}

export function countAdminNotifications(
  orders: Order[],
  products: Product[]
): number {
  return buildAdminNotifications(orders, products).length;
}
