"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useStorageState } from "@/hooks/useStorageState";
import {
  buildAdminNotifications,
  type AdminNotification,
} from "@/lib/adminNotifications";
import { formatShortDate, getInitials } from "@/lib/format";
import { getOrders, getProducts } from "@/lib/storage";
import { STORAGE_CACHE_KEYS } from "@/lib/storageCache";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

const notificationAccent: Record<AdminNotification["type"], string> = {
  pending_order: "bg-emerald-500",
  out_of_stock: "bg-red-500",
  low_stock: "bg-orange-500",
};

function NotificationItem({ notification }: { notification: AdminNotification }) {
  return (
    <Link
      href={notification.href}
      className="flex gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50"
    >
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notificationAccent[notification.type]}`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-800">
          {notification.title}
        </p>
        <p className="truncate text-xs text-gray-500">{notification.subtitle}</p>
        {notification.timestamp && (
          <p className="mt-0.5 text-[10px] text-gray-400">
            {formatShortDate(notification.timestamp)}
          </p>
        )}
      </div>
    </Link>
  );
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const [orders] = useStorageState(getOrders, [], STORAGE_CACHE_KEYS.orders);
  const [products] = useStorageState(
    getProducts,
    [],
    STORAGE_CACHE_KEYS.products
  );
  const [open, setOpen] = useState(false);
  const [badgeAnim, setBadgeAnim] = useState(0);
  const prevCount = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const notifications = useMemo(
    () => buildAdminNotifications(orders, products),
    [orders, products]
  );
  const count = notifications.length;

  useEffect(() => {
    if (count > prevCount.current) {
      setBadgeAnim((value) => value + 1);
    }
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-lg">
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

          <div ref={panelRef} className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100"
            >
              <Bell size={18} />
              {count > 0 && (
                <span
                  key={badgeAnim}
                  className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] animate-cart-pop items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-bold text-gray-900">Notifications</p>
                  <p className="text-xs text-gray-500">
                    {count === 0
                      ? "Aucune alerte pour le moment"
                      : `${count} alerte${count > 1 ? "s" : ""} en cours`}
                  </p>
                </div>

                <div className="max-h-72 overflow-y-auto p-2">
                  {count === 0 ? (
                    <p className="px-3 py-6 text-center text-sm text-gray-400">
                      Tout est à jour.
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
