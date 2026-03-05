"use client";

import { useState } from "react"; // Eliminamos useEffect para limpiar la terminal
import { BarraNavegacion } from "@/Componentes/Comunes/BarraNavegacion";
import { HabitacionCard } from "@/Componentes/Comunes/HabitacionCard";
import { BotonEnlace } from "@/Componentes/Base/BotonEnlace";
import Link from "next/link";
import Image from "next/image";

const HABITACIONES_DATA = [
  { id: 1, titulo: "Habitación Standard", precio: 80, maxHuespedes: 2, descripcion: "Ideal para viajeros de paso.", imagen: "/HabitacionStandar.jpg", equipamiento: ["Wifi", "Escritorio"] },
  { id: 2, titulo: "Habitación Superior / Deluxe", precio: 150, maxHuespedes: 2, descripcion: "Mejor experiencia y comodidad.", imagen: "/Habitacion Superior_....jpg", equipamiento: ["Cama King", "Tina"] },
  { id: 3, titulo: "Executive Suite", precio: 380, maxHuespedes: 3, descripcion: "Para el viajero de negocios.", imagen: "/Business_Suite.jpg", equipamiento: ["Nespresso", "Workstation"] },
  { id: 4, titulo: "Family Suite", precio: 420, maxHuespedes: 6, descripcion: "Ideal para familias unidas.", imagen: "/Familysuite.jpg", equipamiento: ["Cocineta", "Smart TV"] },
];
export default function CatalogoPage() {
  const [seleccionada, setSeleccionada] = useState(HABITACIONES_DATA[0]);
  const [huespedes, setHuespedes] = useState(1);
  const [fechaEntrada, setFechaEntrada] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");

  // --- LÓGICA DE ESTADO DERIVADO (Corrige error de línea 28) ---
  // Calculamos noches al vuelo sin usar useEffect ni un estado extra
  let nochesCalculadas = 1;
  if (fechaEntrada && fechaSalida) {
    const inicio = new Date(fechaEntrada);
    const fin = new Date(fechaSalida);
    const diferencia = fin.getTime() - inicio.getTime();
    const dias = Math.ceil(diferencia / (1000 * 3600 * 24));
    nochesCalculadas = dias > 0 ? dias : 1;
  }

  // Validamos huéspedes al vuelo para el resumen
  const huespedesValidados = huespedes > seleccionada.maxHuespedes 
    ? seleccionada.maxHuespedes 
    : huespedes;

  // Precio final usando los valores derivados
  const totalEstimado = (seleccionada.precio * huespedesValidados) * nochesCalculadas;

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <BarraNavegacion />

      <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-20">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-black font-serif tracking-tight">Gestión de Reservas</h1>
            <BotonEnlace HRef="/Habitaciones/Crear" Texto="Nueva Habitación" Variante="Dorado" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="flex flex-col gap-2">
              <label className="block text-[10px] font-bold uppercase text-[#b88f3a] tracking-widest ml-1">Check-In</label>
              <input 
                type="date" 
                value={fechaEntrada}
                onChange={(e) => setFechaEntrada(e.target.value)}
                className="w-full p-2.5 border-2 border-[#b88f3a]/30 rounded-xl text-sm text-black outline-none focus:border-[#b88f3a] bg-[#fcfaf2]/30 transition-all" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-[10px] font-bold uppercase text-[#b88f3a] tracking-widest ml-1">Check-Out</label>
              <input 
                type="date" 
                value={fechaSalida}
                onChange={(e) => setFechaSalida(e.target.value)}
                className="w-full p-2.5 border-2 border-[#b88f3a]/30 rounded-xl text-sm text-black outline-none focus:border-[#b88f3a] bg-[#fcfaf2]/30 transition-all" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-[10px] font-bold uppercase text-[#b88f3a] tracking-widest ml-1">Huéspedes (Máx: {seleccionada.maxHuespedes})</label>
              <div className="flex items-center border-2 border-[#b88f3a]/30 rounded-xl overflow-hidden bg-white">
                <button onClick={() => setHuespedes(Math.max(1, huespedes - 1))} className="px-4 py-2 hover:bg-[#b88f3a] hover:text-white transition-colors text-black font-bold border-r border-[#b88f3a]/10">-</button>
                <input type="number" value={huespedesValidados} readOnly className="w-full text-center text-sm font-bold text-black outline-none" />
                <button onClick={() => setHuespedes(huespedes + 1)} className="px-4 py-2 hover:bg-[#b88f3a] hover:text-white transition-colors text-black font-bold border-l border-[#b88f3a]/10">+</button>
              </div>
            </div>

            <BotonEnlace HRef="#" Texto="Verificar" Variante="Dorado" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-6">
            {HABITACIONES_DATA.map((hab) => (
              <div 
                key={hab.id} 
                onClick={() => setSeleccionada(hab)}
                className={`cursor-pointer transition-all duration-500 rounded-2xl border-4 ${
                  seleccionada.id === hab.id ? "border-[#b88f3a] shadow-2xl scale-[1.01]" : "border-transparent opacity-70 grayscale-[30%]"
                }`}
              >
                <HabitacionCard 
                  titulo={hab.titulo}
                  descripcion={hab.descripcion}
                  precio={hab.precio}
                  equipamiento={hab.equipamiento}
                  imagen={hab.imagen}
                />
              </div>
            ))}
          </div>

          <aside className="w-full lg:w-[400px]">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 sticky top-32 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#fcfaf2] rounded-full -mr-16 -mt-16 z-0"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                  <Image 
                    src="/Logo.svg" 
                    alt="Royal Palm Logo" 
                    width={64} 
                    height={64} 
                    className="drop-shadow-sm" 
                  />
                  <div className="text-center">
                    <span className="font-bold text-[#b88f3a] tracking-tighter text-2xl font-serif">Royal Palm</span>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[4px] mb-1">Resumen de</p>
                  </div>
                </div>

                <div className="space-y-6 text-sm mb-10">
                  <div className="bg-[#fcfaf2] p-4 rounded-2xl border border-[#b88f3a]/10">
                    <p className="text-[10px] uppercase font-bold text-[#b88f3a] mb-1 tracking-widest">Estancia Seleccionada</p>
                    <p className="font-bold text-black text-lg">{seleccionada.titulo}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-l-4 border-[#b88f3a] pl-3">
                      <p className="text-[10px] text-[#b88f3a] font-bold uppercase tracking-wider">Check-In</p>
                      <p className="text-black font-semibold">{fechaEntrada || "---"}</p>
                    </div>
                    <div className="border-l-4 border-[#b88f3a] pl-3">
                      <p className="text-[10px] text-[#b88f3a] font-bold uppercase tracking-wider">Check-Out</p>
                      <p className="text-black font-semibold">{fechaSalida || "---"}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-dashed border-[#b88f3a]/30">
                    <span className="text-gray-500 font-medium italic">Huéspedes:</span>
                    <span className="font-bold text-[#b88f3a]">{huespedesValidados} personas</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-[#b88f3a]/30">
                    <span className="text-gray-500 font-medium italic">Noches totales:</span>
                    <span className="font-bold text-[#b88f3a]">{nochesCalculadas}</span>
                  </div>
                </div>

                <div className="bg-black p-6 rounded-2xl text-white shadow-xl mb-8 relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[10px] uppercase font-bold text-[#b88f3a] mb-1 tracking-[2px]">Total del servicio</p>
                    <p className="text-4xl font-bold text-white">
                      <span className="text-[#b88f3a]">$</span>{totalEstimado.toLocaleString()}<span className="text-sm font-normal opacity-60">.00</span>
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b88f3a]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                <button className="w-full bg-[#b88f3a] text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs">
                  RESERVAR AHORA
                </button>
                
                <Link href="/" className="block text-center text-[10px] text-gray-400 hover:text-[#b88f3a] font-bold uppercase tracking-[3px] mt-6 transition-colors">
                  ← Volver al Inicio
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}