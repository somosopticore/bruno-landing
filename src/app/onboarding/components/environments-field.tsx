"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EnvironmentsFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export const EnvironmentsField: React.FC<EnvironmentsFieldProps> = ({
  value = [],
  onChange,
  error,
}) => {
  const [options, setOptions] = useState<string[]>(["Salón", "Exterior", "Patio"]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleToggle = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  const submitCustom = () => {
    const cleanTag = newTag.trim();
    if (!cleanTag) return;

    if (!options.includes(cleanTag)) {
      setOptions([...options, cleanTag]);
    }
    if (!value.includes(cleanTag)) {
      onChange([...value, cleanTag]);
    }
    setNewTag("");
    setIsAdding(false);
  };

  const handleRemoveCustomOption = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    // Remover de opciones y de valores seleccionados
    setOptions(options.filter((o) => o !== tag));
    onChange(value.filter((v) => v !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsAdding(false);
      setNewTag("");
    } else if (e.key === "Enter") {
      e.preventDefault();
      submitCustom();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2.5 items-center">
        <AnimatePresence>
          {options.map((tag) => {
            const isSelected = value.includes(tag);
            const isDefault = ["Salón", "Exterior", "Patio"].includes(tag);

            return (
              <motion.button
                key={tag}
                type="button"
                layout
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                onClick={() => handleToggle(tag)}
                className={`relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-acento-primario text-bg-primary shadow-[0_4px_12px_rgba(193,154,91,0.3)]"
                    : "bg-bg-card border border-border-sutil text-text-secundario hover:text-text-primario hover:border-text-secundario"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>{tag}</span>
                {!isDefault && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveCustomOption(e, tag)}
                    className={`ml-1 rounded-full p-0.5 transition-colors ${
                      isSelected
                        ? "text-bg-primary hover:bg-[#D9B273]"
                        : "text-text-muted hover:bg-bg-hover hover:text-text-primario"
                    }`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Input inline / Botón "+ Agregar otro" */}
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="add-form"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <Input
                type="text"
                autoFocus
                placeholder="Nombre del ambiente (Ej: Terraza)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 py-1 px-2.5 text-xs max-w-[180px] bg-bg-primary border-border-sutil"
              />
              <Button type="button" onClick={submitCustom} size="sm" className="h-8 px-2">
                <Check className="w-3.5 h-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-text-muted hover:text-error"
                onClick={() => {
                  setIsAdding(false);
                  setNewTag("");
                }}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </motion.div>
          ) : (
            <motion.button
              key="add-button"
              type="button"
              layout
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold bg-[#2B1810] border border-dashed border-border-sutil text-acento-primario hover:bg-[#3A2218] hover:border-acento-primario transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar otro
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-text-muted font-medium">
        Dejalo vacío si tu local tiene un único ambiente general.
      </p>

      {error && (
        <p className="text-xs text-error font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
export default EnvironmentsField;
