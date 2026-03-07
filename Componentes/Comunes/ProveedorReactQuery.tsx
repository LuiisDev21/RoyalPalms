"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const TiempoFrescoMs = 5 * 60 * 1000;
const TiempoCacheMs = 10 * 60 * 1000;

export function ProveedorReactQuery({
  children,
}: {
  children: React.ReactNode;
}) {
  const [Cliente] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: TiempoFrescoMs,
            gcTime: TiempoCacheMs,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={Cliente}>{children}</QueryClientProvider>
  );
}
