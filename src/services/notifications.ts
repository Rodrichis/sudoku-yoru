import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { env } from "@/src/config/env";
import { db } from "@/src/services/firebaseConfig";

const DISPOSITIVO_STORAGE_KEY = "@rz-base-app/dispositivo-id";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function obtenerDispositivoId() {
  const actual = await AsyncStorage.getItem(DISPOSITIVO_STORAGE_KEY);
  if (actual) return actual;

  const siguiente = `${Platform.OS}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(DISPOSITIVO_STORAGE_KEY, siguiente);
  return siguiente;
}

async function configurarCanalAndroid() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync("default", {
    importance: Notifications.AndroidImportance.MAX,
    lightColor: "#c96b3b",
    name: "default",
    vibrationPattern: [0, 250, 250, 250],
  });
}

export interface ResultadoRegistroPush {
  error?: string;
  expoPushToken: string | null;
  permiso: string;
}

export async function registrarDispositivoPush(uid?: string | null): Promise<ResultadoRegistroPush> {
  if (Platform.OS === "web") {
    return {
      error: "Expo push notifications no estan disponibles en web.",
      expoPushToken: null,
      permiso: "denegado",
    };
  }

  if (!Device.isDevice) {
    return {
      error: "El registro push requiere un dispositivo fisico.",
      expoPushToken: null,
      permiso: "denegado",
    };
  }

  await configurarCanalAndroid();

  const permisoActual = await Notifications.getPermissionsAsync();
  const permisoFinal =
    permisoActual.status === "granted"
      ? permisoActual
      : await Notifications.requestPermissionsAsync();

  if (permisoFinal.status !== "granted") {
    return {
      error: "No se otorgaron permisos para notificaciones.",
      expoPushToken: null,
      permiso: permisoFinal.status,
    };
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    env.EXPO_PUBLIC_EAS_PROJECT_ID;

  if (!projectId) {
    return {
      error: "Falta EXPO_PUBLIC_EAS_PROJECT_ID para registrar el token Expo.",
      expoPushToken: null,
      permiso: permisoFinal.status,
    };
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  const expoPushToken = token.data;

  if (uid && db) {
    const dispositivoId = await obtenerDispositivoId();
    const dispositivoRef = doc(db, "usuarios", uid, "dispositivos", dispositivoId);

    await setDoc(
      dispositivoRef,
      {
        actualizadoEl: serverTimestamp(),
        dispositivoId,
        expoPushToken,
        fabricante: Device.manufacturer ?? null,
        modelo: Device.modelName ?? null,
        notificacionesHabilitadas: true,
        plataforma: Platform.OS,
      },
      { merge: true }
    );
  }

  return {
    expoPushToken,
    permiso: permisoFinal.status,
  };
}
