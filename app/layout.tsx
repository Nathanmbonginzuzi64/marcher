import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { BottomNav } from "@/components/layout/BottomNav";
import { MainContent } from "@/components/layout/MainContent";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { PWARegister } from "@/components/pwa/PWARegister";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bouillie Shop",
  description: "Commandez votre bouillie en ligne — livraison rapide",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bouillie Shop",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geist.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AppProviders>
          <PWARegister />
          <ToastContainer />
          <MainContent>{children}</MainContent>
          <BottomNav />
        </AppProviders>
      </body>
    </html>
  );
}
