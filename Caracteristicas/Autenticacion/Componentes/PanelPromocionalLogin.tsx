export function PanelPromocionalLogin() {
  return (
    <aside
      className="relative hidden min-h-screen flex-1 overflow-hidden bg-[#5c4520] bg-cover bg-center bg-no-repeat lg:flex lg:flex-col lg:justify-end lg:p-12 xl:p-16"
      style={{ backgroundImage: "url(/playa1.png)" }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[#1c1a16]/40" aria-hidden="true" />
      <div className="relative z-10 max-w-md">
        <h2 className="FuenteTitulo text-4xl font-semibold leading-tight text-white xl:text-5xl">
          La experiencia comienza aquí.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-white/95">
          Descubre el confort inigualable y la elegancia atemporal en cada
          detalle de tu estancia.
        </p>
      </div>
    </aside>
  );
}
