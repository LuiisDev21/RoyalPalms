"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaginaMiCuenta() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/mi-cuenta/reservas");
  }, [router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
    </div>
  );
}
