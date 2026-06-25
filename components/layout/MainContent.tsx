"use client";

import { usePathname } from "next/navigation";
import { PageTransition } from "@/components/animation/PageTransition";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) {
    return <>{children}</>;
  }

  const isAuth = pathname === "/login" || pathname === "/register";

  return (
    <div className={`min-h-screen overflow-x-hidden ${isAuth ? "pb-0" : "pb-nav"}`}>
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
