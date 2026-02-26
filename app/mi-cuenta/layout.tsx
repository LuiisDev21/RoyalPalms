"use client";

import { EncabezadoMiCuenta } from "@/Componentes/Comunes/EncabezadoMiCuenta";
import { SidebarMiCuenta } from "@/Componentes/Comunes/SidebarMiCuenta";
import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { ObtenerRolesUsuario } from "@/Tipos/Auth";
import { ObtenerUsuarioAlmacenado } from "@/Servicios/ApiCliente";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LayoutMiCuenta({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { Usuario, Cargando } = UseAuth();
  const [Comprobado, setComprobado] = useState(false);

  useEffect(() => {
    if (Cargando) return;
    const u = Usuario ?? ObtenerUsuarioAlmacenado();
    if (!u) {
      router.replace("/login");
      return;
    }
    const roles = ObtenerRolesUsuario(u);
    const EsSoloHuesped = roles.length === 1 && roles[0] === "huesped";
    if (!EsSoloHuesped) {
      router.replace("/admin");
      return;
    }
    setComprobado(true);
  }, [Cargando, Usuario, router, pathname]);

  if (!Comprobado || Cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f2ec]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
          <p className="text-sm text-[#5b564d]">Verificando acceso…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f2ec]">
      <SidebarMiCuenta />
      <div className="flex flex-1 flex-col overflow-hidden">
        <EncabezadoMiCuenta />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
