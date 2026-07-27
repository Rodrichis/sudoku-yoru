import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import {
  cargarSudokuEstadisticas,
  reconciliarSudokuVictoriaPendiente,
} from "@/src/services/sudoku-storage";
import type { SudokuEstadisticas } from "@/src/types/sudoku";

export function useSudokuEstadisticas(perfilId: string | null) {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estadisticas, setEstadisticas] = useState<SudokuEstadisticas | null>(null);

  const refrescar = useCallback(async () => {
    if (!perfilId) {
      setEstadisticas(null);
      setError(null);
      setCargando(false);
      return;
    }

    setCargando(true);
    setError(null);

    try {
      await reconciliarSudokuVictoriaPendiente(perfilId);
      const siguientes = await cargarSudokuEstadisticas(perfilId);
      setEstadisticas(siguientes);
    } catch (errorCarga) {
      setError(
        errorCarga instanceof Error
          ? errorCarga.message
          : "No se pudieron cargar las estadisticas."
      );
      setEstadisticas(null);
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
    estadisticas,
    refrescar,
  };
}
