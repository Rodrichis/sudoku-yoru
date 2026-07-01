import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { SudokuPage } from "@/src/components/sudoku/sudoku-page";
import { PantallaCarga } from "@/src/components/ui/pantalla-carga";
import { SUDOKU_DIFICULTADES } from "@/src/constants/sudoku";
import { branding } from "@/src/config/branding";
import { useSesion } from "@/src/hooks/use-sesion";
import { useSudokuResumen } from "@/src/hooks/use-sudoku-resumen";
import { useTextos } from "@/src/hooks/use-textos";
import { formatearDuracion } from "@/src/utils/sudoku";

export default function HomeScreen() {
  const router = useRouter();
  const textos = useTextos();
  const { perfilId } = useSesion();
  const { cargando: cargandoResumen, resumen } = useSudokuResumen(perfilId);

  if (cargandoResumen) {
    return <PantallaCarga texto={textos.general.cargando} />;
  }

  const puedeContinuar = resumen.existe && !resumen.finalizada;

  return (
    <SudokuPage>
      <View
        className="flex-1 px-5 pt-4"
        style={{ maxWidth: branding.layout.anchoContenido, width: "100%" }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View
              className="h-11 w-11 items-center justify-center rounded-full"
              style={{
                backgroundColor: branding.colores.fondoElevado,
                borderColor: branding.colores.bordeSuave,
                borderWidth: 0.8,
              }}
            >
              <Ionicons color={branding.colores.primario} name="leaf-outline" size={20} />
            </View>
            <Text
              className="text-[30px]"
              style={{
                color: branding.colores.textoPrimario,
                fontFamily: branding.tipografia.tituloFuerte,
              }}
            >
              {branding.app.nombre}
            </Text>
          </View>

          <View className="flex-row items-center gap-4">
            <Ionicons color={branding.colores.primario} name="leaf-outline" size={21} />
            <Ionicons color={branding.colores.textoSuave} name="grid-outline" size={22} />
          </View>
        </View>

        <View className="flex-1 items-center justify-center px-4 pb-16 pt-20">
          <Text
            className="text-center text-[28px] italic"
            style={{
              color: branding.colores.secundario,
              fontFamily: branding.tipografia.tituloMedio,
            }}
          >
            {textos.sudoku.home.subtituloSuave}
          </Text>
          <Text
            className="mt-2 text-center text-[18px]"
            style={{
              color: branding.colores.textoPrimario,
              fontFamily: branding.tipografia.cuerpo,
            }}
          >
            {textos.sudoku.home.subtituloFuerte}
          </Text>

          <View className="mt-12 w-full gap-3">
            {puedeContinuar ? (
              <>
                <Pressable
                  onPress={() => router.replace("/(app)/juego")}
                  style={{
                    backgroundColor: branding.colores.primario,
                    borderRadius: 6,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    paddingVertical: 18,
                  }}
                >
                  <Text
                    className="text-[15px] uppercase tracking-[1.2px]"
                    style={{
                      color: branding.colores.textoInvertido,
                      fontFamily: branding.tipografia.cuerpoSemi,
                    }}
                  >
                    {textos.sudoku.home.continuar}
                  </Text>
                  <Ionicons color={branding.colores.textoInvertido} name="play-outline" size={22} />
                </Pressable>

                <Text
                  className="text-center text-[12px]"
                  style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
                >
                  {`${SUDOKU_DIFICULTADES[resumen.dificultad].titulo} - ${formatearDuracion(
                    resumen.segundosTranscurridos
                  )}`}
                </Text>
              </>
            ) : (
              <Text
                className="text-center text-[12px]"
                style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
              >
                {textos.sudoku.home.sinPartida}
              </Text>
            )}

            <Pressable
              className="flex-row items-center gap-4 px-5 py-5"
              onPress={() => router.push("/(app)/nueva-partida")}
              style={{
                backgroundColor: branding.colores.fondoElevado,
                borderColor: branding.colores.bordeSuave,
                borderRadius: 6,
                borderWidth: 0.8,
              }}
            >
              <Ionicons color={branding.colores.primario} name="add-circle-outline" size={24} />
              <Text
                className="text-[16px]"
                style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.cuerpoSemi }}
              >
                {textos.sudoku.home.nuevaPartida}
              </Text>
            </Pressable>

            <Pressable
              className="flex-row items-center gap-4 px-5 py-5"
              onPress={() => router.push("/(app)/estadisticas")}
              style={{
                backgroundColor: branding.colores.fondoElevado,
                borderColor: branding.colores.bordeSuave,
                borderRadius: 6,
                borderWidth: 0.8,
              }}
            >
              <Ionicons color={branding.colores.primario} name="stats-chart-outline" size={24} />
              <Text
                className="text-[16px]"
                style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.cuerpoSemi }}
              >
                {textos.sudoku.home.estadisticas}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SudokuPage>
  );
}
