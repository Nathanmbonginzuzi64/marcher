"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock,
  Flame,
  MapPin,
  Search,
  ShieldCheck,
  Soup,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { getCategories } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { getProducts } from "@/lib/storage";
import { useAuthStore } from "@/stores/authStore";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductImage } from "@/components/products/ProductImage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Product } from "@/lib/types";

const CATEGORY_ICONS: Record<string, string> = {
  Classique: "🌽",
  Sucrée: "🍯",
  Épicée: "🌶️",
  Premium: "✨",
  Bio: "🌿",
};

const FEATURES = [
  { icon: Truck, label: "Livraison rapide", sub: "Sous 30 min" },
  { icon: ShieldCheck, label: "100% naturel", sub: "Sans additifs" },
  { icon: Star, label: "4.9/5", sub: "500+ avis" },
];

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setProducts(getProducts());
    setLoading(false);
  }, []);

  const popular = useMemo(() => products.slice(0, 4), [products]);
  const trending = useMemo(
    () => [...products].sort((a, b) => b.stock - a.stock).slice(0, 6),
    [products]
  );
  const featured = products[0];
  const categories = useMemo(() => getCategories().slice(0, 6), [products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <div className="mx-auto max-w-lg overflow-hidden bg-gray-50 lg:max-w-4xl">
      {/* Hero */}
      <section className="relative min-h-[340px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1516684732162-798a0062be99?w=1200&h=800&fit=crop"
          alt="Bouillie"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-emerald-950/60 to-gray-50" />

        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -left-8 top-32 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl" />

        <div className="relative px-5 pb-10 pt-12">
          <div className="animate-fade-up mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md ring-1 ring-white/30">
                <Soup size={22} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-200">
                  {user ? `Bonjour, ${user.name.split(" ")[0]} 👋` : "Bienvenue"}
                </p>
                <h1 className="text-xl font-bold text-white">Bouillie Shop</h1>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/20">
              <MapPin size={12} className="text-emerald-300" />
              <span className="text-[11px] font-medium text-white">Abidjan</span>
            </div>
          </div>

          <div className="animate-fade-up animate-fade-up-delay-1">
            <h2 className="text-2xl font-bold leading-tight text-white">
              La bouillie
              <br />
              <span className="text-emerald-300">authentique</span> chez vous
            </h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/75">
              Commandez en quelques clics. Fraîche, nourrissante et livrée
              rapidement à votre porte.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="animate-fade-up animate-fade-up-delay-2 relative mt-6"
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une bouillie..."
              className="w-full rounded-2xl border-0 bg-white py-3.5 pl-11 pr-24 text-sm text-gray-800 shadow-xl shadow-black/10 outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-600"
            >
              Chercher
            </button>
          </form>
        </div>
      </section>

      {/* Features strip */}
      <section className="relative z-10 -mt-5 px-4">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-3 shadow-lg shadow-gray-200/60 ring-1 ring-gray-100">
          {FEATURES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center py-2 text-center">
              <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                <Icon size={16} className="text-emerald-600" />
              </div>
              <p className="text-[11px] font-bold text-gray-800">{label}</p>
              <p className="text-[10px] text-gray-400">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-7 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Catégories</h2>
          <Link
            href="/products"
            className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600"
          >
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>
        <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${encodeURIComponent(cat)}`}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-emerald-200">
                {CATEGORY_ICONS[cat] ?? "🥣"}
              </div>
              <span className="text-[11px] font-medium text-gray-600">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="mt-7 px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 p-5 shadow-lg shadow-orange-200/50">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 right-8 h-20 w-20 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Zap size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <Flame size={14} className="text-yellow-200" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-100">
                  Offre limitée
                </span>
              </div>
              <h3 className="mt-0.5 text-lg font-bold text-white">-15% aujourd&apos;hui</h3>
              <p className="text-xs text-white/80">Code : BOUILLIE15</p>
            </div>
            <Link
              href="/products"
              className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-bold text-orange-600"
            >
              Profiter
            </Link>
          </div>
        </div>
      </section>

      {/* Featured product */}
      {featured && (
        <section className="mt-7 px-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-500" />
            <h2 className="text-base font-bold text-gray-900">Coup de cœur</h2>
          </div>
          <Link
            href={`/product/${featured.id}`}
            className="group flex overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md"
          >
            <div className="relative h-36 w-36 shrink-0 sm:h-40 sm:w-40">
              <ProductImage
                src={featured.image}
                alt={featured.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center p-4">
              <span className="w-fit rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                {featured.category}
              </span>
              <h3 className="mt-2 text-base font-bold text-gray-900">
                {featured.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                {featured.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-emerald-600">
                  {formatPrice(featured.price)}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                  <Clock size={12} />
                  15-25 min
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Trending horizontal scroll */}
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between px-4">
          <h2 className="text-base font-bold text-gray-900">Tendances 🔥</h2>
          <Link
            href="/products"
            className="text-xs font-semibold text-emerald-600"
          >
            Voir tout
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <div className="hide-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
            {trending.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="w-36 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
              >
                <div className="relative aspect-square">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2.5">
                  <p className="line-clamp-1 text-xs font-semibold text-gray-900">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-emerald-600">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Popular grid */}
      <section className="mt-7 px-4 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Populaires</h2>
          <Link
            href="/products"
            className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600"
          >
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {popular.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="mx-4 mb-8 overflow-hidden rounded-3xl bg-emerald-600 p-6 text-center shadow-lg shadow-emerald-200">
        <Soup size={32} className="mx-auto text-emerald-200" />
        <h3 className="mt-3 text-lg font-bold text-white">
          Prêt à commander ?
        </h3>
        <p className="mt-1 text-sm text-emerald-100">
          Découvrez toute notre carte de bouillies artisanales
        </p>
        <Link
          href="/products"
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-emerald-600 transition-transform active:scale-95"
        >
          Explorer le menu
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
