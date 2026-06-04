import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { env } from "@/src/config/env";
import { db } from "@/src/services/firebaseConfig";

const DISPOSITIVO_STORAGE_KEY = "@sudoku-yoru/dispositivo-id";

let handlerNotificacionesConfigurado = false;

function estaEnExpoGo() {
  return Constants.expoGoConfig !== null;
}

export function soportaPushRemoto() {
  return Platform.OS !== "web" && !estaEnExpoGo();
}

async function cargarModuloNotifications() {
  if (!soportaPushRemoto()) {
    return null;
  }

  const Notifications = await import("expo-notifications");

  if (!handlerNotificacionesConfigurado) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    handlerNotificacionesConfigurado = true;
  }

  return Notifications;
}

async function obtenerDispositivoId() {
  const actual = await AsyncStorage.getItem(DISPOSITIVO_STORAGE_KEY);
  if (actual) return actual;

  const siguiente = `${Platform.OS}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(DISPOSITIVO_STORAGE_KEY, siguiente);
  return siguiente;
}

async function configurarCanalAndroid() {
  if (Platform.OS !== "android") return;

  const Notifications = await cargarModuloNotifications();
  if (!Notifications) {
    return;
  }

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

  if (estaEnExpoGo()) {
    return {
      error: "Push remoto deshabilitado en Expo Go. Usa un development build para probar notificaciones.",
      expoPushToken: null,
      permiso: "no-disponible",
    };
  }

  if (!Device.isDevice) {
    return {
      error: "El registro push requiere un dispositivo fisico.",
      expoPushToken: null,
      permiso: "denegado",
    };
  }

  const Notifications = await cargarModuloNotifications();
  if (!Notifications) {
    return {
      error: "No fue posible cargar expo-notifications en este entorno.",
      expoPushToken: null,
      permiso: "no-disponible",
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

export async function suscribirEventosNotificaciones(opciones: {
  onNotificacionAbierta: (titulo: string) => void;
  onNotificacionRecibida: (titulo: string) => void;
}) {
  const Notifications = await cargarModuloNotifications();
  if (!Notifications) {
    return () => undefined;
  }

  const recibido = Notifications.addNotificationReceivedListener((notificacion) => {
    opciones.onNotificacionRecibida(
      typeof notificacion.request.content.title === "string"
        ? notificacion.request.content.title
        : "Notificacion recibida"
    );
  });

  const respuesta = Notifications.addNotificationResponseReceivedListener((evento) => {
    opciones.onNotificacionAbierta(
      typeof evento.notification.request.content.title === "string"
        ? evento.notification.request.content.title
        : "Notificacion abierta"
    );
  });

  return () => {
    recibido.remove();
    respuesta.remove();
  };
}
