import { HacerRequest } from "./ApiCliente";
import type {
  HabitacionResponse,
  TipoHabitacionResponse,
} from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";

export async function ListarTiposHabitacionCliente(): Promise<TipoHabitacionResponse[]> {
  const r = await HacerRequest<TipoHabitacionResponse[]>(
    "/tipos-habitacion?SoloActivos=true&Saltar=0&Limite=100"
  );
  return Array.isArray(r) ? r : [];
}

export interface ReservaClienteResponse {
  id: number;
  habitacion_id: number;
  usuario_id: number;
  fecha_entrada: string;
  fecha_salida: string;
  numero_huespedes: number;
  precio_total: string;
  estado: string;
  codigo_reserva: string | null;
  numero_habitacion?: string | null;
  notas?: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface TransaccionPagoClienteResponse {
  id: number;
  reserva_id: number;
  tipo: string;
  monto: string;
  metodo_pago: string;
  estado: string;
  numero_transaccion: string | null;
  fecha_pago: string | null;
  fecha_creacion: string;
}

export async function BuscarHabitacionesDisponiblesCliente(
  FechaEntrada: string,
  FechaSalida: string,
  Capacidad?: number | null,
  TipoHabitacionId?: number | null
): Promise<HabitacionResponse[]> {
  const Params = new URLSearchParams({
    FechaEntrada,
    FechaSalida,
  });
  if (Capacidad != null && Capacidad > 0) Params.set("Capacidad", String(Capacidad));
  if (TipoHabitacionId != null && TipoHabitacionId > 0)
    Params.set("TipoHabitacionId", String(TipoHabitacionId));
  const r = await HacerRequest<HabitacionResponse[]>(
    `/habitaciones/buscar?${Params.toString()}`
  );
  return Array.isArray(r) ? r : [];
}

export async function ListarMisReservas(): Promise<ReservaClienteResponse[]> {
  const r = await HacerRequest<ReservaClienteResponse[]>("/reservas");
  return Array.isArray(r) ? r : [];
}

export async function ObtenerReservaCliente(Id: number): Promise<ReservaClienteResponse> {
  return HacerRequest<ReservaClienteResponse>(`/reservas/${Id}`);
}

export interface DatosCrearReserva {
  habitacion_id: number;
  fecha_entrada: string;
  fecha_salida: string;
  numero_huespedes: number;
  notas?: string | null;
}

export async function CrearReservaCliente(
  Datos: DatosCrearReserva
): Promise<ReservaClienteResponse> {
  return HacerRequest<ReservaClienteResponse>("/reservas", {
    method: "POST",
    body: JSON.stringify(Datos),
  });
}

export async function CancelarReservaCliente(Id: number): Promise<ReservaClienteResponse> {
  return HacerRequest<ReservaClienteResponse>(`/reservas/${Id}/cancelar`, {
    method: "POST",
  });
}

export async function ListarPagosDeReserva(
  ReservaId: number
): Promise<TransaccionPagoClienteResponse[]> {
  const r = await HacerRequest<TransaccionPagoClienteResponse[]>(
    `/pagos/reserva/${ReservaId}`
  );
  return Array.isArray(r) ? r : [];
}

export async function ObtenerPagoCliente(
  TransaccionId: number
): Promise<TransaccionPagoClienteResponse> {
  return HacerRequest<TransaccionPagoClienteResponse>(`/pagos/${TransaccionId}`);
}

export interface DatosCrearPago {
  reserva_id: number;
  monto: string;
  metodo_pago: string;
}

export async function CrearPagoCliente(
  Datos: DatosCrearPago
): Promise<TransaccionPagoClienteResponse> {
  return HacerRequest<TransaccionPagoClienteResponse>("/pagos", {
    method: "POST",
    body: JSON.stringify(Datos),
  });
}
