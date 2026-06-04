import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { Pressable, Text, Vibration, View } from "react-native";

import { SudokuAdBanner } from "@/src/components/sudoku/sudoku-ad-banner";
import { SudokuBoard } from "@/src/components/sudoku/sudoku-board";
import { SudokuNumberPad } from "@/src/components/sudoku/sudoku-number-pad";
import { SudokuPage } from "@/src/components/sudoku/sudoku-page";
import { SudokuPanel } from "@/src/components/sudoku/sudoku-panel";
import { SudokuToolbar } from "@/src/components/sudoku/sudoku-toolbar";
import { PantallaCarga } from "@/src/components/ui/pantalla-carga";
import { SUDOKU_DIFICULTADES, SUDOKU_ORDEN_DIFICULTADES } from "@/src/constants/sudoku";
import { branding } from "@/src/config/branding";
import { useSesion } from "@/src/hooks/use-sesion";
import { useSudokuAjustes } from "@/src/hooks/use-sudoku-ajustes";
import { useSudokuJuego } from "@/src/hooks/use-sudoku-juego";
import { useSudokuSonidos } from "@/src/hooks/use-sudoku-sonidos";
import { useTextos } from "@/src/hooks/use-textos";
import type { SudokuDificultad } from "@/src/types/sudoku";
import { formatearDuracion } from "@/src/utils/sudoku";

