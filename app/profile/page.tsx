"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Shield,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { getInitials } from "@/lib/format";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Profil</h1>
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
          <p className="text-gray-500">Connectez-vous pour accéder à votre profil</p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/login"
              className="rounded-2xl bg-emerald-500 py-3 text-sm font-semibold text-white"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-700"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { href: "/orders", icon: ShoppingBag, label: "Mes commandes" },
    ...(user.role === "admin"
      ? [{ href: "/admin", icon: Shield, label: "Administration" }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Profil</h1>

      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-bold text-white">
          {getInitials(user.name)}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {user.role === "admin" ? "Administrateur" : "Client"}
          </span>
        </div>
      </div>

      <div className="space-y-1 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {menuItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
