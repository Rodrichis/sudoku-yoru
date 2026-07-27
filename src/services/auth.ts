import * as Google from "expo-auth-session/providers/google";
import { Platform } from "react-native";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  env,
  googleLoginNativoConfigurado,
  googleLoginWebConfigurado,
} from "@/src/config/env";
import { auth } from "@/src/services/firebaseConfig";
import { asegurarDocumentoUsuarioBase } from "@/src/services/usuarios";

export interface CredencialesEmail {
  email: string;
  password: string;
}

export interface RegistroEmail extends CredencialesEmail {
  nombre: string;
}

function obtenerAuth() {
  if (!auth) {
    throw new Error("Firebase Auth no esta configurado. Revisa tu archivo .env.");
  }

  return auth;
}

function obtenerGoogleClientIdActual() {
  switch (Platform.OS) {
    case "android":
      return env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID.trim();
    case "ios":
      return env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID.trim();
    default:
      return env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.trim();
  }
}

export function googleLoginDisponible() {
  if (Platform.OS === "web") {
    return googleLoginWebConfigurado;
  }

  return obtenerGoogleClientIdActual().length > 0 && googleLoginNativoConfigurado;
}

export function useSolicitudGoogle() {
  return Google.useAuthRequest({
    androidClientId:
      env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "google-android-client-id-pendiente",
    iosClientId: env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "google-ios-client-id-pendiente",
    scopes: ["openid", "profile", "email"],
    webClientId: env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "google-web-client-id-pendiente",
  });
}

export async function iniciarSesionEmail({ email, password }: CredencialesEmail) {
  const authInstancia = obtenerAuth();
  const resultado = await signInWithEmailAndPassword(
    authInstancia,
    email.trim().toLowerCase(),
    password
  );
  await asegurarDocumentoUsuarioBase(resultado.user, "password");
  return resultado;
}

export async function registrarUsuarioEmail({ email, nombre, password }: RegistroEmail) {
  const authInstancia = obtenerAuth();
  const credencial = await createUserWithEmailAndPassword(
    authInstancia,
    email.trim().toLowerCase(),
    password
  );

  if (nombre.trim()) {
    await updateProfile(credencial.user, {
      displayName: nombre.trim(),
    });
  }

  await asegurarDocumentoUsuarioBase(credencial.user, "password");

  return credencial.user;
}

export async function enviarRecuperacionPassword(email: string) {
  const authInstancia = obtenerAuth();
  return sendPasswordResetEmail(authInstancia, email.trim().toLowerCase());
}

export async function iniciarSesionGoogleWeb() {
  const authInstancia = obtenerAuth();

  if (Platform.OS !== "web") {
    throw new Error("Google web solo esta disponible en navegador.");
  }

  const proveedor = new GoogleAuthProvider();
  const resultado = await signInWithPopup(authInstancia, proveedor);
  await asegurarDocumentoUsuarioBase(resultado.user, "google");
  return resultado.user;
}

export async function iniciarSesionGoogleNativo(idToken: string | null, accessToken?: string | null) {
  const authInstancia = obtenerAuth();

  if (!idToken) {
    throw new Error("Google no devolvio un token valido.");
  }

  const credencial = GoogleAuthProvider.credential(idToken, accessToken ?? undefined);
  const resultado = await signInWithCredential(authInstancia, credencial);
  await asegurarDocumentoUsuarioBase(resultado.user, "google");
  return resultado.user;
}

export async function cerrarSesion() {
  const authInstancia = obtenerAuth();
  return signOut(authInstancia);
}
