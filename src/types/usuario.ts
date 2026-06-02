import type { Idioma } from "@/src/types/idioma";
import type { EstadoSuscripcion, PlanId, ProveedorPago } from "@/src/types/suscripciones";

export type RolUsuario = "usuario" | "admin";

export interface UsuarioBase {
  actualizadoEl?: unknown;
  authProviders?: string[];
  creadoEl?: unknown;
  email: string;
  esAdmin: boolean;
  estadoSuscripcion: EstadoSuscripcion;
  expiraEl?: unknown;
  idiomaPreferido: Idioma;
  nombre: string;
  planId: PlanId;
  proveedorPago: ProveedorPago;
  role: RolUsuario;
  uid: string;
}
