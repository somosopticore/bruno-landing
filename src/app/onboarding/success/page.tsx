"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function OnboardingSuccessPage() {
  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-4">
      {/* Glow Effects */}
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-success/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-acento-primario/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[500px]"
      >
        <Card className="p-8 text-center space-y-6 bg-bg-card/45 backdrop-blur-xl relative overflow-hidden">
          {/* Confetti / Sparkle visual hint */}
          <div className="absolute top-4 left-4 text-acento-primario/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="absolute bottom-4 right-4 text-acento-primario/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          {/* Animated Check Circle */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 15 }}
              className="w-20 h-20 rounded-full bg-success/10 border border-success/30 flex items-center justify-center text-success shadow-[0_0_24px_rgba(143,170,91,0.25)]"
            >
              <CheckCircle2 className="w-10 h-10 stroke-[1.8]" />
            </motion.div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h2 className="font-serif text-3xl font-bold text-text-primario tracking-tight">
              ¡Onboarding completado!
            </h2>
            <div className="h-0.5 w-12 bg-acento-primario mx-auto rounded-full" />
            <p className="text-sm text-text-secundario leading-relaxed max-w-[380px] mx-auto">
              Bruno está estudiando tu carta. En menos de 24hs te escribimos para activar tu maître digital.
            </p>
          </div>

          <SeparatorWrapper />

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <Link href="https://wa.me/message/opticore" target="_blank" passHref className="w-full">
              <Button className="w-full h-12 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-bg-primary fill-bg-primary" />
                Chatear con soporte en WhatsApp
              </Button>
            </Link>

            <Link href="/" passHref className="w-full">
              <Button
                variant="secondary"
                className="w-full h-12 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider"
              >
                <Home className="w-4 h-4" />
                Volver al sitio principal
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// Separador local para evitar imports extras
const SeparatorWrapper = () => (
  <div className="bg-border-sutil shrink-0 h-[1px] w-full" />
);
