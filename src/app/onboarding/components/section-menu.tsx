"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, X, File, Check, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EnvironmentsField } from "./environments-field";
import { toast } from "sonner";

export const SectionMenu: React.FC = () => {
  const {
    control,
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  const [activeTab, setActiveTab] = useState<"text" | "pdf">("text");
  const [pdfFile, setPdfFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuText = watch("menu_text") || "";
  const pdfName = watch("menu_pdf_name") || "";
  const pdfSize = watch("menu_pdf_size") || "";
  const menuError = (errors.menu_text?.message as string) || (errors.menu_pdf_name?.message as string);

  // Restaurar estado del PDF si se está recuperando un borrador del localStorage
  useEffect(() => {
    if (pdfName) {
      setPdfFile({
        name: pdfName,
        size: pdfSize || "Desconocido",
      });
      setActiveTab("pdf");
    } else {
      // Fallback para borradores antiguos
      // @ts-ignore
      const oldMenu = watch("menu") || "";
      if (oldMenu.startsWith("[CARTA EN PDF ADJUNTADA]")) {
        const lines = oldMenu.split("\n");
        const nameLine = lines.find((l: string) => l.startsWith("Archivo:"));
        const sizeLine = lines.find((l: string) => l.startsWith("Tamaño:"));
        const fileName = nameLine ? nameLine.replace("Archivo: ", "") : "carta.pdf";
        const fileSize = sizeLine ? sizeLine.replace("Tamaño: ", "") : "0 KB";
        
        setPdfFile({
          name: fileName,
          size: fileSize,
        });
        setValue("menu_pdf_name", fileName);
        setValue("menu_pdf_size", fileSize);
        setActiveTab("pdf");
      } else if (oldMenu) {
        setValue("menu_text", oldMenu);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Formato no soportado", {
        description: "Por favor, subí un archivo en formato PDF.",
      });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("Archivo demasiado grande", {
        description: "El tamaño máximo permitido es de 15MB.",
      });
      return;
    }

    // Simular carga de archivo premium con barra de progreso
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const sizeInKB = Math.round(file.size / 1024);
            const sizeStr = sizeInKB > 1024 
              ? `${(sizeInKB / 1024).toFixed(1)} MB` 
              : `${sizeInKB} KB`;

            setPdfFile({
              name: file.name,
              size: sizeStr,
            });
            setUploadProgress(null);
            
            // Rellenar los campos de hook-form
            setValue("menu_pdf_name", file.name);
            setValue("menu_pdf_size", sizeStr);
            setValue("menu_text", ""); // Limpiar texto libre para no confundir
            trigger(["menu_text", "menu_pdf_name"]);
            
            toast.success("Archivo cargado con éxito", {
              description: `"${file.name}" está listo para ser analizado por Bruno.`,
            });
          }, 350);
          return 100;
        }
        return prev + 10;
      });
    }, 70);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPdfFile(null);
    setValue("menu_pdf_name", "");
    setValue("menu_pdf_size", "");
    trigger(["menu_text", "menu_pdf_name"]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Archivo eliminado", {
      description: "Pegá el texto de tu carta o subí otro archivo PDF.",
    });
  };

  const menuPlaceholder = `[ENTRADAS]
- Provoleta Moyo: Con tomates confitados, pesto de rúcula y almendras tostadas. $8.500
- Empanada Criolla: De carne cortada a cuchillo, frita, bien jugosa. $2.200

[PRINCIPALES]
- Ojo de Bife 400g: Con papas rústicas y manteca de chimichurri. Cocción sugerida: a punto. $18.900
- Ravioles de Cordero: Con salsa demiglace de hongos de pino y verdeo. $15.500

[BEBIDAS & VINOS]
- Malbec Gran Reserva Moyo (Copa / Botella): $3.500 / $14.000
- Limonada casera con menta y jengibre: $3.000`;

  return (
    <motion.section
      id="menu"
      data-step="menu"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 scroll-mt-20"
    >
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-acento-primario">
          CARTA Y AMBIENTES · PASO 02
        </span>
        <h3 className="font-serif text-2xl font-bold text-text-primario">
          El conocimiento base de tu maître.
        </h3>
        <p className="text-sm text-text-secundario leading-relaxed">
          Bruno responde lo que le enseñes acá. Si un cliente pregunta por celíacos, vinos o mesa
          en el patio, esto es lo que va a leer primero.
        </p>
      </div>

      {/* Environments field array (Chips) */}
      <div className="space-y-2">
        <Label>Distribución de ambientes</Label>
        <Controller
          name="environments"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <EnvironmentsField
              value={field.value}
              onChange={field.onChange}
              error={error?.message}
            />
          )}
        />
      </div>

      {/* Selector de modo de Carta */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Carta, menú y opciones gastronómicas</Label>
          
          {/* Tabs */}
          <div className="flex gap-1.5 p-1 bg-bg-primary border border-border-sutil rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab("text");
                // Si eliminamos el PDF, vaciamos para forzar revalidación
                if (pdfFile) {
                  setPdfFile(null);
                  setValue("menu_pdf_name", "");
                  setValue("menu_pdf_size", "");
                  trigger(["menu_text", "menu_pdf_name"]);
                }
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                activeTab === "text"
                  ? "bg-acento-primario text-bg-primary"
                  : "text-text-secundario hover:text-text-primario hover:bg-bg-card"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Texto
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("pdf");
                // Si veníamos de texto y tenía datos, limpiamos para no confundir
                if (menuText) {
                  setValue("menu_text", "");
                  trigger(["menu_text", "menu_pdf_name"]);
                }
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                activeTab === "pdf"
                  ? "bg-acento-primario text-bg-primary"
                  : "text-text-secundario hover:text-text-primario hover:bg-bg-card"
              }`}
            >
              <File className="w-3.5 h-3.5" />
              PDF
            </button>
          </div>
        </div>

        {activeTab === "text" ? (
          /* Modo: Pegar Texto */
          <div className="space-y-2">
            <div className="relative">
              <Textarea
                id="menu_text"
                isMono
                placeholder={menuPlaceholder}
                error={!!menuError}
                maxLength={15000}
                {...register("menu_text")}
                className="min-h-[300px] text-xs font-mono leading-relaxed"
              />
              <div className="absolute bottom-3 right-3 text-[9px] font-mono text-text-muted bg-bg-primary/80 px-2 py-0.5 rounded">
                {menuText.length.toLocaleString()} / 15.000
              </div>
            </div>

            <div className="flex justify-between items-start">
              <p className="text-xs text-text-muted font-medium max-w-[480px]">
                Copiá y pegá tu carta actual. Incluí descripciones, precios y aclaraciones de alérgenos
                (sin TACC, vegano, etc.). Cuanto más detalle, mejor responde Bruno.
              </p>
              {menuError && (
                <p className="text-xs text-error font-medium" role="alert">
                  {menuError}
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Modo: Subir PDF */
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />

            {uploadProgress !== null ? (
              /* Cargando */
              <div className="border border-border-sutil bg-bg-card rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="w-8 h-8 text-acento-primario animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-text-primario">Subiendo tu carta...</p>
                  <p className="text-xs text-text-muted">Procesando y analizando el archivo PDF</p>
                </div>
                <div className="w-48 h-1.5 bg-bg-primary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-acento-primario transition-all duration-75"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : pdfFile ? (
              /* Archivo cargado */
              <div className="border border-success/30 bg-[#2B1810]/40 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-lg bg-success/10 border border-success/30 flex items-center justify-center text-success shrink-0 shadow-inner">
                    <File className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="space-y-1 text-left">
                    <h4 className="text-sm font-bold text-text-primario flex items-center gap-1.5">
                      {pdfFile.name}
                      <Check className="w-3.5 h-3.5 text-success stroke-[3]" />
                    </h4>
                    <p className="text-xs text-text-secundario">
                      Tamaño: {pdfFile.size} · Listo para que Bruno lo analice
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleRemoveFile}
                  className="px-3 text-text-muted hover:text-error hover:bg-bg-hover h-11"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              /* Dropzone vacía */
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 bg-[#2B1810]/20 hover:bg-[#3A2218]/25 ${
                  isDragActive 
                    ? "border-acento-primario bg-[#3A2218]/40 shadow-[0_0_15px_rgba(193,154,91,0.15)]" 
                    : "border-border-sutil hover:border-acento-primario"
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-[#3A2218] border border-acento-primario/10 flex items-center justify-center text-acento-primario shadow-inner">
                  <Upload className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-text-primario">
                    Arrastrá tu carta en PDF acá o hacé click para buscar
                  </p>
                  <p className="text-xs text-text-secundario max-w-[360px] mx-auto leading-relaxed">
                    Subí tu carta en PDF (hasta 15MB). Bruno interpretará de forma automática los platos, ingredientes y precios.
                  </p>
                </div>
              </div>
            )}

            {menuError && (
              <p className="text-xs text-error font-medium" role="alert">
                {menuError}
              </p>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
};
export default SectionMenu;
