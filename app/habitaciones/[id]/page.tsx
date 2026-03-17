import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VistaDetalleHabitacionCliente } from "@/Caracteristicas/Habitaciones/Componentes/VistaDetalleHabitacionCliente";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Habitación | Royal Palm" };
}

export default async function PaginaDetalleHabitacion({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const Parametros = await searchParams;
  const Id = parseInt(id, 10);
  if (Number.isNaN(Id)) notFound();

  const Entrada = typeof Parametros.entrada === "string" ? Parametros.entrada : null;
  const Salida = typeof Parametros.salida === "string" ? Parametros.salida : null;
  return <VistaDetalleHabitacionCliente Id={Id} Entrada={Entrada} Salida={Salida} />;
}
