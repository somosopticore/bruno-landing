# Design Tokens - Bruno Onboarding

Documento de investigación visual y tokens de diseño extraídos de la landing page pública de [Bruno](https://bruno.somosopticore.com).

## 1. Paleta de Colores (Fiel al sitio real)

### Primarios y Acentos
* **Acento Primario (Dorado de marca)**: `#C19A5B` (mapeado a `--color-acento-primario`). Es el color de acento principal del logotipo, los bordes activos y los CTAs secundarios de realce.
* **Acento Secundario (Naranja/Coral de acento)**: `#D4574E` (mapeado a `--color-acento-secundario`). Usado para el detalle del labio del logo, toques cálidos adicionales y estados interactivos selectos.
* **Fondo Principal**: `#1A0F0A` (mapeado a `--color-bg-primary`). Un marrón muy oscuro y profundo, con baja saturación, que evita la dureza del negro puro y aporta calidez premium.
* **Fondo de Card/Superficie**: `#2B1810` (mapeado a `--color-bg-card`). Un tono marrón ligeramente más claro para elevación de contenedores y paneles de contenido.
* **Fondo de Hover**: `#3A2218` (mapeado a `--color-bg-hover`). Estado hover para botones vacíos o tarjetas interactivas.

### Neutrales y Semánticos
* **Texto Primario**: `#F5E6D3` (mapeado a `--color-text-primario`). Color crema muy suave que contrasta de manera armónica sobre el fondo oscuro sin agresión visual.
* **Texto Secundario**: `#B8A282` (mapeado a `--color-text-secundario`). Tono arena medio para descripciones, leyendas secundarias y textos de ayuda.
* **Texto Muted/Desactivado**: `#6B5847` (mapeado a `--color-text-muted`). Tono marrón apagado para bordes inactivos o textos deshabilitados.
* **Borde Sutil**: `#3D2820` (mapeado a `--color-border-sutil`). El color de los separadores y bordes de tarjetas que delimita suavemente los espacios.
* **Semántico Éxito (Success)**: `#8FAA5B` (mapeado a `--color-success`). Un verde oliva atenuado de baja saturación que se usa para checks e indicadores de éxito.
* **Semántico Error (Destructive)**: `#B85450` (mapeado a `--color-error`). Un rojo suavemente desaturado para errores y estados inválidos.

---

## 2. Tipografía y Jerarquía

* **Fuente de Display (Serif)**: `Playfair Display` (cargada vía Google Fonts con pesos `400`, `700`, y `900`). Se utiliza para los encabezados principales de sección (`text-h1`, `text-h2`), con un tracking ceñido (`tracking-[-0.02em]`) y un line-height muy compacto para darle ese estilo de editorial premium.
* **Fuente de Cuerpo (Sans-Serif)**: `Inter` (pesos `400`, `500`, `600`, y `700`). Usada para todo el texto de interfaz, inputs, etiquetas y párrafos comunes.
* **Fuente Monoespaciada (Mono)**: `ui-monospace`, `SFMono-Regular`, `Menlo`, etc. Se reserva para campos específicos como el editor del menú o la carta para que mantenga su alineación y formato.
* **Estilo Micro-Headers (Small Caps)**:
  * Texto en mayúsculas (`uppercase`).
  * Tamaño extra pequeño (`text-xs`).
  * Tracking ensanchado (`letter-spacing: 0.18em` o `tracking-widest`).
  * Color atenuado al 60% (`text-text-secundario` o `text-text-muted`).
  * Acompañado de separadores horizontales tenues.

---

## 3. Espaciado y Radios

* **Bordes y Esquinas**:
  * Esquinas de contenedores principales / cards: `12px` (`rounded-xl` / `radius-xl` en Tailwind v4).
  * Esquinas de botones y inputs: `8px` (`rounded-lg` / `radius-lg`).
  * Chips interactivos y badges redondos: `9999px` (`rounded-full`).
* **Paddings de Tarjetas**:
  * Desktop: `32px` (`p-8`).
  * Mobile: `24px` o `16px` (`p-6` o `p-4`).
* **Gaps y Espaciados verticales**:
  * Entre secciones principales: `48px` - `64px` (`gap-12` a `gap-16`).
  * Entre campos y etiquetas: `8px` - `10px` (`space-y-2` o `gap-2.5`).

---

## 4. Efectos Visuales y Animaciones

* **Efectos de Contenedores y Glassmorphism**:
  * Backdrop blur de `12px` combinado con un color de fondo semi-transparente de la card: `background: rgba(43, 24, 16, 0.7)`.
  * Textura de grano/ruido de fondo: Un elemento global `body::before` con un SVG de ruido fractal al `5%` de opacidad (`pointer-events-none`) que le otorga una sensación de material rugoso premium.
* **Sombras (Shadows)**:
  * Multi-capa oscuras para simular profundidad profunda. Ejemplo: `shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]` para el teléfono flotante.
* **Glow/Resplandor**:
  * Text-shadow dorado de marca: `text-shadow: 0 0 15px rgba(193, 154, 91, 0.65)`.
  * Gradiente de texto de marca: de dorado `#C19A5B` a crema `#F5E6D3`.
  * Resplandores de fondo flotantes: Círculos grandes difuminados con `blur-[120px]` y animaciones lentas de flotado (`float-glow-1` y `float-glow-2`).
* **Curvas de Animación y Transiciones**:
  * Hover / Focus: Transición rápida y fluida de `150ms` con curva `ease-out`.
  * Entradas de sección: Desplazamiento sutil hacia arriba (`y: 12` a `y: 0`) y aparición gradual (`opacity: 0` a `1`) con duración de `0.4s` usando curvas spring o cubic-bezier fluidas.
  * Cambios de chips: Efecto de rebote ligero (`scale: 0.96` al presionar, `1.0` al soltar).
