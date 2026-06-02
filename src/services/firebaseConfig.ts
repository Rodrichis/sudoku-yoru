import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { Platform } from "react-native";

import { env, firebaseConfigurado } from "@/src/config/env";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (firebaseConfigurado) {
  const firebaseConfig = {
    apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
    appId: env.EXPO_PUBLIC_FIREBASE_APP_ID,
    authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    measurementId: env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
    messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  };

  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);

  if (Platform.OS === "web") {
    auth = getAuth(app);
  } else {
    try {
      auth = initializeAuth(app, {
        // dynamic require to keep React Native persistence isolated from web bundling
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        persistence: require("firebase/auth").getReactNativePersistence(AsyncStorage),
      });
    } catch {
      auth = getAuth(app);
    }
  }
}

export { app, auth, db };
