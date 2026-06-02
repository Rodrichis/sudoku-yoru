export const textosEs = {
  auth: {
    recuperar: {
      accion: "Enviar enlace",
      descripcion: "Te enviaremos un correo para restablecer tu password.",
      exito: "Si el correo existe, ya enviamos las instrucciones.",
      volver: "Volver al login",
    },
    registro: {
      accion: "Crear cuenta",
      descripcion:
        "Crea la base de usuarios, roles y suscripcion inicial para reutilizar en futuras apps.",
      subtitulo: "App base reusable",
      titulo: "Comienza con una base lista",
      volver: "Ya tengo cuenta",
    },
    sesion: {
      accion: "Entrar",
      descripcion:
        "Autenticacion lista con Firebase, sesion persistente, Firestore y push notifications.",
      google: "Continuar con Google",
      recuperar: "Olvide mi password",
      registro: "Crear una cuenta",
      subtitulo: "Expo + Firebase",
      titulo: "Bienvenido a la plantilla base",
    },
  },
  estados: {
    activa: "Activa",
    caducada: "Caducada",
    cancelada: "Cancelada",
    prueba: "Prueba",
  },
  general: {
    admin: "Admin",
    cancelar: "Cancelar",
    cargando: "Cargando sesion...",
    cerrarSesion: "Cerrar sesion",
    configuracionFaltante: "Falta configurar Firebase en tu archivo .env local.",
    guardar: "Guardar",
    idioma: "Idioma",
    loadingGoogle: "Abriendo Google...",
    notifications: "Notificaciones",
    plan: "Plan",
    role: "Rol",
    usuario: "Usuario",
  },
  home: {
    contextoIa:
      "Recuerda documentar flujos y decisiones importantes en la carpeta contexto-ia de la raiz.",
    notificationsHint:
      "El registro push se monta automaticamente y guarda el dispositivo en Firestore cuando la app tiene sesion.",
    resumen:
      "Esta pantalla existe para validar sesion, rol, plan, idioma y registro de push desde una base reusable.",
    titulo: "Base operativa",
  },
  planes: {
    free: "Free",
    pro: "Pro",
    trial: "Prueba",
  },
  servicios: {
    analytics: "Analytics web listo",
    firebase: "Firebase configurado",
    google: "Google login disponible",
    push: "Expo Notifications montado",
    revenuecat: "RevenueCat desacoplado",
  },
} as const;

type TextoProfundo<T> = T extends string
  ? string
  : T extends Record<string, unknown>
    ? { [K in keyof T]: TextoProfundo<T[K]> }
    : T;

export type Textos = TextoProfundo<typeof textosEs>;
