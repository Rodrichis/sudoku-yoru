import type { Textos } from "@/src/i18n/es";

export const textosEn: Textos = {
  auth: {
    recuperar: {
      accion: "Send reset link",
      descripcion: "We will send an email so you can reset your password.",
      exito: "If the email exists, the instructions are already on the way.",
      volver: "Back to sign in",
    },
    registro: {
      accion: "Create account",
      descripcion:
        "Create the user base, roles and initial subscription once and reuse it in future apps.",
      subtitulo: "Reusable app base",
      titulo: "Start from a ready-made foundation",
      volver: "I already have an account",
    },
    sesion: {
      accion: "Sign in",
      descripcion:
        "Authentication ready with Firebase, persistent session, Firestore and push notifications.",
      google: "Continue with Google",
      recuperar: "Forgot my password",
      registro: "Create an account",
      subtitulo: "Expo + Firebase",
      titulo: "Welcome to the base template",
    },
  },
  estados: {
    activa: "Active",
    caducada: "Expired",
    cancelada: "Cancelled",
    prueba: "Trial",
  },
  general: {
    admin: "Admin",
    cancelar: "Cancel",
    cargando: "Loading session...",
    cerrarSesion: "Sign out",
    configuracionFaltante: "Firebase is not configured yet in your local .env file.",
    guardar: "Save",
    idioma: "Language",
    loadingGoogle: "Opening Google...",
    notifications: "Notifications",
    plan: "Plan",
    role: "Role",
    usuario: "User",
  },
  home: {
    contextoIa:
      "Remember to document important flows and architectural decisions inside the root contexto-ia folder.",
    notificationsHint:
      "Push registration is mounted automatically and saves the current device in Firestore once the app has a session.",
    resumen:
      "This screen exists to validate session, role, plan, language and push registration from a reusable base.",
    titulo: "Operational base",
  },
  planes: {
    free: "Free",
    pro: "Pro",
    trial: "Trial",
  },
  servicios: {
    analytics: "Web analytics ready",
    firebase: "Firebase configured",
    google: "Google login available",
    push: "Expo Notifications mounted",
    revenuecat: "RevenueCat decoupled",
  },
};
