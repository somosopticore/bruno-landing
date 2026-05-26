# Bruno - Landing & Onboarding

Este es el repositorio del producto **Bruno** (maître digital con IA para restaurantes argentinos), de la agencia OptiCore. 

Contiene tanto la landing page pública como el formulario premium de onboarding `/onboarding` para clientes que ya han firmado el servicio.

---

## Estructura de Archivos del Onboarding

Los archivos relativos a la interfaz de onboarding se encuentran organizados de la siguiente manera:

```text
/src
  /components
    /ui
      button.tsx             # Botones interactivos con variantes
      input.tsx              # Input de texto con estados de éxito/error
      textarea.tsx           # Textarea configurable (monoespaciado en carta)
      label.tsx              # Label accesible
      switch.tsx             # Switch interactivo con Framer Motion
      separator.tsx          # Divisor horizontal de marca
      card.tsx               # Contenedores elevados y con blur
      tooltip.tsx            # Tooltips de información contextual
  /app
    /onboarding
      layout.tsx             # Layout limpio con Toaster global
      page.tsx               # Server Component contenedor de la ruta
      /components
        onboarding-form.tsx  # Controlador del formulario, Intersection Observer y autosave
        brand-panel.tsx      # Panel izquierdo con Stepper y barra de progreso animada
        step-indicator.tsx   # Progreso horizontal flotante para mobile/tablet
        environments-field.tsx # Selector de ambientes (chips sugeridos y tags custom)
        admin-numbers-field.tsx # Editor de teléfonos con validación de blur
        feature-row.tsx      # Fila de configuración de audio y llamadas (beta)
        section-identity.tsx # Paso 1 - Identidad de negocio
        section-menu.tsx     # Paso 2 - Carga de carta y distribución
        section-hours.tsx    # Paso 3 - Horarios de cocina
        section-permissions.tsx # Paso 4 - Permisos de administrador y canales
      /hooks
        use-autosave.ts      # Autosave en localStorage cada 4 segundos
      /lib
        schema.ts            # Esquemas de datos Zod y tipos TypeScript
        submit.ts            # Server Action de envío
      /success
        page.tsx             # Página final de confirmación de onboarding exitoso
```

---

## Cómo Correr el Proyecto Localmente

### 1. Prerrequisitos
Asegurate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).

### 2. Instalar dependencias
Desde la raíz del proyecto (`bruno-landing`), instalá los paquetes:
```bash
npm install
```

*Nota: El proyecto utiliza Next.js 16 y React 19. Si surge algún warning de dependencias de terceros, npm resolverá correctamente mediante las flags internas del proyecto.*

### 3. Iniciar el servidor de desarrollo
Iniciá el servidor local:
```bash
npm run dev
```

### 4. Acceder a las rutas
Abrí tu navegador e ingresá a:
* **Landing Page**: [http://localhost:3000](http://localhost:3000)
* **Formulario de Onboarding**: [http://localhost:3000/onboarding](http://localhost:3000/onboarding)
* **Página de éxito**: [http://localhost:3000/onboarding/success](http://localhost:3000/onboarding/success)

### 5. Compilar para producción
Para compilar y verificar tipos estrictos:
```bash
npm run build
```
Y luego levantá la build:
```bash
npm run start
```

---

## Características de Diseño y Terminación Premium
* **Textura de Grano Fractal**: Aplicada en el fondo global mediante SVG en CSS para dar sensación física.
* **Resplandores de Fondo**: Elipses desenfocadas de marca que flotan y se mueven lentamente.
* **Autosave Silencioso**: Guarda el estado del formulario en `localStorage` cada 4s al detectar cambios, mostrando el tiempo transcurrido (ej: "Guardado · hace 12s").
* **Validación Visual Háptica**: Inputs interactivos que titilan un checkmark verde de validación exitosa por 1.5s en Blur, o se tornan destructivos si son incorrectos.
* **Intersection Observer**: El stepper izquierdo vertical sincroniza automáticamente el paso activo con el scroll del usuario por la página en tiempo real.
