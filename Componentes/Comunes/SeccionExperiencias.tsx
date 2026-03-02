import { TarjetaExperienciaMejorada } from "./TarjetaExperienciaMejorada";



export function SeccionExperiencias() {
  return (
    <section className="bg-[#f6f2ec] px-6 py-20" aria-label="Experiencias">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs tracking-[0.35em] text-gold-500">
            EXPERIENCIAS
          </p>
          <h2 className="FuenteTitulo mt-3 text-3xl text-gold-500 md:text-4xl">
            Más que un hotel
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#5b564d]">
            Descubre todo lo que Royal Palm tiene para ofrecerte
          </p>
        </div>

        <div className="mt-14 grid gap-12 md:grid-cols-4">
          <TarjetaExperienciaMejorada
            RutaIcono="/bed.svg"
            Titulo="Servicio Premium"
            Descripcion="Atención personalizada las 24 horas para hacer de tu estancia una experiencia única."
          />
          <TarjetaExperienciaMejorada
            RutaIcono="/food.svg"
            Titulo="Gastronomía Exquisita"
            Descripcion="Restaurantes de clase mundial con cocina internacional y local de primer nivel."
          />
          <TarjetaExperienciaMejorada
            RutaIcono="/spa.svg"
            Titulo="Spa & Bienestar"
            Descripcion="Centro de bienestar completo con tratamientos exclusivos y piscina infinita."
          />
          <TarjetaExperienciaMejorada
            RutaIcono="/nature.svg"
            Titulo="Sostenibilidad"
            Descripcion="Comprometidos con el medio ambiente y prácticas responsables en cada detalle."
          />
        </div>
      </div>
    </section>
  );
}
