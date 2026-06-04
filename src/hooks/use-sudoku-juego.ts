import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { registrarAbandonoSudoku, registrarIntentoSudoku, registrarVictoriaSudoku } from "@/src/services/sudoku-estadisticas";
import { crearSudokuPartida } from "@/src/services/sudoku-partidas";
import { esSudokuResuelto } from "@/src/services/sudoku-solver";
import {
  cargarSudokuEstadisticas,
  cargarSudokuPartida,
  eliminarSudokuPartida,
  guardarSudokuEstadisticas,
  guardarSudokuPartida,
} from "@/src/services/sudoku-storage";
import type {
  SudokuAjustes,
  SudokuCelda,
  SudokuDificultad,
  SudokuEstadisticas,
  SudokuNumero,
  SudokuPartida,
} from "@/src/types/sudoku";
import {
  aplicarInstantaneaSudoku,
  crearInstantaneaSudoku,
  esIndiceSudokuValido,
  limitarHistorialSudoku,
  normalizarNotasSudoku,
  obtenerHoyIso,
  obtenerIndicesRelacionadosSudoku,
} from "@/src/utils/sudoku";

interface UseSudokuJuegoParams {
  ajustes: SudokuAjustes;
  dificultadInicial?: SudokuDificultad | null;
  forzarNuevaPartida?: boolean;
  perfilId: string | null;
}

function actualizarCelda(celdas: SudokuCelda[], indice: number, celda: SudokuCelda) {
  return celdas.map((actual, cursor) => (cursor === indice ? celda : actual));
}

