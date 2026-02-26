"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UseAuth } from "@/Caracteristicas/Autenticacion/Contexto/AuthContext";
import { ObtenerUsuarioAlmacenado } from "@/Servicios/ApiCliente";

export function EnlaceReservarAhora({
  className,
  children = "Reservar Ahora",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [Montado, PonerMontado] = useState(false);
  const { Usuario } = UseAuth();

  useEffect(() => {
    PonerMontado(true);
  }, []);

  const UsuarioActual = Montado ? (Usuario ?? ObtenerUsuarioAlmacenado()) : null;
  const Href = UsuarioActual ? "/mi-cuenta/reservas/nueva" : "/login";

  return (
    <Link href={Href} className={className}>
      {children}
    </Link>
  );
}
