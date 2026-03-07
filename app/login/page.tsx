import { FormularioIniciarSesion } from "@/Caracteristicas/Autenticacion/Componentes/FormularioIniciarSesion";
import { PanelPromocionalLogin } from "@/Caracteristicas/Autenticacion/Componentes/PanelPromocionalLogin";

export default function PaginaLogin() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f2ec] lg:flex-row">
      <PanelPromocionalLogin />
      <div className="flex min-h-screen w-full min-w-0 flex-1 items-center justify-center bg-[#f6f2ec] p-4 sm:p-6 lg:p-8">
        <FormularioIniciarSesion />
      </div>
    </div>
  );
}
