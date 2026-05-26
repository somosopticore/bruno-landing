"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const SectionHours: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const hoursText = watch("business_hours") || "";
  const hoursError = errors.business_hours?.message as string;

  return (
    <motion.section
      id="hours"
      data-step="hours"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 scroll-mt-20"
    >
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-acento-primario">
          OPERACIÓN Y TURNOS · PASO 03
        </span>
        <h3 className="font-serif text-2xl font-bold text-text-primario">
          Cuándo se sientan los comensales.
        </h3>
        <p className="text-sm text-text-secundario leading-relaxed">
          Bruno filtra reservas 24/7 contra estos horarios. Lo que no entra acá, lo deriva o lo
          rechaza con cortesía.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="business_hours">Horarios de cocina y atención</Label>
          <span className="text-[10px] font-mono text-text-muted font-bold">
            {hoursText.length} / 500
          </span>
        </div>

        <Textarea
          id="business_hours"
          placeholder={"Martes a Domingos de 20:00 a 00:00 hs\nLunes cerrado"}
          error={!!hoursError}
          maxLength={500}
          {...register("business_hours")}
          className="min-h-[140px] text-sm leading-relaxed"
        />

        <div className="flex justify-between items-start">
          <p className="text-xs text-text-muted font-medium max-w-[480px]">
            Anotalo como se lo dirías a un cliente. Incluí días de descanso y horarios especiales
            (almuerzos, after office, feriados, etc.).
          </p>
          {hoursError && (
            <p className="text-xs text-error font-medium" role="alert">
              {hoursError}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
};
export default SectionHours;
