import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { PropsWithChildren, ReactNode } from "react";

import { branding } from "@/src/config/branding";

interface PantallaProps extends PropsWithChildren {
  aviso?: string | null;
  cabecera?: ReactNode;
}

export function Pantalla({ aviso, cabecera, children }: PantallaProps) {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: branding.colores.fondoApp }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1"
        >
          <View className="flex-1 justify-center px-5 py-8">
            {cabecera ? <View className="mb-6">{cabecera}</View> : null}

            {aviso ? (
              <View
                className="mb-4 rounded-2xl px-4 py-3"
                style={{
                  backgroundColor: branding.colores.advertenciaFondo,
                  borderColor: branding.colores.advertenciaBorde,
                  borderWidth: 1,
                }}
              >
                <Text className="text-sm font-medium" style={{ color: branding.colores.advertenciaTexto }}>
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
