import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { useSesion } from "@/src/hooks/use-sesion";
import {
  registrarDispositivoPush,
  suscribirEventosNotificaciones,
} from "@/src/services/notifications";

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
    let activa = true;
    let cancelar: () => void = () => undefined;

    void suscribirEventosNotificaciones({
      onNotificacionAbierta: (titulo) => {
        if (activa) {
          setUltimaNotificacion(titulo);
        }
      },
      onNotificacionRecibida: (titulo) => {
        if (activa) {
          setUltimaNotificacion(titulo);
        }
      },
    })
      .then((cancelarSuscripcion) => {
        if (!activa) {
          cancelarSuscripcion();
          return;
        }

        cancelar = cancelarSuscripcion;
      })
      .catch((errorSuscripcion) => {
        if (activa) {
          setError(
            errorSuscripcion instanceof Error
              ? errorSuscripcion.message
              : "No fue posible escuchar notificaciones."
          );
        }
      });

    return () => {
      activa = false;
      cancelar();
    };
  }, []);

  useEffect(() => {
    if (!usuarioFirebase?.uid) {
      setExpoPushToken(null);
      setRegistrando(false);
      return;
    }

    let activa = true;

    void (async () => {
      setRegistrando(true);

      try {
        const resultado = await registrarDispositivoPush(usuarioFirebase.uid);

        if (!activa) {
          return;
        }

        setExpoPushToken(resultado.expoPushToken);
        setPermiso(resultado.permiso);
        setError(resultado.error ?? null);
      } catch (errorRegistro) {
        if (activa) {
          setExpoPushToken(null);
          setError(
            errorRegistro instanceof Error
              ? errorRegistro.message
              : "No fue posible registrar las notificaciones."
          );
        }
      } finally {
        if (activa) {
          setRegistrando(false);
        }
      }
    })();

    return () => {
      activa = false;
    };
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
