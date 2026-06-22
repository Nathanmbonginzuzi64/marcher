"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tags,
  Settings,
  User,
  LogOut,
  Soup,
  Plus,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const mainNav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
];

const gestionNav = [
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/categories", label: "Catégories", icon: Tags },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const linkClass = (href: string) =>
    `mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
      isActive(href)
        ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-gray-100 bg-white lg:flex">
      <div className="border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-sm shadow-emerald-200">
            <Soup size={22} className="text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">Bouillie Shop</p>
            <p className="text-[11px] font-semibold text-emerald-600">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        {mainNav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={linkClass(href)}>
            <Icon size={18} />
            {label}
          </Link>
        ))}

        <p className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Gestion
        </p>
        {gestionNav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={linkClass(href)}>
            <Icon size={18} />
            {label}
          </Link>
        ))}

        <p className="mb-2 mt-7 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Paramètres
        </p>
        <Link href="/admin/settings" className={linkClass("/admin/settings")}>
          <Settings size={18} />
          Paramètres
        </Link>
        <Link href="/profile" className={linkClass("/profile")}>
          <User size={18} />
          Mon profil
        </Link>
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </nav>

      <div className="m-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
        <p className="text-xs font-bold text-emerald-800">Bouillie Shop</p>
        <p className="text-[10px] text-emerald-600">Version 1.0.0</p>
        <p className="mt-2 text-[10px] leading-relaxed text-gray-500">
          Plateforme e-commerce de bouillie traditionnelle.
        </p>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();

  const leftItems = [
    { href: "/admin", label: "Accueil", icon: LayoutDashboard },
    { href: "/admin/products", label: "Produits", icon: Package },
  ];

  const rightItems = [
    { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
    { href: "/profile", label: "Profil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/95 backdrop-blur-lg safe-bottom lg:hidden">
      <div className="mx-auto flex max-w-lg items-end justify-around px-2 pb-2 pt-1">
        {leftItems.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 ${
                active ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}

        <Link
          href="/admin/products?add=true"
          className="-mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-300 transition-transform active:scale-95"
          aria-label="Ajouter un produit"
        >
          <Plus size={26} strokeWidth={2.5} />
        </Link>

        {rightItems.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 ${
                active ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function isActivePath(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}
