import * as React from "react";
import { cn } from "@/lib/utils/client";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({ open, onClose, children, className }: DrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-md bg-card rounded-t-2xl shadow-lg p-6 animate-in slide-in-from-bottom-10 duration-300",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
