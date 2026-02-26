"use client";

import { Toaster } from "sileo";

export function ProveedorNotificaciones({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
}
