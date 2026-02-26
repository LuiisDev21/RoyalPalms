import { jsPDF } from "jspdf";
import type { HabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";

export interface DatosCotizacionPdf {
  Habitacion: HabitacionResponse;
  FechaEntrada: string;
  FechaSalida: string;
  Noches: number;
  PrecioPorNoche: number;
  Total: number;
}

function FormatearFecha(Fecha: string): string {
  try {
    const D = new Date(Fecha + "T12:00:00");
    return D.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return Fecha;
  }
}

export async function GenerarCotizacionPdf(Datos: DatosCotizacionPdf): Promise<void> {
  const Doc = new jsPDF({ unit: "mm", format: "a4" });
  const Margen = 20;
  let Y = Margen;

  const LogoUrl = typeof window !== "undefined" ? `${window.location.origin}/Logo.svg` : "";
  let LogoDataUrl: string | null = null;
  let AnchoNat = 120;
  let AltoNat = 40;

  if (typeof window !== "undefined" && LogoUrl) {
    try {
      const Img = new Image();
      Img.crossOrigin = "anonymous";
      Img.src = LogoUrl;
      await new Promise<void>((Resolve, Rechazar) => {
        Img.onload = () => Resolve();
        Img.onerror = () => Rechazar(new Error("Logo"));
      });
      AnchoNat = Img.naturalWidth || 120;
      AltoNat = Img.naturalHeight || 40;
      const Canvas = document.createElement("canvas");
      Canvas.width = AnchoNat;
      Canvas.height = AltoNat;
      const Ctx = Canvas.getContext("2d");
      if (Ctx) {
        Ctx.drawImage(Img, 0, 0);
        Ctx.globalCompositeOperation = "source-atop";
        Ctx.fillStyle = "#b88f3a";
        Ctx.fillRect(0, 0, Canvas.width, Canvas.height);
        LogoDataUrl = Canvas.toDataURL("image/png");
      }
    } catch {
      LogoDataUrl = null;
    }
  }

  const MaxAnchoLogo = 35;
  const MaxAltoLogo = 12;
  const Escala = LogoDataUrl ? Math.min(MaxAnchoLogo / AnchoNat, MaxAltoLogo / AltoNat) : 0;
  const AnchoLogo = LogoDataUrl ? AnchoNat * Escala : 0;
  const AltoLogo = LogoDataUrl ? AltoNat * Escala : 0;

  Doc.setTextColor(184, 143, 58);
  if (LogoDataUrl) {
    Doc.addImage(LogoDataUrl, "PNG", Margen, Y, AnchoLogo, AltoLogo);
    Doc.setFontSize(22);
    Doc.setFont("times", "bold");
    Doc.text("Royal Palm", Margen + AnchoLogo + 6, Y + 9);
    Y += 18;
  } else {
    Doc.setFontSize(22);
    Doc.setFont("times", "bold");
    Doc.text("Royal Palm", Margen, Y + 8);
    Y += 18;
  }
  Doc.setTextColor(0, 0, 0);

  Doc.setDrawColor(200, 180, 100);
  Doc.setLineWidth(0.5);
  Doc.line(Margen, Y, 210 - Margen, Y);
  Y += 12;

  Doc.setFontSize(16);
  Doc.setFont("times", "bold");
  Doc.text("Cotización de precio", Margen, Y);
  Y += 10;

  Doc.setFontSize(10);
  Doc.setFont("helvetica", "normal");
  Doc.text("Comprobante de cotización para su estancia. No constituye reserva.", Margen, Y);
  Y += 14;

  Doc.setFont("helvetica", "bold");
  Doc.text("Habitación:", Margen, Y);
  Doc.setFont("helvetica", "normal");
  Doc.text(`Nº ${Datos.Habitacion.numero} · ${Datos.Habitacion.tipo_nombre ?? "Habitación"}`, Margen + 28, Y);
  Y += 8;

  Doc.setFont("helvetica", "bold");
  Doc.text("Fecha de entrada:", Margen, Y);
  Doc.setFont("helvetica", "normal");
  Doc.text(FormatearFecha(Datos.FechaEntrada), Margen + 38, Y);
  Y += 8;

  Doc.setFont("helvetica", "bold");
  Doc.text("Fecha de salida:", Margen, Y);
  Doc.setFont("helvetica", "normal");
  Doc.text(FormatearFecha(Datos.FechaSalida), Margen + 38, Y);
  Y += 8;

  Doc.setFont("helvetica", "bold");
  Doc.text("Noches:", Margen, Y);
  Doc.setFont("helvetica", "normal");
  Doc.text(String(Datos.Noches), Margen + 22, Y);
  Y += 8;

  if (Datos.Habitacion.capacidad) {
    Doc.setFont("helvetica", "bold");
    Doc.text("Capacidad:", Margen, Y);
    Doc.setFont("helvetica", "normal");
    Doc.text(`${Datos.Habitacion.capacidad} huésped${Datos.Habitacion.capacidad !== 1 ? "es" : ""}`, Margen + 28, Y);
    Y += 8;
  }

  if (Datos.Habitacion.politica_nombre) {
    Doc.setFont("helvetica", "bold");
    Doc.text("Política de cancelación:", Margen, Y);
    Doc.setFont("helvetica", "normal");
    Doc.text(Datos.Habitacion.politica_nombre, Margen + 48, Y);
    Y += 10;
  } else {
    Y += 6;
  }

  Doc.setDrawColor(220, 220, 220);
  Doc.line(Margen, Y, 210 - Margen, Y);
  Y += 10;

  Doc.setFont("helvetica", "bold");
  Doc.text("Precio por noche:", Margen, Y);
  Doc.setFont("helvetica", "normal");
  Doc.text(`$${Datos.PrecioPorNoche.toFixed(2)}`, 210 - Margen - 25, Y);
  Y += 8;

  Doc.setFont("helvetica", "bold");
  Doc.setFontSize(12);
  Doc.text("Total estimado:", Margen, Y);
  Doc.text(`$${Datos.Total.toFixed(2)}`, 210 - Margen - 28, Y);
  Y += 14;

  Doc.setFont("helvetica", "normal");
  Doc.setFontSize(9);
  Doc.setTextColor(100, 100, 100);
  Doc.text(
    "Este documento es una cotización informativa. El precio final puede variar según impuestos o servicios adicionales.",
    Margen,
    Y
  );
  Y += 10;
  Doc.text(
    "Para confirmar su reserva, complete el proceso de reserva en nuestro sitio o contacte con el hotel.",
    Margen,
    Y
  );

  Doc.setTextColor(0, 0, 0);
  Doc.setFontSize(8);
  Doc.text(
    `Generado el ${new Date().toLocaleDateString("es-ES")} a las ${new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })} · Royal Palm`,
    Margen,
    290
  );

  Doc.save(`cotizacion-royal-palm-habitacion-${Datos.Habitacion.numero}.pdf`);
}
