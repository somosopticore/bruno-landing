"use client";

import * as React from "react";
import { motion } from "framer-motion";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  id,
  name,
}) => {
  const toggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <button
        type="button"
        id={id}
        name={name}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-acento-primario focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-acento-primario" : "bg-[#3D2820]"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 ${
            checked ? "bg-bg-primary" : "bg-text-secundario"
          }`}
          style={{
            marginLeft: checked ? "20px" : "0px",
          }}
        />
      </button>
      <span className="text-xs font-semibold uppercase tracking-wider text-text-secundario w-20">
        {checked ? "Activado" : "Desactivado"}
      </span>
    </div>
  );
};
