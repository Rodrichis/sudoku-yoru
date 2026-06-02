import { ActivityIndicator, Text, View } from "react-native";

import { branding } from "@/src/config/branding";

export function PantallaCarga({ texto }: { texto: string }) {
  return (
    <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: branding.colores.fondoApp }}>
      <View
        className="w-full max-w-sm p-6 shadow-sm"
        style={{
          backgroundColor: branding.colores.superficie,
          borderColor: branding.colores.bordeSuave,
          borderRadius: 24,
          borderWidth: 1,
        }}
      >
        <ActivityIndicator color={branding.colores.primario} size="large" />
        <Text
          className="mt-4 text-center text-base font-medium"
          style={{ color: branding.colores.textoSecundario }}
        >
          {texto}
        </Text>
      </View>
    </View>
  );
}
