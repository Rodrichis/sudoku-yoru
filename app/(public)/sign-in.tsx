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
  type IniciarSesionValores,
  iniciarSesionSchema,
} from "@/src/features/auth/esquemas";
import { useGoogleAuth } from "@/src/hooks/use-google-auth";
import { useTextos } from "@/src/hooks/use-textos";
import { iniciarSesionEmail } from "@/src/services/auth";

export default function SignInScreen() {
  const textos = useTextos();
  const google = useGoogleAuth();
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IniciarSesionValores>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(iniciarSesionSchema),
  });

  const onSubmit = handleSubmit(async (valores) => {
    try {
      setErrorGeneral(null);
      await iniciarSesionEmail(valores);
    } catch (error) {
      setErrorGeneral(
        error instanceof Error ? error.message : "No se pudo iniciar sesion con email."
      );
    }
  });

  return (
    <Pantalla aviso={!firebaseConfigurado ? textos.general.configuracionFaltante : null}>
      <TarjetaAuth
        descripcion={textos.auth.sesion.descripcion}
        subtitulo={textos.auth.sesion.subtitulo}
        titulo={textos.auth.sesion.titulo}
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
              textContentType="emailAddress"
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onBlur, onChange, value } }) => (
            <CampoTexto
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.password?.message}
              label="Password"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Tu password"
              rightAccessory={
                <Pressable onPress={() => setMostrarPassword((actual) => !actual)}>
                  <Text className="text-sm font-semibold" style={{ color: branding.colores.textoSuave }}>
                    {mostrarPassword ? "Ocultar" : "Ver"}
                  </Text>
                </Pressable>
              }
              secureTextEntry={!mostrarPassword}
              textContentType="password"
              value={value}
            />
          )}
        />

        {errorGeneral ? (
          <Text className="text-sm font-medium" style={{ color: branding.colores.error }}>
            {errorGeneral}
          </Text>
        ) : null}

        {google.error ? (
          <Text className="text-sm font-medium" style={{ color: branding.colores.error }}>
            {google.error}
          </Text>
        ) : null}

        <Boton
          cargando={isSubmitting}
          deshabilitado={!firebaseConfigurado}
          etiqueta={textos.auth.sesion.accion}
          icono={<Ionicons color={branding.colores.textoInvertido} name="log-in-outline" size={20} />}
          onPress={onSubmit}
        />

        {google.disponible ? (
          <Boton
            cargando={google.cargando}
            deshabilitado={!firebaseConfigurado}
            etiqueta={google.cargando ? textos.general.loadingGoogle : textos.auth.sesion.google}
            icono={<Ionicons color={branding.colores.textoInvertido} name="logo-google" size={20} />}
            onPress={google.iniciar}
            variante="secundario"
          />
        ) : null}

        <Link href="/(public)/forgot-password" asChild>
          <Pressable>
            <Text
              className="text-center text-sm font-semibold"
              style={{ color: branding.colores.textoSecundario }}
            >
              {textos.auth.sesion.recuperar}
            </Text>
          </Pressable>
        </Link>

        <Link href="/(public)/sign-up" asChild>
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
              {textos.auth.sesion.registro}
            </Text>
          </Pressable>
        </Link>
      </TarjetaAuth>
    </Pantalla>
  );
}
