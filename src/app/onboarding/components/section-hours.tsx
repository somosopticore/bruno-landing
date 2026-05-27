"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const SectionHours: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const hoursText = watch("business_hours") || "";
  const hoursError = errors.business_hours?.message as string;
  const acceptsEvents = watch("accepts_events");
  const eventDetails = watch("event_details") || "";
  const eventDetailsError = errors.event_details?.message as string;

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
          Cuándo se sientan los comensales y eventos.
        </h3>
        <p className="text-sm text-text-secundario leading-relaxed">
          Bruno filtra reservas 24/7 contra estos horarios y sabe responder sobre la realización de eventos especiales.
        </p>
      </div>

      {/* Horarios de Atención */}
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

      {/* Sección Eventos y Cumpleaños */}
      <div className="space-y-4 pt-4 border-t border-border-sutil">
        <div className="space-y-2">
          <Label className="text-sm font-bold text-text-primario">
            ¿El local recibe eventos, cumpleaños o reuniones?
          </Label>
          <p className="text-xs text-text-secundario leading-relaxed">
            Esto permite que Bruno Bot responda preguntas sobre reservas grupales, capacidad y condiciones del salón.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("accepts_events", true, { shouldValidate: true })}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              acceptsEvents === true
                ? "bg-indigo-600/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)] text-text-primario"
                : "bg-bg-card/40 border-border-sutil text-text-secundario hover:border-text-muted"
            }`}
          >
            <span className="text-sm font-bold">Sí, recibimos eventos</span>
            <span className="text-[10px] text-text-muted mt-1">Cumpleaños, corporativos, etc.</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setValue("accepts_events", false, { shouldValidate: true });
              setValue("event_details", ""); // Limpiar detalles al decir que no
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
              acceptsEvents === false
                ? "bg-indigo-600/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)] text-text-primario"
                : "bg-bg-card/40 border-border-sutil text-text-secundario hover:border-text-muted"
            }`}
          >
            <span className="text-sm font-bold">No por el momento</span>
            <span className="text-[10px] text-text-muted mt-1">Solo reservas y mesas estándar</span>
          </button>
        </div>

        {/* Animate textarea appearance with framer-motion */}
        <AnimatePresence initial={false}>
          {acceptsEvents && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden space-y-2"
            >
              <div className="flex justify-between items-center">
                <Label htmlFor="event_details">Detalles y condiciones de los eventos</Label>
                <span className="text-[10px] font-mono text-text-muted font-bold">
                  {eventDetails.length} / 1000
                </span>
              </div>

              <Textarea
                id="event_details"
                placeholder="Ej: Aceptamos cumpleaños y eventos de hasta 40 personas. Contamos con menús fijos grupales, o tapeo con reserva previa. Se solicita una seña del 30%..."
                error={!!eventDetailsError || (acceptsEvents && eventDetails.trim().length < 10 && eventDetails.trim().length > 0)}
                maxLength={1000}
                {...register("event_details")}
                className="min-h-[120px] text-sm leading-relaxed"
              />

              <div className="flex justify-between items-start">
                <p className="text-xs text-text-muted font-medium max-w-[480px]">
                  Contanos las condiciones mínimas: cantidad de personas, menús especiales de grupo, reserva exclusiva del salón, señas, etc. (Mínimo 10 caracteres).
                </p>
                {eventDetailsError && (
                  <p className="text-xs text-error font-medium" role="alert">
                    {eventDetailsError}
                  </p>
                )}
                {!eventDetailsError && eventDetails.trim().length < 10 && eventDetails.trim().length > 0 && (
                  <p className="text-xs text-error font-medium" role="alert">
                    Faltan {10 - eventDetails.trim().length} caracteres más
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default SectionHours;