function resolverDificultad(valor?: string | string[]) {
  const valorNormalizado = Array.isArray(valor) ? valor[0] : valor;
  return SUDOKU_ORDEN_DIFICULTADES.find((item) => item === valorNormalizado) ?? null;
}

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ dificultad?: string; nueva?: string }>();
  const textos = useTextos();
  const { perfilId } = useSesion();
  const { ajustes } = useSudokuAjustes();
  const { reproducirToque, reproducirVictoria } = useSudokuSonidos(ajustes.sonidos);
  const dificultadInicial = useMemo(
    () => resolverDificultad(params.dificultad) as SudokuDificultad | null,
    [params.dificultad]
  );
  const forzarNuevaPartida = params.nueva === "1";
  const {
    alternarNotas,
    alternarPausa,
    borrarCelda,
    cargando,
    cerrarCelebracion,
    completadaReciente,
    deshacer,
    error,
    indicesErroneos,
    indicesMismoValor,
    indicesRelacionados,
    ingresarNumero,
    partida,
    puedeDeshacer,
    seleccionarCelda,
    usarPista,
  } = useSudokuJuego({
    ajustes,
    dificultadInicial,
    forzarNuevaPartida,
    perfilId,
  });

  useEffect(() => {
    if (forzarNuevaPartida) {
      router.replace("/(app)/juego");
    }
  }, [forzarNuevaPartida, router]);

  useEffect(() => {
    if (!completadaReciente) {
      return;
    }

    reproducirVictoria();

    if (ajustes.vibracion) {
      Vibration.vibrate(30);
    }
  }, [ajustes.vibracion, completadaReciente, reproducirVictoria]);

  if (cargando) {
    return <PantallaCarga texto={textos.general.cargando} />;
  }

  if (!partida) {
    return (
      <SudokuPage>
        <View className="flex-1 justify-center px-5" style={{ maxWidth: 360, width: "100%" }}>
          <SudokuPanel>
            <Text
              className="text-center text-3xl"
              style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.titulo }}
            >
              {textos.sudoku.juego.errorSinPartida}
            </Text>
            {error ? (
              <Text
                className="mt-4 text-center text-sm"
                style={{ color: branding.colores.error, fontFamily: branding.tipografia.cuerpo }}
              >
                {error}
              </Text>
            ) : null}
            <Pressable
              className="mt-6 items-center"
              onPress={() => router.replace("/(app)/nueva-partida")}
              style={{
                backgroundColor: branding.colores.primario,
                borderRadius: 999,
                paddingVertical: 14,
              }}
            >
              <Text
                className="text-[14px] uppercase tracking-[1.6px]"
                style={{ color: branding.colores.textoInvertido, fontFamily: branding.tipografia.cuerpoSemi }}
              >
                {textos.sudoku.juego.sinPartidaAccion}
              </Text>
            </Pressable>
          </SudokuPanel>
        </View>
      </SudokuPage>
    );
  }

  const configuracionDificultad = SUDOKU_DIFICULTADES[partida.dificultad];

  function feedbackLigero() {
    reproducirToque();

    if (ajustes.vibracion) {
      Vibration.vibrate(10);
    }
  }

  return (
    <SudokuPage scroll={false}>
      <View
        className="flex-1 px-5 pt-4"
        style={{ maxWidth: branding.layout.anchoContenido, width: "100%" }}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center gap-3">
            <Pressable className="pt-1" onPress={() => router.replace("/(app)")}>
              <Ionicons color={branding.colores.primario} name="grid-outline" size={24} />
            </Pressable>
            <View>
              <Text
                className="text-[20px]"
                style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.tituloMedio }}
              >
                {branding.app.nombre}
              </Text>
              <Text
                className="text-[12px]"
                style={{ color: branding.colores.textoSecundario, fontFamily: branding.tipografia.cuerpo }}
              >
                {configuracionDificultad.titulo}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="items-end">
              <Text
                className="text-[10px] uppercase tracking-[2px]"
                style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpoSemi }}
              >
                {textos.sudoku.juego.timer}
              </Text>
              <Text
                className="text-[18px]"
                style={{ color: branding.colores.primario, fontFamily: branding.tipografia.cuerpo }}
              >
                {formatearDuracion(partida.segundosTranscurridos)}
              </Text>
            </View>
            <Pressable onPress={() => void alternarPausa()}>
              <Ionicons
                color={branding.colores.primario}
                name={partida.pausada ? "play-circle-outline" : "pause-circle-outline"}
                size={28}
              />
            </Pressable>
            <Pressable className="pt-1" onPress={() => router.push("/(app)/ajustes")}>
              <Ionicons color={branding.colores.primario} name="settings-outline" size={24} />
            </Pressable>
          </View>
        </View>

        <View className="mt-5">
          <SudokuAdBanner />
        </View>

        <View className="mt-7 items-center">
          <View className="w-full" style={{ maxWidth: 380 }}>
            <SudokuBoard
              celdas={partida.celdas}
              deshabilitado={partida.pausada || partida.finalizada}
              indicesErroneos={indicesErroneos}
              indicesMismoValor={indicesMismoValor}
              indicesRelacionados={indicesRelacionados}
              indiceSeleccionado={partida.celdaSeleccionada}
              onPressCelda={(indice) => {
                feedbackLigero();
                void seleccionarCelda(indice);
              }}
            />
          </View>
        </View>

        <View className="mt-7">
          <SudokuToolbar
            notasActivas={partida.notasActivas}
            onBorrar={() => {
              feedbackLigero();
              void borrarCelda();
            }}
            onDeshacer={() => {
              feedbackLigero();
              void deshacer();
            }}
            onNotas={() => {
              feedbackLigero();
              void alternarNotas();
            }}
            onPista={() => {
              feedbackLigero();
              void usarPista();
            }}
            puedeDeshacer={puedeDeshacer}
            pistasRestantes={partida.pistasRestantes}
          />
        </View>

        <View className="mt-6">
          <SudokuNumberPad
            onPressNumero={(numero) => {
              feedbackLigero();
              void ingresarNumero(numero);
            }}
          />
        </View>
      </View>

      {partida.pausada ? (
        <View
          className="absolute inset-0 items-center justify-center px-6"
          style={{ backgroundColor: branding.colores.backdrop }}
        >
          <SudokuPanel estilo={{ maxWidth: 360, width: "100%" }}>
            <Text
              className="text-center text-4xl"
              style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.titulo }}
            >
              {textos.sudoku.juego.pausaTitulo}
            </Text>
            <Text
              className="mt-4 text-center text-base leading-7"
              style={{ color: branding.colores.textoSecundario, fontFamily: branding.tipografia.cuerpo }}
            >
              {textos.sudoku.juego.pausaTexto}
            </Text>
            <Pressable
              className="mt-6 items-center"
              onPress={() => {
                void alternarPausa();
              }}
              style={{
                backgroundColor: branding.colores.primario,
                borderRadius: 999,
                paddingVertical: 14,
              }}
            >
              <Text
                className="text-[14px] uppercase tracking-[1.6px]"
                style={{ color: branding.colores.textoInvertido, fontFamily: branding.tipografia.cuerpoSemi }}
              >
                {textos.sudoku.juego.reanudar}
              </Text>
            </Pressable>
          </SudokuPanel>
        </View>
      ) : null}

      {completadaReciente ? (
        <View
          className="absolute inset-0 items-center justify-center px-6"
          style={{ backgroundColor: branding.colores.backdrop }}
        >
          <SudokuPanel estilo={{ maxWidth: 360, width: "100%" }}>
            <Text
              className="text-center text-4xl"
              style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.titulo }}
            >
              {textos.sudoku.juego.victoriaTitulo}
            </Text>
            <Text
              className="mt-4 text-center text-base leading-7"
              style={{ color: branding.colores.textoSecundario, fontFamily: branding.tipografia.cuerpo }}
            >
              {textos.sudoku.juego.victoriaTexto}
            </Text>
            <Pressable
              className="mt-6 items-center"
              onPress={() => {
                cerrarCelebracion();
                router.replace("/(app)");
              }}
              style={{
                backgroundColor: branding.colores.primario,
                borderRadius: 999,
                paddingVertical: 14,
              }}
            >
              <Text
                className="text-[14px] uppercase tracking-[1.6px]"
                style={{ color: branding.colores.textoInvertido, fontFamily: branding.tipografia.cuerpoSemi }}
              >
                {textos.sudoku.juego.victoriaAccion}
              </Text>
            </Pressable>
          </SudokuPanel>
        </View>
      ) : null}
    </SudokuPage>
  );
}
