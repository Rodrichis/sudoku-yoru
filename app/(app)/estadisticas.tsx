import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Text, View } from "react-native";

import { SudokuPage } from "@/src/components/sudoku/sudoku-page";
import { SudokuPanel } from "@/src/components/sudoku/sudoku-panel";
import { SudokuStatCard } from "@/src/components/sudoku/sudoku-stat-card";
import { SudokuWeeklyChart } from "@/src/components/sudoku/sudoku-weekly-chart";
import { PantallaCarga } from "@/src/components/ui/pantalla-carga";
import { branding } from "@/src/config/branding";
import { useSesion } from "@/src/hooks/use-sesion";
import { useSudokuEstadisticas } from "@/src/hooks/use-sudoku-estadisticas";
import { useTextos } from "@/src/hooks/use-textos";
import { obtenerTiempoPromedioSudoku } from "@/src/services/sudoku-estadisticas";
import { construirActividadSemanal, formatearDuracion } from "@/src/utils/sudoku";

export default function StatsScreen() {
  const textos = useTextos();
  const { perfilId } = useSesion();
  const { cargando, estadisticas } = useSudokuEstadisticas(perfilId);

  const actividad = useMemo(() => {
    if (!estadisticas) {
      return [];
    }

    return construirActividadSemanal(estadisticas.actividadDiaria, estadisticas.historialTiempos);
  }, [estadisticas]);

  if (cargando || !estadisticas) {
    return <PantallaCarga texto={textos.general.cargando} />;
  }

  const promedio = obtenerTiempoPromedioSudoku(estadisticas);
  const exito =
    estadisticas.partidasJugadas > 0
      ? `${Math.round((estadisticas.partidasGanadas / estadisticas.partidasJugadas) * 100)}% de exito`
      : textos.general.sinDatos;

  return (
    <SudokuPage>
      <View
        className="px-5 pt-5"
        style={{ maxWidth: branding.layout.anchoContenido, width: "100%" }}
      >
        <View className="flex-row items-center justify-between">
          <Ionicons color={branding.colores.primario} name="grid-outline" size={24} />
          <Text
            className="text-[30px]"
            style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.titulo }}
          >
            {branding.app.nombre}
          </Text>
          <Ionicons color={branding.colores.primario} name="leaf-outline" size={24} />
        </View>

        <Text
          className="mt-8 text-center text-[46px]"
          style={{ color: branding.colores.primario, fontFamily: branding.tipografia.tituloFuerte }}
        >
          {textos.sudoku.stats.progresoTitulo}
        </Text>
        <Text
          className="mt-1 text-center text-[16px]"
          style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
        >
          {textos.sudoku.stats.progresoSubtitulo}
        </Text>

        <View className="mt-8 flex-row gap-3">
          <SudokuStatCard
            etiqueta={textos.sudoku.stats.partidas}
            valor={estadisticas.partidasJugadas.toString()}
          />
          <SudokuStatCard
            etiqueta={textos.sudoku.stats.victorias}
            nota={exito}
            valor={estadisticas.partidasGanadas.toString()}
          />
        </View>

        <View className="mt-3">
          <SudokuPanel>
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className="text-xs uppercase tracking-[2px]"
                  style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
                >
                  {textos.sudoku.stats.rachaActual}
                </Text>
                <Text
                  className="mt-1 text-[32px]"
                  style={{ color: branding.colores.secundario, fontFamily: branding.tipografia.tituloMedio }}
                >
                  {estadisticas.rachaActual}
                </Text>
              </View>
              <Ionicons color={branding.colores.secundario} name="flame-outline" size={24} />
            </View>

            <View
              className="mt-5 flex-row justify-between pt-4"
              style={{ borderTopColor: branding.colores.bordeSuave, borderTopWidth: 0.8 }}
            >
              <View>
                <Text
                  className="text-xs uppercase tracking-[2px]"
                  style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
                >
                  {textos.sudoku.stats.mejorTiempo}
                </Text>
                <Text
                  className="mt-2 text-[28px]"
                  style={{ color: branding.colores.primario, fontFamily: branding.tipografia.tituloMedio }}
                >
                  {estadisticas.mejorTiempoSegundos !== null
                    ? formatearDuracion(estadisticas.mejorTiempoSegundos)
                    : "--:--"}
                </Text>
              </View>

              <View>
                <Text
                  className="text-xs uppercase tracking-[2px]"
                  style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
                >
                  {textos.sudoku.stats.promedio}
                </Text>
                <Text
                  className="mt-2 text-[28px]"
                  style={{ color: branding.colores.primario, fontFamily: branding.tipografia.tituloMedio }}
                >
                  {promedio !== null ? formatearDuracion(promedio) : "--:--"}
                </Text>
              </View>
            </View>
          </SudokuPanel>
        </View>

        <Text
          className="mt-10 text-[32px]"
          style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.tituloMedio }}
        >
          {textos.sudoku.stats.actividadSemanal}
        </Text>

        <View className="mt-4">
          <SudokuWeeklyChart
            datos={actividad}
            etiquetaIntentos={textos.sudoku.stats.intentos}
            etiquetaResueltos={textos.sudoku.stats.resueltos}
          />
        </View>

        <View className="mt-6">
          <SudokuPanel>
            <Text
              className="text-[28px] italic leading-10"
              style={{ color: branding.colores.textoSecundario, fontFamily: branding.tipografia.tituloMedio }}
            >
              {textos.sudoku.stats.quote}
            </Text>
          </SudokuPanel>
        </View>
      </View>
    </SudokuPage>
  );
}
