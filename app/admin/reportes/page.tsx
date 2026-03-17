"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ExportarClientesReportePanel,
  ExportarIngresosPorTipoReportePanel,
  ExportarIngresosReportePanel,
  ExportarOcupacionReportePanel,
  ObtenerDashboardReportePanel,
  ObtenerDashboardCompletoReportePanel,
  ObtenerEstadisticasReservasPanel,
  ObtenerIngresosPorTipoPanel,
  ObtenerIngresosReportePanel,
  ObtenerKpisHoyReportePanel,
  ObtenerOcupacionReportePanel,
  ObtenerComparativaReportePanel,
  ObtenerReembolsosDisputasReportePanel,
  ObtenerTendenciasReportePanel,
  ObtenerClientesRankingPanel,
} from "@/Servicios/PanelApiServicio";
import { CampoFecha } from "@/Componentes/Base/CampoFecha";
import { ClavesQueryPanel } from "@/Utilidades/QueryKeysPanel";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import {
  NavegacionPestanasReportes,
  type TipoPestanaReporte,
} from "@/Caracteristicas/Reportes/Componentes/NavegacionPestanasReportes";
import { PestanaResumenReportes } from "@/Caracteristicas/Reportes/Componentes/PestanaResumenReportes";
import { PestanaIngresosReportes } from "@/Caracteristicas/Reportes/Componentes/PestanaIngresosReportes";
import { PestanaOcupacionReportes } from "@/Caracteristicas/Reportes/Componentes/PestanaOcupacionReportes";
import { PestanaClientesReportes } from "@/Caracteristicas/Reportes/Componentes/PestanaClientesReportes";
import { PestanaAnaliticaAvanzadaReportes } from "@/Caracteristicas/Reportes/Componentes/PestanaAnaliticaAvanzadaReportes";

function FechaInicioPorDefecto(): string {
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return start.toISOString().slice(0, 10);
}

