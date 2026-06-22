"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductImage } from "@/components/products/ProductImage";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { getProducts } from "@/lib/storage";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Product } from "@/lib/types";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    const products = getProducts();
    const found = products.find((p) => p.id === params.id);
    setProduct(found ?? null);
    setLoading(false);
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product.id);
    }
    showToast(`${quantity}x ${product.name} ajouté au panier`);
  };

  if (loading) return <LoadingSpinner />;
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Produit introuvable</p>
        <button onClick={() => router.back()} className="mt-4 text-emerald-600">
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="relative aspect-square bg-gray-50">
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md"
        >
          <ArrowLeft size={20} />
        </button>
        <ProductImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="px-5 py-6 animate-fade-up">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {product.category}
        </span>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <span
            className={`text-sm font-medium ${
              product.stock > 10
                ? "text-emerald-600"
                : product.stock > 0
                  ? "text-orange-500"
                  : "text-red-500"
            }`}
          >
            {product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}
          </span>
        </div>

        {product.stock > 0 && (
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-gray-100 px-2 py-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="btn-press flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              <ShoppingCart size={18} />
              Ajouter au panier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
