import { VistaNoEncontrada } from "@/Componentes/Comunes/VistaNoEncontrada";

export default function PaginaNoEncontradaMiCuenta() {
  return (
    <VistaNoEncontrada
      Titulo="Vista no encontrada"
      Descripcion="La sección solicitada no está disponible en tu cuenta."
      HrefBoton="/mi-cuenta"
      TextoBoton="Volver a mi cuenta"
      EnPanel
    />
  );
}
