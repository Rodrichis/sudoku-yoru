import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
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
import { useSesion } from "@/src/hooks/use-sesion";
import { useTextos } from "@/src/hooks/use-textos";
import { googleLoginDisponible, iniciarSesionEmail } from "@/src/services/auth";

function GoogleAuthAction() {
  const textos = useTextos();
  const google = useGoogleAuth();

  return (
    <>
      {google.error ? (
        <Text
          className="text-sm"
          style={{ color: branding.colores.error, fontFamily: branding.tipografia.cuerpoMedio }}
        >
          {google.error}
        </Text>
      ) : null}

      <Boton
        cargando={google.cargando}
        deshabilitado={!firebaseConfigurado}
        etiqueta={google.cargando ? textos.general.loadingGoogle : textos.auth.sesion.google}
        icono={<Ionicons color={branding.colores.primario} name="logo-google" size={20} />}
        onPress={google.iniciar}
        variante="ghost"
      />
    </>
  );
}

export default function SignInScreen() {
  const textos = useTextos();
  const { entrarComoInvitado } = useSesion();
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const mostrarGoogle = googleLoginDisponible();
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
              label="Correo"
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
              label="Clave"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Tu clave"
              rightAccessory={
                <Pressable onPress={() => setMostrarPassword((actual) => !actual)}>
                  <Text
                    className="text-sm"
                    style={{
                      color: branding.colores.textoSuave,
                      fontFamily: branding.tipografia.cuerpoSemi,
                    }}
                  >
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
          <Text
            className="text-sm"
            style={{ color: branding.colores.error, fontFamily: branding.tipografia.cuerpoMedio }}
          >
            {errorGeneral}
          </Text>
        ) : null}

        <Boton
          cargando={isSubmitting}
          deshabilitado={!firebaseConfigurado}
          etiqueta={textos.auth.sesion.accion}
          icono={<Ionicons color={branding.colores.textoInvertido} name="log-in-outline" size={20} />}
          onPress={onSubmit}
        />

        {mostrarGoogle ? <GoogleAuthAction /> : null}

        <Boton
          etiqueta={textos.auth.sesion.invitado}
          icono={<Ionicons color={branding.colores.textoPrimario} name="moon-outline" size={20} />}
          onPress={() => {
            void entrarComoInvitado();
          }}
          variante="ghost"
        />

        <View className="flex-row items-center justify-center pt-1">
          <Link href="/(public)/forgot-password" asChild>
            <Pressable style={{ marginRight: 16 }}>
              <Text
                style={{
                  color: branding.colores.textoSecundario,
                  fontFamily: branding.tipografia.cuerpoSemi,
                  fontSize: 13,
                }}
              >
                {textos.auth.sesion.recuperar}
              </Text>
            </Pressable>
          </Link>

          <Text
            style={{
              color: branding.colores.textoSuave,
              fontFamily: branding.tipografia.cuerpo,
              fontSize: 13,
            }}
          >
            /
          </Text>

          <Link href="/(public)/sign-up" asChild>
            <Pressable style={{ marginLeft: 16 }}>
              <Text
                style={{
                  color: branding.colores.textoPrimario,
                  fontFamily: branding.tipografia.cuerpoSemi,
                  fontSize: 13,
                }}
              >
                {textos.auth.sesion.registro}
              </Text>
            </Pressable>
          </Link>
        </View>
      </TarjetaAuth>
    </Pantalla>
  );
}
