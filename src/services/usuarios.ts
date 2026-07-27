import { type User } from "firebase/auth";
import { arrayUnion, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { ROLES_USUARIO } from "@/src/constants/roles";
import {
  DIAS_PRUEBA_PREDETERMINADOS,
  ESTADOS_SUSCRIPCION,
  PLANES_IDS,
} from "@/src/constants/suscripciones";
import { resolverIdiomaInicial } from "@/src/i18n";
import { db } from "@/src/services/firebaseConfig";
import { agregarDias, obtenerClaveMesActual } from "@/src/utils/fechas";

function obtenerDb() {
  if (!db) {
    throw new Error("Firestore no esta configurado. Revisa tu archivo .env.");
  }

  return db;
}

export async function asegurarDocumentoUsuarioBase(
  user: User,
  proveedorAuth: "password" | "google"
) {
  const dbInstancia = obtenerDb();
  const usuarioRef = doc(dbInstancia, "usuarios", user.uid);
  const usuarioSnap = await getDoc(usuarioRef);

  const ahora = new Date();
  const expiraEl = agregarDias(ahora, DIAS_PRUEBA_PREDETERMINADOS);

  if (!usuarioSnap.exists()) {
    await setDoc(usuarioRef, {
      actualizadoEl: serverTimestamp(),
      authProviders: [proveedorAuth],
      creadoEl: serverTimestamp(),
      email: user.email ?? "",
      esAdmin: false,
      estadoSuscripcion: ESTADOS_SUSCRIPCION.PRUEBA,
      expiraEl,
      idiomaPreferido: resolverIdiomaInicial(),
      nombre: user.displayName ?? "",
      planId: PLANES_IDS.TRIAL,
      proveedorPago: null,
      role: ROLES_USUARIO.USUARIO,
      uid: user.uid,
    });
  } else {
    await setDoc(
      usuarioRef,
      {
        actualizadoEl: serverTimestamp(),
        authProviders: arrayUnion(proveedorAuth),
        email: user.email ?? "",
        nombre: user.displayName ?? "",
      },
      { merge: true }
    );
  }

  const usoActualRef = doc(dbInstancia, "usuarios", user.uid, "uso", "actual");
  const usoActualSnap = await getDoc(usoActualRef);
  const mesReferencia = obtenerClaveMesActual();

  if (
    !usoActualSnap.exists() ||
    usoActualSnap.data().mesReferencia !== mesReferencia
  ) {
    await setDoc(
      usoActualRef,
      {
        actualizadoEl: serverTimestamp(),
        correosMes: 0,
        mesReferencia,
        notificacionesMes: 0,
      },
      { merge: true }
    );
  }
}
