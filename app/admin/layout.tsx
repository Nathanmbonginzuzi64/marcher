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
      <div className="relative flex h-dvh flex-col overflow-hidden bg-[#f4f6f8] lg:min-h-screen lg:h-auto lg:overflow-visible">
        <AdminSidebar />

        <div className="flex min-h-0 flex-1 flex-col lg:pl-64">
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
            {children}
          </main>
        </div>

        <AdminMobileNav />
      </div>
    </ProtectedRoute>
  );
}
