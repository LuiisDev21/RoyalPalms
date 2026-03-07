"use client";

import { Toaster } from "sileo";

export function ProveedorNotificaciones({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position="top-center"
        options={{
          fill: "#0b0b0b",
          styles: {
            title: "text-white!",
            description: "text-white/80!",
            badge: "bg-white/10! text-white!",
            button: "bg-white/10! hover:bg-white/15! text-white!",
          },
        }}
      />
      {children}
    </>
  );
}
