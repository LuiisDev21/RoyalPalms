import type {
  HabitacionResponse,
  TipoHabitacionResponse,
} from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";

const BaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

function ConstruirUrl(
  Ruta: string,
  Params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!BaseUrl) return "";
  const Buscador = new URLSearchParams();
  if (Params) {
    Object.entries(Params).forEach(([Clave, Valor]) => {
      if (Valor !== undefined && Valor !== null && Valor !== "") {
        Buscador.set(Clave, String(Valor));
      }
    });
  }
  const Query = Buscador.toString();
  return `${BaseUrl}${Ruta}${Query ? `?${Query}` : ""}`;
}

export async function ListarTiposHabitacion(): Promise<TipoHabitacionResponse[]> {
  if (!BaseUrl) return [];
  const Url = ConstruirUrl("/tipos-habitacion", {
    SoloActivos: true,
    Saltar: 0,
    Limite: 100,
  });
  const Respuesta = await fetch(Url, { next: { revalidate: 300 } });
  if (!Respuesta.ok) return [];
  return Respuesta.json();
}

export async function ListarHabitaciones(
  Saltar = 0,
  Limite = 100
): Promise<HabitacionResponse[]> {
  if (!BaseUrl) return [];
  const Url = ConstruirUrl("/habitaciones", { Saltar, Limite });
  const Respuesta = await fetch(Url, { next: { revalidate: 60 } });
  if (!Respuesta.ok) return [];
  return Respuesta.json();
}

export async function BuscarHabitacionesDisponibles(
  FechaEntrada: string,
  FechaSalida: string,
  Capacidad?: number | null,
  TipoHabitacionId?: number | null
): Promise<HabitacionResponse[]> {
  if (!BaseUrl) return [];
  const Params: Record<string, string | number> = {
    FechaEntrada,
    FechaSalida,
  };
  if (Capacidad != null && Capacidad > 0) Params.Capacidad = Capacidad;
  if (TipoHabitacionId != null && TipoHabitacionId > 0)
    Params.TipoHabitacionId = TipoHabitacionId;
  const Url = ConstruirUrl("/habitaciones/buscar", Params);
  const Respuesta = await fetch(Url, { next: { revalidate: 0 } });
  if (!Respuesta.ok) return [];
  return Respuesta.json();
}

export async function ObtenerHabitacion(Id: number): Promise<HabitacionResponse | null> {
  if (!BaseUrl) return null;
  const Url = `${BaseUrl}/habitaciones/${Id}`;
  const Respuesta = await fetch(Url, { next: { revalidate: 60 } });
  if (!Respuesta.ok) return null;
  return Respuesta.json();
}
