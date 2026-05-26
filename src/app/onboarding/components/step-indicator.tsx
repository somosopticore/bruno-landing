"use client";

import React from "react";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  activeStep: string;
  progressPercent: number;
}

const stepTitles: Record<string, { num: string; title: string }> = {
  identity: { num: "01", title: "Identidad del negocio" },
  menu: { num: "02", title: "Carta y ambientes" },
  hours: { num: "03", title: "Operación y turnos" },
  permissions: { num: "04", title: "Permisos y canales" },
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  activeStep,
  progressPercent,
}) => {
  const current = stepTitles[activeStep] || { num: "01", title: "Identidad del negocio" };

  return (
    <div className="lg:hidden sticky top-0 z-40 w-full bg-bg-primary/90 backdrop-blur-md border-b border-border-sutil px-4 py-3.5 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-acento-primario text-bg-primary text-[10px] font-black font-mono">
            {current.num}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-text-primario">
            {current.title}
          </span>
        </div>
        <span className="text-xs font-black font-mono text-acento-primario">
          {progressPercent}%
        </span>
      </div>
      <div className="h-1 w-full bg-border-sutil rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-acento-primario to-[#F5E6D3]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
export default StepIndicator;
