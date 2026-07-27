import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

import { resolverIdiomaInicial } from "@/src/i18n";
import { auth, db } from "@/src/services/firebaseConfig";
import { guardarSesionInvitado, cargarSesionInvitado } from "@/src/services/sesion-invitado";
import type { Idioma } from "@/src/types/idioma";
import type { UsuarioBase } from "@/src/types/usuario";

type TipoSesion = "firebase" | "invitado" | null;

interface SesionContextoValor {
  cargando: boolean;
  entrarComoInvitado: () => Promise<void>;
  esInvitado: boolean;
  idioma: Idioma;
  perfilId: string | null;
  salirSesionActual: () => Promise<void>;
  tieneSesionActiva: boolean;
  tipoSesion: TipoSesion;
  usuarioApp: UsuarioBase | null;
  usuarioFirebase: User | null;
}

export const SesionContexto = createContext<SesionContextoValor | null>(null);

export function SesionProvider({ children }: PropsWithChildren) {
  const [cargandoAuth, setCargandoAuth] = useState(Boolean(auth));
  const [cargandoInvitado, setCargandoInvitado] = useState(true);
  const [esInvitado, setEsInvitado] = useState(false);
  const [usuarioApp, setUsuarioApp] = useState<UsuarioBase | null>(null);
  const [usuarioFirebase, setUsuarioFirebase] = useState<User | null>(null);

  useEffect(() => {
    let activa = true;

    void cargarSesionInvitado()
      .then((invitadoActivo) => {
        if (!activa) {
          return;
        }

        setEsInvitado(invitadoActivo);
        setCargandoInvitado(false);
      })
      .catch(() => {
        if (!activa) {
          return;
        }

        setEsInvitado(false);
        setCargandoInvitado(false);
      });

    return () => {
      activa = false;
    };
  }, []);

  useEffect(() => {
    if (!auth) {
      setCargandoAuth(false);
      return;
    }

    let cancelarUsuario: (() => void) | null = null;

    const cancelarAuth = onAuthStateChanged(auth, (siguienteUsuario) => {
      setUsuarioFirebase(siguienteUsuario);

      cancelarUsuario?.();
      cancelarUsuario = null;

      if (!siguienteUsuario || !db) {
        setUsuarioApp(null);
        setCargandoAuth(false);
        return;
      }

      setEsInvitado((invitadoActual) => {
        if (invitadoActual) {
          void guardarSesionInvitado(false);
        }

        return false;
      });

      cancelarUsuario = onSnapshot(
        doc(db, "usuarios", siguienteUsuario.uid),
        (snapshot) => {
          setUsuarioApp(snapshot.exists() ? (snapshot.data() as UsuarioBase) : null);
          setCargandoAuth(false);
        },
        () => {
          setUsuarioApp(null);
          setCargandoAuth(false);
        }
      );
    });

    return () => {
      cancelarUsuario?.();
      cancelarAuth();
    };
  }, []);

  async function entrarComoInvitado() {
    await guardarSesionInvitado(true);
    setEsInvitado(true);
  }

  async function salirSesionActual() {
    if (auth?.currentUser) {
      await auth.signOut();
    }

    setEsInvitado(false);
    setUsuarioApp(null);
    await guardarSesionInvitado(false);
  }

  const tieneSesionActiva = Boolean(usuarioFirebase || esInvitado);
  const perfilId = usuarioFirebase?.uid ?? (esInvitado ? "guest" : null);
  const tipoSesion: TipoSesion = usuarioFirebase ? "firebase" : esInvitado ? "invitado" : null;
  const cargando = cargandoAuth || cargandoInvitado;

  const valor = useMemo<SesionContextoValor>(
    () => ({
      cargando,
      entrarComoInvitado,
      esInvitado,
      idioma: usuarioApp?.idiomaPreferido ?? resolverIdiomaInicial(),
      perfilId,
      salirSesionActual,
      tieneSesionActiva,
      tipoSesion,
      usuarioApp,
      usuarioFirebase,
    }),
    [
      cargando,
      esInvitado,
      perfilId,
      tieneSesionActiva,
      tipoSesion,
      usuarioApp,
      usuarioFirebase,
    ]
  );

  return <SesionContexto.Provider value={valor}>{children}</SesionContexto.Provider>;
}
