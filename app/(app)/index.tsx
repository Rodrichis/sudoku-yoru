import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { Boton } from "@/src/components/ui/boton";
import { FichaResumen } from "@/src/components/ui/ficha-resumen";
import { Pantalla } from "@/src/components/ui/pantalla";
import { branding } from "@/src/config/branding";
import { firebaseConfigurado } from "@/src/config/env";
import { useSesion } from "@/src/hooks/use-sesion";
import { useTextos } from "@/src/hooks/use-textos";
import { useNotificaciones } from "@/src/providers/notificaciones-provider";
import { cerrarSesion, googleLoginDisponible } from "@/src/services/auth";
import { isRevenueCatDisponible } from "@/src/services/revenuecat";
import {
  obtenerNombreEstado,
  obtenerNombrePlan,
  suscripcionExpirada,
} from "@/src/services/suscripciones";
import { formatearFecha } from "@/src/utils/fechas";

export default function HomeScreen() {
  const textos = useTextos();
  const { idioma, usuarioApp, usuarioFirebase } = useSesion();
  const { error, expoPushToken, permiso, registrando, ultimaNotificacion } = useNotificaciones();

  const tituloUsuario =
    usuarioApp?.nombre || usuarioFirebase?.displayName || usuarioFirebase?.email || branding.app.nombre;

  const estiloPanel = {
    backgroundColor: branding.colores.superficie,
    borderColor: branding.colores.bordeSuave,
    borderRadius: branding.layout.radioPanel,
    borderWidth: 1,
  } as const;

  return (
    <Pantalla
      cabecera={
        <View className="mb-2">
          <Text
            className="text-sm font-semibold uppercase tracking-[1.8px]"
            style={{ color: branding.colores.acento }}
          >
            {branding.app.nombre}
          </Text>
          <Text className="mt-2 text-4xl font-black" style={{ color: branding.colores.textoPrimario }}>
            {textos.home.titulo}
          </Text>
          <Text
            className="mt-3 max-w-2xl text-base leading-6"
            style={{ color: branding.colores.textoSecundario }}
          >
            {textos.home.resumen}
          </Text>
        </View>
      }
    >
      <View className="gap-4">
        <View className="px-6 py-6 shadow-tarjeta" style={estiloPanel}>
          <Text
            className="text-sm font-semibold uppercase tracking-[1.6px]"
            style={{ color: branding.colores.textoSuave }}
          >
            {textos.general.usuario}
          </Text>
          <Text className="mt-2 text-2xl font-bold" style={{ color: branding.colores.textoPrimario }}>
            {tituloUsuario}
          </Text>
          <Text className="mt-2 text-sm leading-6" style={{ color: branding.colores.textoSecundario }}>
            UID: {usuarioFirebase?.uid ?? "-"}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-4">
          <FichaResumen
            label={textos.general.role}
            value={usuarioApp?.esAdmin ? textos.general.admin : textos.general.usuario}
          />
          <FichaResumen
            label={textos.general.plan}
            value={usuarioApp ? obtenerNombrePlan(usuarioApp.planId, idioma) : "-"}
          />
          <FichaResumen
            label="Estado"
            value={
              usuarioApp
                ? obtenerNombreEstado(
                    suscripcionExpirada(usuarioApp) ? "caducada" : usuarioApp.estadoSuscripcion,
                    idioma
                  )
                : "-"
            }
          />
          <FichaResumen
            label={textos.general.idioma}
            value={(usuarioApp?.idiomaPreferido ?? idioma).toUpperCase()}
          />
        </View>

        <View className="px-6 py-6 shadow-tarjeta" style={estiloPanel}>
          <Text className="text-lg font-bold" style={{ color: branding.colores.textoPrimario }}>
            {textos.general.notifications}
          </Text>
          <Text className="mt-2 text-sm leading-6" style={{ color: branding.colores.textoSecundario }}>
            {textos.home.notificationsHint}
          </Text>

          <View className="mt-4 gap-3">
            <Text className="text-sm" style={{ color: branding.colores.textoSecundario }}>
              Permiso: <Text className="font-semibold">{permiso}</Text>
            </Text>
            <Text className="text-sm" style={{ color: branding.colores.textoSecundario }}>
              Token Expo:{" "}
              <Text className="font-semibold">
                {expoPushToken
                  ? `${expoPushToken.slice(0, 24)}...`
                  : registrando
                    ? "Registrando..."
                    : "-"}
              </Text>
            </Text>
            <Text className="text-sm" style={{ color: branding.colores.textoSecundario }}>
              Ultima notificacion:{" "}
              <Text className="font-semibold">{ultimaNotificacion ?? "Sin eventos aun"}</Text>
            </Text>
            {error ? (
              <Text className="text-sm font-medium" style={{ color: branding.colores.advertenciaTexto }}>
                {error}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="px-6 py-6 shadow-tarjeta" style={estiloPanel}>
          <Text className="text-lg font-bold" style={{ color: branding.colores.textoPrimario }}>
            Servicios base
          </Text>
          <View className="mt-4 gap-3">
            <Text className="text-sm" style={{ color: branding.colores.textoSecundario }}>
              {textos.servicios.firebase}:{" "}
              <Text className="font-semibold">{firebaseConfigurado ? "OK" : "Pendiente"}</Text>
            </Text>
            <Text className="text-sm" style={{ color: branding.colores.textoSecundario }}>
              {textos.servicios.google}:{" "}
              <Text className="font-semibold">
                {googleLoginDisponible() ? "OK" : "Pendiente"}
              </Text>
            </Text>
            <Text className="text-sm" style={{ color: branding.colores.textoSecundario }}>
              {textos.servicios.push}: <Text className="font-semibold">OK</Text>
            </Text>
            <Text className="text-sm" style={{ color: branding.colores.textoSecundario }}>
              {textos.servicios.revenuecat}:{" "}
              <Text className="font-semibold">
                {isRevenueCatDisponible() ? "Configurable" : "No-op"}
              </Text>
            </Text>
            <Text className="text-sm" style={{ color: branding.colores.textoSecundario }}>
              Fecha expira:{" "}
              <Text className="font-semibold">
                {usuarioApp
                  ? formatearFecha(usuarioApp.expiraEl, idioma === "en" ? "en-US" : "es-CL")
                  : "-"}
              </Text>
            </Text>
          </View>
        </View>

        <View
          className="px-6 py-6"
          style={{
            ...estiloPanel,
            borderColor: branding.colores.bordeFuerte,
            borderStyle: "dashed",
          }}
        >
          <Text className="text-base font-semibold" style={{ color: branding.colores.textoPrimario }}>
            {textos.home.contextoIa}
          </Text>
        </View>

        <Boton
          etiqueta={textos.general.cerrarSesion}
          icono={<Ionicons color={branding.colores.textoInvertido} name="log-out-outline" size={20} />}
          onPress={() => {
            void cerrarSesion();
          }}
          variante="secundario"
        />
      </View>
    </Pantalla>
  );
}
