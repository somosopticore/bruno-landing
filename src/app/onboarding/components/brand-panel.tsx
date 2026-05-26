"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
  subtitle: string;
  stepNumber: string;
}

const steps: Step[] = [
  { id: "identity", label: "Identidad del negocio", subtitle: "Así se presenta Bruno", stepNumber: "01" },
  { id: "menu", label: "Carta y ambientes", subtitle: "El conocimiento base", stepNumber: "02" },
  { id: "hours", label: "Operación y turnos", subtitle: "Cuándo se sientan los comensales", stepNumber: "03" },
  { id: "permissions", label: "Permisos y canales", subtitle: "Quién manda y por dónde habla", stepNumber: "04" },
];

interface BrandPanelProps {
  activeStep: string;
  completedSteps: Record<string, boolean>;
  progressPercent: number;
}

export const BrandPanel: React.FC<BrandPanelProps> = ({
  activeStep,
  completedSteps,
  progressPercent,
}) => {
  const currentStepIndex = steps.findIndex((s) => s.id === activeStep);

  const completedIndices = steps.map((s, idx) => completedSteps[s.id] ? idx : -1);
  const maxCompletedIndex = Math.max(...completedIndices, currentStepIndex);
  const allCompleted = Object.values(completedSteps).filter(Boolean).length === 4;
  const activeLineScale = allCompleted ? 1 : Math.max(0, maxCompletedIndex) / (steps.length - 1);

  return (
    <aside className="hidden lg:flex flex-col justify-between w-[40%] max-w-[450px] min-h-[calc(100vh-64px)] sticky top-8 bg-[#2B1810]/40 border border-border-sutil rounded-2xl p-8 overflow-hidden backdrop-blur-xl">
      {/* Glow effects */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-acento-primario/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-acento-secundario/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col gap-10 pb-8">
        {/* Header Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(193,154,91,0.2)]"
            >
              <path
                d="M85 45C85 61.57 69.33 75 50 75C44.42 75 39.14 73.88 34.45 71.86L15 78L21.75 60.1C17.47 55.77 15 50.62 15 45C15 28.43 30.67 15 50 15C69.33 15 85 28.43 85 45Z"
                stroke="#C19A5B"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              <path
                d="M38 35H62V46C62 52.63 56.63 58 50 58C43.37 58 38 52.63 38 46V35Z"
                stroke="#C19A5B"
                strokeWidth="3"
              />
              <path d="M50 58V68" stroke="#C19A5B" strokeWidth="3" />
              <path d="M43 68H57" stroke="#C19A5B" strokeWidth="3" strokeLinecap="round" />
              <path
                d="M40.5 43C43.5 43 45.5 41.5 49.5 41.5C53.5 41.5 56.5 43 59.5 43"
                stroke="#D4574E"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-serif text-2xl font-black text-acento-primario tracking-tight">
            Bruno
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-acento-secundario self-end mb-2"></span>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-text-primario leading-tight">
            Configurá a tu maître digital.
          </h2>
          <p className="text-sm text-text-secundario leading-relaxed">
            5 minutos. Después, Bruno aprende solo.
          </p>
        </div>

        {/* Vertical Stepper */}
        <div className="relative flex-1 flex flex-col justify-between min-h-[340px] pl-2 py-2">
          {/* Stepper vertical line */}
          <div className="absolute left-[17px] top-3 bottom-3 w-[2px] bg-border-sutil" />
          
          {/* Active progress line fill */}
          <motion.div
            className="absolute left-[17px] top-3 w-[2px] bg-acento-primario origin-top"
            initial={{ scaleY: 0 }}
            animate={{
              scaleY: activeLineScale,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ height: "calc(100% - 24px)" }}
          />

          {steps.map((step, idx) => {
            const isCompleted = completedSteps[step.id];
            const isActive = step.id === activeStep;
            const isPending = !isCompleted && !isActive;

            return (
              <div
                key={step.id}
                className="relative flex gap-4 group cursor-pointer"
                onClick={() => {
                  const element = document.getElementById(step.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
              >
                {/* Node icon / indicator */}
                <div className="relative z-10 flex items-center justify-center">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-bg-primary shadow-[0_0_8px_rgba(143,170,91,0.4)]"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </motion.div>
                  ) : isActive ? (
                    <div className="relative w-5 h-5 rounded-full bg-acento-primario flex items-center justify-center shadow-[0_0_12px_rgba(193,154,91,0.5)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-bg-primary" />
                      <motion.div
                        className="absolute inset-0 rounded-full border border-acento-primario"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-border-sutil bg-bg-card flex items-center justify-center text-[10px] font-bold text-text-muted transition-colors duration-200 group-hover:border-text-secundario">
                      {step.stepNumber}
                    </div>
                  )}
                </div>

                {/* Texts */}
                <div className="flex flex-col -mt-0.5">
                  <span
                    className={`text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? "text-acento-primario"
                        : isCompleted
                        ? "text-text-primario"
                        : "text-text-secundario group-hover:text-text-primario"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span
                    className={`text-xs transition-colors duration-200 ${
                      isActive ? "text-text-secundario" : "text-text-muted"
                    }`}
                  >
                    {step.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer & Progress bar */}
      <div className="relative z-10 space-y-6 pt-6 border-t border-border-sutil">
        {/* Progress Bar Info */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-secundario font-semibold">Progreso de configuración</span>
            <span className="text-acento-primario font-bold font-mono">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-border-sutil rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-acento-primario to-[#F5E6D3] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* AES Encrypted Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-hover/50 border border-border-sutil/50 text-[10px] font-medium text-text-muted">
          <svg
            className="w-3.5 h-3.5 text-acento-primario"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Cifrado AES-256 · Datos privados de tu negocio
        </div>
      </div>
    </aside>
  );
};
export default BrandPanel;
