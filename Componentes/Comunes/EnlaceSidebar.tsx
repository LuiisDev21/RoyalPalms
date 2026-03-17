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
  Icono,
  onNavigate,
  SoloIcono = false,
}: {
  Hijo: React.ReactNode;
  Href: string;
  Activo?: boolean;
  Icono: React.ReactNode;
  onNavigate?: () => void;
  SoloIcono?: boolean;
}) {
  const pathname = usePathname();
  const EstaActivo = Activo ?? (pathname === Href || pathname.startsWith(Href + "/"));

  return (
    <Link
      href={Href}
      onClick={onNavigate}
      className={UnirClases(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        SoloIcono && "justify-center px-2",
        EstaActivo
          ? "bg-[#b88f3a]/20 text-[#d4a84b]"
          : "text-[#d1d5db] hover:bg-[#374151] hover:text-white"
      )}
      title={typeof Hijo === "string" ? Hijo : undefined}
    >
      {Icono}
      {!SoloIcono && <span>{Hijo}</span>}
    </Link>
  );
}
