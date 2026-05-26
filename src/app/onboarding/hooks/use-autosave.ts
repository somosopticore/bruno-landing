"use client";

import { useEffect, useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { OnboardingData } from "../lib/schema";

export function useAutosave(form: UseFormReturn<OnboardingData>) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [timeAgoText, setTimeAgoText] = useState<string>("");
  const formValuesRef = useRef<OnboardingData | null>(null);

  // Cargar borrador de localStorage en el montaje del componente
  useEffect(() => {
    const draft = localStorage.getItem("bruno_onboarding_draft_v1");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        form.reset(parsed);
        formValuesRef.current = parsed;
        setLastSaved(new Date());
      } catch (e) {
        console.error("Error al cargar el borrador de onboarding:", e);
      }
    } else {
      formValuesRef.current = form.getValues();
    }
  }, [form]);

  // Intervalo de autosalvado cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const values = form.getValues();
      const stringifiedCurrent = JSON.stringify(values);
      const stringifiedPrevious = JSON.stringify(formValuesRef.current || {});

      if (stringifiedCurrent !== stringifiedPrevious) {
        setIsSaving(true);
        // Simular un delay sutil de escritura
        setTimeout(() => {
          localStorage.setItem("bruno_onboarding_draft_v1", stringifiedCurrent);
          formValuesRef.current = values;
          setLastSaved(new Date());
          setIsSaving(false);
        }, 300);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [form]);

  // Actualizar el texto del indicador de guardado cada segundo
  useEffect(() => {
    if (!lastSaved) return;

    const updateText = () => {
      const diffMs = new Date().getTime() - lastSaved.getTime();
      const diffSec = Math.max(0, Math.floor(diffMs / 1000));

      if (diffSec < 2) {
        setTimeAgoText("Guardado ahora");
      } else if (diffSec < 60) {
        setTimeAgoText(`Guardado · hace ${diffSec}s`);
      } else {
        const mins = Math.floor(diffSec / 60);
        setTimeAgoText(`Guardado · hace ${mins}m`);
      }
    };

    updateText();
    const textInterval = setInterval(updateText, 1000);
    return () => clearInterval(textInterval);
  }, [lastSaved]);

  return { isSaving, lastSaved, timeAgoText };
}
export default useAutosave;
