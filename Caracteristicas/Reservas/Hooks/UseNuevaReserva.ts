"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BuscarHabitacionesDisponiblesCliente,
  CrearReservaCliente,
  CrearPagoCliente,
  ListarTiposHabitacionCliente,
  PrevisualizarPrecioReservaCliente,
  type ReservaClienteResponse,
} from "@/Servicios/ClienteApiServicio";
import type { HabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import type { TipoHabitacionResponse } from "@/Caracteristicas/Habitaciones/Tipos/Habitacion";
import type { DatosBusquedaHabitaciones } from "@/Caracteristicas/Habitaciones/Componentes/FormularioBusquedaHabitaciones";
import { ClavesQueryMiCuenta } from "@/Utilidades/QueryKeysMiCuenta";
import { Notificaciones } from "@/Utilidades/Notificaciones";
import { ObtenerTituloYDescripcionError } from "@/Utilidades/MensajeDeError";
import type { PagoTarjetaSimulado } from "@/Tipos/Pagos";
import { CalcularNoches, ObtenerMarcaTarjeta } from "../Utilidades/ReservaUtil";

export function UseNuevaReserva() {
  const queryClient = useQueryClient();
  const [Tipos, setTipos] = useState<TipoHabitacionResponse[]>([]);
  const [FechaEntrada, setFechaEntrada] = useState("");
  const [FechaSalida, setFechaSalida] = useState("");
  const [NumeroHuespedes, setNumeroHuespedes] = useState(1);
  const [Notas, setNotas] = useState("");
  const [Buscando, setBuscando] = useState(false);
  const [Habitaciones, setHabitaciones] = useState<HabitacionResponse[]>([]);
  const [ReservandoId, setReservandoId] = useState<number | null>(null);
  const [ReservaCreada, setReservaCreada] = useState<ReservaClienteResponse | null>(null);
  const [HabitacionSeleccionada, setHabitacionSeleccionada] = useState<HabitacionResponse | null>(null);
  const [MetodoPago, setMetodoPago] = useState("tarjeta_credito");
  const [Paso, setPaso] = useState<"busqueda" | "confirmacion">("busqueda");
  const [PagoTarjeta, setPagoTarjeta] = useState<PagoTarjetaSimulado>({
    Numero: "",
    Expiracion: "",
    Cvv: "",
  });

  const MutacionReservar = useMutation({
    mutationFn: (payload: {
      habitacion_id: number;
      fecha_entrada: string;
      fecha_salida: string;
      numero_huespedes: number;
      notas: string | null;
    }) => CrearReservaCliente(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClavesQueryMiCuenta.ListaReservas });
    },
    onError: (e: unknown) => {
      setReservandoId(null);
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al crear la reserva");
      Notificaciones.Error(Titulo, Descripcion ?? "");
    },
  });

  useEffect(() => {
    ListarTiposHabitacionCliente()
      .then(setTipos)
      .catch(() => {});
  }, []);

  const MutacionPagoInicial = useMutation({
    mutationFn: (payload: { reserva_id: number; monto: string; metodo_pago: string }) =>
      CrearPagoCliente(payload),
  });

  const DatosPrevisualizacion =
    HabitacionSeleccionada && FechaEntrada && FechaSalida
      ? {
          habitacion_id: HabitacionSeleccionada.id,
          fecha_entrada: FechaEntrada,
          fecha_salida: FechaSalida,
          numero_huespedes: NumeroHuespedes,
          notas: Notas.trim() || null,
        }
      : null;

  const {
    data: PrevisualizacionPrecio,
    isLoading: CargandoPrevisualizacion,
    isError: ErrorPrevisualizacion,
    error: ErrorPrevisualizacionObjeto,
  } = useQuery({
    queryKey: [
      "previsualizar-precio",
      DatosPrevisualizacion?.habitacion_id,
      DatosPrevisualizacion?.fecha_entrada,
      DatosPrevisualizacion?.fecha_salida,
      DatosPrevisualizacion?.numero_huespedes,
      DatosPrevisualizacion?.notas ?? "",
    ],
    queryFn: () => PrevisualizarPrecioReservaCliente(DatosPrevisualizacion!),
    enabled: Paso === "confirmacion" && !!DatosPrevisualizacion,
  });

  const AlBuscarConDatos = useCallback(async (datos: DatosBusquedaHabitaciones) => {
    if (!datos.FechaEntrada || !datos.FechaSalida) {
      Notificaciones.Error("Fechas requeridas", "Indica fecha de entrada y salida.");
      return;
    }
    if (new Date(datos.FechaEntrada) >= new Date(datos.FechaSalida)) {
      Notificaciones.Error("Fechas inválidas", "La salida debe ser posterior a la entrada.");
      return;
    }
    setFechaEntrada(datos.FechaEntrada);
    setFechaSalida(datos.FechaSalida);
    setNumeroHuespedes(parseInt(datos.Huespedes, 10) || 1);
    setBuscando(true);
    setHabitaciones([]);
    try {
      const CapacidadNum = parseInt(datos.Huespedes, 10);
      const Capacidad = Number.isNaN(CapacidadNum) || CapacidadNum <= 0 ? undefined : CapacidadNum;
      const TipoNum = datos.TipoId ? parseInt(datos.TipoId, 10) : undefined;
      const Lista = await BuscarHabitacionesDisponiblesCliente(
        datos.FechaEntrada,
        datos.FechaSalida,
        Capacidad,
        TipoNum && !Number.isNaN(TipoNum) ? TipoNum : undefined
      );
      setHabitaciones(Lista);
      if (Lista.length === 0) {
        Notificaciones.Advertencia(
          "Sin disponibilidad",
          "No hay habitaciones disponibles para esas fechas. Prueba otras."
        );
      }
    } catch (e) {
      const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(e, "Error al buscar habitaciones");
      Notificaciones.Error(Titulo, Descripcion ?? "");
    } finally {
      setBuscando(false);
    }
  }, []);

  const IrAConfirmacion = useCallback((H: HabitacionResponse) => {
    if (!FechaEntrada || !FechaSalida) {
      Notificaciones.Error("Fechas requeridas", "Indica fecha de entrada y salida.");
      return;
    }
    setHabitacionSeleccionada(H);
    setMetodoPago("tarjeta_credito");
    setPaso("confirmacion");
  }, [FechaEntrada, FechaSalida]);

  const VolverABusqueda = useCallback(() => {
    setPaso("busqueda");
    setHabitacionSeleccionada(null);
  }, []);

  const ConfirmarReservaSeleccionada = useCallback(async () => {
    if (!HabitacionSeleccionada || !FechaEntrada || !FechaSalida) return;
    const EsTarjeta = MetodoPago === "tarjeta_credito" || MetodoPago === "tarjeta_debito";
    if (EsTarjeta) {
      const NumeroLimpio = PagoTarjeta.Numero.replace(/[\s-]/g, "");
      const Exp = PagoTarjeta.Expiracion.trim();
      const Cvv = PagoTarjeta.Cvv.trim();
      const RegexExp = /^(\d{2})\/(\d{2})$/;
      const RegexCvv = /^\d{3,4}$/;
      const Marca = ObtenerMarcaTarjeta(NumeroLimpio);
      if (
        !NumeroLimpio ||
        !Marca ||
        NumeroLimpio.length < 13 ||
        !RegexExp.test(Exp) ||
        !RegexCvv.test(Cvv)
      ) {
        Notificaciones.Error(
          "Datos de tarjeta inválidos",
          "Revisa el número de tarjeta, la fecha de expiración (MM/AA) y el CVV."
        );
        return;
      }
    }
    try {
      setReservandoId(HabitacionSeleccionada.id);
      const Reserva = await MutacionReservar.mutateAsync({
        habitacion_id: HabitacionSeleccionada.id,
        fecha_entrada: FechaEntrada,
        fecha_salida: FechaSalida,
        numero_huespedes: NumeroHuespedes,
        notas: Notas.trim() || null,
      });

      let PagoExitoso = false;
      try {
        const Moneda = Reserva.moneda ?? "USD";
        const PrecioTotalNum =
          typeof Reserva.precio_total === "number"
            ? Reserva.precio_total
            : parseFloat(String(Reserva.precio_total));
        const MontoTexto = PrecioTotalNum.toFixed(2);
        await MutacionPagoInicial.mutateAsync({
          reserva_id: Reserva.id,
          monto: MontoTexto,
          metodo_pago: MetodoPago,
        });
        PagoExitoso = true;
        Notificaciones.Exito(
          "Reserva y pago registrados",
          `Se registró un pago por el total de la reserva en ${Moneda}.`
        );
      } catch (e) {
        const { Titulo, Descripcion } = ObtenerTituloYDescripcionError(
          e,
          "La reserva se creó pero hubo un problema al registrar el pago"
        );
        Notificaciones.Advertencia(Titulo, Descripcion ?? "");
      }

      setReservaCreada(Reserva);
      setPaso("busqueda");

      if (!PagoExitoso) {
        Notificaciones.Info(
          "Reserva creada sin pago",
          "Podrás completar el pago más adelante desde el detalle de la reserva."
        );
      }
    } finally {
      setReservandoId(null);
    }
  }, [
    HabitacionSeleccionada,
    FechaEntrada,
    FechaSalida,
    NumeroHuespedes,
    Notas,
    MetodoPago,
    PagoTarjeta,
    MutacionReservar,
    MutacionPagoInicial,
  ]);

  const Noches = FechaEntrada && FechaSalida ? CalcularNoches(FechaEntrada, FechaSalida) : 0;

  return {
    Tipos,
    FechaEntrada,
    FechaSalida,
    NumeroHuespedes,
    Notas,
    setNotas,
    Buscando,
    Habitaciones,
    ReservandoId,
    ReservaCreada,
    HabitacionSeleccionada,
    MetodoPago,
    setMetodoPago,
    Paso,
    PagoTarjeta,
    setPagoTarjeta,
    PrevisualizacionPrecio,
    CargandoPrevisualizacion,
    ErrorPrevisualizacion,
    ErrorPrevisualizacionObjeto,
    MutacionReservar,
    MutacionPagoInicial,
    Noches,
    AlBuscarConDatos,
    IrAConfirmacion,
    VolverABusqueda,
    ConfirmarReservaSeleccionada,
  };
}
