"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Save, CheckCircle2, AlertTriangle, Loader2, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { onboardingSchema, OnboardingData } from "../lib/schema";
import { submitOnboarding } from "../lib/submit";
import { useAutosave } from "../hooks/use-autosave";

import { BrandPanel } from "./brand-panel";
import { StepIndicator } from "./step-indicator";
import { SectionIdentity } from "./section-identity";
import { SectionMenu } from "./section-menu";
import { SectionHours } from "./section-hours";
import { SectionPermissions } from "./section-permissions";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const OnboardingForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [activeStep, setActiveStep] = useState<string>("identity");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onBlur",
    defaultValues: {
      business_name: "",
      environments: ["Salón", "Exterior", "Patio"],
      menu: "",
      business_hours: "",
      admin_numbers: [""],
      audio_transcription: true,
      voice_calls: false,
      comments: "",
    },
  });

  const {
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid: formIsValid },
  } = methods;

  // Habilitar Autosave silencioso cada 4 segundos
  const { isSaving, timeAgoText } = useAutosave(methods);

  // Observar qué sección está visible para actualizar el Stepper izquierdo
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -45% 0px", // centrado en viewport
      threshold: 0.05,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const step = entry.target.getAttribute("data-step");
          if (step) {
            setActiveStep(step);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const sections = document.querySelectorAll("section[data-step]");
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  // Calcular de forma proactiva qué secciones están completas y válidas
  const bName = watch("business_name") || "";
  const bMenu = watch("menu") || "";
  const bHours = watch("business_hours") || "";
  const bAdmins = watch("admin_numbers") || [];

  const completedSteps: Record<string, boolean> = {
    identity: !errors.business_name && bName.trim().length >= 2,
    menu: !errors.menu && bMenu.trim().length >= 40,
    hours: !errors.business_hours && bHours.trim().length >= 10,
    permissions:
      !errors.admin_numbers &&
      bAdmins.length >= 1 &&
      bAdmins.every((num) => /^\d{11,15}$/.test(num)),
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = completedCount * 25;
  const isFormValid = completedCount === 4;

  const handleManualSave = () => {
    const values = methods.getValues();
    localStorage.setItem("bruno_onboarding_draft_v1", JSON.stringify(values));
    toast.success("Borrador guardado correctamente", {
      description: "Tus datos se guardaron en tu navegador.",
      duration: 3000,
    });
  };

  const onSubmit = async (data: OnboardingData) => {
    setIsSubmitting(true);
    try {
      const response = await submitOnboarding(data);
      if (response.success) {
        // Guardar submission en localStorage y en el backend real
        try {
          const submissionsStr = localStorage.getItem("bruno_onboarding_submissions_v1");
          let submissions = [];
          if (submissionsStr) {
            submissions = JSON.parse(submissionsStr);
          }
          const newSubmission = {
            id: String(Date.now()),
            name: data.business_name,
            slug: data.business_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            environments: data.environments,
            status: "ACTIVO" as const,
            reservationsToday: 0,
            adminNumbers: data.admin_numbers,
            audioTranscription: data.audio_transcription,
            voiceCalls: data.voice_calls,
            businessHours: data.business_hours,
            menu: data.menu,
            comments: data.comments || "",
            submittedAt: new Date().toISOString(),
          };

          // Persistir en el backend real
          const apiRes = await fetch("/api/submissions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...newSubmission,
              token: token // Inyección del token extraído de la URL
            })
          });

          if (apiRes.status === 403) {
            toast.error("Enlace inválido o expirado", {
              description: "El enlace de invitación ha expirado o ya fue utilizado.",
              duration: 5000,
            });
            setIsSubmitting(false);
            return;
          }

          // Si el servidor lo acepta, guardamos localmente también
          submissions.push(newSubmission);
          localStorage.setItem("bruno_onboarding_submissions_v1", JSON.stringify(submissions));
        } catch (err) {
          console.error("Error saving submission:", err);
        }

        // Limpiar borrador local al tener éxito
        localStorage.removeItem("bruno_onboarding_draft_v1");
        
        // Redirigir a success
        router.push("/onboarding/success");
      } else {
        // Mostrar errores devueltos por el servidor
        toast.error("Error al procesar el onboarding", {
          description: "Por favor revisá los campos con errores marcados.",
        });
        
        // Ejecutar validaciones locales para pintar bordes de error
        trigger();
      }
    } catch (e) {
      toast.error("Ocurrió un error inesperado", {
        description: "Revisá tu conexión y volvé a intentarlo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center px-4 relative overflow-hidden bg-zinc-950/20">
        {/* Glows de fondo */}
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-rose-500/5 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[500px] bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 relative z-10">
          <div className="mx-auto h-16 w-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center rounded-2xl shadow-inner animate-pulse">
            <Lock className="w-7 h-7" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-zinc-100 tracking-wide">
              Acceso Protegido
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              Para registrar tu restaurante en Bruno, necesitas un enlace de invitación válido emitido por <span className="text-acento-primario font-bold">Opticore</span>. Si eres cliente, por favor solicita tu enlace a tu asesor.
            </p>
          </div>

          <div className="border-t border-zinc-800/80 pt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 w-full"
            >
              Volver a la página principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      {/* Mobile Top Stepper */}
      <StepIndicator activeStep={activeStep} progressPercent={progressPercent} />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 md:py-10">
        
        {/* Left Side Panel (Desktop only) */}
        <BrandPanel
          activeStep={activeStep}
          completedSteps={completedSteps}
          progressPercent={progressPercent}
        />

        {/* Right Side Scrollable Form */}
        <div className="flex-1 lg:max-w-[60%] space-y-12">
          {/* Header de Autosave arriba a la derecha */}
          <div className="flex justify-between items-center pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">
              Paso a paso de tu maître
            </span>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-text-secundario">
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-acento-primario animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                timeAgoText && (
                  <span className="text-text-muted flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    {timeAgoText}
                  </span>
                )
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 pb-24">
            {/* Paso 1: Identidad */}
            <SectionIdentity />
            
            <Separator />

            {/* Paso 2: Carta y Ambientes */}
            <SectionMenu />

            <Separator />

            {/* Paso 3: Operación y Turnos */}
            <SectionHours />

            <Separator />

            {/* Paso 4: Canales y Permisos */}
            <SectionPermissions />

            {/* Form Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-bg-primary/80 backdrop-blur-md border-t border-border-sutil px-4 py-4 z-30 sm:px-6 lg:relative lg:bg-transparent lg:backdrop-blur-none lg:border-t-0 lg:px-0 lg:py-6">
              <div className="max-w-[1200px] mx-auto lg:max-w-none flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Estado de validación */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  {isFormValid ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-success">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      Listo para enviar
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-acento-secundario">
                      <AlertTriangle className="w-4 h-4" />
                      Faltan {4 - completedCount} paso{4 - completedCount > 1 ? "s" : ""} obligatorio{4 - completedCount > 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {/* Guardar Borrador manual */}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleManualSave}
                    className="text-text-secundario font-bold hover:text-text-primario flex items-center gap-1.5 h-12"
                  >
                    <Save className="w-4 h-4" />
                    Guardar borrador
                  </Button>

                  {/* Submit CTA */}
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    isLoading={isSubmitting}
                    className="flex-1 sm:flex-none h-12 font-bold px-6 uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Preparando tu maître…" : (
                      <>
                        Activar a Bruno
                        <Sparkles className="w-4 h-4 text-bg-primary fill-bg-primary" />
                      </>
                    )}
                  </Button>
                </div>

              </div>
            </div>
            {/* Agency Footer */}
            <div className="pt-8 pb-12 border-t border-border-sutil/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
              <div className="flex items-center gap-1">
                <span>Bruno es un maître digital desarrollado por</span>
                <a
                  href="https://somosopticore.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-acento-primario hover:underline"
                >
                  OptiCore
                </a>
              </div>
              <Link href="/" className="hover:text-text-primario transition-colors font-semibold flex items-center gap-1.5 cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver a la página principal
              </Link>
            </div>
          </form>
        </div>

      </div>
    </FormProvider>
  );
};
export default OnboardingForm;
