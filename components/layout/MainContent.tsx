"use client";

import { usePathname } from "next/navigation";
import { PageTransition } from "@/components/animation/PageTransition";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname === "/login" || pathname === "/register";

  return (
    <div
      className={`${
        isAdmin ? "h-dvh overflow-hidden" : "min-h-screen"
      } ${isAdmin || isAuth ? "pb-0" : "pb-nav"}`}
    >
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
