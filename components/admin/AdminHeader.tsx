"use client";

import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { getInitials } from "@/lib/format";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur-lg">
      <div className="flex items-start justify-between gap-4 px-4 py-5 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Rechercher"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              5
            </span>
          </button>

          <div className="hidden items-center gap-2.5 rounded-2xl border border-gray-100 bg-gray-50 py-1.5 pl-1.5 pr-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
              {getInitials(user?.name ?? "A")}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold leading-tight text-gray-800">
                {user?.name ?? "Admin"}
              </p>
              <p className="text-[11px] text-gray-500">Administrateur</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
