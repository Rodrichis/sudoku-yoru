import "../global.css";
import "react-native-gesture-handler";
import "react-native-reanimated";

import * as WebBrowser from "expo-web-browser";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";

import { branding } from "@/src/config/branding";
import { SesionProvider } from "@/src/contexts/sesion-contexto";
import { NotificacionesProvider } from "@/src/providers/notificaciones-provider";

WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    document.body.style.backgroundColor = branding.colores.fondoApp;
    document.body.style.color = branding.colores.textoPrimario;
  }, []);

  return (
    <SafeAreaProvider>
      <SesionProvider>
        <NotificacionesProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="dark" />
        </NotificacionesProvider>
      </SesionProvider>
    </SafeAreaProvider>
  );
}
