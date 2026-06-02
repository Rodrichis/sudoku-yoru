import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text } from "react-native";
import { useState } from "react";

import { Boton } from "@/src/components/ui/boton";
import { CampoTexto } from "@/src/components/ui/campo-texto";
import { Pantalla } from "@/src/components/ui/pantalla";
import { TarjetaAuth } from "@/src/components/ui/tarjeta-auth";
import { branding } from "@/src/config/branding";
import { firebaseConfigurado } from "@/src/config/env";
import {
  type RecuperarPasswordValores,
  recuperarPasswordSchema,
} from "@/src/features/auth/esquemas";
import { useTextos } from "@/src/hooks/use-textos";
import { enviarRecuperacionPassword } from "@/src/services/auth";

export default function ForgotPasswordScreen() {
  const textos = useTextos();
  const [estadoExito, setEstadoExito] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecuperarPasswordValores>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(recuperarPasswordSchema),
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      setEstadoExito(null);
      setErrorGeneral(null);
      await enviarRecuperacionPassword(email);
      setEstadoExito(textos.auth.recuperar.exito);
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo solicitar la recuperacion."
      );
    }
  });

  return (
    <Pantalla aviso={!firebaseConfigurado ? textos.general.configuracionFaltante : null}>
      <TarjetaAuth
        descripcion={textos.auth.recuperar.descripcion}
        subtitulo={textos.auth.sesion.subtitulo}
        titulo={textos.auth.sesion.recuperar}
      >
        <Controller
          control={control}
          name="email"
          render={({ field: { onBlur, onChange, value } }) => (
            <CampoTexto
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              error={errors.email?.message}
              keyboardType="email-address"
              label="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="tu@correo.com"
              value={value}
            />
          )}
        />

        {estadoExito ? (
          <Text className="text-sm font-medium" style={{ color: branding.colores.exito }}>
            {estadoExito}
          </Text>
        ) : null}

        {errorGeneral ? (
          <Text className="text-sm font-medium" style={{ color: branding.colores.error }}>
            {errorGeneral}
          </Text>
        ) : null}

        <Boton
          cargando={isSubmitting}
          deshabilitado={!firebaseConfigurado}
          etiqueta={textos.auth.recuperar.accion}
          icono={
            <Ionicons color={branding.colores.textoInvertido} name="mail-unread-outline" size={20} />
          }
          onPress={onSubmit}
        />

        <Link href="/(public)/sign-in" asChild>
          <Pressable
            className="px-4 py-4"
            style={{
              backgroundColor: branding.colores.superficie,
              borderColor: branding.colores.bordeSuave,
              borderRadius: branding.layout.radioControl,
              borderWidth: 1,
            }}
          >
            <Text
              className="text-center text-base font-bold"
              style={{ color: branding.colores.textoPrimario }}
            >
              {textos.auth.recuperar.volver}
            </Text>
          </Pressable>
        </Link>
      </TarjetaAuth>
    </Pantalla>
  );
}
