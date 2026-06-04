import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { branding } from "@/src/config/branding";
import { useTextos } from "@/src/hooks/use-textos";

interface SudokuToolbarProps {
  notasActivas: boolean;
  onBorrar: () => void;
  onDeshacer: () => void;
  onNotas: () => void;
  onPista: () => void;
  puedeDeshacer: boolean;
  pistasRestantes: number;
}

function SudokuToolbarButton({
  activo = false,
  descripcion,
  icono,
  onPress,
  titulo,
}: {
  activo?: boolean;
  descripcion?: string;
  icono: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  titulo: string;
}) {
  return (
    <Pressable className="items-center gap-3" onPress={onPress}>
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: activo ? branding.colores.primario : branding.colores.superficieOscura,
        }}
      >
        <Ionicons
          color={activo ? branding.colores.textoInvertido : branding.colores.primario}
          name={icono}
          size={20}
        />
      </View>
      <View className="items-center">
        <Text
          className="text-[11px]"
          style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
        >
          {titulo}
        </Text>
        {descripcion ? (
          <Text
            className="text-[11px]"
            style={{ color: branding.colores.textoSuave, fontFamily: branding.tipografia.cuerpo }}
          >
            {descripcion}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export function SudokuToolbar({
  notasActivas,
  onBorrar,
  onDeshacer,
  onNotas,
  onPista,
  puedeDeshacer,
  pistasRestantes,
}: SudokuToolbarProps) {
  const textos = useTextos();

  return (
    <View className="flex-row items-start justify-around px-2">
      <SudokuToolbarButton
        descripcion={puedeDeshacer ? undefined : textos.general.desactivado}
        icono="arrow-undo-outline"
        onPress={onDeshacer}
        titulo={textos.sudoku.juego.deshacer}
      />
      <SudokuToolbarButton
        icono="backspace-outline"
        onPress={onBorrar}
        titulo={textos.sudoku.juego.borrar}
      />
      <SudokuToolbarButton
        activo={notasActivas}
        descripcion={notasActivas ? "ON" : undefined}
        icono="create-outline"
        onPress={onNotas}
        titulo={textos.sudoku.juego.notas}
      />
      <SudokuToolbarButton
        descripcion={`${pistasRestantes}`}
        icono="bulb-outline"
        onPress={onPista}
        titulo={textos.sudoku.juego.pista}
      />
    </View>
  );
}
