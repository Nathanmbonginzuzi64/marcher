"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, Package, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCartItemCount } from "@/stores/cartStore";

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/products", label: "Recherche", icon: Search },
  { href: "/cart", label: "Panier", icon: ShoppingCart, badge: true },
  { href: "/orders", label: "Commandes", icon: Package },
  { href: "/profile", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartItemCount();
  const prevCount = useRef(itemCount);
  const [badgeAnim, setBadgeAnim] = useState(0);

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setBadgeAnim((k) => k + 1);
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  if (pathname.startsWith("/admin") || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="bottom-nav-shell" aria-label="Navigation principale">
      <div className="bottom-nav-grid">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              prefetch
              className={`bottom-nav-item relative transition-colors duration-150 ${
                isActive
                  ? "text-emerald-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-transform duration-300 ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                />
                {badge && itemCount > 0 && (
                  <span
                    key={badgeAnim}
                    className="absolute -right-1 -top-1 flex h-4 min-w-4 animate-cart-pop items-center justify-center rounded-full bg-emerald-500 px-0.5 text-[10px] font-bold leading-none text-white"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </div>
              <span
                className={`max-w-full truncate text-[10px] font-medium ${
                  isActive ? "text-emerald-600" : ""
                }`}
              >
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-5 rounded-full bg-emerald-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
