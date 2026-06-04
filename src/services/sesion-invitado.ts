import { eliminarStorage, guardarJsonStorage, leerJsonStorage } from "@/src/services/storage";

const SESION_INVITADO_KEY = "@sudoku-yoru/sesion-invitado";

export async function cargarSesionInvitado() {
  const invitadoActivo = await leerJsonStorage<boolean>(SESION_INVITADO_KEY);
  return invitadoActivo === true;
}

export async function guardarSesionInvitado(activo: boolean) {
  if (!activo) {
    await eliminarStorage(SESION_INVITADO_KEY);
    return;
  }

  await guardarJsonStorage(SESION_INVITADO_KEY, true);
}
