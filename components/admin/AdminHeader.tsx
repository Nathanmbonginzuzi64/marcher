"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Search, X } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useStorageState } from "@/hooks/useStorageState";
import {
  buildAdminNotifications,
  type AdminNotification,
} from "@/lib/adminNotifications";
import {
  getAdminSearchTypeLabel,
  searchAdminData,
  type AdminSearchResult,
} from "@/lib/adminSearch";
import { formatShortDate, getInitials } from "@/lib/format";
import { getOrders, getProducts, getUsers } from "@/lib/storage";
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

const searchAccent: Record<AdminSearchResult["type"], string> = {
  product: "bg-violet-100 text-violet-700",
  order: "bg-emerald-100 text-emerald-700",
  user: "bg-blue-100 text-blue-700",
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

function SearchResultItem({ result }: { result: AdminSearchResult }) {
  return (
    <Link
      href={result.href}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50"
    >
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${searchAccent[result.type]}`}
      >
        {getAdminSearchTypeLabel(result.type)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-800">
          {result.title}
        </p>
        <p className="truncate text-xs text-gray-500">{result.subtitle}</p>
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
  const [users] = useStorageState(getUsers, [], STORAGE_CACHE_KEYS.users);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [badgeAnim, setBadgeAnim] = useState(0);
  const prevCount = useRef(0);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const notifications = useMemo(
    () => buildAdminNotifications(orders, products),
    [orders, products]
  );
  const count = notifications.length;

  const searchResults = useMemo(
    () => searchAdminData(query, products, orders, users),
    [query, products, orders, users]
  );

  useEffect(() => {
    if (count > prevCount.current) {
      setBadgeAnim((value) => value + 1);
    }
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!notificationsOpen && !searchOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notificationsOpen && !notificationsRef.current?.contains(target)) {
        setNotificationsOpen(false);
      }
      if (searchOpen && !searchRef.current?.contains(target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [notificationsOpen, searchOpen]);

  const toggleSearch = () => {
    setSearchOpen((open) => {
      if (open) setQuery("");
      return !open;
    });
    setNotificationsOpen(false);
  };

  return (
    <header className="admin-header">
      <div className="flex items-start justify-between gap-4 px-4 py-5 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div ref={searchRef} className="relative">
            <button
              type="button"
              aria-label="Ouvrir la recherche"
              aria-expanded={searchOpen}
              aria-controls="admin-search-panel"
              onClick={toggleSearch}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                searchOpen
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                  : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Search size={18} aria-hidden="true" />
            </button>

            {searchOpen && (
              <div
                id="admin-search-panel"
                role="search"
                className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5"
              >
                <div className="border-b border-gray-100 p-3">
                  <label htmlFor="admin-search-input" className="sr-only">
                    Rechercher des produits, commandes ou utilisateurs
                  </label>
                  <div className="relative">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <input
                      id="admin-search-input"
                      ref={searchInputRef}
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Produits, commandes, utilisateurs…"
                      autoComplete="off"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-9 text-sm text-gray-800 outline-none ring-emerald-500 focus:border-emerald-300 focus:ring-2"
                    />
                    {query && (
                      <button
                        type="button"
                        aria-label="Effacer la recherche"
                        onClick={() => setQuery("")}
                        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto p-2">
                  {query.trim().length < 2 ? (
                    <p className="px-3 py-4 text-center text-sm text-gray-400">
                      Saisissez au moins 2 caractères
                    </p>
                  ) : searchResults.length === 0 ? (
                    <p className="px-3 py-4 text-center text-sm text-gray-400">
                      Aucun résultat pour « {query.trim()} »
                    </p>
                  ) : (
                    searchResults.map((result) => (
                      <SearchResultItem key={result.id} result={result} />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              aria-controls="admin-notifications-panel"
              onClick={() => {
                setNotificationsOpen((open) => !open);
                setSearchOpen(false);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100"
            >
              <Bell size={18} aria-hidden="true" />
              {count > 0 && (
                <span
                  key={badgeAnim}
                  className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] animate-cart-pop items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div
                id="admin-notifications-panel"
                className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5"
              >
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
