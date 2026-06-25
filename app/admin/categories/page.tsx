"use client";

import { useMemo } from "react";
import { Tags } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useStorageState } from "@/hooks/useStorageState";
import { STORAGE_CACHE_KEYS } from "@/lib/storageCache";
import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/storage";
import type { Product } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [products] = useStorageState(getProducts, [], STORAGE_CACHE_KEYS.products);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    });
    getCategories().forEach((cat) => {
      if (!map.has(cat)) map.set(cat, 0);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [products]);

  return (
    <>
      <AdminHeader title="Catégories" subtitle="Gérez les catégories de produits" />

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 lg:p-8">
        {categories.map(([name, count]) => (
          <div
            key={name}
            className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
              <Tags size={22} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{name}</p>
              <p className="text-sm text-gray-500">
                {count} produit{count > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
