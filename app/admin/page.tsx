"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductImage } from "@/components/products/ProductImage";
import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  Package,
  Users,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Sparkline } from "@/components/admin/Sparkline";
import { SalesLineChart } from "@/components/admin/SalesLineChart";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getOrders, getProducts, getUsers } from "@/lib/storage";
import { formatPrice, formatShortDate, getInitials } from "@/lib/format";
import type { Order, Product, User } from "@/lib/types";

const SPARK_DATA = {
  orders: [12, 18, 15, 22, 19, 25, 28],
  revenue: [80, 120, 95, 140, 130, 160, 180],
  products: [40, 41, 42, 43, 44, 44, 45],
  users: [280, 290, 295, 300, 305, 308, 312],
};

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  iconBg,
  sparkColor,
  sparkData,
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  iconBg: string;
  sparkColor: string;
  sparkData: number[];
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon size={20} className="text-white" />
        </div>
        <Sparkline data={sparkData} color={sparkColor} className="h-8 w-20" />
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-[11px] font-semibold text-emerald-600">{change}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7");

  useEffect(() => {
    setOrders(getOrders());
    setProducts(getProducts());
    setUsers(getUsers());
    setLoading(false);
  }, []);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0);
    return {
      orders: orders.length || 128,
      revenue: revenue || 1250,
      products: products.length || 45,
      users: users.length || 312,
    };
  }, [orders, products, users]);

  const topProducts = useMemo(() => {
    const counts: Record<string, { product: Product; sold: number }> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return;
        if (!counts[item.productId]) {
          counts[item.productId] = { product, sold: 0 };
        }
        counts[item.productId].sold += item.quantity;
      });
    });
    const result = Object.values(counts).sort((a, b) => b.sold - a.sold);
    if (result.length === 0) {
      return products.slice(0, 5).map((p) => ({ product: p, sold: 0 }));
    }
    return result.slice(0, 5);
  }, [orders, products]);

  const recentUsers = useMemo(
    () =>
      users
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [users]
  );

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <AdminHeader
        title="Tableau de bord 👋"
        subtitle="Bienvenue, Admin ! Voici un aperçu de votre boutique."
      />

      <div className="space-y-6 p-4 lg:p-8">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            label="Total Commandes"
            value={String(stats.orders)}
            change="+12% ce mois"
            icon={ShoppingBag}
            iconBg="bg-emerald-500"
            sparkColor="#10b981"
            sparkData={SPARK_DATA.orders}
          />
          <StatCard
            label="Chiffre d'affaires"
            value={formatPrice(stats.revenue)}
            change="+18% ce mois"
            icon={DollarSign}
            iconBg="bg-blue-500"
            sparkColor="#3b82f6"
            sparkData={SPARK_DATA.revenue}
          />
          <StatCard
            label="Produits"
            value={String(stats.products)}
            change="+5 nouveaux"
            icon={Package}
            iconBg="bg-violet-500"
            sparkColor="#8b5cf6"
            sparkData={SPARK_DATA.products}
          />
          <StatCard
            label="Utilisateurs"
            value={String(stats.users)}
            change="+20 ce mois"
            icon={Users}
            iconBg="bg-orange-500"
            sparkColor="#f97316"
            sparkData={SPARK_DATA.users}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 xl:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                Ventes des 7 derniers jours
              </h3>
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="appearance-none rounded-xl border border-gray-200 bg-gray-50 py-1.5 pl-3 pr-8 text-xs font-medium text-gray-600 outline-none"
                >
                  <option value="7">7 jours</option>
                  <option value="30">30 jours</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
            <SalesLineChart orders={orders} />
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                Commandes récentes
              </h3>
              <Link
                href="/admin/orders"
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Voir toutes
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="max-h-72 space-y-3 overflow-y-auto overscroll-contain pr-1">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-50 bg-gray-50/80 p-2.5"
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                    <ProductImage
                      src={order.items[0]?.image ?? "/icons/icon.svg"}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-gray-800">
                      #{order.id}
                    </p>
                    <p className="truncate text-[11px] text-gray-500">
                      {order.userName}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {formatShortDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                    <div className="mt-1">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                Produits les plus vendus
              </h3>
              <Link
                href="/admin/products"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Voir tous
              </Link>
            </div>
            <div className="max-h-80 overflow-x-auto overflow-y-auto overscroll-contain">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    <th className="pb-3 pr-2">Produit</th>
                    <th className="pb-3 px-2 text-center">Vendus</th>
                    <th className="pb-3 px-2 text-center">Stock</th>
                    <th className="pb-3 pl-2 text-right">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map(({ product, sold }) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2.5">
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                            <ProductImage
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-semibold text-gray-800">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-center font-medium text-gray-600">
                        {sold}
                      </td>
                      <td className="px-2 py-3 text-center">
                        <span
                          className={`font-bold ${
                            product.stock > 10
                              ? "text-emerald-600"
                              : product.stock > 0
                                ? "text-orange-500"
                                : "text-red-500"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-right font-bold text-gray-800">
                        {formatPrice(product.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                Utilisateurs récents
              </h3>
              <Link
                href="/admin/users"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Voir tous
              </Link>
            </div>
            <div className="max-h-72 space-y-3 overflow-y-auto overscroll-contain pr-1">
              {recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-50 bg-gray-50/50 px-3 py-2.5"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {getInitials(u.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {u.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {formatShortDate(u.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {u.role === "admin" ? "Administrateur" : "Client"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
