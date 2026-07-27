import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { Linking, Pressable, Text, View } from "react-native";
import { useState } from "react";

import { SudokuPage } from "@/src/components/sudoku/sudoku-page";
import { SudokuPanel } from "@/src/components/sudoku/sudoku-panel";
import { SudokuToggleRow } from "@/src/components/sudoku/sudoku-toggle-row";
import { PantallaCarga } from "@/src/components/ui/pantalla-carga";
import { branding } from "@/src/config/branding";
import { env } from "@/src/config/env";
import { useSesion } from "@/src/hooks/use-sesion";
import { useSudokuAjustes } from "@/src/hooks/use-sudoku-ajustes";
import { useTema } from "@/src/hooks/use-tema";
import { useTextos } from "@/src/hooks/use-textos";

export default function SettingsScreen() {
  const textos = useTextos();
  const { cargando, ajustes, actualizarAjustes } = useSudokuAjustes();
  const { esInvitado, salirSesionActual } = useSesion();
  const { aplicarModoOscuro } = useTema();
  const [errorEnlace, setErrorEnlace] = useState<string | null>(null);
  const version = Constants.expoConfig?.version ?? "1.0.0";
  const politicaPrivacidadUrl = env.EXPO_PUBLIC_PRIVACY_POLICY_URL.trim();
  const politicaDisponible = politicaPrivacidadUrl.startsWith("https://");

  if (cargando) {
    return <PantallaCarga texto={textos.general.cargando} />;
  }

  return (
    <SudokuPage>
      <View
        className="px-5 pt-5"
        style={{ maxWidth: branding.layout.anchoContenido, width: "100%" }}
      >
        <View className="flex-row items-center justify-between">
          <Ionicons color={branding.colores.primario} name="grid-outline" size={24} />
          <Text
            className="text-[28px]"
            style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.tituloFuerte }}
          >
            {textos.sudoku.home.ajustes}
          </Text>
          <Ionicons color={branding.colores.primario} name="leaf-outline" size={22} />
        </View>

        <Text
          className="mb-4 mt-10 text-xs uppercase tracking-[2.6px]"
          style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
        >
          {textos.sudoku.settings.experiencia}
        </Text>

        <SudokuPanel estilo={{ paddingHorizontal: 0, paddingVertical: 0 }}>
          <SudokuToggleRow
            activo={ajustes.modoOscuro}
            icono={<Ionicons color={branding.colores.primario} name="moon-outline" size={22} />}
            onPress={() => {
              const siguienteModoOscuro = !ajustes.modoOscuro;
              aplicarModoOscuro(siguienteModoOscuro);
              void actualizarAjustes({ modoOscuro: siguienteModoOscuro }).catch(() => {
                aplicarModoOscuro(ajustes.modoOscuro);
              });
            }}
            titulo={textos.sudoku.settings.darkMode}
          />
          <SudokuToggleRow
            activo={ajustes.mostrarErrores}
            icono={<Ionicons color={branding.colores.primario} name="alert-circle-outline" size={22} />}
            onPress={() => {
              void actualizarAjustes({ mostrarErrores: !ajustes.mostrarErrores });
            }}
            titulo={textos.sudoku.settings.visualizarErrores}
          />
          <SudokuToggleRow
            activo={ajustes.sonidos}
            icono={<Ionicons color={branding.colores.primario} name="volume-medium-outline" size={22} />}
            onPress={() => {
              void actualizarAjustes({ sonidos: !ajustes.sonidos });
            }}
            titulo={textos.sudoku.settings.sonidos}
          />
          <SudokuToggleRow
            activo={ajustes.vibracion}
            icono={<Ionicons color={branding.colores.primario} name="phone-portrait-outline" size={22} />}
            onPress={() => {
              void actualizarAjustes({ vibracion: !ajustes.vibracion });
            }}
            titulo={textos.sudoku.settings.vibracion}
          />
        </SudokuPanel>

        <Text
          className="mb-4 mt-10 text-xs uppercase tracking-[2.6px]"
          style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
        >
          {textos.sudoku.settings.suscripcion}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          className="flex-row items-center justify-between px-5 py-5"
          disabled
          onPress={() => undefined}
          style={{
            backgroundColor: branding.colores.primario,
            borderRadius: branding.layout.radioTarjeta,
            opacity: 0.68,
          }}
        >
          <View className="flex-row items-center gap-3">
            <Ionicons color={branding.colores.textoInvertido} name="sparkles-outline" size={20} />
            <Text
              className="text-[16px]"
              style={{ color: branding.colores.textoInvertido, fontFamily: branding.tipografia.cuerpoSemi }}
            >
              {textos.sudoku.settings.eliminarPublicidad}
            </Text>
          </View>
          <Ionicons color={branding.colores.textoInvertido} name="chevron-forward-outline" size={20} />
        </Pressable>

        <Text
          className="mt-3 text-sm leading-6"
          style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
        >
          {textos.sudoku.settings.placeholderPago}
        </Text>

        <Text
          className="mb-4 mt-10 text-xs uppercase tracking-[2.6px]"
          style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
        >
          {textos.sudoku.settings.informacion}
        </Text>

        <SudokuPanel>
          <Pressable
            accessibilityRole="link"
            accessibilityState={{ disabled: !politicaDisponible }}
            className="flex-row items-center justify-between py-2"
            disabled={!politicaDisponible}
            onPress={() => {
              setErrorEnlace(null);
              void Linking.openURL(politicaPrivacidadUrl).catch(() => {
                setErrorEnlace(textos.sudoku.settings.errorEnlace);
              });
            }}
          >
            <View className="flex-1 pr-4">
              <Text
                className="text-[17px]"
                style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.cuerpo }}
              >
                {textos.sudoku.settings.politicaPrivacidad}
              </Text>
              <Text
                className="mt-2 text-sm leading-6"
                style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
              >
                {politicaDisponible
                  ? textos.sudoku.settings.politicaPrivacidadTexto
                  : textos.sudoku.settings.politicaPrivacidadPendiente}
              </Text>
            </View>
            {politicaDisponible ? (
              <Ionicons color={branding.colores.textoSuave} name="chevron-forward-outline" size={20} />
            ) : null}
          </Pressable>

          {errorEnlace ? (
            <Text
              accessibilityLiveRegion="polite"
              className="mt-3 text-sm"
              style={{ color: branding.colores.error, fontFamily: branding.tipografia.cuerpoMedio }}
            >
              {errorEnlace}
            </Text>
          ) : null}

          <View
            className="my-4"
            style={{ borderBottomColor: branding.colores.bordeSuave, borderBottomWidth: 0.6 }}
          />

          <View className="flex-row items-center justify-between py-2">
            <View className="flex-1 pr-4">
              <Text
                className="text-[17px]"
                style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.cuerpo }}
              >
                {textos.sudoku.settings.acerca}
              </Text>
              <Text
                className="mt-2 text-sm leading-6"
                style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
              >
                {textos.sudoku.settings.acercaTexto}
              </Text>
            </View>
            <Ionicons color={branding.colores.textoSuave} name="information-circle-outline" size={20} />
          </View>
        </SudokuPanel>

        <Pressable
          className="mt-8 items-center"
          onPress={() => {
            void salirSesionActual();
          }}
          style={{
            backgroundColor: branding.colores.fondoElevado,
            borderColor: branding.colores.bordeSuave,
            borderRadius: 999,
            borderWidth: 0.8,
            paddingVertical: 14,
          }}
        >
          <Text
            className="text-[14px] uppercase tracking-[1.4px]"
            style={{ color: branding.colores.textoPrimario, fontFamily: branding.tipografia.cuerpoSemi }}
          >
            {esInvitado
              ? textos.sudoku.settings.cerrarSesionInvitado
              : textos.sudoku.settings.cerrarSesionCuenta}
          </Text>
        </Pressable>

        <Text
          className="pb-4 pt-10 text-center text-sm leading-6"
          style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
        >
          {branding.app.nombre} v{version}
          {"\n"}
          {textos.sudoku.settings.hechoConCalma}
        </Text>
      </View>
    </SudokuPage>
  );
}
