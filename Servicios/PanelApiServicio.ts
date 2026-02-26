import type {
  HabitacionResponse,
  TipoHabitacionResponse,
} from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import { HacerRequest, HacerRequestFormData } from "./ApiCliente";

export interface PoliticaCancelacionResponse {
  id: number;
  nombre: string;
  descripcion: string | null;
  horas_anticipacion: number;
  porcentaje_penalizacion?: string;
  activa: boolean;
  fecha_creacion: string;
}

export async function ListarTiposHabitacionPanel(
  SoloActivos = true
): Promise<TipoHabitacionResponse[]> {
  const r = await HacerRequest<TipoHabitacionResponse[]>(
    `/tipos-habitacion?SoloActivos=${SoloActivos}&Saltar=0&Limite=100`
  );
  return Array.isArray(r) ? r : [];
}

export async function ListarPoliticasCancelacionPanel(
  SoloActivos = false
): Promise<PoliticaCancelacionResponse[]> {
  const r = await HacerRequest<PoliticaCancelacionResponse[]>(
    `/politicas-cancelacion?SoloActivos=${SoloActivos}&Saltar=0&Limite=100`
  );
  return Array.isArray(r) ? r : [];
}

export async function ListarHabitacionesPanel(
  Saltar = 0,
  Limite = 100
): Promise<HabitacionResponse[]> {
  const r = await HacerRequest<HabitacionResponse[]>(
    `/habitaciones?Saltar=${Saltar}&Limite=${Limite}`
  );
  return Array.isArray(r) ? r : [];
}

export async function ObtenerHabitacionPanel(Id: number): Promise<HabitacionResponse> {
  return HacerRequest<HabitacionResponse>(`/habitaciones/${Id}`);
}

export interface DatosCrearHabitacion {
  numero: string;
  tipo_habitacion_id: number;
  politica_cancelacion_id?: number | null;
  descripcion?: string | null;
  capacidad: number;
  precio_por_noche: number;
  estado?: string;
  piso?: number | null;
}

export interface DatosActualizarHabitacion {
  tipo_habitacion_id: number;
  politica_cancelacion_id?: number | null;
  descripcion?: string | null;
  capacidad: number;
  precio_por_noche: number;
  estado?: string;
  piso?: number | null;
}

export async function CrearHabitacionPanel(
  Datos: DatosCrearHabitacion,
  Archivo: File | null
): Promise<HabitacionResponse> {
  const form = new FormData();
  form.append("numero", Datos.numero);
  form.append("tipo_habitacion_id", String(Datos.tipo_habitacion_id));
  form.append("descripcion", Datos.descripcion ?? "");
  form.append("capacidad", String(Datos.capacidad));
  form.append("precio_por_noche", String(Datos.precio_por_noche));
  form.append("estado", Datos.estado ?? "disponible");
  if (Datos.politica_cancelacion_id != null)
    form.append("politica_cancelacion_id", String(Datos.politica_cancelacion_id));
  if (Datos.piso != null) form.append("piso", String(Datos.piso));
  if (Archivo) form.append("archivo", Archivo);
  return HacerRequestFormData<HabitacionResponse>("/habitaciones", form, "POST");
}

export async function ActualizarHabitacionPanel(
  Id: number,
  Datos: DatosActualizarHabitacion,
  Archivo: File | null
): Promise<HabitacionResponse> {
  const form = new FormData();
  form.append("tipo_habitacion_id", String(Datos.tipo_habitacion_id));
  form.append("descripcion", Datos.descripcion ?? "");
  form.append("capacidad", String(Datos.capacidad));
  form.append("precio_por_noche", String(Datos.precio_por_noche));
  form.append("estado", Datos.estado ?? "disponible");
  form.append(
    "politica_cancelacion_id",
    Datos.politica_cancelacion_id != null ? String(Datos.politica_cancelacion_id) : ""
  );
  if (Datos.piso != null) form.append("piso", String(Datos.piso));
  if (Archivo) form.append("archivo", Archivo);
  return HacerRequestFormData<HabitacionResponse>(`/habitaciones/${Id}`, form, "PUT");
}

