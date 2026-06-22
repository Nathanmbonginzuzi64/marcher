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
      <div className="min-h-screen bg-[#f4f6f8] lg:pl-64">
        <AdminSidebar />
        <main className="pb-24 lg:pb-0">{children}</main>
        <AdminMobileNav />
      </div>
    </ProtectedRoute>
  );
}
