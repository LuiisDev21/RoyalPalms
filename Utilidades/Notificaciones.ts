import { sileo } from "sileo";

export const Notificaciones = {
  Exito(Titulo: string, Descripcion?: string) {
    sileo.success({ title: Titulo, description: Descripcion ?? undefined });
  },
  Error(Titulo: string, Descripcion?: string) {
    sileo.error({ title: Titulo, description: Descripcion ?? undefined });
  },
  Advertencia(Titulo: string, Descripcion?: string) {
    sileo.warning({ title: Titulo, description: Descripcion ?? undefined });
  },
  Info(Titulo: string, Descripcion?: string) {
    sileo.info({ title: Titulo, description: Descripcion ?? undefined });
  },
};
