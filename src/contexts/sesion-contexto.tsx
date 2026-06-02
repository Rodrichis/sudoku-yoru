import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

import { resolverIdiomaInicial } from "@/src/i18n";
import { auth, db } from "@/src/services/firebaseConfig";
import type { Idioma } from "@/src/types/idioma";
import type { UsuarioBase } from "@/src/types/usuario";

interface SesionContextoValor {
  cargando: boolean;
  idioma: Idioma;
  usuarioApp: UsuarioBase | null;
  usuarioFirebase: User | null;
}

export const SesionContexto = createContext<SesionContextoValor | null>(null);

export function SesionProvider({ children }: PropsWithChildren) {
  const [cargando, setCargando] = useState(true);
  const [usuarioApp, setUsuarioApp] = useState<UsuarioBase | null>(null);
  const [usuarioFirebase, setUsuarioFirebase] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) {
      setCargando(false);
      return;
    }

    let cancelarUsuario: (() => void) | null = null;

    const cancelarAuth = onAuthStateChanged(auth, (siguienteUsuario) => {
      setUsuarioFirebase(siguienteUsuario);

      cancelarUsuario?.();
      cancelarUsuario = null;

      if (!siguienteUsuario || !db) {
        setUsuarioApp(null);
        setCargando(false);
        return;
      }

      cancelarUsuario = onSnapshot(
        doc(db, "usuarios", siguienteUsuario.uid),
        (snapshot) => {
          setUsuarioApp(snapshot.exists() ? (snapshot.data() as UsuarioBase) : null);
          setCargando(false);
        },
        () => {
          setUsuarioApp(null);
          setCargando(false);
        }
      );
    });

    return () => {
      cancelarUsuario?.();
      cancelarAuth();
    };
  }, []);

  const valor = useMemo<SesionContextoValor>(
    () => ({
      cargando,
      idioma: usuarioApp?.idiomaPreferido ?? resolverIdiomaInicial(),
      usuarioApp,
      usuarioFirebase,
    }),
    [cargando, usuarioApp, usuarioFirebase]
  );

  return <SesionContexto.Provider value={valor}>{children}</SesionContexto.Provider>;
}
