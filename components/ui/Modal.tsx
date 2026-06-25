"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useClientReady } from "@/hooks/useClientReady";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  const ready = useClientReady();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!ready || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:items-center lg:pb-0"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full lg:flex lg:justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
