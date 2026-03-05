import { FormatearFechaHoraParaUsuario } from "@/Utilidades/FormatearFechaHora";

interface DetalleItem {
  msg?: string;
  message?: string;
  loc?: unknown;
  type?: string;
}

const REGEX_CUENTA_BLOQUEADA = /^Cuenta bloqueada hasta (.+)$/;

function ExtraerDetalleTexto(err: unknown): string | null {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "object" && err !== null) {
    if ("message" in err) {
      const m = (err as { message: unknown }).message;
      if (typeof m === "string") return m;
    }
    if ("detail" in err) {
      const d = (err as { detail: unknown }).detail;
      const extraido = ExtraerMensajeDeDetalle(d);
      if (extraido) return extraido;
    }
  }
  if (typeof err === "string") return err;
  return null;
}

export function ExtraerMensajeDeDetalle(detail: unknown): string {
  if (detail == null) return "";
  if (Array.isArray(detail)) {
    const mensajes = (detail as DetalleItem[])
      .map((x) => x.msg ?? x.message ?? "")
      .filter(Boolean);
    return mensajes.length ? mensajes.join(", ") : "Error en la petición";
  }
  if (typeof detail === "object" && "message" in detail) {
    const m = (detail as { message: unknown }).message;
    if (typeof m === "string") return m;
  }
  if (typeof detail === "string") return detail;
  return "Error en la petición";
}

export function MensajeDeError(err: unknown, PorDefecto: string): string {
  const texto = ExtraerDetalleTexto(err);
  return texto ?? PorDefecto;
}

export type TituloYDescripcion = { Titulo: string; Descripcion?: string };

export function ObtenerTituloYDescripcionError(
  err: unknown,
  TituloPorDefecto: string
): TituloYDescripcion {
  const texto = ExtraerDetalleTexto(err);
  if (!texto) return { Titulo: TituloPorDefecto };

  const matchBloqueada = texto.match(REGEX_CUENTA_BLOQUEADA);
  if (matchBloqueada) {
    const iso = matchBloqueada[1].trim();
    const fechaFormateada = FormatearFechaHoraParaUsuario(iso);
    return {
      Titulo: "Cuenta bloqueada",
      Descripcion: `Podrás acceder de nuevo el ${fechaFormateada}.`,
    };
  }

  return { Titulo: TituloPorDefecto, Descripcion: texto };
}
