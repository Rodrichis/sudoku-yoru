import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import * as Notifications from "expo-notifications";

import { registrarDispositivoPush } from "@/src/services/notifications";
import { useSesion } from "@/src/hooks/use-sesion";

interface NotificacionesContextoValor {
  error: string | null;
  expoPushToken: string | null;
  permiso: string;
  registrando: boolean;
  ultimaNotificacion: string | null;
}

const NotificacionesContexto = createContext<NotificacionesContextoValor | null>(null);

export function NotificacionesProvider({ children }: PropsWithChildren) {
  const [error, setError] = useState<string | null>(null);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permiso, setPermiso] =
    useState<NotificacionesContextoValor["permiso"]>("pending");
  const [registrando, setRegistrando] = useState(false);
  const [ultimaNotificacion, setUltimaNotificacion] = useState<string | null>(null);
  const { usuarioFirebase } = useSesion();

  useEffect(() => {
    const recibido = Notifications.addNotificationReceivedListener((notificacion) => {
      setUltimaNotificacion(
        typeof notificacion.request.content.title === "string"
          ? notificacion.request.content.title
          : "Notificacion recibida"
      );
    });

    const respuesta = Notifications.addNotificationResponseReceivedListener((evento) => {
      setUltimaNotificacion(
        typeof evento.notification.request.content.title === "string"
          ? evento.notification.request.content.title
          : "Notificacion abierta"
      );
    });

    return () => {
      recibido.remove();
      respuesta.remove();
    };
  }, []);

  useEffect(() => {
    if (!usuarioFirebase?.uid) {
      setExpoPushToken(null);
      return;
    }

    void (async () => {
      setRegistrando(true);
      const resultado = await registrarDispositivoPush(usuarioFirebase.uid);
      setExpoPushToken(resultado.expoPushToken);
      setPermiso(resultado.permiso);
      setError(resultado.error ?? null);
      setRegistrando(false);
    })();
  }, [usuarioFirebase?.uid]);

  const valor = useMemo<NotificacionesContextoValor>(
    () => ({
      error,
      expoPushToken,
      permiso,
      registrando,
      ultimaNotificacion,
    }),
    [error, expoPushToken, permiso, registrando, ultimaNotificacion]
  );

  return (
    <NotificacionesContexto.Provider value={valor}>
      {children}
    </NotificacionesContexto.Provider>
  );
}

export function useNotificaciones() {
  const contexto = useContext(NotificacionesContexto);

  if (!contexto) {
    throw new Error("useNotificaciones debe usarse dentro de NotificacionesProvider.");
  }

  return contexto;
}
