import { Text, View } from "react-native";

import { branding } from "@/src/config/branding";

interface FichaResumenProps {
  label: string;
  value: string;
}

export function FichaResumen({ label, value }: FichaResumenProps) {
  return (
    <View
      className="min-h-24 flex-1 px-4 py-4"
      style={{
        backgroundColor: branding.colores.superficie,
        borderColor: branding.colores.bordeSuave,
        borderRadius: 24,
        borderWidth: 1,
      }}
    >
      <Text
        className="text-xs font-semibold uppercase tracking-[1.5px]"
        style={{ color: branding.colores.textoSuave }}
      >
        {label}
      </Text>
      <Text className="mt-2 text-lg font-bold" style={{ color: branding.colores.textoPrimario }}>
        {value}
      </Text>
    </View>
  );
}
