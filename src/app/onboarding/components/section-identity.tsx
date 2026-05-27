"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SectionIdentity: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const businessName = watch("business_name") || "";
  const nameError = errors.business_name?.message as string;
  const tablesError = errors.total_tables?.message as string;

  return (
    <motion.section
      id="identity"
      data-step="identity"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 scroll-mt-20"
    >
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-acento-primario">
          IDENTIDAD DEL NEGOCIO · PASO 01
        </span>
        <h3 className="font-serif text-2xl font-bold text-text-primario">
          Así se va a presentar Bruno.
        </h3>
        <p className="text-sm text-text-secundario leading-relaxed">
          El nombre comercial exacto que aparece en tu carta, en tu cartel y en Google Maps.
          Bruno lo usará en cada saludo.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="business_name">Nombre de tu local</Label>
          <span className="text-[10px] font-mono text-text-muted font-bold">
            {businessName.length} / 80
          </span>
        </div>
        
        <Input
          id="business_name"
          placeholder="Moyo Resto & Bodegón"
          error={!!nameError}
          maxLength={80}
          {...register("business_name")}
          className="h-12 text-base"
        />

        <div className="flex justify-between items-start">
          <p className="text-xs text-text-muted font-medium">
            Exactamente como querés que tus clientes lo lean.
          </p>
          {nameError && (
            <p className="text-xs text-error font-medium" role="alert">
              {nameError}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="total_tables">Cantidad aproximada de mesas (Capacidad del salón)</Label>
        </div>
        
        <Input
          id="total_tables"
          type="number"
          min="1"
          placeholder="Ej: 25"
          error={!!tablesError}
          {...register("total_tables", { valueAsNumber: true })}
          className="h-12 text-base"
        />

        <div className="flex justify-between items-start">
          <p className="text-xs text-text-muted font-medium">
            Esto ayuda a configurar el límite de reservas simultáneas.
          </p>
          {tablesError && (
            <p className="text-xs text-error font-medium" role="alert">
              {tablesError}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
};
export default SectionIdentity;
