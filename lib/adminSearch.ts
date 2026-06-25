import type { Order, Product, User } from "@/lib/types";

export type AdminSearchResultType = "product" | "order" | "user";

export interface AdminSearchResult {
  id: string;
  type: AdminSearchResultType;
  title: string;
  subtitle: string;
  href: string;
}

const TYPE_LABELS: Record<AdminSearchResultType, string> = {
  product: "Produit",
  order: "Commande",
  user: "Utilisateur",
};

export function getAdminSearchTypeLabel(type: AdminSearchResultType): string {
  return TYPE_LABELS[type];
}

export function searchAdminData(
  query: string,
  products: Product[],
  orders: Order[],
  users: User[]
): AdminSearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) return [];

  const results: AdminSearchResult[] = [];

  products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized)
    )
    .slice(0, 4)
    .forEach((product) => {
      results.push({
        id: `product-${product.id}`,
        type: "product",
        title: product.name,
        subtitle: product.category,
        href: "/admin/products",
      });
    });

  orders
    .filter(
      (order) =>
        order.id.toLowerCase().includes(normalized) ||
        order.userName.toLowerCase().includes(normalized)
    )
    .slice(0, 4)
    .forEach((order) => {
      results.push({
        id: `order-${order.id}`,
        type: "order",
        title: order.id,
        subtitle: order.userName,
        href: "/admin/orders",
      });
    });

  users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized)
    )
    .slice(0, 4)
    .forEach((user) => {
      results.push({
        id: `user-${user.id}`,
        type: "user",
        title: user.name,
        subtitle: user.email,
        href: "/admin/users",
      });
    });

  return results.slice(0, 8);
}
