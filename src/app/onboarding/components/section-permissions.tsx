"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Mic, Phone } from "lucide-react";
import { AdminNumbersField } from "./admin-numbers-field";
import { FeatureRow } from "./feature-row";

export const SectionPermissions: React.FC = () => {
  const { control } = useFormContext();

  return (
    <motion.section
      id="permissions"
      data-step="permissions"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 scroll-mt-20"
    >
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-acento-primario">
          PERMISOS Y CANALES · PASO 04
        </span>
        <h3 className="font-serif text-2xl font-bold text-text-primario">
          Quién manda y por dónde habla.
        </h3>
        <p className="text-sm text-text-secundario leading-relaxed">
          Decidí quién puede activar el panel de control y qué canales le habilitamos a Bruno.
        </p>
      </div>

      {/* Admin numbers list */}
      <AdminNumbersField />

      {/* Feature Switches */}
      <div className="space-y-4 pt-2">
        <Controller
          name="audio_transcription"
          control={control}
          render={({ field }) => (
            <FeatureRow
              icon={<Mic className="w-5 h-5 stroke-[1.8]" />}
              title="Transcripción de notas de voz"
              description="Bruno escucha y procesa los audios de reserva que mandan tus clientes. Si lo desactivás, va a solicitar texto de forma cortés."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          name="voice_calls"
          control={control}
          render={({ field }) => (
            <FeatureRow
              icon={<Phone className="w-5 h-5 stroke-[1.8]" />}
              title="Atención de llamadas de voz (IVR/IA)"
              description="Bruno responde llamadas entrantes con voz artificial natural y acento local. Ideal para clientes que prefieren hablar en lugar de escribir."
              checked={field.value}
              onChange={field.onChange}
              betaBadge
            />
          )}
        />
      </div>
    </motion.section>
  );
};
export default SectionPermissions;
