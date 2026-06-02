import { Platform } from "react-native";

import { app } from "@/src/services/firebaseConfig";

export async function registrarEventoAnalytics(
  nombre: string,
  parametros?: Record<string, string | number | boolean>
) {
  if (Platform.OS !== "web" || !app) return;

  const modulo = await import("firebase/analytics");
  const soportado = await modulo.isSupported();

  if (!soportado) return;

  const analytics = modulo.getAnalytics(app);
  modulo.logEvent(analytics, nombre, parametros);
}
