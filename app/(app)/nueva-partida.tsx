import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { SudokuDifficultyCard } from "@/src/components/sudoku/sudoku-difficulty-card";
import { SudokuConfirmDialog } from "@/src/components/sudoku/sudoku-confirm-dialog";
import { SudokuPage } from "@/src/components/sudoku/sudoku-page";
import { SUDOKU_DIFICULTADES, SUDOKU_ORDEN_DIFICULTADES } from "@/src/constants/sudoku";
import { branding } from "@/src/config/branding";
import { useSesion } from "@/src/hooks/use-sesion";
import { useSudokuResumen } from "@/src/hooks/use-sudoku-resumen";
import { useTextos } from "@/src/hooks/use-textos";
import type { SudokuDificultad } from "@/src/types/sudoku";

export default function NewGameScreen() {
  const router = useRouter();
  const textos = useTextos();
  const { perfilId } = useSesion();
  const {
    cargando: cargandoResumen,
    error: errorResumen,
    refrescar: refrescarResumen,
    resumen,
  } = useSudokuResumen(perfilId);
  const [confirmacionVisible, setConfirmacionVisible] = useState(false);
  const [dificultadSeleccionada, setDificultadSeleccionada] = useState<SudokuDificultad>("medio");

  function navegarPartida() {
    router.replace({
      params: { dificultad: dificultadSeleccionada, nueva: "1" },
      pathname: "/(app)/juego",
    });
  }

  function iniciarPartida() {
    if (resumen.existe && !resumen.finalizada) {
      setConfirmacionVisible(true);
      return;
    }

    navegarPartida();
  }

  return (
    <SudokuPage conNavegacion={false}>
      <View
        className="px-5 pb-12 pt-4"
        style={{ maxWidth: branding.layout.anchoContenido, width: "100%" }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Ionicons color={branding.colores.primario} name="grid-outline" size={24} />
          </Pressable>
          <Text
            className="text-[28px]"
            style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.titulo }}
          >
            {branding.app.nombre}
          </Text>
          <Ionicons color={branding.colores.primario} name="leaf-outline" size={22} />
        </View>

        <View className="mb-8 mt-10">
          <Text
            className="text-[42px]"
            style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.tituloFuerte }}
          >
            {textos.sudoku.nuevaPartida.titulo}
          </Text>
          <Text
            className="mt-1 text-[18px]"
            style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
          >
            {textos.sudoku.nuevaPartida.subtitulo}
          </Text>
        </View>

        <View>
          {SUDOKU_ORDEN_DIFICULTADES.map((dificultad) => (
            <SudokuDifficultyCard
              key={dificultad}
              descripcion={SUDOKU_DIFICULTADES[dificultad].descripcionCorta}
              dificultad={dificultad}
              objetivoMinutos={SUDOKU_DIFICULTADES[dificultad].objetivoMinutos}
              onPress={setDificultadSeleccionada}
              seleccionada={dificultad === dificultadSeleccionada}
              titulo={SUDOKU_DIFICULTADES[dificultad].titulo}
            />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: cargandoResumen || Boolean(errorResumen) }}
          className="mt-10 items-center"
          disabled={cargandoResumen || Boolean(errorResumen)}
          onPress={iniciarPartida}
          style={{
            backgroundColor: branding.colores.primario,
            borderRadius: 999,
            opacity: cargandoResumen || errorResumen ? 0.55 : 1,
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}
        >
          <Text
            className="text-[14px] uppercase tracking-[2px]"
            style={{ color: branding.colores.textoInvertido, fontFamily: branding.tipografia.cuerpoSemi }}
          >
            {textos.sudoku.nuevaPartida.iniciar}
          </Text>
        </Pressable>

        {errorResumen ? (
          <Pressable
            accessibilityRole="button"
            className="mt-4 items-center"
            onPress={() => {
              void refrescarResumen();
            }}
          >
            <Text
              accessibilityLiveRegion="polite"
              className="text-center text-sm"
              style={{ color: branding.colores.error, fontFamily: branding.tipografia.cuerpoMedio }}
            >
              {textos.sudoku.home.errorPartida} {textos.sudoku.stats.reintentar}
            </Text>
          </Pressable>
        ) : null}
      </View>

      <SudokuConfirmDialog
        accion={textos.sudoku.nuevaPartida.reemplazar}
        cancelar={textos.general.cancelar}
        descripcion={textos.sudoku.nuevaPartida.confirmacionTexto}
        onCancelar={() => setConfirmacionVisible(false)}
        onConfirmar={() => {
          setConfirmacionVisible(false);
          navegarPartida();
        }}
        titulo={textos.sudoku.nuevaPartida.confirmacionTitulo}
        visible={confirmacionVisible}
      />
    </SudokuPage>
  );
}
