import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { branding } from "@/src/config/branding";
import { useTema } from "@/src/hooks/use-tema";
import { useTextos } from "@/src/hooks/use-textos";

export function SudokuAdBanner() {
  const textos = useTextos();
  const { colores } = useTema();

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: colores.fondoElevado,
        borderColor: colores.bordeSuave,
        borderRadius: 14,
        borderWidth: 0.6,
        flexDirection: "row",
        gap: 10,
        minHeight: 76,
        paddingHorizontal: 14,
        paddingVertical: 12,
      }}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: colores.superficie,
          borderRadius: 7,
          justifyContent: "center",
          paddingHorizontal: 9,
          paddingVertical: 5,
        }}
      >
        <Text
          className="text-xs font-semibold uppercase"
          style={{ color: colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
        >
          AD
        </Text>
      </View>
      <Text
        className="flex-1 text-[11px]"
        style={{ color: colores.textoSecundario, fontFamily: branding.tipografia.cuerpo }}
      >
        {textos.sudoku.juego.anuncio}
      </Text>
      <Ionicons color={colores.textoSuave} name="close-outline" size={18} />
    </View>
  );
}
