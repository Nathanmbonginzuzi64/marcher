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
      <div className="relative min-h-dvh overflow-x-hidden bg-[#f4f6f8]">
        <AdminSidebar />

        <div className="lg:pl-64">
          <main className="pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
            {children}
          </main>
        </div>

        <AdminMobileNav />
      </div>
    </ProtectedRoute>
  );
}