export function useSudokuJuego({
  ajustes,
  dificultadInicial = null,
  forzarNuevaPartida = false,
  perfilId,
}: UseSudokuJuegoParams) {
  const [cargando, setCargando] = useState(true);
  const [completadaReciente, setCompletadaReciente] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estadisticas, setEstadisticas] = useState<SudokuEstadisticas | null>(null);
  const [partida, setPartida] = useState<SudokuPartida | null>(null);
  const partidaRef = useRef<SudokuPartida | null>(null);

  function fijarPartida(siguiente: SudokuPartida | null) {
    partidaRef.current = siguiente;
    setPartida(siguiente);
  }

  const persistirEstadisticas = useCallback(async (siguientes: SudokuEstadisticas) => {
    if (!perfilId) {
      return;
    }

    setEstadisticas(siguientes);
    await guardarSudokuEstadisticas(perfilId, siguientes);
  }, [perfilId]);

  const registrarVictoria = useCallback(async (partidaGanada: SudokuPartida) => {
    if (!estadisticas) {
      return;
    }

    const siguientes = registrarVictoriaSudoku(estadisticas, {
      dificultad: partidaGanada.dificultad,
      duracionSegundos: partidaGanada.segundosTranscurridos,
      id: partidaGanada.id,
    });

    await persistirEstadisticas(siguientes);
    await eliminarSudokuPartida(perfilId ?? "guest");
    setCompletadaReciente(true);
  }, [estadisticas, perfilId, persistirEstadisticas]);

  function cerrarCelebracion() {
    setCompletadaReciente(false);
  }

  const guardarPartidaActual = useCallback(async (siguiente: SudokuPartida) => {
    if (!perfilId) {
      return;
    }

    await guardarSudokuPartida(perfilId, siguiente);
  }, [perfilId]);

  const aplicarCambio = useCallback(async (
    construirSiguiente: (actual: SudokuPartida) => SudokuPartida | null
  ) => {
    const actual = partidaRef.current;

    if (!actual) {
      return;
    }

    const siguiente = construirSiguiente(actual);

    if (!siguiente) {
      return;
    }

    const tableroActual = siguiente.celdas.map((celda) => celda.valor);
    const partidaFinal = {
      ...siguiente,
      actualizadaEl: obtenerHoyIso(),
      finalizada: siguiente.finalizada || esSudokuResuelto(tableroActual, siguiente.solucion),
      pausada:
        siguiente.finalizada || esSudokuResuelto(tableroActual, siguiente.solucion)
          ? false
          : siguiente.pausada,
    };

    fijarPartida(partidaFinal);

    if (partidaFinal.finalizada && !actual.finalizada) {
      await registrarVictoria(partidaFinal);
      return;
    }

    await guardarPartidaActual(partidaFinal);
  }, [guardarPartidaActual, registrarVictoria]);

  const cargar = useCallback(async () => {
    if (!perfilId) {
      setError("No existe una sesion activa para cargar una partida.");
      setCargando(false);
      return;
    }

    setCargando(true);
    setError(null);

    try {
      let estadisticasActuales = await cargarSudokuEstadisticas(perfilId);
      const partidaGuardada = await cargarSudokuPartida(perfilId);
      let siguientePartida: SudokuPartida | null = null;

      if (forzarNuevaPartida && dificultadInicial) {
        if (partidaGuardada && !partidaGuardada.finalizada) {
          estadisticasActuales = registrarAbandonoSudoku(estadisticasActuales);
        }

        siguientePartida = crearSudokuPartida(dificultadInicial);
        estadisticasActuales = registrarIntentoSudoku(estadisticasActuales);
        await persistirEstadisticas(estadisticasActuales);
        await guardarSudokuPartida(perfilId, siguientePartida);
      } else if (partidaGuardada && !partidaGuardada.finalizada) {
        siguientePartida = partidaGuardada;
      } else if (dificultadInicial) {
        siguientePartida = crearSudokuPartida(dificultadInicial);
        estadisticasActuales = registrarIntentoSudoku(estadisticasActuales);
        await persistirEstadisticas(estadisticasActuales);
        await guardarSudokuPartida(perfilId, siguientePartida);
      } else {
        await persistirEstadisticas(estadisticasActuales);
      }

      setEstadisticas(estadisticasActuales);
      fijarPartida(siguientePartida);
    } catch (errorCargado) {
      setError(errorCargado instanceof Error ? errorCargado.message : "No se pudo cargar la partida.");
      fijarPartida(null);
    } finally {
      setCargando(false);
    }
  }, [dificultadInicial, forzarNuevaPartida, perfilId, persistirEstadisticas]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const partidaId = partida?.id;
  const partidaPausada = partida?.pausada;
  const partidaFinalizada = partida?.finalizada;

  useEffect(() => {
    if (!partidaId || partidaPausada || partidaFinalizada) {
      return;
    }

    const intervalo = setInterval(() => {
      const actual = partidaRef.current;

      if (!actual || actual.pausada || actual.finalizada) {
        return;
      }

      const siguiente = {
        ...actual,
        actualizadaEl: obtenerHoyIso(),
        segundosTranscurridos: actual.segundosTranscurridos + 1,
      };

      fijarPartida(siguiente);
      void guardarPartidaActual(siguiente);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [guardarPartidaActual, partidaFinalizada, partidaId, partidaPausada]);

  async function seleccionarCelda(indice: number) {
    await aplicarCambio((actual) => ({
      ...actual,
      celdaSeleccionada: indice,
    }));
  }

  async function alternarNotas() {
    await aplicarCambio((actual) => ({
      ...actual,
      historial: limitarHistorialSudoku([
        ...actual.historial,
        crearInstantaneaSudoku(actual.celdas, actual.pistasRestantes, actual.notasActivas),
      ]),
      notasActivas: !actual.notasActivas,
    }));
  }

  async function alternarPausa() {
    await aplicarCambio((actual) => ({
      ...actual,
      pausada: !actual.pausada,
    }));
  }

  async function deshacer() {
    await aplicarCambio((actual) => {
      const ultimaInstantanea = actual.historial.at(-1);

      if (!ultimaInstantanea) {
        return actual;
      }

      return {
        ...actual,
        celdas: aplicarInstantaneaSudoku(actual.celdas, ultimaInstantanea),
        historial: actual.historial.slice(0, -1),
        notasActivas: ultimaInstantanea.notasActivas,
        pistasRestantes: ultimaInstantanea.pistasRestantes,
      };
    });
  }

  async function borrarCelda() {
    await aplicarCambio((actual) => {
      if (!esIndiceSudokuValido(actual.celdaSeleccionada)) {
        return actual;
      }

      const celdaActual = actual.celdas[actual.celdaSeleccionada];

      if (celdaActual.fija || (celdaActual.valor === null && celdaActual.notas.length === 0)) {
        return actual;
      }

      return {
        ...actual,
        celdas: actualizarCelda(actual.celdas, actual.celdaSeleccionada, {
          ...celdaActual,
          notas: [],
          valor: null,
        }),
        historial: limitarHistorialSudoku([
          ...actual.historial,
          crearInstantaneaSudoku(actual.celdas, actual.pistasRestantes, actual.notasActivas),
        ]),
      };
    });
  }

  async function ingresarNumero(numero: SudokuNumero) {
    await aplicarCambio((actual) => {
      if (!esIndiceSudokuValido(actual.celdaSeleccionada)) {
        return actual;
      }

      const indice = actual.celdaSeleccionada;
      const celdaActual = actual.celdas[indice];

      if (celdaActual.fija) {
        return actual;
      }

      if (actual.notasActivas) {
        if (celdaActual.valor !== null) {
          return actual;
        }

        const notas = celdaActual.notas.includes(numero)
          ? celdaActual.notas.filter((nota) => nota !== numero)
          : normalizarNotasSudoku([...celdaActual.notas, numero]);

        return {
          ...actual,
          celdas: actualizarCelda(actual.celdas, indice, {
            ...celdaActual,
            notas,
          }),
          historial: limitarHistorialSudoku([
            ...actual.historial,
            crearInstantaneaSudoku(actual.celdas, actual.pistasRestantes, actual.notasActivas),
          ]),
        };
      }

      if (celdaActual.valor === numero && celdaActual.notas.length === 0) {
        return actual;
      }

      return {
        ...actual,
        celdas: actualizarCelda(actual.celdas, indice, {
          ...celdaActual,
          notas: [],
          valor: numero,
        }),
        historial: limitarHistorialSudoku([
          ...actual.historial,
          crearInstantaneaSudoku(actual.celdas, actual.pistasRestantes, actual.notasActivas),
        ]),
      };
    });
  }

  async function usarPista() {
    await aplicarCambio((actual) => {
      if (actual.pistasRestantes <= 0) {
        return actual;
      }

      const indiceObjetivo =
        esIndiceSudokuValido(actual.celdaSeleccionada) &&
        !actual.celdas[actual.celdaSeleccionada].fija &&
        actual.celdas[actual.celdaSeleccionada].valor !== actual.solucion[actual.celdaSeleccionada]
          ? actual.celdaSeleccionada
          : actual.celdas.findIndex(
              (celda, indice) => !celda.fija && celda.valor !== actual.solucion[indice]
            );

      if (!esIndiceSudokuValido(indiceObjetivo)) {
        return actual;
      }

      const celdaActual = actual.celdas[indiceObjetivo];

      return {
        ...actual,
        celdaSeleccionada: indiceObjetivo,
        celdas: actualizarCelda(actual.celdas, indiceObjetivo, {
          ...celdaActual,
          notas: [],
          valor: actual.solucion[indiceObjetivo],
        }),
        historial: limitarHistorialSudoku([
          ...actual.historial,
          crearInstantaneaSudoku(actual.celdas, actual.pistasRestantes, actual.notasActivas),
        ]),
        pistasRestantes: actual.pistasRestantes - 1,
      };
    });
  }

  const indicesErroneos = useMemo(() => {
    if (!ajustes.mostrarErrores || !partida) {
      return [] as number[];
    }

    return partida.celdas.flatMap((celda, indice) => {
      if (celda.fija || celda.valor === null || celda.valor === partida.solucion[indice]) {
        return [];
      }

      return [indice];
    });
  }, [ajustes.mostrarErrores, partida]);

  const indicesRelacionados = useMemo(() => {
    if (!partida || !esIndiceSudokuValido(partida.celdaSeleccionada)) {
      return [] as number[];
    }

    return obtenerIndicesRelacionadosSudoku(partida.celdaSeleccionada);
  }, [partida]);

  const indicesMismoValor = useMemo(() => {
    if (!partida || !esIndiceSudokuValido(partida.celdaSeleccionada)) {
      return [] as number[];
    }

    const valorSeleccionado = partida.celdas[partida.celdaSeleccionada].valor;

    if (valorSeleccionado === null) {
      return [];
    }

    return partida.celdas.flatMap((celda, indice) =>
      celda.valor === valorSeleccionado ? [indice] : []
    );
  }, [partida]);

  return {
    alternarNotas,
    alternarPausa,
    borrarCelda,
    cargando,
    cerrarCelebracion,
    completadaReciente,
    deshacer,
    error,
    estadisticas,
    indicesErroneos,
    indicesMismoValor,
    indicesRelacionados,
    ingresarNumero,
    partida,
    puedeDeshacer: (partida?.historial.length ?? 0) > 0,
    refrescar: cargar,
    seleccionarCelda,
    usarPista,
  };
}
