"use client";

import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

export const AdminNumbersField: React.FC = () => {
  const {
    register,
    control,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "admin_numbers",
  });

  // Mapa para controlar qué índices muestran el checkmark de validación exitosa temporal
  const [successIndices, setSuccessIndices] = useState<Record<number, boolean>>({});

  const handleBlur = async (index: number) => {
    // Validar el campo específico
    const isValid = await trigger(`admin_numbers.${index}`);
    
    // Obtener valor actual
    const value = getValues(`admin_numbers.${index}`);
    
    if (isValid && value) {
      setSuccessIndices((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setSuccessIndices((prev) => ({ ...prev, [index]: false }));
      }, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Escape") {
      e.preventDefault();
      // Limpiar el input al presionar Esc
      setValue(`admin_numbers.${index}`, "");
      trigger(`admin_numbers.${index}`);
    }
  };

  const phoneErrors = errors.admin_numbers as any;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label>Números de Administrador</Label>
        <Tooltip
          content={
            <div className="space-y-1.5">
              <p className="font-bold text-text-primario flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-acento-primario" /> Formato Requerido
              </p>
              <p>Solo dígitos. Sin espacios, guiones ni símbolo "+".</p>
              <p className="text-acento-primario font-mono mt-1">
                Ej: 5493514567890
              </p>
              <p className="text-[10px] text-text-muted">
                (Código de país 54 + prefijo móvil 9 + cód. de área + número)
              </p>
            </div>
          }
        >
          <button
            type="button"
            className="text-text-muted hover:text-acento-primario transition-colors cursor-pointer"
            aria-label="Información de formato"
          >
            <Info className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      <div className="space-y-3" aria-live="polite">
        {fields.map((field, index) => {
          const hasError = !!phoneErrors?.[index];
          const hasSuccess = successIndices[index];

          return (
            <div key={field.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    {...register(`admin_numbers.${index}` as const)}
                    placeholder="Ej: 5493514567890"
                    error={hasError}
                    success={hasSuccess}
                    onBlur={() => handleBlur(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="pr-10 bg-bg-primary"
                  />
                  {/* Icono de validación exitosa sutil */}
                  {hasSuccess && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Botón borrar (deshabilitado si es el único para cumplir min:1) */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  className="px-3 text-text-muted hover:text-error hover:bg-bg-hover h-11"
                  aria-label={`Eliminar administrador número ${index + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Mensaje de error individual */}
              {hasError && (
                <p className="text-xs text-error font-medium pl-1">
                  {phoneErrors[index]?.message || "Número no válido"}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Botón agregar otro */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => append("")}
        className="w-full sm:w-auto h-9 px-4 font-bold flex items-center justify-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        Agregar otro administrador
      </Button>

      {/* Helper text permanente y prominente */}
      <div className="p-3.5 bg-bg-card/50 border border-border-sutil/60 rounded-lg text-xs text-text-secundario leading-relaxed">
        <span className="font-bold text-acento-primario block mb-1">
          ⚠️ Formato telefónico obligatorio:
        </span>
        Solo números. Sin el prefijo <strong>"+"</strong>, sin espacios y sin guiones. 
        <span className="block mt-1 font-mono text-text-primario bg-bg-primary/70 px-2 py-1 rounded inline-block">
          Ejemplo correcto: 5493514567890
        </span>
      </div>

      {errors.admin_numbers && !Array.isArray(errors.admin_numbers) && (
        <p className="text-xs text-error font-semibold" role="alert">
          {(errors.admin_numbers as any).message}
        </p>
      )}
    </div>
  );
};
export default AdminNumbersField;
