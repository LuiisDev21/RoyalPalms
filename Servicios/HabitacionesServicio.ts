import type {
  HabitacionResponse,
  TipoHabitacionResponse,
} from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import { ObtenerBaseUrl } from "./ApiCliente";

const BaseUrl = ObtenerBaseUrl();

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

async function ObtenerJsonSeguro<T>(Url: string, Revalidar: number): Promise<T | null> {
  const Respuesta = await fetch(Url, { next: { revalidate: Revalidar } });
  if (!Respuesta.ok) {
    console.error("[HabitacionesServicio] Error en fetch", {
      url: Url,
      status: Respuesta.status,
      statusText: Respuesta.statusText,
    });
    return null;
  }
  return Respuesta.json() as Promise<T>;
}

export async function ListarTiposHabitacion(): Promise<TipoHabitacionResponse[]> {
  if (!BaseUrl) return [];
  const Url = ConstruirUrl("/tipos-habitacion", {
    SoloActivos: true,
    Saltar: 0,
    Limite: 100,
  });
  const Datos = await ObtenerJsonSeguro<TipoHabitacionResponse[]>(Url, 300);
  return Array.isArray(Datos) ? Datos : [];
}

export async function ListarHabitaciones(
  Saltar = 0,
  Limite = 100
): Promise<HabitacionResponse[]> {
  if (!BaseUrl) return [];
  const Url = ConstruirUrl("/habitaciones", { Saltar, Limite });
  const Datos = await ObtenerJsonSeguro<HabitacionResponse[]>(Url, 60);
  return Array.isArray(Datos) ? Datos : [];
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
  const Datos = await ObtenerJsonSeguro<HabitacionResponse[]>(Url, 0);
  return Array.isArray(Datos) ? Datos : [];
}

export async function ObtenerHabitacion(Id: number): Promise<HabitacionResponse | null> {
  if (!BaseUrl) return null;
  const Url = `${BaseUrl}/habitaciones/${Id}`;
  return ObtenerJsonSeguro<HabitacionResponse>(Url, 60);
}
