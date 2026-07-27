import AsyncStorage from "@react-native-async-storage/async-storage";

const operacionesPendientes = new Map<string, Promise<void>>();

async function esperarOperacionPendiente(clave: string) {
  await operacionesPendientes.get(clave)?.catch(() => undefined);
}

function encolarOperacion(clave: string, operacion: () => Promise<void>) {
  const anterior = operacionesPendientes.get(clave) ?? Promise.resolve();
  const siguiente = anterior.catch(() => undefined).then(operacion);

  operacionesPendientes.set(clave, siguiente);
  void siguiente.then(
    () => {
      if (operacionesPendientes.get(clave) === siguiente) {
        operacionesPendientes.delete(clave);
      }
    },
    () => {
      if (operacionesPendientes.get(clave) === siguiente) {
        operacionesPendientes.delete(clave);
      }
    }
  );

  return siguiente;
}

export async function leerJsonStorage<T>(clave: string): Promise<T | null> {
  await esperarOperacionPendiente(clave);
  const valor = await AsyncStorage.getItem(clave);

  if (!valor) {
    return null;
  }

  try {
    return JSON.parse(valor) as T;
  } catch {
    return null;
  }
}

export async function guardarJsonStorage<T>(clave: string, valor: T) {
  const serializado = JSON.stringify(valor);
  await encolarOperacion(clave, () => AsyncStorage.setItem(clave, serializado));
}

export async function eliminarStorage(clave: string) {
  await encolarOperacion(clave, () => AsyncStorage.removeItem(clave));
}
