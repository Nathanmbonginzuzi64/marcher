"use client";

import { usePathname } from "next/navigation";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname === "/login" || pathname === "/register";

  return (
    <div
      className={`min-h-screen ${isAdmin || isAuth ? "pb-0" : "pb-nav"}`}
    >
      {children}
    </div>
  );
}
