import Image from "next/image";
import { BotonEnlace } from "@/Componentes/Base/BotonEnlace";

interface Props {
  titulo: string;
  descripcion: string;
  precio: number;
  equipamiento: string[];
  imagen: string;
}

export const HabitacionCard = ({ titulo, descripcion, precio, equipamiento, imagen }: Props) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
      {/* Contenedor de Imagen - CORREGIDO PARA NEXT/IMAGE */}
      <div className="relative h-64 w-full">
        <Image 
          src={imagen} 
          alt={titulo} 
          fill
          className="object-cover"
        />
      </div>

      {/* Contenido Funcional */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl mb-2 FuenteTitulo text-black">{titulo}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {descripcion}
        </p>

        {/* Listado de Equipamiento (Tags) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {equipamiento.map((item, index) => (
            <span 
              key={index} 
              className="text-[10px] uppercase tracking-widest bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Footer de la tarjeta: Precio y Acción */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-400 block uppercase">Desde</span>
            <span className="text-xl font-bold text-[#b88f3a]">
              ${precio} <small className="text-xs font-normal text-gray-500">/ noche</small>
            </span>
          </div>
          
          <BotonEnlace 
            HRef={`/habitaciones/${titulo.toLowerCase().replace(/\s+/g, '-')}`} 
            Texto="Ver Detalles" 
            Variante="Dorado" 
            Tamano="Mediano" 
          />
        </div>
      </div>
    </div>
  );
};