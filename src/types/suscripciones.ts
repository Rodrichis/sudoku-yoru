export type PlanId = "trial" | "free" | "pro";

export type EstadoSuscripcion = "prueba" | "activa" | "caducada" | "cancelada";

export type ProveedorPago = "revenuecat" | "mercadoPago" | "manual" | null;

export interface LimitesPlan {
  admins: number;
  correosMes: number;
  notificacionesMes: number;
}

export interface PlanBase {
  billing: {
    proveedorPrincipal: Exclude<ProveedorPago, null>;
    usaWebhooks: boolean;
  };
  descripcion: string;
  id: PlanId;
  limites: LimitesPlan;
  nombre: string;
  trialDays: number;
}

export interface UsoSuscripcion {
  actualizadoEl?: unknown;
  correosMes: number;
  mesReferencia: string;
  notificacionesMes: number;
}
