export interface TipoHabitacionResponse {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  capacidad_maxima: number;
  precio_base: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface HabitacionResponse {
  id: number;
  numero: string;
  tipo_habitacion_id: number;
  politica_cancelacion_id: number | null;
  descripcion: string | null;
  capacidad: number;
  precio_por_noche: string;
  estado: string;
  imagen_url: string | null;
  piso: number | null;
  tipo_nombre: string | null;
  politica_nombre: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
}
