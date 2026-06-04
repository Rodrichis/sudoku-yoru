import "../global.css";
import "react-native-gesture-handler";
import "react-native-reanimated";

import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from "@expo-google-fonts/playfair-display";
import { useFonts } from "expo-font";
import * as WebBrowser from "expo-web-browser";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";

import { SesionProvider } from "@/src/contexts/sesion-contexto";
import { TemaProvider } from "@/src/contexts/tema-contexto";
import { useTema } from "@/src/hooks/use-tema";
import { NotificacionesProvider } from "@/src/providers/notificaciones-provider";

WebBrowser.maybeCompleteAuthSession();

function AppShell() {
  const { colores, modoOscuro } = useTema();

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    document.body.style.backgroundColor = colores.fondoApp;
    document.body.style.color = colores.textoPrimario;
  }, [colores.fondoApp, colores.textoPrimario]);

  return (
    <NotificacionesProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style={modoOscuro ? "light" : "dark"} />
    </NotificacionesProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <TemaProvider>
        <SesionProvider>
          <AppShell />
        </SesionProvider>
      </TemaProvider>
    </SafeAreaProvider>
  );
}
