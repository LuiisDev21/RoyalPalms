"use client";

import { EncabezadoPanel } from "@/Componentes/Comunes/EncabezadoPanel";
import { SidebarPanel } from "@/Componentes/Comunes/SidebarPanel";
import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { EsHuesped, ObtenerRolesUsuario } from "@/Tipos/Auth";
import { ObtenerUsuarioAlmacenado } from "@/Servicios/ApiCliente";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LayoutAdmin({
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
    if (EsHuesped(roles)) {
      router.replace("/");
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
      <SidebarPanel />
      <div className="flex flex-1 flex-col overflow-hidden">
        <EncabezadoPanel />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
