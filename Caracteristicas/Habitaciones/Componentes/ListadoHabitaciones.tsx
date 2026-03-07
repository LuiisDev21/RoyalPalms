import Link from "next/link";
import {
  BuscarHabitacionesDisponibles,
  ListarHabitaciones,
} from "@/Servicios/HabitacionesServicio";
import { TarjetaHabitacion } from "./TarjetaHabitacion";

const TamanoPagina = 6;

export async function ListadoHabitaciones({
  Entrada,
  Salida,
  Huespedes,
  TipoId,
  Pagina,
}: {
  Entrada: string | null;
  Salida: string | null;
  Huespedes: string | null;
  TipoId: string | null;
  Pagina: number;
}) {
  const Capacidad = Huespedes ? parseInt(Huespedes, 10) : null;
  const TipoNum = TipoId ? parseInt(TipoId, 10) : null;
  const PaginaActual = Math.max(1, Pagina);

  const ListaCompleta =
    Entrada && Salida
      ? await BuscarHabitacionesDisponibles(
          Entrada,
          Salida,
          Number.isNaN(Capacidad) ? null : Capacidad,
          Number.isNaN(TipoNum) ? null : TipoNum
        )
      : await ListarHabitaciones(0, 100);

  const Total = ListaCompleta.length;
  const PaginaInicio = (PaginaActual - 1) * TamanoPagina;
  const HabitacionesPagina = ListaCompleta.slice(
    PaginaInicio,
    PaginaInicio + TamanoPagina
  );
  const TotalPaginas = Math.max(1, Math.ceil(Total / TamanoPagina));
  const TieneFechas = Boolean(Entrada && Salida);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="FuenteTitulo text-2xl text-[#1c1a16] md:text-3xl">
            Nuestras habitaciones
          </h2>
          <p className="mt-1 text-sm text-[#5b564d]">
            {TieneFechas
              ? `Mostrando ${Total} resultado${Total !== 1 ? "s" : ""} disponible${Total !== 1 ? "s" : ""} para tus fechas`
              : `${Total} habitación${Total !== 1 ? "es" : ""} disponibles`}
          </p>
        </div>
      </div>

      {HabitacionesPagina.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-[#6a645a]/15 bg-[#f6f2ec] p-12 text-center">
          <p className="FuenteTitulo text-lg text-[#1c1a16]">
            No hay habitaciones disponibles
          </p>
          <p className="mt-2 text-sm text-[#5b564d]">
            {TieneFechas
              ? "Prueba otras fechas o criterios de búsqueda."
              : "Vuelve más tarde o contacta con nosotros."}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {HabitacionesPagina.map((H) => (
              <TarjetaHabitacion
                key={H.id}
                Habitacion={H}
                FechaEntrada={Entrada}
                FechaSalida={Salida}
              />
            ))}
          </div>

          {TotalPaginas > 1 && (
            <nav
              className="mt-12 flex items-center justify-center gap-2"
              aria-label="Paginación"
            >
              {PaginaActual > 1 ? (
                <Link
                  href={ConstruirUrlPaginacion(
                    PaginaActual - 1,
                    Entrada,
                    Salida,
                    Huespedes,
                    TipoId
                  )}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#5b564d] transition-colors hover:bg-[#f6f2ec] hover:text-[#1c1a16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
                  aria-label="Página anterior"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </Link>
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full text-[#6a645a]/50" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </span>
              )}

              <div className="flex items-center gap-1">
                {Array.from({ length: TotalPaginas }, (_, i) => i + 1).map(
                  (p) =>
                    p === PaginaActual ? (
                      <span
                        key={p}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b88f3a] text-sm font-medium text-white"
                        aria-current="page"
                      >
                        {p}
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={ConstruirUrlPaginacion(
                          p,
                          Entrada,
                          Salida,
                          Huespedes,
                          TipoId
                        )}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-sm text-[#5b564d] transition-colors hover:bg-[#f6f2ec] hover:text-[#1c1a16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
                      >
                        {p}
                      </Link>
                    )
                )}
              </div>

              {PaginaActual < TotalPaginas ? (
                <Link
                  href={ConstruirUrlPaginacion(
                    PaginaActual + 1,
                    Entrada,
                    Salida,
                    Huespedes,
                    TipoId
                  )}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[#5b564d] transition-colors hover:bg-[#f6f2ec] hover:text-[#1c1a16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b88f3a]"
                  aria-label="Página siguiente"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full text-[#6a645a]/50" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </section>
  );
}

function ConstruirUrlPaginacion(
  Pagina: number,
  Entrada: string | null,
  Salida: string | null,
  Huespedes: string | null,
  TipoId: string | null
): string {
  const P = new URLSearchParams();
  P.set("pagina", String(Pagina));
  if (Entrada) P.set("entrada", Entrada);
  if (Salida) P.set("salida", Salida);
  if (Huespedes) P.set("huespedes", Huespedes);
  if (TipoId) P.set("tipo", TipoId);
  return `/habitaciones?${P.toString()}`;
}
