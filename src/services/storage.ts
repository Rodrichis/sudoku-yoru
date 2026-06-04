import AsyncStorage from "@react-native-async-storage/async-storage";

export async function leerJsonStorage<T>(clave: string): Promise<T | null> {
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
  await AsyncStorage.setItem(clave, JSON.stringify(valor));
}

export async function eliminarStorage(clave: string) {
  await AsyncStorage.removeItem(clave);
}