export async function EliminarHabitacionPanel(Id: number): Promise<void> {
  await HacerRequest(`/habitaciones/${Id}`, { method: "DELETE" });
}

export interface ReservaResponse {
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
  nombre_usuario?: string | null;
  notas?: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export async function ListarTodasReservasPanel(
  Saltar = 0,
  Limite = 100
): Promise<ReservaResponse[]> {
  const r = await HacerRequest<ReservaResponse[]>(
    `/reservas/todas?Saltar=${Saltar}&Limite=${Limite}`
  );
  return Array.isArray(r) ? r : [];
}

export async function ObtenerReservaPanel(Id: number): Promise<ReservaResponse> {
  return HacerRequest<ReservaResponse>(`/reservas/${Id}`);
}

export async function ActualizarReservaPanel(
  Id: number,
  Datos: { estado?: string; notas?: string | null }
): Promise<ReservaResponse> {
  return HacerRequest<ReservaResponse>(`/reservas/${Id}`, {
    method: "PUT",
    body: JSON.stringify(Datos),
  });
}

export async function CancelarReservaPanel(Id: number): Promise<ReservaResponse> {
  return HacerRequest<ReservaResponse>(`/reservas/${Id}/cancelar`, {
    method: "POST",
  });
}

export interface TransaccionPagoResponse {
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

export async function ListarPagosPanel(
  Saltar = 0,
  Limite = 100
): Promise<TransaccionPagoResponse[]> {
  const r = await HacerRequest<TransaccionPagoResponse[]>(
    `/pagos?Saltar=${Saltar}&Limite=${Limite}`
  );
  return Array.isArray(r) ? r : [];
}

export async function ProcesarPagoPanel(Id: number): Promise<TransaccionPagoResponse> {
  return HacerRequest<TransaccionPagoResponse>(`/pagos/${Id}/procesar`, {
    method: "POST",
  });
}

export async function ReembolsarPagoPanel(Id: number): Promise<TransaccionPagoResponse> {
  return HacerRequest<TransaccionPagoResponse>(`/pagos/${Id}/reembolsar`, {
    method: "POST",
  });
}

export interface UsuarioPanelResponse {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  activo: boolean;
  fecha_creacion: string;
  roles?: { id: number; nombre: string }[];
}

export async function ListarUsuariosPanel(
  Saltar = 0,
  Limite = 100
): Promise<UsuarioPanelResponse[]> {
  const r = await HacerRequest<UsuarioPanelResponse[]>(
    `/auth/usuarios?Saltar=${Saltar}&Limite=${Limite}`
  );
  return Array.isArray(r) ? r : [];
}

export interface ConfiguracionHotelItem {
  clave: string;
  valor: string;
  descripcion: string | null;
  modificable: boolean;
  fecha_actualizacion: string;
}

export async function ListarConfiguracionPanel(): Promise<ConfiguracionHotelItem[]> {
  const r = await HacerRequest<ConfiguracionHotelItem[]>("/configuracion");
  return Array.isArray(r) ? r : [];
}

export async function ActualizarConfiguracionPanel(
  Clave: string,
  Valor: string
): Promise<ConfiguracionHotelItem> {
  return HacerRequest<ConfiguracionHotelItem>(
    `/configuracion/${encodeURIComponent(Clave)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ valor: Valor }),
    }
  );
}

function ConstruirQueryReporte(
  Params: Record<string, string | number | null | undefined>
): string {
  const q = new URLSearchParams();
  Object.entries(Params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export interface DashboardReporteResponse {
  estadisticas_reservas: {
    total_reservas: number;
    reservas_pendientes: number;
    reservas_confirmadas: number;
    reservas_canceladas: number;
    reservas_completadas: number;
  };
  total_ingresos: number;
  cantidad_pagos: number;
}

export async function ObtenerDashboardReportePanel(
  FechaInicio?: string | null,
  FechaFin?: string | null
): Promise<DashboardReporteResponse> {
  return HacerRequest<DashboardReporteResponse>(
    "/reportes/dashboard" +
      ConstruirQueryReporte({
        fecha_inicio: FechaInicio,
        fecha_fin: FechaFin,
      })
  );
}

export interface EstadisticasReservasResponse {
  total_reservas: number;
  reservas_pendientes: number;
  reservas_confirmadas: number;
  reservas_canceladas: number;
  reservas_completadas: number;
  ingresos_totales: number;
  promedio_reserva: number;
}

export async function ObtenerEstadisticasReservasPanel(
  FechaInicio?: string | null,
  FechaFin?: string | null
): Promise<EstadisticasReservasResponse> {
  return HacerRequest<EstadisticasReservasResponse>(
    "/reportes/estadisticas-reservas" +
      ConstruirQueryReporte({
        fecha_inicio: FechaInicio,
        fecha_fin: FechaFin,
      })
  );
}

export interface IngresosReporteResponse {
  total_ingresos: number;
  cantidad_pagos: number;
  por_metodo_pago?: { metodo_pago: string; cantidad: number; monto: number }[];
}

export async function ObtenerIngresosReportePanel(
  FechaInicio?: string | null,
  FechaFin?: string | null
): Promise<IngresosReporteResponse> {
  return HacerRequest<IngresosReporteResponse>(
    "/reportes/ingresos" +
      ConstruirQueryReporte({
        fecha_inicio: FechaInicio,
        fecha_fin: FechaFin,
      })
  );
}

export interface OcupacionItemResponse {
  identificador: string;
  nombre: string;
  noches_ocupadas: number;
  ingresos: number;
}

export interface OcupacionReporteResponse {
  items: OcupacionItemResponse[];
}

export async function ObtenerOcupacionReportePanel(
  FechaInicio: string,
  FechaFin: string,
  AgruparPor: "habitacion" | "tipo" = "habitacion"
): Promise<OcupacionReporteResponse> {
  return HacerRequest<OcupacionReporteResponse>(
    `/reportes/ocupacion?fecha_inicio=${FechaInicio}&fecha_fin=${FechaFin}&agrupar_por=${AgruparPor}`
  );
}

export interface AuditoriaLogItem {
  id: number;
  tabla_afectada: string;
  registro_id: number | null;
  accion: string;
  usuario_id: number | null;
  usuario_nombre: string | null;
  fecha_accion: string;
  observaciones: string | null;
}

export async function ObtenerAuditoriaReportePanel(Params: {
  fechaDesde?: string | null;
  fechaHasta?: string | null;
  Saltar?: number;
  Limite?: number;
}): Promise<AuditoriaLogItem[]> {
  const r = await HacerRequest<AuditoriaLogItem[]>(
    "/reportes/auditoria" +
      ConstruirQueryReporte({
        fecha_desde: Params.fechaDesde,
        fecha_hasta: Params.fechaHasta,
        Saltar: Params.Saltar ?? 0,
        Limite: Params.Limite ?? 100,
      })
  );
  return Array.isArray(r) ? r : [];
}

export interface ClienteRankingItem {
  usuario_id: number;
  nombre: string;
  email: string;
  total_reservas: number;
  total_gastado: number;
}

export async function ObtenerClientesRankingPanel(
  FechaInicio?: string | null,
  FechaFin?: string | null,
  Orden: "gastado" | "reservas" = "gastado",
  Limite = 50
): Promise<ClienteRankingItem[]> {
  const r = await HacerRequest<ClienteRankingItem[]>(
    "/reportes/clientes" +
      ConstruirQueryReporte({
        fecha_inicio: FechaInicio,
        fecha_fin: FechaFin,
        orden: Orden,
        Limite,
      })
  );
  return Array.isArray(r) ? r : [];
}
