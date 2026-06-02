import { useEffect, useState } from "react";
import { Platform } from "react-native";

import {
  googleLoginDisponible,
  iniciarSesionGoogleNativo,
  iniciarSesionGoogleWeb,
  useSolicitudGoogle,
} from "@/src/services/auth";

export function useGoogleAuth() {
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [request, response, promptAsync] = useSolicitudGoogle();

  useEffect(() => {
    if (response?.type !== "success") return;

    const idToken =
      response.authentication?.idToken ??
      (typeof response.params?.id_token === "string" ? response.params.id_token : null);

    const accessToken =
      response.authentication?.accessToken ??
      (typeof response.params?.access_token === "string" ? response.params.access_token : null);

    void (async () => {
      try {
        setError(null);
        await iniciarSesionGoogleNativo(idToken, accessToken);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "No se pudo iniciar con Google.");
      } finally {
        setCargando(false);
      }
    })();
  }, [response]);

  async function iniciar() {
    try {
      setError(null);
      setCargando(true);

      if (Platform.OS === "web") {
        await iniciarSesionGoogleWeb();
        setCargando(false);
        return;
      }

      if (!request) {
        throw new Error("Google aun no esta listo en este entorno.");
      }

      const resultado = await promptAsync();

      if (resultado.type === "cancel" || resultado.type === "dismiss") {
        setCargando(false);
        return;
      }

      if (resultado.type !== "success") {
        throw new Error("No se pudo completar el flujo de Google.");
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "No se pudo iniciar con Google.");
      setCargando(false);
    }
  }

  return {
    cargando,
    disponible: googleLoginDisponible(),
    error,
    iniciar,
  };
}
