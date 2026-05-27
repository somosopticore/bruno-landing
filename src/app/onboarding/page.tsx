import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import OnboardingForm from "./components/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="w-full flex-1 flex flex-col justify-start">
      {/* Header simplificado */}
      <header className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 border-b border-border-sutil/30 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group focus:outline-none">
          <div className="relative flex items-center justify-center w-8 h-8">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-[0_2px_6px_rgba(193,154,91,0.2)]"
            >
              <path
                d="M85 45C85 61.57 69.33 75 50 75C44.42 75 39.14 73.88 34.45 71.86L15 78L21.75 60.1C17.47 55.77 15 50.62 15 45C15 28.43 30.67 15 50 15C69.33 15 85 28.43 85 45Z"
                stroke="#C19A5B"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <path
                d="M38 35H62V46C62 52.63 56.63 58 50 58C43.37 58 38 52.63 38 46V35Z"
                stroke="#C19A5B"
                strokeWidth="4"
              />
              <path d="M50 58V68" stroke="#C19A5B" strokeWidth="4" />
              <path d="M43 68H57" stroke="#C19A5B" strokeWidth="4" strokeLinecap="round" />
              <path
                d="M40.5 43C43.5 43 45.5 41.5 49.5 41.5C53.5 41.5 56.5 43 59.5 43"
                stroke="#D4574E"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-serif text-xl font-black text-acento-primario tracking-tight">
            Bruno
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-acento-secundario self-end mb-2.5"></span>
        </a>
        <div className="flex items-center gap-2.5 text-xs text-text-secundario font-semibold">
          <span>SaaS Gastronómico Premium</span>
        </div>
      </header>

      {/* Formulario */}
      <Suspense fallback={
        <div className="min-h-[60vh] w-full flex items-center justify-center bg-zinc-950 text-zinc-400">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <span className="text-sm font-semibold tracking-wide">Cargando Onboarding...</span>
          </div>
        </div>
      }>
        <OnboardingForm />
      </Suspense>
    </div>
  );
}

// Requerido importar Loader2 si lo usamos en fallback, pero wait, en page.tsx no tenemos Loader2. 
// Para evitar importación extra en page.tsx, podemos usar un loader inline o importar Loader2 de lucide-react.
// Vamos a importar Loader2 de lucide-react en page.tsx.
export const dynamic = "force-dynamic";
