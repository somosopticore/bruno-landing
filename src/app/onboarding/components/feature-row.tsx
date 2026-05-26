"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";

interface FeatureRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  betaBadge?: boolean;
}

export const FeatureRow: React.FC<FeatureRowProps> = ({
  icon,
  title,
  description,
  checked,
  onChange,
  betaBadge = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#2B1810]/40 border border-border-sutil rounded-xl hover:border-text-muted transition-all duration-200">
      <div className="flex gap-4 items-start">
        <div className="w-11 h-11 rounded-lg bg-[#3A2218] border border-acento-primario/20 flex items-center justify-center text-acento-primario shrink-0 shadow-inner">
          {icon}
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-text-primario">{title}</h4>
          <p className="text-xs text-text-secundario leading-relaxed max-w-[440px]">
            {description}
          </p>
          {betaBadge && checked && (
            <div className="inline-flex mt-1.5 px-2 py-0.5 rounded bg-acento-secundario/10 border border-acento-secundario/30 text-[9px] font-black uppercase tracking-wider text-acento-secundario">
              Función beta · puede generar costos adicionales de Meta/Twilio
            </div>
          )}
        </div>
      </div>
      <div className="self-end sm:self-center shrink-0">
        <Switch checked={checked} onChange={onChange} />
      </div>
    </div>
  );
};
export default FeatureRow;
