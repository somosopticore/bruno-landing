"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Mic, Phone, MessageSquare } from "lucide-react";
import { AdminNumbersField } from "./admin-numbers-field";
import { FeatureRow } from "./feature-row";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const SectionPermissions: React.FC = () => {
  const { control, register } = useFormContext();

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

      {/* WhatsApp Support & Comments Block */}
      <div className="p-5 bg-[#2B1810]/30 border border-border-sutil rounded-xl space-y-5 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-text-primario flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-acento-primario" />
              ¿Tenés alguna duda o consulta?
            </h4>
            <p className="text-xs text-text-secundario leading-relaxed max-w-[340px]">
              Escribile directamente a nuestro equipo por WhatsApp para ayudarte al instante.
            </p>
          </div>
          <a
            href="https://wa.me/5493517302559?text=Hola!%20Tengo%20una%20consulta%20sobre%20el%20onboarding%20de%20Bruno."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-lg cursor-pointer"
          >
            Preguntar por WhatsApp
          </a>
        </div>

        <div className="border-t border-border-sutil/30 pt-4 space-y-2">
          <Label htmlFor="comments">Comentarios o notas para Bruno</Label>
          <Textarea
            id="comments"
            placeholder="Opcional. Escribí detalles especiales sobre tu local, preferencias de atención o cualquier aclaración..."
            className="min-h-[100px] text-xs leading-relaxed"
            {...register("comments")}
          />
          <p className="text-[10px] text-text-muted">
            Este comentario se enviará con tu ficha técnica para que el equipo de Opticore lo tenga en cuenta en la configuración.
          </p>
        </div>
      </div>
    </motion.section>
  );
};
export default SectionPermissions;
