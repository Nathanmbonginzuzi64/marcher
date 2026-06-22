"use client";

import { ProductImage } from "@/components/products/ProductImage";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore, useCartLines, useCartTotal } from "@/stores/cartStore";
import { formatPrice } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CartPage() {
  const lines = useCartLines();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartTotal();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Mon panier</h1>
        <EmptyState
          icon={ShoppingBag}
          title="Votre panier est vide"
          description="Ajoutez des produits pour commencer votre commande."
          action={
            <Link
              href="/products"
              className="inline-flex rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white"
            >
              Voir les produits
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Mon panier</h1>

      <div className="space-y-3">
        {lines.map((line) => (
          <div
            key={line.productId}
            className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <ProductImage
                src={line.product.image}
                alt={line.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {line.product.name}
                  </h3>
                  <p className="text-sm font-bold text-emerald-600">
                    {formatPrice(line.product.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(line.productId)}
                  className="text-gray-300 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(line.productId, line.quantity - 1)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">
                    {line.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(line.productId, line.quantity + 1)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatPrice(line.product.price * line.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Sous-total</span>
          <span className="font-semibold">{formatPrice(total)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-gray-500">Livraison</span>
          <span className="font-semibold text-emerald-600">Gratuite</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="font-bold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-4 flex w-full items-center justify-center rounded-2xl bg-emerald-500 py-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
      >
        Passer la commande
      </Link>
    </div>
  );
}
