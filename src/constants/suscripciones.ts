import { trialDiasPredeterminados } from "@/src/config/env";
import type { PlanBase } from "@/src/types/suscripciones";

export const PLANES_IDS = {
  FREE: "free",
  PRO: "pro",
  TRIAL: "trial",
} as const;

export const ESTADOS_SUSCRIPCION = {
  ACTIVA: "activa",
  CADUCADA: "caducada",
  CANCELADA: "cancelada",
  PRUEBA: "prueba",
} as const;

export const DIAS_PRUEBA_PREDETERMINADOS =
  Number.isFinite(trialDiasPredeterminados) && trialDiasPredeterminados > 0
    ? trialDiasPredeterminados
    : 14;

export const PLANES_BASE: PlanBase[] = [
  {
    billing: {
      proveedorPrincipal: "manual",
      usaWebhooks: false,
    },
    descripcion: "Periodo de prueba inicial para desbloquear funciones premium.",
    id: PLANES_IDS.TRIAL,
    limites: {
      admins: 1,
      correosMes: 200,
      notificacionesMes: 500,
    },
    nombre: "Prueba",
    trialDays: DIAS_PRUEBA_PREDETERMINADOS,
  },
  {
    billing: {
      proveedorPrincipal: "manual",
      usaWebhooks: false,
    },
    descripcion: "Plan gratuito con limites controlados para validar una idea.",
    id: PLANES_IDS.FREE,
    limites: {
      admins: 1,
      correosMes: 50,
      notificacionesMes: 100,
    },
    nombre: "Free",
    trialDays: 0,
  },
  {
    billing: {
      proveedorPrincipal: "revenuecat",
      usaWebhooks: true,
    },
    descripcion: "Plan de pago con limites mas altos y pensado para integrarse con RevenueCat.",
    id: PLANES_IDS.PRO,
    limites: {
      admins: 5,
      correosMes: 5000,
      notificacionesMes: 10000,
    },
    nombre: "Pro",
    trialDays: 0,
  },
];
