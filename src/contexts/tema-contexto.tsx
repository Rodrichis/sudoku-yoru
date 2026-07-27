import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { SUDOKU_AJUSTES_PREDETERMINADOS } from "@/src/constants/sudoku";
import { branding, establecerTemaBranding } from "@/src/config/branding";
import { cargarSudokuAjustes } from "@/src/services/sudoku-storage";

interface TemaContextoValor {
  aplicarModoOscuro: (siguiente: boolean) => void;
  cargandoTema: boolean;
  colores: typeof branding.colores;
  modoOscuro: boolean;
}

export const TemaContexto = createContext<TemaContextoValor | null>(null);

function resolverModoBranding(modoOscuro: boolean) {
  return modoOscuro ? "oscuro" : "claro";
}

export function TemaProvider({ children }: PropsWithChildren) {
  const [cargandoTema, setCargandoTema] = useState(true);
  const [modoOscuro, setModoOscuro] = useState(SUDOKU_AJUSTES_PREDETERMINADOS.modoOscuro);

  useEffect(() => {
    let activa = true;

    void cargarSudokuAjustes()
      .then((ajustes) => {
        if (!activa) {
          return;
        }

        establecerTemaBranding(resolverModoBranding(ajustes.modoOscuro));
        setModoOscuro(ajustes.modoOscuro);
        setCargandoTema(false);
      })
      .catch(() => {
        if (!activa) {
          return;
        }

        establecerTemaBranding(resolverModoBranding(SUDOKU_AJUSTES_PREDETERMINADOS.modoOscuro));
        setModoOscuro(SUDOKU_AJUSTES_PREDETERMINADOS.modoOscuro);
        setCargandoTema(false);
      });

    return () => {
      activa = false;
    };
  }, []);

  function aplicarModoOscuro(siguiente: boolean) {
    establecerTemaBranding(resolverModoBranding(siguiente));
    setModoOscuro(siguiente);
  }

  const valor = useMemo<TemaContextoValor>(
    () => ({
      aplicarModoOscuro,
      cargandoTema,
      colores: branding.colores,
      modoOscuro,
    }),
    [cargandoTema, modoOscuro]
  );

  return <TemaContexto.Provider value={valor}>{children}</TemaContexto.Provider>;
}
