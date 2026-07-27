import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { PropsWithChildren, ReactNode } from "react";

import { branding } from "@/src/config/branding";
import { useTema } from "@/src/hooks/use-tema";

interface PantallaProps extends PropsWithChildren {
  aviso?: string | null;
  cabecera?: ReactNode;
}

export function Pantalla({ aviso, cabecera, children }: PantallaProps) {
  const { colores, modoOscuro } = useTema();

  return (
    <SafeAreaView style={{ backgroundColor: colores.fondoApp, flex: 1, position: "relative" }}>
      <View
        pointerEvents="none"
        style={{
          bottom: 0,
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
          zIndex: 0,
        }}
      >
        <View
          style={{
            backgroundColor: colores.resalteGrupo,
            borderRadius: 999,
            height: 220,
            opacity: modoOscuro ? 0.22 : 0.6,
            position: "absolute",
            right: -48,
            top: -74,
            width: 220,
          }}
        />
        <View
          style={{
            backgroundColor: colores.resalteCelda,
            borderRadius: 999,
            bottom: -54,
            height: 180,
            left: -36,
            opacity: modoOscuro ? 0.18 : 0.46,
            position: "absolute",
            width: 180,
          }}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 16,
            paddingVertical: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            width: "100%",
            zIndex: 1,
          }}
        >
          <View style={{ maxWidth: branding.layout.anchoTarjetaAuth, width: "100%" }}>
            {cabecera ? <View style={{ marginBottom: 20 }}>{cabecera}</View> : null}

            {aviso ? (
              <View
                style={{
                  backgroundColor: colores.advertenciaFondo,
                  borderColor: colores.advertenciaBorde,
                  borderRadius: 18,
                  borderWidth: 1,
                  marginBottom: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    color: colores.advertenciaTexto,
                    fontFamily: branding.tipografia.cuerpoMedio,
                    fontSize: 14,
                  }}
                >
                  {aviso}
                </Text>
              </View>
            ) : null}

            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
