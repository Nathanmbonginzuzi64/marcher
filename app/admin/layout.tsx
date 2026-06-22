"use client";

import { AdminSidebar, AdminMobileNav } from "@/components/admin/AdminSidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin>
      <div className="fixed inset-0 z-30 flex flex-col bg-[#f4f6f8] lg:pl-64">
        <AdminSidebar />
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          {children}
        </main>
        <AdminMobileNav />
      </div>
    </ProtectedRoute>
  );
}
