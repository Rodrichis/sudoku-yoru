import { APP_NOMBRE } from "@/src/constants/app";

export const branding = {
  app: {
    nombre: APP_NOMBRE,
    descripcionCorta: "Plantilla base reusable para apps Expo con Firebase.",
  },
  layout: {
    anchoTarjetaAuth: 640,
    radioControl: 18,
    radioPanel: 32,
    radioTarjeta: 28,
  },
  colores: {
    fondoApp: "#f8fafc",
    superficie: "#ffffff",
    bordeSuave: "#e2e8f0",
    bordeFuerte: "#cbd5e1",
    textoPrimario: "#0f172a",
    textoSecundario: "#334155",
    textoSuave: "#64748b",
    textoInvertido: "#ffffff",
    primario: "#0f172a",
    secundario: "#334155",
    acento: "#92400e",
    advertenciaFondo: "#fef3c7",
    advertenciaBorde: "#fcd34d",
    advertenciaTexto: "#92400e",
    error: "#be123c",
    exito: "#047857",
  },
} as const;
