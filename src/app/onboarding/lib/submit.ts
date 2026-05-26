"use server";

import { onboardingSchema } from "./schema";

export async function submitOnboarding(data: unknown) {
  // Simular latencia de red premium para mostrar el loading state (1.5 segundos)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Validar del lado del servidor
  const result = onboardingSchema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // En producción, aquí se guardaría en base de datos o despacharía webhooks/Telegram notifications.
  console.log("Onboarding completado con éxito para:", result.data.business_name);

  return {
    success: true,
  };
}
