import Link from "next/link";
import { EnlaceScrollInicio } from "@/Componentes/Base/EnlaceScrollInicio";
import { LogoMarca } from "@/Componentes/Comunes/LogoMarca";

const EnlacesPie = [
  { Texto: "Habitaciones", HRef: "/habitaciones" },
  { Texto: "Nosotros", HRef: "/nosotros" },
  { Texto: "Contacto", HRef: "/#Contacto" },
  { Texto: "Política de privacidad", HRef: "/politica-privacidad" },
] as const;

export function PiePagina() {
  return (
    <footer
      className="bg-[#bf9a4f] px-6 py-16"
      role="contentinfo"
      aria-label="Pie de página"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:justify-between">
          <EnlaceScrollInicio
            href="/"
            className="FuenteTitulo flex items-center gap-3 text-lg tracking-wide text-white transition-colors hover:text-white/90"
          >
            <LogoMarca ClaseAdicional="h-7 w-7 shrink-0 text-white" />
            <span>Royal Palm</span>
          </EnlaceScrollInicio>

          <nav
            className="flex flex-wrap justify-center gap-8 md:gap-10"
            aria-label="Enlaces del sitio"
          >
            {EnlacesPie.map((Enlace) =>
              Enlace.HRef.startsWith("/#") ? (
                <Link
                  key={Enlace.Texto}
                  href={Enlace.HRef}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {Enlace.Texto}
                </Link>
              ) : (
                <EnlaceScrollInicio
                  key={Enlace.Texto}
                  href={Enlace.HRef}
                  className="text-sm text-white/80 transition-colors hover:text-white"
                >
                  {Enlace.Texto}
                </EnlaceScrollInicio>
              )
            )}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/30 pt-10 md:flex-row md:justify-between md:items-center">
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} Royal Palm. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/70">
            Donde el lujo se encuentra con la serenidad.
          </p>
        </div>
      </div>
    </footer>
  );
}
