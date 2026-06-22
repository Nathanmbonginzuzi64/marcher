"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Package } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getProducts } from "@/lib/storage";
import { ProductCard } from "@/components/products/ProductCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Product } from "@/lib/types";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
    setLoading(false);
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    if (q) setSearch(q);
    if (cat) setCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        !category ||
        p.category.toLowerCase() === category.toLowerCase();
      const matchPrice = maxPrice === null || p.price <= maxPrice;
      return matchSearch && matchCategory && matchPrice;
    });
  }, [products, search, category, maxPrice]);

  const maxProductPrice = useMemo(
    () => Math.max(...products.map((p) => p.price), 20),
    [products]
  );

  return (
    <div className="mx-auto max-w-lg lg:max-w-4xl px-4 pt-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Nos produits</h1>

      <SearchBar
        value={search}
        onChange={setSearch}
        showFilter
        onFilterClick={() => setShowFilter(!showFilter)}
      />

      {showFilter && (
        <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <label className="text-sm font-medium text-gray-700">
            Prix max : {maxPrice ? formatPrice(maxPrice) : "Tous"}
          </label>
          <input
            type="range"
            min={1}
            max={maxProductPrice}
            step={0.5}
            value={maxPrice ?? maxProductPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
          <button
            onClick={() => setMaxPrice(null)}
            className="mt-2 text-xs font-medium text-emerald-600"
          >
            Réinitialiser le filtre
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aucun produit trouvé"
          description="Essayez de modifier votre recherche ou vos filtres."
        />
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 pb-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductsContent />
    </Suspense>
  );
}
