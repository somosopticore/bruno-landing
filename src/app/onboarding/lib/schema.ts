import { z } from "zod";

export const onboardingSchema = z.object({
  // Sección 1 — Identidad
  business_name: z
    .string()
    .trim()
    .min(2, "Ingresá el nombre del local")
    .max(80, "El nombre no puede superar los 80 caracteres"),

  // Sección 2 — Distribución y carta
  // Nota: Cambiado a z.string() en lugar de z.enum para soportar custom tags agregados dinámicamente
  environments: z.array(z.string()),
  
  menu: z
    .string()
    .trim()
    .min(40, "Pegá tu carta completa (al menos 40 caracteres)")
    .max(15000, "La carta no puede superar los 15.000 caracteres"),

  // Sección 3 — Reglas operativas
  business_hours: z
    .string()
    .trim()
    .min(10, "Detallá días y horarios de cocina")
    .max(500, "El detalle de horarios no puede superar los 500 caracteres"),

  // Sección 4 — Canales y permisos
  admin_numbers: z
    .array(
      z
        .string()
        .regex(
          /^\d{11,15}$/,
          "Solo dígitos. Sin '+', sin espacios, sin guiones."
        )
    )
    .min(1, "Cargá al menos un número de administrador"),
  
  audio_transcription: z.boolean(),
  voice_calls: z.boolean(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
export type OnboardingStep = "identity" | "menu" | "hours" | "permissions";
export const STEPS: OnboardingStep[] = ["identity", "menu", "hours", "permissions"];
