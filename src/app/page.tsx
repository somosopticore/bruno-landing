"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircleOff,
  Users,
  Star,
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Menu,
  ChevronRight,
  ShieldCheck,
  Zap,
  Volume2,
  Calendar,
  Send,
  MessageSquareCode,
  MapPin,
  Clock,
  Heart,
  TrendingUp,
  Cpu,
  Server,
} from "lucide-react";

// Types for messages in the real-time chat
interface ChatMessage {
  id: string;
  sender: "client" | "bruno" | "system";
  text: string;
  timestamp: string;
  status?: "read" | "sent";
}

// Types for form values
interface FormValues {
  userName: string;
  whatsapp: string;
  email: string;
  mensaje: string;
}

// 3D Tilt Card wrapper component with running border gold beam
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Maximum tilt angles (degrees)
    const maxTilt = 8;
    const rotateX = -(mouseY / (height / 2)) * maxTilt;
    const rotateY = (mouseX / (width / 2)) * maxTilt;

    setCoords({ rotateX, rotateY, scale: 1.02 });
  };

  const handleMouseLeave = () => {
    setCoords({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`card-3d rounded-xl transition-all duration-200 ease-out relative overflow-hidden group p-[1px] ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) scale3d(${coords.scale}, ${coords.scale}, ${coords.scale})`,
        boxShadow: coords.scale > 1 
          ? "0 20px 40px -15px rgba(26, 15, 10, 0.7), 0 0 25px -5px rgba(193, 154, 91, 0.15)"
          : "0 4px 20px -10px rgba(0,0,0,0.5)",
      }}
    >
      {/* Rotating border gradient (Border Beam) - Centered 2000px square to guarantee coverage on all aspect ratios */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2000px] h-[2000px] bg-[conic-gradient(from_0deg,transparent_30%,#C19A5B_50%,#D4574E_60%,transparent_80%)] animate-[spin_6s_linear_infinite] opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      ></div>

      {/* Card content container with solid background covering the rotating gradient, leaving a 1px border */}
      <div className="relative w-full h-full bg-[#2B1810]/95 rounded-[11px] p-8 flex flex-col justify-between card-3d-inner z-10">
        {children}
      </div>
    </div>
  );
}

// Custom Cursor component (Wine Glass 🍷)
function WineCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-cursor-hover]")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    // Only apply if the device has a fine pointer (mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (mediaQuery.matches) {
      document.body.classList.add("custom-cursor-none");
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("mouseenter", handleMouseEnter);
      window.addEventListener("mouseover", handleMouseOver);
    }

    return () => {
      document.body.classList.remove("custom-cursor-none");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[10000] transition-transform duration-100 ease-out select-none hidden md:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${hovered ? 1.5 : 1})`,
      }}
    >
      {/* Dynamic Gold Wine Glass Cursor */}
      <div className="relative flex items-center justify-center">
        {/* Glow behind glass */}
        <div
          className={`absolute w-8 h-8 rounded-full bg-acento-primario/25 blur-sm transition-all duration-300 ${
            hovered ? "scale-150 opacity-50 bg-acento-secundario/30" : "scale-100 opacity-30"
          }`}
        ></div>
        
        {/* Wine glass SVG */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={hovered ? "#D4574E" : "#C19A5B"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-200 drop-shadow-[0_2px_4px_rgba(26,15,10,0.8)]"
        >
          {/* Wine Glass shape */}
          <path d="M6 3h12v7c0 3.3-2.7 6-6 6s-6-2.7-6-6V3Z" />
          <path d="M12 16v5" />
          <path d="M9 21h6" />
          {/* Liquid inside */}
          <path
            d="M7.5 9.5c1.5 0 2.5-1 4.5-1s3 1 4.5 1"
            stroke={hovered ? "#C19A5B" : "#D4574E"}
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}

// Custom Bruno Gold Logo SVG
function BrunoLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Wine glass combined with message bubble */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(193,154,91,0.2)]"
      >
        {/* Speech Bubble Base */}
        <path
          d="M85 45C85 61.57 69.33 75 50 75C44.42 75 39.14 73.88 34.45 71.86L15 78L21.75 60.1C17.47 55.77 15 50.62 15 45C15 28.43 30.67 15 50 15C69.33 15 85 28.43 85 45Z"
          stroke="#C19A5B"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Minimal Wine Glass inside */}
        <path
          d="M38 35H62V46C62 52.63 56.63 58 50 58C43.37 58 38 52.63 38 46V35Z"
          stroke="#C19A5B"
          strokeWidth="3"
        />
        <path d="M50 58V68" stroke="#C19A5B" strokeWidth="3" />
        <path d="M43 68H57" stroke="#C19A5B" strokeWidth="3" strokeLinecap="round" />
        {/* Wine Liquid inside */}
        <path
          d="M40.5 43C43.5 43 45.5 41.5 49.5 41.5C53.5 41.5 56.5 43 59.5 43"
          stroke="#D4574E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function BrunoLanding() {
  // FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form
  const [formValues, setFormValues] = useState<FormValues>({
    userName: "",
    whatsapp: "",
    email: "",
    mensaje: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormValues>>({});
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  // Real-Time Chat Simulator States
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fallbackCount, setFallbackCount] = useState(0);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "sys-1",
      sender: "system",
      text: "⚠️ Esta es una demostración ilustrativa. El agente real en producción utiliza modelos avanzados de IA y notificaciones vía Telegram/WhatsApp.",
      timestamp: "10:00",
    },
    {
      id: "1",
      sender: "bruno",
      text: "¡Hola! Soy Bruno, el asistente virtual de demostración. Atiendo tu salón las 24 horas. 🍷",
      timestamp: "10:00",
    },
    {
      id: "2",
      sender: "bruno",
      text: "Escribí tu consulta abajo para probar la demo, o elegí una opción rápida:",
      timestamp: "10:00",
    },
  ]);

  // Scroll to bottom of chat container (does not affect browser window scrolling)
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    if (formErrors[name as keyof FormValues]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Keyword-based conversational parsing logic with dynamic intriguing fallbacks
  const getSimulatedResponse = (input: string, currentFallbackCount: number): string => {
    const text = input.toLowerCase();
    
    // Greetings
    if (text.match(/(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hola bruno|hola!)/)) {
      return "¡Hola! Qué gusto saludarte. Soy el maître virtual del restaurante. Estoy listo para reservar mesas, pasarte la carta actual, alertarte por celíacos o coordinar eventos. ¿Qué andás necesitando? 🍕";
    }
    
    // Reservations
    if (text.match(/(reserva|reservar|mesa|personas|viernes|sabado|sábado|domingo|lunes|martes|miercoles|miércoles|jueves|noche|cenar|almorzar|comer|lugar|disponible)/)) {
      return "¡Por supuesto! Tengo disponibilidad en el salón principal o en mesa interior. Confirmame por favor: ¿para cuántas personas sería y en qué fecha/hora tenías pensado? 📅";
    }

    // Menu / TACC
    if (text.match(/(carta|menu|menú|tacc|celiaco|celíaco|veggie|vegetariano|comer|precios|precio|tienen|platos|entrada|postre|vino|bebida)/)) {
      return "¡Excelente elección! Tenemos opciones 100% aptas para celíacos (sin TACC) como nuestra Burrata con tomates rostizados ($12.500) o el Ojo de Bife madurado ($24.000), preparados en área aislada para evitar contaminación. ¿Te gustaría agendar una mesa y probarlos? 🍷";
    }

    // Events
    if (text.match(/(evento|cumple|cumpleaños|15|privado|salon|salón|festejo|fiesta|40|personas|grupo|cerrar)/)) {
      return "¡Qué lindo festejo! Sí, hacemos eventos privados y corporativos. Para grupos de más de 15 personas armamos menús cerrados o a la carta, y podés reservar el salón exclusivo. Decime la fecha estimada y te armamos una propuesta a medida. 🥂";
    }

    // Human contact / telegram
    if (text.match(/(humano|persona|contacto|hablar con alguien|atencion|soporte|ayuda|dueño|encargado|telefono|tel)/)) {
      return "Entiendo perfectamente. Ya le avisé al encargado por Telegram. Te va a estar respondiendo en este mismo chat en un minuto. Mientras tanto, decime si querés ver el menú. 📱";
    }

    // Dynamic looping / fallback counter triggers PNL hook
    if (currentFallbackCount === 0) {
      return "Esa es una buena pregunta. Como asistente inteligente me adapto al 100% a la carta y reglas de tu restaurante. De hecho, puedo responder cosas complejas sobre ingredientes o alérgenos en segundos. Si querés ver cómo Bruno maneja tus reservas reales y responde a tus clientes en vivo, te invito a dejarnos tus datos abajo para armar tu simulación personalizada. ¿Te gustaría que probemos simulando una reserva acá? 🍷";
    } else if (currentFallbackCount === 1) {
      return "Veo que querés poner a prueba mis límites, ¡me encanta! 😉 Bruno está diseñado sobre modelos de IA de última generación. No solo responde texto: gestiona turnos de mesa, asienta reservas en tu planilla en tiempo real y detecta al instante si un cliente necesita ser derivado a un humano enviándote una alerta por Telegram. Para ver el panel de control y cómo funciona todo por detrás, déjanos tu contacto en el formulario. Te va a sugerir un nuevo nivel de control.";
    } else {
      return "Ahí tocaste un punto clave del servicio. La respuesta completa a eso depende de la configuración de tu salón, y esa es la magia: no hay dos Brunos iguales, cada uno se entrena a medida. Para descubrir cómo se vería Bruno con el menú y los horarios de tu restaurante en WhatsApp, podés agendar una videollamada de 5 minutos haciendo click en el botón 'Agendar videollamada' al lado del formulario. ¿Te sumás a la demo virtual? 🚀";
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || userInput;
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "client",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "read",
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setUserInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      // Check if user input matches keywords
      const textLower = text.toLowerCase();
      const isKeyword = textLower.match(/(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hola bruno|hola!|reserva|reservar|mesa|personas|viernes|sabado|sábado|domingo|lunes|martes|miercoles|miércoles|jueves|noche|cenar|almorzar|comer|lugar|disponible|carta|menu|menú|tacc|celiaco|celíaco|veggie|vegetariano|comer|precios|precio|tienen|platos|entrada|postre|vino|bebida|evento|cumple|cumpleaños|15|privado|salon|salón|festejo|fiesta|40|personas|grupo|cerrar|humano|persona|contacto|hablar con alguien|atencion|soporte|ayuda|dueño|encargado|telefono|tel)/);

      const responseText = getSimulatedResponse(text, fallbackCount);
      
      // If it wasn't a keyword match, increment fallbackCount (up to 2)
      if (!isKeyword) {
        setFallbackCount((prev) => Math.min(prev + 1, 2));
      }

      const brunoMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "bruno",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, brunoMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormValues> = {};
    if (!formValues.userName.trim()) {
      errors.userName = "Tu nombre es requerido.";
    }
    if (!formValues.whatsapp.trim()) {
      errors.whatsapp = "El WhatsApp es requerido.";
    }
    if (!formValues.email.trim()) {
      errors.email = "El correo electrónico es requerido.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formValues.email)) {
        errors.email = "Ingresá un correo electrónico válido.";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormStatus("submitting");
    setServerErrorMessage("");

    try {
      const cleanedWhatsapp = formValues.whatsapp.startsWith("+")
        ? formValues.whatsapp
        : `+54 ${formValues.whatsapp}`;

      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          whatsapp: cleanedWhatsapp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus("success");
      } else {
        setFormStatus("error");
        setServerErrorMessage(data.error || "Hubo un error al enviar el formulario.");
      }
    } catch (error) {
      console.error(error);
      setFormStatus("error");
      setServerErrorMessage("Error de conexión. Intentá de nuevo.");
    }
  };

  return (
    <div className="flex-1 flex flex-col relative selection:bg-acento-primario selection:text-bg-primary">
      {/* Custom Wine Glass Cursor */}
      <WineCursor />

      {/* HERO & HEADER WRAPPER */}
      <div className="relative w-full overflow-hidden bg-transparent z-10">
        {/* Glows for Hero */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-acento-primario/10 blur-[130px] pointer-events-none animate-glow-1 z-0"></div>
        <div className="absolute top-[40%] left-[-15%] w-[450px] h-[450px] rounded-full bg-acento-secundario/5 blur-[120px] pointer-events-none animate-glow-2 z-0"></div>

        {/* HEADER / NAVIGATION */}
        <header className="w-full max-w-[1200px] mx-auto px-6 py-6 md:py-8 flex justify-between items-center z-50 relative">
          <a href="#" className="flex items-center gap-3 group focus:outline-none">
            <BrunoLogo className="w-9 h-9" />
            <span className="font-serif text-3xl font-black text-acento-primario tracking-tight transition-colors duration-200 group-hover:text-text-primario">
              Bruno
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-acento-secundario self-end mb-2.5"></span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <a href="#como-funciona" className="text-text-secundario hover:text-text-primario transition-colors duration-200">
              Cómo funciona
            </a>
            <a href="#ventajas" className="text-text-secundario hover:text-text-primario transition-colors duration-200">
              Ventajas
            </a>
            <a href="#demo-real" className="text-text-secundario hover:text-text-primario transition-colors duration-200">
              Chat en vivo
            </a>
            <a href="#faq" className="text-text-secundario hover:text-text-primario transition-colors duration-200">
              FAQ
            </a>
          </nav>
          <a
            href="/onboarding"
            className="px-5 py-2.5 bg-transparent border border-border-sutil rounded-lg text-xs font-bold uppercase tracking-wider text-acento-primario hover:bg-bg-hover hover:border-acento-primario hover:scale-105 transition-all duration-200 focus:outline-none shadow-md"
          >
            Probar Demo Gratis
          </a>
        </header>

        {/* SECCIÓN 1: HERO */}
        <section className="relative w-full max-w-[1200px] mx-auto px-6 pt-10 pb-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Columna Izquierda (Texto + PNL Copywriting) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-bg-card/70 border border-border-sutil rounded-full text-xs font-semibold tracking-wider text-text-secundario mb-6 uppercase shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse-fast"></span>
              Bruno Maître Virtual · Online las 24 horas
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-text-primario leading-[1.08] tracking-[-0.02em] mb-6">
              El silencio en WhatsApp es <br />
              <span className="text-acento-primario font-serif font-black bg-gradient-to-r from-acento-primario to-[#F5E6D3] bg-clip-text text-transparent">el ruido de mesas vacías.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-secundario font-normal leading-relaxed mb-8 max-w-[620px]">
              Mientras tu cocina arde y el salón está lleno, Bruno atiende tu WhatsApp en 1.8 segundos. Toma reservas, responde la carta, cuida a los celíacos y potencia tu ocupación sin que toques tu celular.
            </p>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <a
                href="/onboarding"
                className="px-8 py-4 bg-acento-primario text-bg-primary font-bold text-center rounded-lg shadow-[0_4px_20px_rgba(193,154,91,0.3)] transition-cta hover-cta flex items-center justify-center gap-2 focus:outline-none"
              >
                Quiero a Bruno en mi restaurante
                <ArrowRight className="w-5 h-5 stroke-[2]" />
              </a>
              <a
                href="#demo-real"
                className="px-6 py-4 bg-transparent text-text-primario font-semibold text-center hover:text-acento-primario transition-colors flex items-center justify-center gap-2 group"
              >
                Chatear con Bruno en vivo
                <span className="group-hover:translate-x-1 transition-transform">↓</span>
              </a>
            </div>

            <div className="w-full text-xs text-text-muted flex flex-wrap gap-x-6 gap-y-3 border-t border-border-sutil pt-6">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-acento-primario" />
                Cero contratos de permanencia
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-acento-primario" />
                Activación completa en 24hs
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-acento-primario" />
                Usa tu mismo número telefónico
              </span>
            </div>
          </div>

          {/* Columna Derecha (WhatsApp Simulator en Tiempo Real) */}
          <div id="demo-real" className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[350px] aspect-[9/18.5] bg-[#0E0704] border-[7px] border-[#2B1810] rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-3 flex flex-col overflow-hidden rotate-[-2deg] hover:rotate-0 transition-all duration-500">
              {/* Phone Speaker/Camera Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-4 bg-black rounded-full z-20 flex justify-center items-center">
                <div className="w-12 h-1 bg-[#1A0F0A] rounded-full"></div>
              </div>

              {/* Chat App Header */}
              <div className="bg-[#1A0F0A] border-b border-border-sutil pt-8 pb-3 px-3 -mx-3 -mt-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-bg-card border border-border-sutil flex items-center justify-center overflow-hidden">
                  <BrunoLogo className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-text-primario flex items-center gap-1.5">
                    Bruno
                    <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse-fast"></span>
                  </div>
                  <div className="text-[10px] text-text-secundario">Maître Digital Automático</div>
                </div>
              </div>

              {/* Message Area */}
              <div
                ref={chatAreaRef}
                className="flex-1 py-4 flex flex-col gap-3 overflow-y-auto text-xs font-sans min-h-[220px]"
              >
                {chatMessages.map((msg) => {
                  if (msg.sender === "system") {
                    return (
                      <div key={msg.id} className="self-center bg-[#2B1810]/90 border border-border-sutil text-text-muted text-[10px] py-1.5 px-3.5 rounded-lg text-center max-w-[90%] font-medium leading-relaxed shadow-sm">
                        {msg.text}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] p-3 rounded-[18px] shadow-sm leading-relaxed ${
                        msg.sender === "client"
                          ? "self-end bg-[#085C42] text-[#F5E6D3] rounded-tr-[4px]"
                          : "self-start bg-bg-card border border-border-sutil text-text-primario rounded-tl-[4px]"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div
                        className={`text-[8px] text-right mt-1 ${
                          msg.sender === "client" ? "text-[#A5D7C7]" : "text-text-muted"
                        }`}
                      >
                        {msg.timestamp} {msg.sender === "client" && "✓✓"}
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="self-start max-w-[80%] bg-bg-card border border-border-sutil p-3 rounded-[18px] rounded-tl-[4px] shadow-sm flex items-center gap-1">
                    <span className="text-[10px] text-text-secundario font-semibold">Bruno está escribiendo</span>
                    <span className="flex gap-0.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-acento-primario animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-acento-primario animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-acento-primario animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </span>
                  </div>
                )}
              </div>

              {/* Suggested quick clicks inside chat */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                <button
                  onClick={() => handleSendMessage("Quiero reservar una mesa para 4 personas")}
                  disabled={isTyping}
                  className="bg-bg-card/90 hover:bg-bg-hover text-text-secundario hover:text-text-primario border border-border-sutil hover:border-acento-primario px-2.5 py-1.5 rounded-full text-[10px] transition-colors focus:outline-none disabled:opacity-50"
                >
                  📅 Reservar mesa
                </button>
                <button
                  onClick={() => handleSendMessage("¿Tienen opciones sin TACC o vegetarianas?")}
                  disabled={isTyping}
                  className="bg-bg-card/90 hover:bg-bg-hover text-text-secundario hover:text-text-primario border border-border-sutil hover:border-acento-primario px-2.5 py-1.5 rounded-full text-[10px] transition-colors focus:outline-none disabled:opacity-50"
                >
                  🍷 Ver opciones sin TACC
                </button>
                <button
                  onClick={() => handleSendMessage("Quiero consultar por un evento de cumpleaños")}
                  disabled={isTyping}
                  className="bg-bg-card/90 hover:bg-bg-hover text-text-secundario hover:text-text-primario border border-border-sutil hover:border-acento-primario px-2.5 py-1.5 rounded-full text-[10px] transition-colors focus:outline-none disabled:opacity-50"
                >
                  🥂 Eventos privados
                </button>
              </div>

              {/* Chat Input area */}
              <div className="border-t border-border-sutil pt-2 pb-1.5 -mx-3 -mb-3 bg-[#1A0F0A] px-3 flex gap-2 items-center">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isTyping}
                  placeholder="Escribí un mensaje..."
                  className="flex-1 h-9 bg-bg-card border border-border-sutil rounded-full px-4 text-xs text-text-primario placeholder-text-muted focus:outline-none focus:border-acento-primario disabled:opacity-50 transition-colors"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isTyping || !userInput.trim()}
                  className="w-9 h-9 rounded-full bg-acento-primario hover:bg-acento-primario/90 text-bg-primary font-bold flex items-center justify-center transition-colors focus:outline-none disabled:opacity-50"
                >
                  <Send className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECCIÓN 2: DOLORES (PNL Focus + 3D Tilt Cards) */}
      <section className="w-full bg-[#1F120C]/40 border-y border-border-sutil py-16 md:py-24 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-widest text-acento-primario font-bold mb-3 block">PÉRDIDAS SILENCIOSAS</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-text-primario mb-4 max-w-[850px] mx-auto leading-tight">
            El cliente gastronómico compra por impulso. <br />
            <span className="text-acento-secundario font-serif">Si demorás 5 minutos, ya reservó en otro lado.</span>
          </h2>
          <p className="text-text-secundario text-base md:text-lg max-w-[660px] mx-auto mb-16 leading-relaxed">
            Mientras estás cocinando, despachando o durmiendo, los mensajes se acumulan. La competencia responde rápido. Vos perdés dinero.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left perspective-container">
            {/* Card 1 */}
            <TiltCard>
              <div>
                <div className="w-14 h-14 bg-[#3A2218] border border-acento-primario/30 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                  <MessageCircleOff className="w-7 h-7 text-acento-primario stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-text-primario mb-4 leading-snug">
                  Mensajes en visto los fines de semana
                </h3>
                <p className="text-sm text-text-secundario leading-relaxed mb-8">
                  Viernes y sábados a la noche tu cocina explota y nadie puede responder WhatsApp. El cliente se frustra con el silencio y le escribe a la competencia que responde al instante.
                </p>
              </div>
              <div className="border-t border-border-sutil pt-6 mt-auto">
                <div className="font-serif text-4xl font-black text-acento-primario leading-none mb-1 flex items-baseline gap-1">
                  40%
                  <span className="text-xs text-text-muted font-sans font-medium uppercase tracking-wider">de leads</span>
                </div>
                <div className="text-xs text-text-muted font-semibold">
                  gastronómicos se pierden por respuestas fuera de hora.
                </div>
              </div>
            </TiltCard>

            {/* Card 2 */}
            <TiltCard>
              <div>
                <div className="w-14 h-14 bg-[#3A2218] border border-acento-primario/30 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                  <Users className="w-7 h-7 text-acento-primario stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-text-primario mb-4 leading-snug">
                  Recepción desbordada en hora pico
                </h3>
                <p className="text-sm text-text-secundario leading-relaxed mb-8">
                  Tu recepcionista acomoda las mesas en el salón físico, atiende a los que entran y responde el teléfono. WhatsApp queda en segundo plano, acumulando reservas que nunca se confirman.
                </p>
              </div>
              <div className="border-t border-border-sutil pt-6 mt-auto">
                <div className="font-serif text-4xl font-black text-acento-primario leading-none mb-1 flex items-baseline gap-1">
                  3 de 10
                  <span className="text-xs text-text-muted font-sans font-medium uppercase tracking-wider">reservas</span>
                </div>
                <div className="text-xs text-text-muted font-semibold">
                  nunca se concretan por demoras de confirmación.
                </div>
              </div>
            </TiltCard>

            {/* Card 3 */}
            <TiltCard>
              <div>
                <div className="w-14 h-14 bg-[#3A2218] border border-acento-primario/30 rounded-xl flex items-center justify-center mb-6 shadow-inner">
                  <Star className="w-7 h-7 text-acento-primario stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-text-primario mb-4 leading-snug">
                  Reseñas negativas sin control
                </h3>
                <p className="text-sm text-text-secundario leading-relaxed mb-8">
                  Una mala crítica de una estrella en Google Maps, sin respuesta inmediata del dueño, destruye tu reputación. Careces de tiempo diario para monitorear y responder en caliente.
                </p>
              </div>
              <div className="border-t border-border-sutil pt-6 mt-auto">
                <div className="font-serif text-4xl font-black text-acento-primario leading-none mb-1 flex items-baseline gap-1">
                  73%
                  <span className="text-xs text-text-muted font-sans font-medium uppercase tracking-wider">del público</span>
                </div>
                <div className="text-xs text-text-muted font-semibold">
                  decide no ir a un lugar al ver reseñas ignoradas.
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: CÓMO FUNCIONA */}
      <section id="como-funciona" className="w-full py-16 md:py-24 max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-widest text-acento-primario font-bold mb-3 block">IMPLEMENTACIÓN RÁPIDA</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-text-primario tracking-tight mb-4">
            Bruno en tu restaurante en 3 pasos
          </h2>
          <p className="text-text-secundario text-base md:text-lg max-w-[540px] mx-auto leading-relaxed">
            Sin códigos complejos, sin cambiar tu software actual, sin contratos anuales.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px] border-t border-dashed border-acento-primario/30 z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-bg-card border-2 border-acento-primario rounded-full flex items-center justify-center font-serif text-3xl font-black text-acento-primario shadow-[0_4px_15px_rgba(193,154,91,0.15)] mb-6">
              01
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-text-primario mb-3">
              Subís tu carta, menú y horarios
            </h3>
            <p className="text-sm text-text-secundario leading-relaxed max-w-[300px]">
              Completás una carga veloz de 5 minutos con tu menú actual, alérgenos y horarios de cocina. Bruno absorbe la información y aprende tu identidad.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-bg-card border-2 border-acento-primario rounded-full flex items-center justify-center font-serif text-3xl font-black text-acento-primario shadow-[0_4px_15px_rgba(193,154,91,0.15)] mb-6">
              02
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-text-primario mb-3">
              Conectamos tu número de WhatsApp
            </h3>
            <p className="text-sm text-text-secundario leading-relaxed max-w-[300px]">
              Asociamos tu cuenta de WhatsApp Business oficial. Mantenés tu número y podés seguir abriéndolo en tu celular. Configuración lista en 24hs.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-bg-card border-2 border-acento-primario rounded-full flex items-center justify-center font-serif text-3xl font-black text-acento-primario shadow-[0_4px_15px_rgba(193,154,91,0.15)] mb-6">
              03
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-text-primario mb-3">
              Vos cocinás, Bruno atiende
            </h3>
            <p className="text-sm text-text-secundario leading-relaxed max-w-[300px]">
              Bruno responde 24/7, agenda las reservas en tu planilla digital y te notifica a tu Telegram personal si hay alguna alerta crítica.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: VENTAJAS EXCLUSIVAS (Reemplaza Pricing, Cards más largas y PNL Copywriting) */}
      <section id="ventajas" className="w-full bg-[#1F120C]/40 border-y border-border-sutil py-16 md:py-24 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs uppercase tracking-widest text-acento-primario font-bold mb-3 block">VENTAJAS EXCLUSIVAS</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-text-primario tracking-tight mb-4">
              Por qué Bruno es el maître preferido de los mejores salones
            </h2>
            <p className="text-text-secundario text-base md:text-lg max-w-[600px] mx-auto leading-relaxed">
              Mucho más que un simple bot. Una infraestructura robusta diseñada para facturar más y aliviar el estrés operativo en salón.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch perspective-container">
            {/* Card 1: CONVERSIÓN INMEDIATA */}
            <TiltCard>
              {/* Highlight background lines */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-acento-primario/5 rounded-bl-full pointer-events-none"></div>
              
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#3A2218] border border-acento-primario/30 rounded-lg flex items-center justify-center shadow-inner">
                    <Zap className="w-6 h-6 text-acento-primario" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-acento-primario">Velocidad Extrema</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-black text-text-primario mb-6 leading-tight">
                  Atención en 1.8 segundos. <br />
                  <span className="text-acento-primario font-serif">Cero clientes en espera.</span>
                </h3>

                <p className="text-sm text-text-secundario leading-relaxed mb-6">
                  El cliente que busca cenar quiere respuestas ya. Si tarda en recibir respuesta, vuelve a Instagram y le escribe a otro local. Bruno responde al instante, reduciendo el rebote de leads al 0%.
                </p>

                <ul className="space-y-4 text-xs text-text-secundario mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-acento-primario shrink-0" />
                    <span>Respuestas contextuales inmediatas las 24hs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-acento-primario shrink-0" />
                    <span>Procesamiento de lenguaje natural avanzado.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-acento-primario shrink-0" />
                    <span>Manejo simultáneo de más de 50 chats a la vez.</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-border-sutil pt-6 text-xs text-text-muted font-semibold mt-4">
                BENEFICIO COMERCIAL: Aumento directo del 25% en reservas concretadas.
              </div>
            </TiltCard>

            {/* Card 2: AUTOMATIZACIÓN DE RESERVAS */}
            <div className="relative w-full h-full flex flex-col lg:scale-[1.03] scale-[1.01] z-20">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-acento-primario text-bg-primary text-[10px] font-black uppercase tracking-wider px-5 py-1 rounded-full shadow-lg z-20">
                ROI MÁS ALTO
              </span>
              <TiltCard className="flex-1 w-full h-full">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-[#3A2218] border border-acento-primario/60 rounded-lg flex items-center justify-center shadow-inner">
                      <Calendar className="w-6 h-6 text-acento-primario" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-acento-primario">Control Total</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-black text-text-primario mb-6 leading-tight">
                    Toma de reservas oficial. <br />
                    <span className="text-acento-primario font-serif">Integrado a tu planilla.</span>
                  </h3>

                  <p className="text-sm text-text-secundario leading-relaxed mb-6 text-text-primario">
                    Bruno asienta las reservas confirmadas de forma automatizada en tu planilla digital. Pide los datos mínimos de contacto, valida cubiertos libres y envía confirmaciones automáticas con recordatorio por WhatsApp.
                  </p>

                  <ul className="space-y-4 text-xs text-text-secundario mb-8">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-acento-primario shrink-0" />
                      <span>Validación de turnos y capacidad en tiempo real.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-acento-primario shrink-0" />
                      <span>Envío de recordatorio automático de asistencia.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-acento-primario shrink-0" />
                      <span>Políticas de tolerancia y cancelación en WhatsApp.</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-border-sutil pt-6 text-xs text-text-muted font-semibold mt-4">
                  BENEFICIO OPERATIVO: Recepción libre para atender el salón en hora pico.
                </div>
              </TiltCard>
            </div>

            {/* Card 3: MONITOREO DE GOOGLE MAPS */}
            <TiltCard>
              <div className="absolute top-0 right-0 w-32 h-32 bg-acento-primario/5 rounded-bl-full pointer-events-none"></div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#3A2218] border border-acento-primario/30 rounded-lg flex items-center justify-center shadow-inner">
                    <ShieldCheck className="w-6 h-6 text-acento-primario" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-acento-primario">Protección de Marca</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-black text-text-primario mb-6 leading-tight">
                  Blindaje de reputación. <br />
                  <span className="text-acento-primario font-serif">Google Maps bajo control.</span>
                </h3>

                <p className="text-sm text-text-secundario leading-relaxed mb-6">
                  Bruno no solo responde mensajes. Escanea opiniones en Google Maps de tu negocio en tiempo real. Responde de forma automática reseñas de 5 estrellas, y te alerta en Telegram ante malas reseñas con un borrador sugerido.
                </p>

                <ul className="space-y-4 text-xs text-text-secundario mb-8">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-acento-primario shrink-0" />
                    <span>Respuestas instantáneas a comentarios positivos.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-acento-primario shrink-0" />
                    <span>Detección y alerta de reseñas negativas vía Telegram.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-acento-primario shrink-0" />
                    <span>Generador inteligente de borradores de disculpa/acción.</span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-border-sutil pt-6 text-xs text-text-muted font-semibold mt-4">
                BENEFICIO DE MARCA: Reputación online impecable 24/7.
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* SECCIÓN 5: PROVE IT (Prueba Social / Respaldado por OptiCore) */}
      <section className="w-full bg-[#1F120C]/20 border-y border-border-sutil py-16 md:py-24 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-widest text-acento-primario font-bold mb-3 block">INFRAESTRUCTURA DE NIVEL EMPRESARIAL</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-text-primario tracking-tight mb-4">
            Arquitectura robusta para operar a gran escala
          </h2>
          <p className="text-text-secundario text-base md:text-lg max-w-[660px] mx-auto mb-16 leading-relaxed">
            Respaldados por una infraestructura en la nube redundante y de alta disponibilidad, garantizamos la seguridad de tus datos, la latencia mínima de procesamiento y una estabilidad operativa continua para el canal de reservas de tu restaurante.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Seguridad & Privacidad */}
            <TiltCard className="text-left flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#C19A5B]/10 border border-[#C19A5B]/30 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-acento-primario" />
                </div>
                <h3 className="text-lg font-serif font-bold text-text-primario mb-3">
                  Cifrado de Extremo a Extremo
                </h3>
                <p className="text-xs text-text-secundario leading-relaxed">
                  Toda la información conversacional y de reservas se encripta mediante protocolos avanzados tanto en tránsito como en reposo. Implementamos un aislamiento lógico estricto por cliente para resguardar la confidencialidad de tu negocio y la privacidad de tus comensales.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-sutil flex flex-col gap-1">
                <div className="text-[10px] uppercase tracking-wider text-acento-primario font-bold font-mono">INFRAESTRUCTURA SEGURA</div>
                <div className="text-[10px] text-text-muted font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  PROTECCIÓN ACTIVA (AES-256)
                </div>
              </div>
            </TiltCard>

            {/* Card 2: Procesamiento Avanzado */}
            <TiltCard className="text-left flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#C19A5B]/10 border border-[#C19A5B]/30 flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6 text-acento-primario" />
                </div>
                <h3 className="text-lg font-serif font-bold text-text-primario mb-3">
                  Arquitectura Cognitiva
                </h3>
                <p className="text-xs text-text-secundario leading-relaxed">
                  Procesamiento mediante redes neuronales de última generación y motores de razonamiento semántico. Nuestro sistema analiza de manera dinámica intenciones complejas, modismos locales y el tono de cada cliente en milisegundos, respondiendo con absoluta fluidez humana.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-sutil flex flex-col gap-1">
                <div className="text-[10px] uppercase tracking-wider text-acento-primario font-bold font-mono">TECNOLOGÍA DE VANGUARDIA</div>
                <div className="text-[10px] text-text-muted font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  LATENCIA COMPROMETIDA (‹150ms)
                </div>
              </div>
            </TiltCard>

            {/* Card 3: Disponibilidad y SLA */}
            <TiltCard className="text-left flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#C19A5B]/10 border border-[#C19A5B]/30 flex items-center justify-center mb-6">
                  <Server className="w-6 h-6 text-acento-primario" />
                </div>
                <h3 className="text-lg font-serif font-bold text-text-primario mb-3">
                  Disponibilidad y Resiliencia
                </h3>
                <p className="text-xs text-text-secundario leading-relaxed">
                  Servicios distribuidos y redundantes en zonas de alta disponibilidad con failover automatizado. Nuestra infraestructura se adapta en tiempo real a picos de demanda y ráfagas de tráfico, asegurando un canal de reservas activo e ininterrumpido en todo momento.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-sutil flex flex-col gap-1">
                <div className="text-[10px] uppercase tracking-wider text-acento-primario font-bold font-mono">ESTABILIDAD EMPRESARIAL</div>
                <div className="text-[10px] text-text-muted font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  SLA DE UPTIME RESPALDADO (99.9%)
                </div>
              </div>
            </TiltCard>

            {/* Card 4: Ingeniería de Conversión */}
            <TiltCard className="text-left flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#C19A5B]/10 border border-[#C19A5B]/30 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-acento-primario" />
                </div>
                <h3 className="text-lg font-serif font-bold text-text-primario mb-3">
                  Ingeniería de Conversión
                </h3>
                <p className="text-xs text-text-secundario leading-relaxed">
                  Algoritmos enfocados en el logro de objetivos comerciales. Bruno no solo responde preguntas, sino que ejecuta reglas de negocio inteligentes diseñadas exclusivamente para optimizar la ocupación del salón, reduciendo a cero el margen de mesas vacías.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-sutil flex flex-col gap-1">
                <div className="text-[10px] uppercase tracking-wider text-acento-primario font-bold font-mono">COMPROMISO CON EL OBJETIVO</div>
                <div className="text-[10px] text-text-muted font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  OPTIMIZACIÓN CONTINUA DE ROI
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* SECCIÓN 6: FAQ (Accordion 10 items) */}
      <section id="faq" className="w-full py-16 md:py-24 max-w-[800px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-acento-primario font-bold mb-3 block">PREGUNTAS FRECUENTES</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-text-primario tracking-tight mb-4">
            Preguntas que ya nos hicieron
          </h2>
          <p className="text-text-secundario text-base md:text-lg leading-relaxed">
            Si tu duda no está acá, escribinos por el formulario de abajo.
          </p>
        </div>

        <div className="space-y-1">
          {faqData.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="border-b border-border-sutil py-4 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left py-2 font-serif text-base sm:text-lg font-bold text-text-primario hover:text-acento-primario transition-colors duration-200 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-text-secundario shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-acento-primario" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm sm:text-base text-text-secundario leading-relaxed pb-2 pr-6">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECCIÓN 7: CTA FINAL - FORM DE CONTACTO (Campos Simplificados) */}
      <section id="contacto" className="w-full bg-[#1F120C]/20 border-t border-border-sutil py-16 md:py-24 relative overflow-hidden z-10">
        {/* Ambient bottom glow */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-acento-primario/5 blur-[150px] pointer-events-none animate-glow-1 z-0"></div>
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-widest text-acento-primario font-bold mb-3 block">DEMO DE 24 HORAS</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-text-primario tracking-tight mb-4">
            Dejá que Bruno te demuestre lo que vale
          </h2>
          <p className="text-text-secundario text-base md:text-lg max-w-[600px] mx-auto mb-12 leading-relaxed">
            Completá el formulario en 30 segundos y te armamos una simulación de Bruno activa para tu restaurante en menos de 24 horas.
          </p>

          <div className="max-w-[560px] mx-auto text-left">
            {formStatus === "success" ? (
              // Success Card
              <div className="bg-[#8FAA5B] border border-border-sutil text-[#1A0F0A] p-8 rounded-xl flex flex-col items-center text-center shadow-xl transition-all duration-500 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#1A0F0A] flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-[#8FAA5B] stroke-[3]" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3 text-[#1A0F0A]">
                  ¡Solicitud Recibida!
                </h3>
                <p className="text-sm font-semibold max-w-[360px] leading-relaxed mb-6">
                  Ya estamos configurando la demo. Te escribimos a Telegram o WhatsApp en menos de 24 horas hábiles.
                </p>
                <button
                  onClick={() => setFormStatus("idle")}
                  className="px-4 py-2 border border-[#1A0F0A] text-xs font-black rounded uppercase tracking-wider hover:bg-[#1A0F0A]/10 transition-colors focus:outline-none"
                >
                  Volver a ver formulario
                </button>
              </div>
            ) : (
              // Simplified Form Card
              <div className="bg-bg-card border border-border-sutil p-6 sm:p-8 rounded-xl shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {formStatus === "error" && (
                    <div className="p-4 bg-[#B85450]/20 border border-[#B85450] text-[#F5E6D3] text-xs font-semibold rounded-md">
                      ⚠️ {serverErrorMessage || "Hubo un error al procesar tu solicitud. Por favor, reintentá."}
                    </div>
                  )}

                  {/* Nombre */}
                  <div>
                    <label htmlFor="userName" className="block text-xs font-semibold uppercase tracking-wider text-text-secundario mb-2">
                      Tu nombre *
                    </label>
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      required
                      value={formValues.userName}
                      onChange={handleInputChange}
                      className={`w-full bg-[#1A0F0A] border rounded px-4 py-3 text-sm text-text-primario focus:outline-none focus:border-acento-primario transition-colors ${
                        formErrors.userName ? "border-error" : "border-border-sutil"
                      }`}
                      placeholder="Ej. Martín García"
                    />
                    {formErrors.userName && (
                      <p className="text-xs text-error mt-1.5">{formErrors.userName}</p>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label htmlFor="whatsapp" className="block text-xs font-semibold uppercase tracking-wider text-text-secundario mb-2">
                      Teléfono WhatsApp *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-[13px] text-sm font-semibold text-text-muted">+54</span>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        required
                        value={formValues.whatsapp}
                        onChange={handleInputChange}
                        className={`w-full bg-[#1A0F0A] border rounded pl-12 pr-4 py-3 text-sm text-text-primario focus:outline-none focus:border-acento-primario transition-colors ${
                          formErrors.whatsapp ? "border-error" : "border-border-sutil"
                        }`}
                        placeholder="351 1234567"
                      />
                    </div>
                    {formErrors.whatsapp ? (
                      <p className="text-xs text-error mt-1.5">{formErrors.whatsapp}</p>
                    ) : (
                      <span className="text-[10px] text-text-muted mt-1.5 block">Con código de área, sin 0 ni 15.</span>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-text-secundario mb-2">
                      Email de contacto *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formValues.email}
                      onChange={handleInputChange}
                      className={`w-full bg-[#1A0F0A] border rounded px-4 py-3 text-sm text-text-primario focus:outline-none focus:border-acento-primario transition-colors ${
                        formErrors.email ? "border-error" : "border-border-sutil"
                      }`}
                      placeholder="martin@correo.com"
                    />
                    {formErrors.email && (
                      <p className="text-xs text-error mt-1.5">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Mensaje opcional */}
                  <div>
                    <label htmlFor="mensaje" className="block text-xs font-semibold uppercase tracking-wider text-text-secundario mb-2">
                      Mensaje opcional
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formValues.mensaje}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-[#1A0F0A] border border-border-sutil rounded px-4 py-3 text-sm text-text-primario focus:outline-none focus:border-acento-primario transition-colors resize-none"
                      placeholder="Contanos qué tipo de comida servís o qué dudas querés resolver"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={formStatus === "submitting"}
                      className="flex-1 py-4 bg-acento-primario text-bg-primary font-bold rounded-lg shadow-lg transition-cta hover-cta flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {formStatus === "submitting" ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-bg-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          Probar Demo WhatsApp
                          <ArrowRight className="w-5 h-5 stroke-[2]" />
                        </>
                      )}
                    </button>

                    {/* Video Call Button */}
                    <a
                      href="https://calendly.com/fabrizzio-joel-c/bruno-demo-15"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-4 bg-transparent border border-acento-primario text-acento-primario font-bold rounded-lg shadow-lg hover:bg-bg-hover hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none text-sm"
                    >
                      Agendar videollamada
                      <PhoneCall className="w-5 h-5 stroke-[1.5]" />
                    </a>
                  </div>

                  <p className="text-[10px] sm:text-xs text-text-muted text-center leading-relaxed">
                    Te contactamos en menos de 24 horas hábiles. Cero spam, cero cadenas de mails comerciales. Odiamos el correo basura tanto como vos.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECCIÓN 8: FOOTER */}
      <footer className="w-full bg-[#0E0704] border-t border-border-sutil pt-16 pb-8 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Logo column (5/12) */}
          <div className="md:col-span-5 flex flex-col items-start text-left">
            <a href="#" className="flex items-center gap-3 mb-4 group focus:outline-none">
              <BrunoLogo className="w-8 h-8" />
              <span className="font-serif text-3xl font-black text-acento-primario tracking-tight group-hover:text-text-primario transition-colors">
                Bruno
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-acento-secundario self-end mb-2.5"></span>
            </a>
            <p className="text-xs text-text-muted font-medium mb-1">Tu maître digital.</p>
            <p className="text-[10px] text-text-muted max-w-[280px] leading-relaxed">
              El asistente virtual con IA que duplica tus reservas y optimiza la atención de tu salón físico.
            </p>
          </div>

          {/* Links column (7/12) */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6 text-left">
            {/* Col 1 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-primario mb-4">Producto</h4>
              <ul className="space-y-2.5 text-xs text-text-secundario">
                <li>
                  <a href="#como-funciona" className="hover:text-text-primario transition-colors">Cómo funciona</a>
                </li>
                <li>
                  <a href="#ventajas" className="hover:text-text-primario transition-colors">Ventajas</a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-text-primario transition-colors">FAQ</a>
                </li>
              </ul>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-primario mb-4">OptiCore</h4>
              <ul className="space-y-2.5 text-xs text-text-secundario">
                <li>
                  <a href="https://somosopticore.com" target="_blank" rel="noopener noreferrer" className="hover:text-text-primario transition-colors">
                    Quiénes somos
                  </a>
                </li>
                <li>
                  <a href="https://sofia.somosopticore.com" target="_blank" rel="noopener noreferrer" className="hover:text-text-primario transition-colors">
                    Sofia Inmobiliaria
                  </a>
                </li>
                <li>
                  <a href="/onboarding" className="hover:text-text-primario transition-colors">Onboarding</a>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-primario mb-4">Legal</h4>
              <ul className="space-y-2.5 text-xs text-text-secundario">
                <li>
                  <a href="#" className="hover:text-text-primario transition-colors">Términos</a>
                </li>
                <li>
                  <a href="#" className="hover:text-text-primario transition-colors">Privacidad</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="max-w-[1200px] mx-auto px-6 border-t border-border-sutil pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-text-muted text-center sm:text-left">
            © 2026 Bruno es un producto de OptiCore. Hecho con 🍷 en Córdoba, Argentina.
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button in Brand Colors */}
      <a
        href="https://wa.me/5493517302559?text=Hola!%20Quiero%20saber%20más%20sobre%20Bruno%20para%20mi%20restaurante."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[9990] flex items-center justify-center w-14 h-14 bg-acento-primario hover:bg-acento-primario/90 text-bg-primary rounded-full shadow-[0_4px_20px_rgba(193,154,91,0.4)] hover:scale-110 transition-all duration-300 group focus:outline-none border border-border-sutil pointer-events-auto"
      >
        <span className="absolute inset-0 rounded-full border border-acento-primario animate-ping opacity-25"></span>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 1.968 14.12 .94 11.5 .94c-5.44 0-9.866 4.372-9.87 9.802 0 1.63.43 3.21 1.24 4.62l-1.024 3.74 3.83-1.002zM17.487 14.4c-.27-.13-1.58-.77-1.82-.85-.24-.09-.41-.13-.58.12-.17.25-.66.83-.81.99-.15.17-.3.19-.57.06-.27-.13-1.14-.42-2.17-1.32-.8-.7-1.33-1.57-1.49-1.84-.15-.27-.02-.41.11-.54.13-.13.27-.3.4-.46.13-.16.18-.27.27-.45.09-.17.04-.32-.02-.45-.07-.13-.58-1.39-.8-1.9-.21-.52-.43-.45-.58-.45h-.5c-.17 0-.45.06-.68.32-.24.25-.9.87-.9 2.13 0 1.26.93 2.47 1.06 2.64.13.17 1.83 2.76 4.43 3.86.62.26 1.1.42 1.48.54.62.2 1.18.17 1.63.1.5-.07 1.58-.64 1.8-1.25.22-.61.22-1.13.15-1.25-.07-.09-.27-.13-.54-.27z" />
        </svg>
        <span className="absolute right-16 bg-bg-card border border-border-sutil text-text-primario text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
          Chatear con Bruno
        </span>
      </a>
    </div>
  );
}

// 10 FAQ items structured data
const faqData = [
  {
    q: "¿Bruno reemplaza a mi recepcionista?",
    a: "No. Bruno la complementa: maneja el volumen de mensajes simultáneos que ningún humano puede atender solo. Tu encargada sigue cuidando el salón y resuelve los casos que Bruno deriva.",
  },
  {
    q: "¿Y si Bruno no sabe responder algo?",
    a: "Bruno está entrenado para detectar cuando una consulta requiere intervención humana. En esos casos te avisa por Telegram al momento y le dice al cliente que en un momento le respondés vos.",
  },
  {
    q: "¿Funciona con mi número de WhatsApp actual?",
    a: "Sí. Podés usar tu número actual o uno nuevo dedicado para reservas. Recomendamos uno nuevo para mantener separado lo personal del negocio.",
  },
  {
    q: "¿Cuánto tarda en estar listo?",
    a: "Setup completo: 24 a 72 horas hábiles desde que firmás. Esto incluye configurar tu menú, horarios, tono de marca y conectar WhatsApp.",
  },
  {
    q: "¿Qué pasa si quiero cancelar?",
    a: "Cancelás cuando quieras. No hay contratos anuales. Solo te pedimos avisar con 15 días de anticipación para hacer la baja ordenada. El setup inicial no se devuelve.",
  },
  {
    q: "¿Bruno habla con clientes en inglés?",
    a: "Sí. Detecta automáticamente el idioma del cliente y responde en español, inglés o portugués. Útil para restaurantes con público turista.",
  },
  {
    q: "¿Mis clientes saben que están hablando con un bot?",
    a: "Bruno se presenta como asistente del restaurante. Si un cliente pregunta explícitamente si es humano, responde con honestidad. La mayoría no nota la diferencia porque las respuestas son contextuales y naturales.",
  },
  {
    q: "¿Qué hago con las reseñas negativas que Bruno responde?",
    a: "Bruno NO responde reseñas negativas sin tu aprobación. Lo que hace es: detectarlas en Google Maps, alertarte por Telegram, y proponerte un borrador de respuesta. Vos aprobás antes de que se publique.",
  },
  {
    q: "¿Cuál es el costo real de Meta WhatsApp Business?",
    a: "Para un restaurante mediano (~500 chats/mes): entre USD $5 y $15 al mes pagados directo a Meta. La mayoría de los mensajes (cuando el cliente te escribe primero y respondés en 24hs) son gratuitos.",
  },
  {
    q: "¿Tengo que comprar algún equipo o software extra?",
    a: "No. Bruno corre en nuestros servidores. Vos solo usás tu WhatsApp normal en tu celular. El dashboard lo abrís desde cualquier navegador.",
  },
];
