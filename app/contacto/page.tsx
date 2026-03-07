"use client";

import { useRef } from 'react';

export default function Contacto() {
  const formularioRef = useRef<HTMLFormElement>(null);
  
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Gracias! Tu mensaje ha sido enviado a Royal Palm con éxito.");
    formularioRef.current?.reset();
  };

  return (
    // Fondo de toda la página en color crema claro
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4">
      
      {/* TARJETA PRINCIPAL */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-2xl overflow-hidden">
        
        {/* LADO IZQUIERDO: Ubicación (TODO NEGRO) */}
        <div className="w-full md:w-1/3 p-10 text-white flex flex-col justify-between z-10 bg-[#1C1C1C]">
          <div>
            <h2 className="text-[#C09D53] tracking-widest text-sm font-bold mb-4">UBICACIÓN</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Fort Lauderdale, Florida<br />Cerca de la playa y el centro
            </p>
          </div>
          <div className="mt-10">
            <h2 className="text-[#C09D53] tracking-widest text-sm font-bold mb-4">SÍGUENOS</h2>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#C09D53] hover:text-[#C09D53] cursor-pointer transition-all">f</span>
              <span className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#C09D53] hover:text-[#C09D53] cursor-pointer transition-all">t</span>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: Formulario (TODO CREMA) */}
        {/* He quitado la "banda dorada" para que el fondo sea un color sólido crema */}
        <div className="w-full md:w-2/3 bg-[#F9F7F2] p-10 md:p-16 flex items-center">
          
          <div className="w-full">
            <h1 className="text-2xl font-light tracking-widest text-[#1C1C1C] mb-10 border-b border-[#C09D53] pb-2 inline-block">
              FORMULARIO DE CONTACTO
            </h1>
            
            <form ref={formularioRef} className="space-y-6" onSubmit={manejarEnvio}>
              <div>
                <input 
                  type="text" 
                  placeholder="Nombre completo" 
                  required
                  className="w-full bg-white border border-gray-200 p-3 outline-none focus:border-[#C09D53] transition-all placeholder:text-gray-400 text-black shadow-sm" 
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Correo electrónico" 
                  required
                  className="w-full bg-white border border-gray-200 p-3 outline-none focus:border-[#C09D53] transition-all placeholder:text-gray-400 text-black shadow-sm" 
                />
              </div>
              <div>
                <textarea 
                  placeholder="Tu mensaje" 
                  rows={4} 
                  required
                  className="w-full bg-white border border-gray-200 p-3 outline-none focus:border-[#C09D53] transition-all resize-none placeholder:text-gray-400 text-black shadow-sm"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="bg-[#1C1C1C] text-[#C09D53] border border-[#C09D53] px-12 py-3 text-sm tracking-[0.2em] font-bold mt-4 shadow-lg transition-all duration-300 hover:bg-[#C09D53] hover:text-white active:scale-95"
              >
                ENVIAR
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}