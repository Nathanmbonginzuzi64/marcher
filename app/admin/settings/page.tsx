"use client";

import { Settings } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminSettingsPage() {
  return (
    <>
      <AdminHeader
        title="Paramètres"
        subtitle="Configuration de votre boutique Bouillie Shop"
      />

      <div className="space-y-4 p-4 lg:p-8">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <Settings size={18} className="text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Informations boutique</p>
              <p className="text-sm text-gray-500">Bouillie Shop — Version 1.0.0</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <h3 className="mb-4 text-sm font-bold text-gray-800">Général</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600">
                Nom de la boutique
              </label>
              <input
                defaultValue="Bouillie Shop"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Devise</label>
              <input
                defaultValue="USD"
                disabled
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
