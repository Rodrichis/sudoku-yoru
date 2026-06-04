import { ActivityIndicator, Text, View } from "react-native";

import { branding } from "@/src/config/branding";
import { useTema } from "@/src/hooks/use-tema";

export function PantallaCarga({ texto }: { texto: string }) {
  const { colores } = useTema();

  return (
    <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: colores.fondoApp }}>
      <View
        className="w-full max-w-sm p-6 shadow-sm"
        style={{
          backgroundColor: colores.superficie,
          borderColor: colores.bordeSuave,
          borderRadius: branding.layout.radioTarjeta,
          borderWidth: 1,
        }}
      >
        <ActivityIndicator color={colores.primario} size="large" />
        <Text
          className="mt-4 text-center text-base"
          style={{ color: colores.textoSecundario, fontFamily: branding.tipografia.cuerpoMedio }}
        >
          {texto}
        </Text>
      </View>
    </View>
  );
}
