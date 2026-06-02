import { ESTADOS_SUSCRIPCION, PLANES_BASE } from "@/src/constants/suscripciones";
import { obtenerTextos } from "@/src/i18n";
import type { Idioma } from "@/src/types/idioma";
import type { UsuarioBase } from "@/src/types/usuario";
import { convertirFechaDesdeFirestore } from "@/src/utils/fechas";

export function obtenerNombrePlan(planId: string, idioma: Idioma) {
  const textos = obtenerTextos(idioma);
  return textos.planes[planId as keyof typeof textos.planes] ?? planId;
}

export function obtenerNombreEstado(estado: string, idioma: Idioma) {
  const textos = obtenerTextos(idioma);
  return textos.estados[estado as keyof typeof textos.estados] ?? estado;
}

export function suscripcionExpirada(usuario: Pick<UsuarioBase, "estadoSuscripcion" | "expiraEl">) {
  const fechaExpiracion = convertirFechaDesdeFirestore(usuario.expiraEl);

  if (!fechaExpiracion) {
    return usuario.estadoSuscripcion === ESTADOS_SUSCRIPCION.CADUCADA;
  }

  return fechaExpiracion.getTime() < Date.now();
}

export function planActual(usuario: Pick<UsuarioBase, "planId">) {
  return PLANES_BASE.find((plan) => plan.id === usuario.planId) ?? null;
}