function FechaFinPorDefecto(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function PaginaReportesAdmin() {
  const [FechaInicio, setFechaInicio] = useState(FechaInicioPorDefecto);
  const [FechaFin, setFechaFin] = useState(FechaFinPorDefecto);
  const [PestanaActiva, setPestanaActiva] = useState<TipoPestanaReporte>("resumen");
  const [OrdenClientes, setOrdenClientes] = useState<"gastado" | "reservas">("gastado");
  const [AgruparOcupacion, setAgruparOcupacion] = useState<"habitacion" | "tipo">("habitacion");
  const [TipoTendencia, setTipoTendencia] = useState<"ingresos" | "reservas">("ingresos");
  const [AgruparTendencia, setAgruparTendencia] = useState<"dia" | "semana">("dia");

  const DatosResumen = useQuery({
    queryKey: ClavesQueryPanel.ReportesResumen(FechaInicio, FechaFin),
    queryFn: async () => {
      const FechaInicioParametro = FechaInicio || null;
      const FechaFinParametro = FechaFin || null;
      const [Dashboard, Estadisticas, KpisHoy] = await Promise.all([
        ObtenerDashboardReportePanel(FechaInicioParametro, FechaFinParametro),
        ObtenerEstadisticasReservasPanel(FechaInicioParametro, FechaFinParametro),
        ObtenerKpisHoyReportePanel(),
      ]);
      return { Dashboard, Estadisticas, KpisHoy };
    },
    enabled: !!FechaInicio && !!FechaFin && PestanaActiva === "resumen",
  });

  const DatosIngresos = useQuery({
    queryKey: ClavesQueryPanel.ReportesIngresos(FechaInicio, FechaFin),
    queryFn: async () => {
      const FechaInicioParametro = FechaInicio || null;
      const FechaFinParametro = FechaFin || null;
      const [Ingresos, IngresosPorTipo] = await Promise.all([
        ObtenerIngresosReportePanel(FechaInicioParametro, FechaFinParametro),
        ObtenerIngresosPorTipoPanel(FechaInicioParametro, FechaFinParametro),
      ]);
      return { Ingresos, IngresosPorTipo };
    },
    enabled: !!FechaInicio && !!FechaFin && PestanaActiva === "ingresos",
  });

  const DatosOcupacion = useQuery({
    queryKey: ClavesQueryPanel.ReportesOcupacion(FechaInicio, FechaFin, AgruparOcupacion),
    queryFn: async () => {
      const Ocupacion = await ObtenerOcupacionReportePanel(FechaInicio, FechaFin, AgruparOcupacion);
      return { Ocupacion };
    },
    enabled: !!FechaInicio && !!FechaFin && PestanaActiva === "ocupacion",
  });

  const DatosClientes = useQuery({
    queryKey: ClavesQueryPanel.ReportesClientes(FechaInicio, FechaFin, OrdenClientes),
    queryFn: async () => {
      const FechaInicioParametro = FechaInicio || null;
      const FechaFinParametro = FechaFin || null;
      const Clientes = await ObtenerClientesRankingPanel(FechaInicioParametro, FechaFinParametro, OrdenClientes, 50);
      return { Clientes };
    },
    enabled: !!FechaInicio && !!FechaFin && PestanaActiva === "clientes",
  });

  const DatosAnalitica = useQuery({
    queryKey: ClavesQueryPanel.ReportesAnalitica(
      FechaInicio,
      FechaFin,
      TipoTendencia,
      AgruparTendencia
    ),
    queryFn: async () => {
      const FechaInicioParametro = FechaInicio || null;
      const FechaFinParametro = FechaFin || null;
      const [Comparativa, Tendencias, ReembolsosDisputas, DashboardCompleto] = await Promise.all([
        ObtenerComparativaReportePanel(FechaInicioParametro, FechaFinParametro),
        ObtenerTendenciasReportePanel({
          tipo: TipoTendencia,
          agrupar_por: AgruparTendencia,
          fecha_inicio: FechaInicioParametro,
          fecha_fin: FechaFinParametro,
        }),
        ObtenerReembolsosDisputasReportePanel(FechaInicioParametro, FechaFinParametro),
        ObtenerDashboardCompletoReportePanel(FechaInicioParametro, FechaFinParametro),
      ]);
      return {
        Comparativa,
        Tendencias: Tendencias.items ?? [],
        ReembolsosDisputas,
        DashboardCompleto,
      };
    },
    enabled: !!FechaInicio && !!FechaFin && PestanaActiva === "analitica",
  });

  const Cargando =
    (PestanaActiva === "resumen" && DatosResumen.isLoading) ||
    (PestanaActiva === "ingresos" && DatosIngresos.isLoading) ||
    (PestanaActiva === "ocupacion" && DatosOcupacion.isLoading) ||
    (PestanaActiva === "clientes" && DatosClientes.isLoading) ||
    (PestanaActiva === "analitica" && DatosAnalitica.isLoading);
  const CargandoAplicar =
    (PestanaActiva === "resumen" && DatosResumen.isFetching) ||
    (PestanaActiva === "ingresos" && DatosIngresos.isFetching) ||
    (PestanaActiva === "ocupacion" && DatosOcupacion.isFetching) ||
    (PestanaActiva === "clientes" && DatosClientes.isFetching) ||
    (PestanaActiva === "analitica" && DatosAnalitica.isFetching);

  const ErrorActivo =
    (PestanaActiva === "resumen" && DatosResumen.error) ||
    (PestanaActiva === "ingresos" && DatosIngresos.error) ||
    (PestanaActiva === "ocupacion" && DatosOcupacion.error) ||
    (PestanaActiva === "clientes" && DatosClientes.error) ||
    (PestanaActiva === "analitica" && DatosAnalitica.error) ||
    null;

  useEffect(() => {
    if (!ErrorActivo) return;
    const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(ErrorActivo, "Error al cargar reporte");
    Notificaciones.Error(Titulo, Descripcion);
  }, [ErrorActivo]);

  function RefetchPestanaActiva() {
    if (PestanaActiva === "resumen") {
      void DatosResumen.refetch();
      return;
    }
    if (PestanaActiva === "ingresos") {
      void DatosIngresos.refetch();
      return;
    }
    if (PestanaActiva === "ocupacion") {
      void DatosOcupacion.refetch();
      return;
    }
    if (PestanaActiva === "clientes") {
      void DatosClientes.refetch();
      return;
    }
    void DatosAnalitica.refetch();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="FuenteTitulo text-2xl font-semibold text-[#1c1a16] md:text-3xl">
            Reportes
          </h1>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-end gap-4">
        <CampoFecha
          Id="reportes-desde"
          Etiqueta="Desde"
          Valor={FechaInicio}
          AlCambiar={setFechaInicio}
          ClaseContenedor="min-w-[150px] w-[180px] flex-shrink-0"
        />
        <CampoFecha
          Id="reportes-hasta"
          Etiqueta="Hasta"
          Min={FechaInicio || undefined}
          Valor={FechaFin}
          AlCambiar={setFechaFin}
          ClaseContenedor="min-w-[150px] w-[180px] flex-shrink-0"
        />
        <button
          type="button"
          onClick={RefetchPestanaActiva}
          disabled={CargandoAplicar}
          className="rounded-lg bg-[#1c1a16] px-4 py-2 text-sm text-white hover:bg-[#2d2a26] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {CargandoAplicar ? "Aplicando..." : "Aplicar"}
        </button>
      </div>
      <NavegacionPestanasReportes
        PestanaActiva={PestanaActiva}
        AlCambiarPestana={setPestanaActiva}
      />
      <div>
        {Cargando ? (
          <div className="mt-8 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b88f3a] border-t-transparent" />
          </div>
        ) : (
          <div>
            {PestanaActiva === "resumen" && (
              <PestanaResumenReportes
                Dashboard={DatosResumen.data?.Dashboard ?? null}
                Estadisticas={DatosResumen.data?.Estadisticas ?? null}
                KpisHoy={DatosResumen.data?.KpisHoy ?? null}
                AlExportarIngresos={(Formato) =>
                  ExportarIngresosReportePanel(Formato, FechaInicio, FechaFin)
                }
              />
            )}
            {PestanaActiva === "ingresos" && (
              <PestanaIngresosReportes
                Ingresos={DatosIngresos.data?.Ingresos ?? null}
                IngresosPorTipo={DatosIngresos.data?.IngresosPorTipo ?? []}
                AlExportarIngresos={(Formato) =>
                  ExportarIngresosReportePanel(Formato, FechaInicio, FechaFin)
                }
                AlExportarIngresosPorTipo={(Formato) =>
                  ExportarIngresosPorTipoReportePanel(Formato, FechaInicio, FechaFin)
                }
              />
            )}
            {PestanaActiva === "ocupacion" && (
              <PestanaOcupacionReportes
                Ocupacion={DatosOcupacion.data?.Ocupacion ?? null}
                AgruparOcupacion={AgruparOcupacion}
                AlCambiarAgrupacion={setAgruparOcupacion}
                AlExportar={(Formato) =>
                  ExportarOcupacionReportePanel(Formato, {
                    fecha_inicio: FechaInicio,
                    fecha_fin: FechaFin,
                    agrupar_por: AgruparOcupacion,
                  })
                }
              />
            )}
            {PestanaActiva === "clientes" && (
              <PestanaClientesReportes
                Clientes={DatosClientes.data?.Clientes ?? []}
                OrdenClientes={OrdenClientes}
                AlCambiarOrdenClientes={setOrdenClientes}
                AlExportar={(Formato) =>
                  ExportarClientesReportePanel(Formato, {
                    fecha_inicio: FechaInicio,
                    fecha_fin: FechaFin,
                    orden: OrdenClientes,
                    limite: 50,
                  })
                }
              />
            )}
            {PestanaActiva === "analitica" && (
              <PestanaAnaliticaAvanzadaReportes
                Comparativa={DatosAnalitica.data?.Comparativa ?? {}}
                Tendencias={DatosAnalitica.data?.Tendencias ?? []}
                ReembolsosDisputas={DatosAnalitica.data?.ReembolsosDisputas ?? {}}
                DashboardCompleto={DatosAnalitica.data?.DashboardCompleto ?? {}}
                TipoTendencia={TipoTendencia}
                AgruparTendencia={AgruparTendencia}
                AlCambiarTipoTendencia={setTipoTendencia}
                AlCambiarAgruparTendencia={setAgruparTendencia}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
