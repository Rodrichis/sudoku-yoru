import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import {
  cargarSudokuResumenPartida,
  reconciliarSudokuVictoriaPendiente,
} from "@/src/services/sudoku-storage";
import type { SudokuResumenPartida } from "@/src/types/sudoku";

const resumenVacio: SudokuResumenPartida = {
  dificultad: "facil",
  existe: false,
  finalizada: false,
  id: null,
  segundosTranscurridos: 0,
};

export function useSudokuResumen(perfilId: string | null) {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumen, setResumen] = useState<SudokuResumenPartida>(resumenVacio);

  const refrescar = useCallback(async () => {
    if (!perfilId) {
      setResumen(resumenVacio);
      setError(null);
      setCargando(false);
      return;
    }

    setCargando(true);
    setError(null);

    try {
      await reconciliarSudokuVictoriaPendiente(perfilId);
      const siguiente = await cargarSudokuResumenPartida(perfilId);
      setResumen(siguiente);
    } catch (errorCarga) {
      setError(
        errorCarga instanceof Error
          ? errorCarga.message
          : "No se pudo leer la partida guardada."
      );
    } finally {
      setCargando(false);
    }
  }, [perfilId]);

  useFocusEffect(
    useCallback(() => {
      void refrescar();
    }, [refrescar])
  );

  return {
    cargando,
    error,
    refrescar,
    resumen,
  };
}
