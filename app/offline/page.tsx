import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <WifiOff size={36} className="text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Vous êtes hors ligne</h1>
      <p className="mt-3 max-w-sm text-sm text-gray-500">
        Pas de connexion internet. Certaines pages mises en cache restent
        accessibles.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-2xl bg-emerald-500 px-8 py-3 text-sm font-semibold text-white"
      >
        Réessayer
      </Link>
    </div>
  );
}
