"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Phone, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore, useCartLines, useCartTotal } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { formatPrice } from "@/lib/format";
import { addOrder, getProducts, saveProducts } from "@/lib/storage";
import type { Order } from "@/lib/types";

function CheckoutContent() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const lines = useCartLines();
  const total = useCartTotal();
  const clearCart = useCartStore((s) => s.clearCart);
  const showToast = useToastStore((s) => s.show);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (!orderPlaced && lines.length === 0) {
      router.replace("/cart");
    }
  }, [lines.length, orderPlaced, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || lines.length === 0 || loading) return;

    setLoading(true);

    const products = getProducts();
    const updatedProducts = products.map((p) => {
      const line = lines.find((l) => l.productId === p.id);
      if (line) return { ...p, stock: Math.max(0, p.stock - line.quantity) };
      return p;
    });
    saveProducts(updatedProducts);

    const order: Order = {
      id: `CMD-${String(Date.now()).slice(-5)}`,
      userId: user.id,
      userName: user.name,
      items: lines.map((l) => ({
        productId: l.productId,
        name: l.product.name,
        price: l.product.price,
        quantity: l.quantity,
        image: l.product.image,
      })),
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const saved = addOrder(order);
    if (!saved) {
      showToast("Erreur lors de l'enregistrement de la commande", "error");
      setLoading(false);
      return;
    }

    setOrderPlaced(true);
    clearCart();
    showToast("Commande passée avec succès ! 🎉");
    router.replace("/orders");
  };

  if (!orderPlaced && lines.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">
            Informations de livraison
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
              <User size={16} className="text-gray-400" />
              <span className="text-sm">{user?.name}</span>
            </div>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Adresse de livraison"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-300"
              />
            </div>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Numéro de téléphone"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-300"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Récapitulatif</h2>
          {lines.map((line) => (
            <div
              key={line.productId}
              className="flex items-center justify-between py-2 text-sm"
            >
              <span className="text-gray-600">
                {line.quantity}x {line.product.name}
              </span>
              <span className="font-medium">
                {formatPrice(line.product.price * line.quantity)}
              </span>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3 font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-emerald-500 py-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
        >
          {loading ? "Traitement..." : "Confirmer la commande"}
        </button>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
