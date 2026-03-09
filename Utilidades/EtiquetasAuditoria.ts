export const ETIQUETAS_ACCION: Record<string, string> = {
  CREATE: "Creación",
  UPDATE: "Actualización",
  DELETE: "Eliminación",
  LOGIN: "Inicio de sesión",
  LOGOUT: "Cierre de sesión",
  LOGIN_FAILED: "Login fallido",
  USUARIO_BLOQUEO: "Usuario bloqueado",
  USUARIO_DESBLOQUEO: "Usuario desbloqueado",
  RESERVA_CREATE: "Reserva creada",
  RESERVA_CANCEL: "Reserva cancelada",
  RESERVA_CONFIRM: "Reserva confirmada",
  RESERVA_CHECKOUT: "Check-out",
  RESERVA_CHECKIN: "Check-in",
  PAGO_PROCESS: "Pago procesado",
  PAGO_REFUND: "Reembolso",
  PAGO_FAILED: "Pago fallido",
  CONFIGURACION_CAMBIO: "Cambio de configuración",
};

export const ETIQUETAS_TABLA: Record<string, string> = {
  sesiones_usuario: "Sesiones de usuario",
  intentos_autenticacion: "Intentos de login",
  configuracion_hotel: "Configuración del hotel",
  reservas: "Reservas",
  usuarios: "Usuarios",
  pagos: "Pagos",
  habitaciones: "Habitaciones",
  tipos_habitacion: "Tipos de habitación",
  politicas_cancelacion: "Políticas de cancelación",
};

const ORDEN_ACCIONES_FILTRO = [
  "LOGIN",
  "LOGOUT",
  "LOGIN_FAILED",
  "USUARIO_BLOQUEO",
  "USUARIO_DESBLOQUEO",
  "CREATE",
  "UPDATE",
  "DELETE",
  "RESERVA_CREATE",
  "RESERVA_CONFIRM",
  "RESERVA_CHECKIN",
  "RESERVA_CHECKOUT",
  "RESERVA_CANCEL",
  "PAGO_PROCESS",
  "PAGO_REFUND",
  "PAGO_FAILED",
  "CONFIGURACION_CAMBIO",
];

const ORDEN_TABLAS_FILTRO = [
  "sesiones_usuario",
  "intentos_autenticacion",
  "configuracion_hotel",
  "reservas",
  "usuarios",
  "pagos",
  "habitaciones",
  "tipos_habitacion",
  "politicas_cancelacion",
];

export function ObtenerEtiquetaAccion(Accion: string): string {
  return ETIQUETAS_ACCION[Accion] ?? Accion;
}

export function ObtenerEtiquetaTabla(Tabla: string): string {
  return ETIQUETAS_TABLA[Tabla] ?? Tabla;
}

export const OPCIONES_FILTRO_ACCION: { valor: string; etiqueta: string }[] = [
  { valor: "", etiqueta: "Todas las acciones" },
  ...ORDEN_ACCIONES_FILTRO.map((valor) => ({
    valor,
    etiqueta: ETIQUETAS_ACCION[valor] ?? valor,
  })),
];

export const OPCIONES_FILTRO_TABLA: { valor: string; etiqueta: string }[] = [
  { valor: "", etiqueta: "Todas las tablas" },
  ...ORDEN_TABLAS_FILTRO.map((valor) => ({
    valor,
    etiqueta: ETIQUETAS_TABLA[valor] ?? valor,
  })),
];
