import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { branding } from "@/src/config/branding";
import { useTextos } from "@/src/hooks/use-textos";

export function SudokuAdBanner() {
  const textos = useTextos();

  return (
    <View
      className="h-12 flex-row items-center gap-2 px-3"
      style={{
        backgroundColor: branding.colores.fondoElevado,
        borderColor: branding.colores.bordeSuave,
        borderRadius: 10,
        borderWidth: 0.6,
      }}
    >
      <View
        className="items-center justify-center rounded px-2 py-1"
        style={{ backgroundColor: branding.colores.superficie }}
      >
        <Text
          className="text-xs font-semibold uppercase"
          style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
        >
          AD
        </Text>
      </View>
      <Text
        className="flex-1 text-[11px]"
        style={{ color: branding.colores.textoSecundario, fontFamily: branding.tipografia.cuerpo }}
      >
        {textos.sudoku.juego.anuncio}
      </Text>
      <Ionicons color={branding.colores.textoSuave} name="close-outline" size={18} />
    </View>
  );
}
