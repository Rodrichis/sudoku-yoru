import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import { branding } from "@/src/config/branding";
import { useTextos } from "@/src/hooks/use-textos";

interface SudokuToolbarProps {
  deshabilitado?: boolean;
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
  deshabilitado = false,
  icono,
  onPress,
  titulo,
}: {
  activo?: boolean;
  descripcion?: string;
  deshabilitado?: boolean;
  icono: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  titulo: string;
}) {
  return (
    <Pressable
      accessibilityLabel={descripcion ? `${titulo}, ${descripcion}` : titulo}
      accessibilityRole="button"
      accessibilityState={{ disabled: deshabilitado, selected: activo }}
      className="items-center gap-3"
      disabled={deshabilitado}
      onPress={onPress}
      style={{ opacity: deshabilitado ? 0.45 : 1 }}
    >
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
  deshabilitado = false,
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
        deshabilitado={deshabilitado || !puedeDeshacer}
        icono="arrow-undo-outline"
        onPress={onDeshacer}
        titulo={textos.sudoku.juego.deshacer}
      />
      <SudokuToolbarButton
        deshabilitado={deshabilitado}
        icono="backspace-outline"
        onPress={onBorrar}
        titulo={textos.sudoku.juego.borrar}
      />
      <SudokuToolbarButton
        activo={notasActivas}
        descripcion={notasActivas ? "ON" : undefined}
        deshabilitado={deshabilitado}
        icono="create-outline"
        onPress={onNotas}
        titulo={textos.sudoku.juego.notas}
      />
      <SudokuToolbarButton
        descripcion={`${pistasRestantes}`}
        deshabilitado={deshabilitado || pistasRestantes <= 0}
        icono="bulb-outline"
        onPress={onPista}
        titulo={textos.sudoku.juego.pista}
      />
    </View>
  );
}
