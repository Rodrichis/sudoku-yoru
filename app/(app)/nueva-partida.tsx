import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { SudokuDifficultyCard } from "@/src/components/sudoku/sudoku-difficulty-card";
import { SudokuPage } from "@/src/components/sudoku/sudoku-page";
import { SUDOKU_DIFICULTADES, SUDOKU_ORDEN_DIFICULTADES } from "@/src/constants/sudoku";
import { branding } from "@/src/config/branding";
import { useTextos } from "@/src/hooks/use-textos";
import type { SudokuDificultad } from "@/src/types/sudoku";

export default function NewGameScreen() {
  const router = useRouter();
  const textos = useTextos();
  const [dificultadSeleccionada, setDificultadSeleccionada] = useState<SudokuDificultad>("medio");

  function iniciarPartida() {
    router.replace({
      params: { dificultad: dificultadSeleccionada, nueva: "1" },
      pathname: "/(app)/juego",
    });
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
          className="mt-10 items-center"
          onPress={iniciarPartida}
          style={{
            backgroundColor: branding.colores.primario,
            borderRadius: 999,
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
      </View>
    </SudokuPage>
  );
}
