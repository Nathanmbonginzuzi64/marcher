"use client";

import { ProductImage } from "@/components/products/ProductImage";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) {
      showToast("Produit en rupture de stock", "error");
      return;
    }
    addItem(product.id);
    showToast(`${product.name} ajouté au panier`);
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <ProductImage
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
              Stock limité
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-bold text-white">
              Rupture
            </span>
          )}
        </div>
        <div className="p-3">
          <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-600">
            {product.category}
          </p>
          <h3 className="mt-0.5 line-clamp-1 text-sm font-semibold text-gray-900">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm transition-all hover:bg-emerald-600 active:scale-95 disabled:opacity-40"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
