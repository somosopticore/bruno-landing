import React from "react";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Bruno · Configuración de tu Maître Digital",
  description: "Formulario de configuración de Bruno para restaurantes argentinos.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-bg-primary overflow-x-hidden">
      {/* Resplandores de fondo decorativos */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-acento-primario/10 blur-[130px] pointer-events-none animate-glow-1 z-0" />
      <div className="absolute top-[40%] left-[-15%] w-[450px] h-[450px] rounded-full bg-acento-secundario/5 blur-[120px] pointer-events-none animate-glow-2 z-0" />

      {/* Contenedor principal de Onboarding */}
      <main className="relative z-10 w-full min-h-screen flex flex-col justify-start">
        {children}
      </main>
      
      {/* Toast notifications */}
      <Toaster theme="dark" richColors closeButton />
    </div>
  );
}
export const dynamic = "force-dynamic";
