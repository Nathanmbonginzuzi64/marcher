"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getUsers } from "@/lib/storage";
import { formatShortDate, getInitials } from "@/lib/format";
import type { User } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsers(
      getUsers().sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
    setLoading(false);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <AdminHeader title="Gestion des utilisateurs" />

      <div className="space-y-3 p-4 lg:p-8">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${
                user.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {getInitials(user.name)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400">
                Inscrit le {formatShortDate(user.createdAt)}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                user.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {user.role === "admin" ? "Administrateur" : "Client"}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
