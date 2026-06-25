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
      <div className="relative min-h-dvh bg-[#f4f6f8]">
        <AdminSidebar />

        <div className="flex min-h-dvh flex-col lg:pl-64">
          <div className="admin-scroll flex-1 overflow-x-hidden overflow-y-auto pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
            {children}
          </div>
        </div>

        <AdminMobileNav />
      </div>
    </ProtectedRoute>
  );
}
