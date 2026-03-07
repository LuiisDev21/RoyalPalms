export function MapaHotel() {
  return (
    <section
      className="bg-[#f6f2ec] px-6 py-16 md:py-20"
      aria-label="Mapa del hotel"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-[0.35em] text-[#b88f3a]">
              CÓMO LLEGAR
            </p>
            <h2 className="FuenteTitulo mt-3 text-2xl leading-tight text-[#1c1a16] md:text-3xl">
              Encuéntranos en el mapa
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5b564d] md:text-base">
              Ubicado en una de las zonas más exclusivas, Royal Palm ofrece un
              acceso cómodo tanto para viajeros locales como internacionales.
              Utiliza el mapa para trazar la mejor ruta hacia tu próximo refugio.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#e0d7c7] bg-[#1c1a16] shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
          <div className="relative h-[340px] w-full md:h-[420px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3855.3557982583293!2d-111.96885669999999!3d33.5047873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b0c623c5a916b%3A0xd761040e71fd5a19!2sRoyal%20Palms%20Resort%20and%20Spa!5e1!3m2!1ses!2sni!4v1772690189666!5m2!1ses!2sni"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

