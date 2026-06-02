import { z } from "zod";

export const iniciarSesionSchema = z.object({
  email: z.email("Ingresa un email valido."),
  password: z.string().min(6, "La password debe tener al menos 6 caracteres."),
});

export const registroSchema = z
  .object({
    confirmacionPassword: z
      .string()
      .min(6, "La confirmacion debe tener al menos 6 caracteres."),
    email: z.email("Ingresa un email valido."),
    nombre: z.string().min(2, "Ingresa tu nombre."),
    password: z.string().min(6, "La password debe tener al menos 6 caracteres."),
  })
  .refine((valores) => valores.password === valores.confirmacionPassword, {
    message: "Las passwords no coinciden.",
    path: ["confirmacionPassword"],
  });

export const recuperarPasswordSchema = z.object({
  email: z.email("Ingresa un email valido."),
});

export type IniciarSesionValores = z.infer<typeof iniciarSesionSchema>;
export type RegistroValores = z.infer<typeof registroSchema>;
export type RecuperarPasswordValores = z.infer<typeof recuperarPasswordSchema>;
