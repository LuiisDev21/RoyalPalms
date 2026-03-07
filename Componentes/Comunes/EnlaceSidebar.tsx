"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function UnirClases(...Clases: Array<string | undefined | false | null>) {
  return Clases.filter(Boolean).join(" ");
}

export function EnlaceSidebar({
  Hijo,
  Href,
  Activo,
  Deshabilitado,
  Icono,
  onNavigate,
}: {
  Hijo: React.ReactNode;
  Href: string;
  Activo?: boolean;
  Deshabilitado?: boolean;
  Icono: React.ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const EstaActivo = Activo ?? (pathname === Href || pathname.startsWith(Href + "/"));

  if (Deshabilitado) {
    return (
      <span
        className={UnirClases(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          "cursor-not-allowed text-[#9ca3af] opacity-70"
        )}
        title="No tienes permiso para acceder"
      >
        {Icono}
        <span>{Hijo}</span>
      </span>
    );
  }

  return (
    <Link
      href={Href}
      onClick={onNavigate}
      className={UnirClases(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        EstaActivo
          ? "bg-[#b88f3a]/20 text-[#d4a84b]"
          : "text-[#d1d5db] hover:bg-[#374151] hover:text-white"
      )}
    >
      {Icono}
      <span>{Hijo}</span>
    </Link>
  );
}
