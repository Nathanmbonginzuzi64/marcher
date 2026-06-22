"use client";

import { useToastStore } from "@/stores/toastStore";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {toasts.map((toast, i) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg animate-toast-enter ${
            toast.type === "success"
              ? "bg-emerald-500 text-white"
              : toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-white"
          }`}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {toast.type === "success" && <CheckCircle size={18} />}
          {toast.type === "error" && <XCircle size={18} />}
          {toast.type === "info" && <Info size={18} />}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => dismiss(toast.id)}
            className="btn-press opacity-70 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
