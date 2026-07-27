import { Modal, Pressable, Text, View } from "react-native";

import { branding } from "@/src/config/branding";
import { useTema } from "@/src/hooks/use-tema";

interface SudokuConfirmDialogProps {
  accion: string;
  cancelar: string;
  descripcion: string;
  onCancelar: () => void;
  onConfirmar: () => void;
  titulo: string;
  visible: boolean;
}

export function SudokuConfirmDialog({
  accion,
  cancelar,
  descripcion,
  onCancelar,
  onConfirmar,
  titulo,
  visible,
}: SudokuConfirmDialogProps) {
  const { colores } = useTema();

  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancelar}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <Pressable
          accessibilityLabel={cancelar}
          onPress={onCancelar}
          style={{
            backgroundColor: colores.backdrop,
            bottom: 0,
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
          }}
        />

        <View
          accessibilityRole="alert"
          style={{
            backgroundColor: colores.fondoElevado,
            borderColor: colores.bordeSuave,
            borderRadius: branding.layout.radioTarjeta,
            borderWidth: 0.8,
            maxWidth: 360,
            padding: 24,
            width: "100%",
          }}
        >
          <Text
            style={{
              color: colores.textoPrimario,
              fontFamily: branding.tipografia.tituloFuerte,
              fontSize: 28,
              lineHeight: 34,
            }}
          >
            {titulo}
          </Text>
          <Text
            style={{
              color: colores.textoSecundario,
              fontFamily: branding.tipografia.cuerpo,
              fontSize: 15,
              lineHeight: 23,
              marginTop: 12,
            }}
          >
            {descripcion}
          </Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 24 }}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancelar}
              style={{
                alignItems: "center",
                borderColor: colores.bordeSuave,
                borderRadius: 999,
                borderWidth: 0.8,
                flex: 1,
                justifyContent: "center",
                minHeight: 48,
                paddingHorizontal: 12,
              }}
            >
              <Text
                style={{
                  color: colores.textoPrimario,
                  fontFamily: branding.tipografia.cuerpoSemi,
                  fontSize: 13,
                }}
              >
                {cancelar}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onConfirmar}
              style={{
                alignItems: "center",
                backgroundColor: colores.primario,
                borderRadius: 999,
                flex: 1,
                justifyContent: "center",
                minHeight: 48,
                paddingHorizontal: 12,
              }}
            >
              <Text
                style={{
                  color: colores.textoInvertido,
                  fontFamily: branding.tipografia.cuerpoSemi,
                  fontSize: 13,
                }}
              >
                {accion}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
