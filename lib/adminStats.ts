import type { Order, Product, User } from "@/lib/types";

const DAY_MS = 24 * 60 * 60 * 1000;

function last7DayIndex(dateIso: string): number | null {
  const diff = Math.floor((Date.now() - new Date(dateIso).getTime()) / DAY_MS);
  if (diff < 0 || diff >= 7) return null;
  return 6 - diff;
}

export function buildDailyOrderCounts(orders: Order[]): number[] {
  const buckets = Array(7).fill(0);
  orders.forEach((order) => {
    const index = last7DayIndex(order.createdAt);
    if (index !== null) buckets[index] += 1;
  });
  return buckets;
}

export function buildDailyRevenue(orders: Order[]): number[] {
  const buckets = Array(7).fill(0);
  orders.forEach((order) => {
    if (order.status === "cancelled") return;
    const index = last7DayIndex(order.createdAt);
    if (index !== null) buckets[index] += order.total;
  });
  return buckets;
}

export function buildDailyUnitsSold(orders: Order[]): number[] {
  const buckets = Array(7).fill(0);
  orders.forEach((order) => {
    if (order.status === "cancelled") return;
    const index = last7DayIndex(order.createdAt);
    if (index === null) return;
    const units = order.items.reduce((sum, item) => sum + item.quantity, 0);
    buckets[index] += units;
  });
  return buckets;
}

export function buildDailyNewUsers(users: User[]): number[] {
  const buckets = Array(7).fill(0);
  users.forEach((user) => {
    const index = last7DayIndex(user.createdAt);
    if (index !== null) buckets[index] += 1;
  });
  return buckets;
}

export function computeDashboardStats(
  orders: Order[],
  products: Product[],
  users: User[]
) {
  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const revenue = validOrders.reduce((sum, order) => sum + order.total, 0);
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const inventoryValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  const weekAgo = Date.now() - 7 * DAY_MS;
  const ordersThisWeek = orders.filter(
    (o) => new Date(o.createdAt).getTime() >= weekAgo
  ).length;
  const revenueThisWeek = validOrders
    .filter((o) => new Date(o.createdAt).getTime() >= weekAgo)
    .reduce((sum, o) => sum + o.total, 0);
  const newUsersThisWeek = users.filter(
    (u) => new Date(u.createdAt).getTime() >= weekAgo
  ).length;

  return {
    orders: orders.length,
    revenue,
    products: products.length,
    users: users.length,
    totalStock,
    inventoryValue,
    ordersThisWeek,
    revenueThisWeek,
    newUsersThisWeek,
    sparklines: {
      orders: buildDailyOrderCounts(orders),
      revenue: buildDailyRevenue(orders),
      products: buildDailyUnitsSold(orders),
      users: buildDailyNewUsers(users),
    },
  };
}
