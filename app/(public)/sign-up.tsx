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
import { type RegistroValores, registroSchema } from "@/src/features/auth/esquemas";
import { useTextos } from "@/src/hooks/use-textos";
import { registrarUsuarioEmail } from "@/src/services/auth";

export default function SignUpScreen() {
  const textos = useTextos();
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroValores>({
    defaultValues: {
      confirmacionPassword: "",
      email: "",
      nombre: "",
      password: "",
    },
    resolver: zodResolver(registroSchema),
  });

  const onSubmit = handleSubmit(async (valores) => {
    try {
      setErrorGeneral(null);
      await registrarUsuarioEmail({
        email: valores.email,
        nombre: valores.nombre,
        password: valores.password,
      });
    } catch (error) {
      setErrorGeneral(error instanceof Error ? error.message : "No se pudo crear la cuenta.");
    }
  });

  return (
    <Pantalla aviso={!firebaseConfigurado ? textos.general.configuracionFaltante : null}>
      <TarjetaAuth
        descripcion={textos.auth.registro.descripcion}
        subtitulo={textos.auth.registro.subtitulo}
        titulo={textos.auth.registro.titulo}
      >
        <Controller
          control={control}
          name="nombre"
          render={({ field: { onBlur, onChange, value } }) => (
            <CampoTexto
              autoCapitalize="words"
              error={errors.nombre?.message}
              label="Nombre"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Tu nombre"
              value={value}
            />
          )}
        />

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
              placeholder="Crea tu clave"
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
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmacionPassword"
          render={({ field: { onBlur, onChange, value } }) => (
            <CampoTexto
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.confirmacionPassword?.message}
              label="Confirmar clave"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Repite tu clave"
              rightAccessory={
                <Pressable onPress={() => setMostrarConfirmacion((actual) => !actual)}>
                  <Text
                    className="text-sm"
                    style={{
                      color: branding.colores.textoSuave,
                      fontFamily: branding.tipografia.cuerpoSemi,
                    }}
                  >
                    {mostrarConfirmacion ? "Ocultar" : "Ver"}
                  </Text>
                </Pressable>
              }
              secureTextEntry={!mostrarConfirmacion}
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
          etiqueta={textos.auth.registro.accion}
          icono={<Ionicons color={branding.colores.textoInvertido} name="sparkles-outline" size={20} />}
          onPress={onSubmit}
        />

        <Link href="/(public)/sign-in" asChild>
          <Pressable className="items-center py-1">
            <Text
              style={{
                color: branding.colores.textoPrimario,
                fontFamily: branding.tipografia.cuerpoSemi,
                fontSize: 13,
              }}
            >
              {textos.auth.registro.volver}
            </Text>
          </Pressable>
        </Link>
      </TarjetaAuth>
    </Pantalla>
  );
}
