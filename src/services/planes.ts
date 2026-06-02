import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";

import { PLANES_BASE } from "@/src/constants/suscripciones";
import { db } from "@/src/services/firebaseConfig";

function obtenerDb() {
  if (!db) {
    throw new Error("Firestore no esta configurado. Revisa tu archivo .env.");
  }

  return db;
}

export async function sincronizarPlanesBase() {
  const dbInstancia = obtenerDb();
  const batch = writeBatch(dbInstancia);

  for (const plan of PLANES_BASE) {
    const ref = doc(dbInstancia, "planes", plan.id);
    batch.set(
      ref,
      {
        ...plan,
        actualizadoEl: serverTimestamp(),
      },
      { merge: true }
    );
  }

  await batch.commit();
}

export async function obtenerPlanPorId(planId: string) {
  const dbInstancia = obtenerDb();
  const ref = doc(dbInstancia, "planes", planId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}
