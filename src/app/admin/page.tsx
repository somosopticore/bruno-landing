"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  CalendarCheck,
  Zap,
  Plus,
  Search,
  Sliders,
  Play,
  Pause,
  Trash2,
  Phone,
  Activity,
  LogOut,
  MapPin,
  X,
  CheckCircle2,
  AlertTriangle,
  Lock,
  MessageSquare,
  Copy,
  Download,
  Check,
  Clock,
  Mic,
  Calendar,
  Loader2,
  FileText
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Datos iniciales ampliados de los clientes del multi-tenant
interface Restaurant {
  id: string;
  name: string;
  slug: string;
  environments: string[];
  status: "ACTIVO" | "PAUSADO";
  reservationsToday: number;
  adminNumbers: string[];
  audioTranscription: boolean;
  voiceCalls: boolean;
  businessHours?: string;
  menu?: string;
  comments?: string;
  submittedAt?: string;
  isUserSubmitted?: boolean;
  deleted?: boolean;
  deletedAt?: string;
}

const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "Moyo Resto & Bodegón",
    slug: "moyo-resto",
    environments: ["Salón", "Exterior", "Patio"],
    status: "ACTIVO",
    reservationsToday: 24,
    adminNumbers: ["5493514567890"],
    audioTranscription: true,
    voiceCalls: true,
    businessHours: "Martes a Domingos de 20:00 a 00:00 hs.\nLunes cerrado.",
    menu: "[ENTRADAS]\n- Provoleta Moyo: Con tomates confitados, pesto de rúcula y almendras tostadas. $8.500\n- Empanada Criolla: De carne cortada a cuchillo, frita, bien jugosa. $2.200\n\n[PRINCIPALES]\n- Ojo de Bife 400g: Con papas rústicas y manteca de chimichurri. Cocción sugerida: a punto. $18.900\n- Ravioles de Cordero: Con salsa demiglace de hongos de pino y verdeo. $15.500\n\n[BEBIDAS & VINOS]\n- Malbec Gran Reserva Moyo (Copa / Botella): $3.500 / $14.000\n- Limonada casera con menta y jengibre: $3.000",
    comments: "Instalación estándar sin requerimientos especiales. Todo funcionando OK.",
  },
  {
    id: "2",
    name: "Pizzería Nápoles",
    slug: "pizzeria-napoles",
    environments: ["Salón", "Patio"],
    status: "ACTIVO",
    reservationsToday: 18,
    adminNumbers: ["5493517890123"],
    audioTranscription: true,
    voiceCalls: false,
    businessHours: "Lunes a Lunes de 19:30 a 23:30 hs.",
    menu: "[PIZZAS CLÁSICAS]\n- Muzzarella: Salsa de tomate, muzzarella, aceitunas. $7.200\n- Fugazzeta: Muzzarella, cebolla caramelizada, orégano. $7.800\n- Margarita: Muzzarella, rodajas de tomate, albahaca fresca. $8.000\n\n[CERVEZAS]\n- IPA Tirada Moyo (Pinta): $2.500\n- Golden Tirada Moyo (Pinta): $2.200",
    comments: "El cliente solicitó prioridad para reservas en mesas de Patio.",
  },
  {
    id: "3",
    name: "Criollo Bodegón",
    slug: "criollo-bodegon",
    environments: ["Salón"],
    status: "ACTIVO",
    reservationsToday: 32,
    adminNumbers: ["5493518901234"],
    audioTranscription: true,
    voiceCalls: true,
    businessHours: "Miércoles a Lunes de 12:00 a 16:00 hs y de 20:00 a 00:30 hs. Martes cerrado.",
    menu: "[MINUTAS]\n- Milanesa Napolitana gigante con papas fritas (para compartir): $16.500\n- Suprema a la Suiza con puré: $13.900\n\n[POSTRES]\n- Flan Mixto (Con dulce de leche y crema): $3.000\n- Vigilante (Queso y dulce de membrillo o batata): $2.500",
    comments: "El administrador principal quiere notificaciones directas por cada reserva superior a 6 cubiertos.",
  },
  {
    id: "4",
    name: "Lunfardo Bar & Vermutería",
    slug: "lunfardo-bar",
    environments: ["Salón", "Exterior"],
    status: "PAUSADO",
    reservationsToday: 0,
    adminNumbers: ["5493519012345"],
    audioTranscription: false,
    voiceCalls: false,
    businessHours: "Jueves a Sábados de 19:00 a 03:00 hs. Domingos de 18:00 a 01:00 hs.",
    menu: "[PLATITOS]\n- Buñuelos de acelga con alioli: $4.200\n- Croquetas de jamón crudo y muzzarella: $4.800\n\n[TRAGOS & VERMUT]\n- Vermut de la casa con sifón: $1.800\n- Negroni Lunfardo: $3.200",
    comments: "Servicio pausado temporalmente por reformas en el local.",
  },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"TODOS" | "ACTIVO" | "PAUSADO" | "PAPELERA">("TODOS");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Estados para nuevo restaurante manual
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newAdmins, setNewAdmins] = useState("");
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>(["Salón"]);

  // Ficha detallada de cliente
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Manejo de montaje y sesión en cliente
  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("opticore_admin_authed") === "true") {
      setIsAuthenticated(true);
    }

    // Cargar submissions del backend real
    const fetchSubmissions = async () => {
      try {
        const res = await fetch("/api/submissions");
        if (res.ok) {
          const submissions = await res.json();
          const formattedSubmissions = submissions.map((sub: any) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            environments: sub.environments || [],
            status: sub.status || "ACTIVO",
            reservationsToday: sub.reservationsToday || 0,
            adminNumbers: sub.adminNumbers || [],
            audioTranscription: sub.audioTranscription ?? true,
            voiceCalls: sub.voiceCalls ?? false,
            businessHours: sub.businessHours || "No especificado",
            menu: sub.menu || "",
            comments: sub.comments || "",
            submittedAt: sub.submittedAt || new Date().toISOString(),
            isUserSubmitted: true,
            deleted: sub.deleted || false,
            deletedAt: sub.deletedAt || undefined,
          }));
          setRestaurants([...INITIAL_RESTAURANTS, ...formattedSubmissions]);
          return;
        }
      } catch (err) {
        console.error("Error al cargar submissions del backend real:", err);
      }

      // Fallback a localStorage
      try {
        const submissionsStr = localStorage.getItem("bruno_onboarding_submissions_v1");
        if (submissionsStr) {
          const submissions = JSON.parse(submissionsStr);
          const formattedSubmissions = submissions.map((sub: any) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            environments: sub.environments || [],
            status: sub.status || "ACTIVO",
            reservationsToday: sub.reservationsToday || 0,
            adminNumbers: sub.adminNumbers || [],
            audioTranscription: sub.audioTranscription ?? true,
            voiceCalls: sub.voiceCalls ?? false,
            businessHours: sub.businessHours || "No especificado",
            menu: sub.menu || "",
            comments: sub.comments || "",
            submittedAt: sub.submittedAt || new Date().toISOString(),
            isUserSubmitted: true,
            deleted: sub.deleted || false,
            deletedAt: sub.deletedAt || undefined,
          }));
          setRestaurants([...INITIAL_RESTAURANTS, ...formattedSubmissions]);
        }
      } catch (err) {
        console.error("Error al cargar submissions de localStorage:", err);
      }
    };

    fetchSubmissions();
  }, []);

  // Acciones de autenticación
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    setTimeout(() => {
      const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "OpticoreBruno2026!";
      if (password === correctPassword) {
        sessionStorage.setItem("opticore_admin_authed", "true");
        setIsAuthenticated(true);
        toast.success("Acceso concedido", {
          description: "Bienvenido al panel central de Opticore.",
        });
      } else {
        toast.error("Contraseña incorrecta", {
          description: "Por favor, verificá las credenciales de administrador.",
        });
        setShakeTrigger(true);
        setTimeout(() => setShakeTrigger(false), 500);
      }
      setIsLoggingIn(false);
    }, 600);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("opticore_admin_authed");
    setIsAuthenticated(false);
    setPassword("");
    toast.info("Sesión cerrada", {
      description: "Has salido del panel de administración.",
    });
  };

  // Filtrado de restaurantes
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.slug.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (statusFilter === "PAPELERA") {
        return r.deleted === true && matchesSearch;
      }
      
      if (r.deleted) return false;
      
      const matchesStatus = statusFilter === "TODOS" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [restaurants, searchQuery, statusFilter]);

  // KPIs calculados en tiempo real
  const activeCount = useMemo(() => {
    return restaurants.filter((r) => r.status === "ACTIVO" && !r.deleted).length;
  }, [restaurants]);

  const totalReservationsToday = useMemo(() => {
    return restaurants.reduce((sum, r) => sum + (r.deleted ? 0 : r.reservationsToday), 0);
  }, [restaurants]);

  const iaEfficiency = useMemo(() => {
    const active = restaurants.filter((r) => r.status === "ACTIVO" && !r.deleted);
    if (active.length === 0) return "0.0%";
    const total = active.reduce((sum, r) => sum + (r.voiceCalls ? 99.6 : 99.2), 0);
    return `${(total / active.length).toFixed(1)}%`;
  }, [restaurants]);

  const deletedCount = useMemo(() => {
    return restaurants.filter((r) => r.deleted).length;
  }, [restaurants]);

  // Acciones rápidas
  const handleToggleStatus = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === "ACTIVO" ? "PAUSADO" : "ACTIVO";
          const nextReservations = nextStatus === "PAUSADO" ? 0 : Math.floor(Math.random() * 20) + 10;
          
          // Sincronizar con localStorage y backend real
          try {
            const submissionsStr = localStorage.getItem("bruno_onboarding_submissions_v1");
            if (submissionsStr) {
              const submissions = JSON.parse(submissionsStr);
              const updatedSubmissions = submissions.map((sub: any) => {
                if (sub.id === id) {
                  return { ...sub, status: nextStatus };
                }
                return sub;
              });
              localStorage.setItem("bruno_onboarding_submissions_v1", JSON.stringify(updatedSubmissions));
            }
          } catch (err) {
            console.error("Error al actualizar estado en localStorage:", err);
          }

          // Persistir en backend real
          fetch("/api/submissions", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id,
              fields: { status: nextStatus }
            })
          }).catch(err => console.error("Error al actualizar estado en backend:", err));

          toast(nextStatus === "ACTIVO" ? "Bot Reanudado" : "Bot Suspendido", {
            description: `Se ha cambiado el estado de ${r.name} a ${nextStatus}.`,
            icon: nextStatus === "ACTIVO" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            ),
          });

          return {
            ...r,
            status: nextStatus,
            reservationsToday: nextReservations,
          };
        }
        return r;
      })
    );
  };

  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim() || !newAdmins.trim()) {
      toast.error("Campos incompletos", {
        description: "Por favor, rellená todos los datos obligatorios.",
      });
      return;
    }

    const newClient: Restaurant = {
      id: String(Date.now()),
      name: newName.trim(),
      slug: newSlug.trim().toLowerCase().replace(/\s+/g, "-"),
      environments: selectedEnvironments,
      status: "ACTIVO",
      reservationsToday: 0,
      adminNumbers: newAdmins.split(",").map((n) => n.trim()),
      audioTranscription: true,
      voiceCalls: false,
      businessHours: "Martes a Domingos de 20:00 a 00:00 hs.\nLunes cerrado.",
      menu: "Carta vacía. Configurada manualmente desde el panel.",
      comments: "Registrado manualmente en consola de administración.",
      submittedAt: new Date().toISOString(),
      isUserSubmitted: true
    };

    // Guardar en localStorage y en backend real
    try {
      const submissionsStr = localStorage.getItem("bruno_onboarding_submissions_v1");
      let submissions = [];
      if (submissionsStr) {
        submissions = JSON.parse(submissionsStr);
      }
      submissions.push(newClient);
      localStorage.setItem("bruno_onboarding_submissions_v1", JSON.stringify(submissions));

      // Persistir en backend real
      fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newClient)
      }).catch(err => console.error("Error al guardar en backend:", err));
    } catch (err) {
      console.error(err);
    }

    setRestaurants([...restaurants, newClient]);
    setIsAddModalOpen(false);

    // Resetear formulario
    setNewName("");
    setNewSlug("");
    setNewAdmins("");
    setSelectedEnvironments(["Salón"]);

    toast.success("Restaurante Activado", {
      description: `Se configuró a Bruno Bot con éxito en ${newClient.name}.`,
    });
  };

  const handleDeleteRestaurant = (id: string, name: string) => {
    const deletedTime = new Date().toISOString();
    
    // Marcar como eliminado en el estado UI
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, deleted: true, deletedAt: deletedTime };
        }
        return r;
      })
    );

    // Marcar como eliminado en localStorage
    try {
      const submissionsStr = localStorage.getItem("bruno_onboarding_submissions_v1");
      if (submissionsStr) {
        const submissions = JSON.parse(submissionsStr);
        const updated = submissions.map((sub: any) => {
          if (sub.id === id) {
            return { ...sub, deleted: true, deletedAt: deletedTime };
          }
          return sub;
        });
        localStorage.setItem("bruno_onboarding_submissions_v1", JSON.stringify(updated));
      }
    } catch (err) {
      console.error(err);
    }

    // Soft delete en backend real
    fetch(`/api/submissions?id=${id}`, {
      method: "DELETE"
    }).catch(err => console.error("Error al borrar del backend:", err));

    toast.error("Restaurante enviado a la papelera", {
      description: `Se movió a ${name} a la papelera por 30 días.`,
    });
  };

  const handleRestoreRestaurant = (id: string, name: string) => {
    // Restaurar en el estado UI
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const { deleted, deletedAt, ...rest } = r;
          return { ...rest, status: "ACTIVO" } as Restaurant;
        }
        return r;
      })
    );

    // Restaurar en localStorage
    try {
      const submissionsStr = localStorage.getItem("bruno_onboarding_submissions_v1");
      if (submissionsStr) {
        const submissions = JSON.parse(submissionsStr);
        const updated = submissions.map((sub: any) => {
          if (sub.id === id) {
            const { deleted, deletedAt, ...rest } = sub;
            return { ...rest, status: "ACTIVO" };
          }
          return sub;
        });
        localStorage.setItem("bruno_onboarding_submissions_v1", JSON.stringify(updated));
      }
    } catch (err) {
      console.error(err);
    }

    // Persistir restauración en backend real
    fetch("/api/submissions", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        fields: { deleted: false, deletedAt: null }
      })
    }).catch(err => console.error("Error al restaurar en backend:", err));

    toast.success("Restaurante restaurado", {
      description: `${name} ha sido reactivado y quitado de la papelera.`,
    });
  };

  const handleForceDeleteRestaurant = (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${name}? Esta acción no se puede deshacer y borrará los datos para siempre.`)) {
      return;
    }

    // Remover del estado UI
    setRestaurants((prev) => prev.filter((r) => r.id !== id));

    // Remover de localStorage
    try {
      const submissionsStr = localStorage.getItem("bruno_onboarding_submissions_v1");
      if (submissionsStr) {
        const submissions = JSON.parse(submissionsStr);
        const filtered = submissions.filter((sub: any) => sub.id !== id);
        localStorage.setItem("bruno_onboarding_submissions_v1", JSON.stringify(filtered));
      }
    } catch (err) {
      console.error(err);
    }

    // Borrado definitivo en backend real (force=true)
    fetch(`/api/submissions?id=${id}&force=true`, {
      method: "DELETE"
    }).catch(err => console.error("Error al borrar definitivamente del backend:", err));

    toast.error("Restaurante eliminado permanentemente", {
      description: `${name} fue eliminado por completo de la base de datos.`,
    });
  };

  const toggleEnvironmentSelection = (env: string) => {
    if (selectedEnvironments.includes(env)) {
      setSelectedEnvironments(selectedEnvironments.filter((e) => e !== env));
    } else {
      setSelectedEnvironments([...selectedEnvironments, env]);
    }
  };

  const handleExportJSON = (restaurant: Restaurant) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(restaurant, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `optibruno-${restaurant.slug}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Ficha Exportada", {
      description: "Se descargaron los datos del cliente en formato JSON.",
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // --- RENDERIZADO DEL LOGIN GATE ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex items-center justify-center relative overflow-hidden px-4">
        {/* Glows de fondo */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px] z-10"
        >
          <motion.div
            animate={shakeTrigger ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-zinc-900/60 border-zinc-800 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="flex flex-col items-center text-center space-y-4 mb-6">
                <div className="h-12 w-12 bg-indigo-600 flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-xl font-bold text-zinc-100 tracking-wide flex items-center justify-center gap-1.5">
                    Opticore Central
                    <span className="text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-mono">ADMIN</span>
                  </h1>
                  <p className="text-xs text-zinc-400">
                    Ingresá tus credenciales de la agencia.
                  </p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Contraseña de acceso</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-sm h-11 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 shadow-[0_4px_15px_rgba(99,102,241,0.35)] active:scale-98 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Acceder al panel"
                  )}
                </Button>
              </form>

              <div className="text-[10px] text-center text-zinc-500 mt-6 border-t border-zinc-800/60 pt-4">
                Seguridad reforzada · Bruno Bot Management
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // --- RENDERIZADO DEL DASHBOARD AUTENTICADO ---
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col relative overflow-hidden">
      <Toaster theme="dark" richColors closeButton />

      {/* Opticore Electric Blue Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

      {/* HEADER / NAVIGATION BAR */}
      <header className="w-full border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-indigo-600 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Sliders className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-zinc-100 flex items-center gap-1.5">
              Opticore Central
              <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono">v1.2</span>
            </h1>
            <p className="text-[10px] text-zinc-400">Bruno Bot Management Console</p>
          </div>
        </div>

        {/* Blinking server status */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sistemas en línea
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-zinc-400 hover:text-zinc-100 h-9 px-3 gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Salir</span>
          </Button>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-8 space-y-8 relative z-10">
        
        {/* WELCOME SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-zinc-100">
              Panel del Administrador
            </h2>
            <p className="text-sm text-zinc-400">
              Monitoreá el estado, la eficiencia y las configuraciones del maître digital en toda tu red gastronómica.
            </p>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-5 shadow-[0_4px_15px_rgba(99,102,241,0.35)] active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Restaurante
          </Button>
        </div>

        {/* METRICS ROW (KPI Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KPI 1 */}
          <Card className="bg-zinc-900/60 border-zinc-800 p-6 flex items-center justify-between hover:border-zinc-700 transition-colors">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Locales Activos</p>
              <h3 className="text-4xl font-bold font-mono tracking-tight text-white flex items-baseline gap-2">
                {activeCount}
                <span className="text-xs font-normal text-zinc-400 font-sans">de {restaurants.length} totales</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
              <Store className="w-6 h-6 stroke-[1.8]" />
            </div>
          </Card>

          {/* KPI 2 */}
          <Card className="bg-zinc-900/60 border-zinc-800 p-6 flex items-center justify-between hover:border-zinc-700 transition-colors">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Reservas de Hoy</p>
              <h3 className="text-4xl font-bold font-mono tracking-tight text-white flex items-baseline gap-2">
                {totalReservationsToday}
                <span className="text-xs font-normal text-zinc-400 font-sans">cubiertos</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
              <CalendarCheck className="w-6 h-6 stroke-[1.8]" />
            </div>
          </Card>

          {/* KPI 3 */}
          <Card className="bg-zinc-900/60 border-zinc-800 p-6 flex items-center justify-between hover:border-zinc-700 transition-colors">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Eficiencia de IA</p>
              <h3 className="text-4xl font-bold font-mono tracking-tight text-white flex items-baseline gap-2">
                {iaEfficiency}
                <span className="text-xs font-normal text-zinc-400 font-sans">resolución</span>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
              <Zap className="w-6 h-6 stroke-[1.8]" />
            </div>
          </Card>
        </section>

        {/* SEARCH & FILTERS CONTROLS */}
        <section className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center p-5 bg-zinc-900/40 border border-zinc-800 rounded-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Buscar por restaurante o slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-zinc-950 border-zinc-800 h-10 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mr-1">Filtrar:</span>
            {(["TODOS", "ACTIVO", "PAUSADO"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-zinc-800 border border-zinc-700 text-zinc-100"
                    : "bg-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {status}
              </button>
            ))}
            <button
              onClick={() => setStatusFilter("PAPELERA")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "PAPELERA"
                  ? "bg-rose-950/40 border border-rose-800 text-rose-300"
                  : "bg-transparent text-zinc-400 hover:text-rose-400"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              PAPELERA
              {deletedCount > 0 && (
                <span className="bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">
                  {deletedCount}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* CLIENTS GRID / LIST TABLE */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.18em] text-indigo-400 pl-1">
            Restaurantes Clientes Multi-Tenant ({filteredRestaurants.length})
          </h3>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRestaurants.map((client) => {
                const isActive = client.status === "ACTIVO";
                const isDeleted = client.deleted === true;

                return (
                  <motion.div
                    key={client.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card className={`bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-full group p-6 ${
                      isDeleted ? "border-rose-950/40 opacity-90" : ""
                    }`}>
                      
                      {/* Top Header Card */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                              {client.name}
                            </h4>
                            {client.isUserSubmitted && (
                              <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 rounded">
                                Onboarding
                              </span>
                            )}
                            {isDeleted && (
                              <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-[9px] font-bold text-rose-400 rounded flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                Papelera
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                            <span>/{client.slug}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {isDeleted ? (
                          (() => {
                            const days = client.deletedAt ? Math.ceil(30 - (new Date().getTime() - new Date(client.deletedAt).getTime()) / (1000 * 60 * 60 * 24)) : 30;
                            const daysText = days > 0 ? `${days} días rest.` : "Expirado";
                            return (
                              <div className="px-2.5 py-1 rounded bg-rose-950/30 border border-rose-900/40 text-[9px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3" />
                                {daysText}
                              </div>
                            );
                          })()
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(client.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                              isActive
                                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                : "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                            }`}
                          >
                            {client.status}
                          </button>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="grid grid-cols-2 gap-4 py-5 my-4 border-y border-zinc-800/60">
                        {/* Environments list */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Ambientes</span>
                          <div className="flex flex-wrap gap-1">
                            {client.environments.map((env) => (
                              <span
                                key={env}
                                className="px-2 py-0.5 bg-zinc-800 border border-zinc-700/60 text-[9px] font-bold text-zinc-300 rounded"
                              >
                                {env}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Reservations Count */}
                        <div className="space-y-1">
                          {isDeleted ? (
                            <>
                              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Eliminado el</span>
                              <span className="text-xs font-mono text-zinc-300 block">
                                {client.deletedAt ? new Date(client.deletedAt).toLocaleDateString("es-AR") : "Desconocido"}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Reservas de hoy</span>
                              <span className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
                                {client.reservationsToday}
                                <span className="text-[10px] font-sans font-normal text-zinc-500">agendadas</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Footer Section */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                        {/* Linked Admins */}
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          <Phone className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-mono text-[11px]">{client.adminNumbers[0]}</span>
                          {client.adminNumbers.length > 1 && (
                            <span className="text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-bold font-sans">
                              +{client.adminNumbers.length - 1} más
                            </span>
                          )}
                        </div>

                        {/* Actions buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {isDeleted ? (
                            <>
                              {/* Restore Button */}
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleRestoreRestaurant(client.id, client.name)}
                                className="h-8 px-3 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Restaurar
                              </Button>

                              {/* Force Delete Button */}
                              <button
                                onClick={() => handleForceDeleteRestaurant(client.id, client.name)}
                                className="h-8 px-3 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-zinc-800 hover:border-rose-800 text-zinc-400 hover:text-rose-400 bg-zinc-950/40 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                                aria-label="Eliminar permanentemente"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                Borrar Permanente
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Ver Ficha Detallada */}
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setSelectedRestaurant(client);
                                  setIsDetailsOpen(true);
                                }}
                                className="h-8 px-3 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 hover:text-white cursor-pointer"
                              >
                                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                                Ver Ficha
                              </Button>

                              {/* Toggle bot status button */}
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleToggleStatus(client.id)}
                                className="h-8 px-3 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:text-white cursor-pointer"
                              >
                                {isActive ? (
                                  <>
                                    <Pause className="w-3 h-3 text-rose-500 fill-rose-500" />
                                    Suspender
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                                    Activar Bot
                                  </>
                                )}
                              </Button>

                              {/* Delete bot button */}
                              <button
                                onClick={() => handleDeleteRestaurant(client.id, client.name)}
                                className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg flex items-center justify-center cursor-pointer transition-colors border border-transparent hover:border-rose-950"
                                aria-label="Dar de baja restaurante"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredRestaurants.length === 0 && (
              <div className="col-span-full border border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
                <Store className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                Ningún restaurante coincide con el filtro de búsqueda o base de datos.
              </div>
            )}
          </div>
        </section>

      </main>

      {/* OPTICORE CENTRAL FOOTER */}
      <footer className="w-full border-t border-zinc-900 bg-zinc-950 px-6 py-6 text-center text-xs text-zinc-600 mt-12 relative z-10">
        <p>
          Panel de Control Central de la Agencia · Desarrollado por{" "}
          <a
            href="https://somosopticore.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-400 hover:underline"
          >
            OptiCore
          </a>
        </p>
      </footer>

      {/* DETALLE DE CLIENTE (FICHA COMPLETA) */}
      <AnimatePresence>
        {isDetailsOpen && selectedRestaurant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-[650px] max-h-[85vh] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-y-auto p-6 z-10 scrollbar-thin"
            >
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-zinc-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                      {selectedRestaurant.name}
                    </h3>
                    {selectedRestaurant.isUserSubmitted && (
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-[9px] font-black uppercase tracking-wider text-indigo-400 rounded">
                        Onboarding
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">
                    ID: {selectedRestaurant.id} · slug: /{selectedRestaurant.slug}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    selectedRestaurant.status === "ACTIVO"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                  }`}>
                    {selectedRestaurant.status}
                  </span>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Side details */}
                <div className="space-y-5">
                  {/* Business Hours */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      Horarios de Cocina y Atención
                    </h4>
                    <p className="text-xs text-zinc-200 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800 leading-relaxed whitespace-pre-line font-medium">
                      {selectedRestaurant.businessHours || "No especificados"}
                    </p>
                  </div>

                  {/* Environments */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      Ambientes del Local
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRestaurant.environments.length > 0 ? (
                        selectedRestaurant.environments.map((env) => (
                          <span
                            key={env}
                            className="px-2.5 py-1 bg-zinc-800 border border-zinc-700/80 text-[10px] font-bold text-zinc-300 rounded-md"
                          >
                            {env}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-500">Ningún ambiente seleccionado</span>
                      )}
                    </div>
                  </div>

                  {/* Bot Configurations */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                      Canales y Permisos Habilitados
                    </h4>
                    <div className="bg-zinc-950/45 border border-zinc-800/80 rounded-lg p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">Transcripción notas de voz</span>
                        <span className={`px-2 py-0.5 rounded font-black text-[9px] tracking-wider ${
                          selectedRestaurant.audioTranscription 
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                            : "bg-zinc-800 text-zinc-500"
                        }`}>
                          {selectedRestaurant.audioTranscription ? "ACTIVO" : "DESACTIVADO"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">Atención de llamadas (IVR)</span>
                        <span className={`px-2 py-0.5 rounded font-black text-[9px] tracking-wider ${
                          selectedRestaurant.voiceCalls 
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                            : "bg-zinc-800 text-zinc-500"
                        }`}>
                          {selectedRestaurant.voiceCalls ? "ACTIVO" : "DESACTIVADO"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Date Submitted if onboarding */}
                  {selectedRestaurant.submittedAt && (
                    <div className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                      Enviado por el cliente el {new Date(selectedRestaurant.submittedAt).toLocaleString("es-AR")}
                    </div>
                  )}

                </div>

                {/* Right Side details */}
                <div className="space-y-5">
                  {/* Admin Numbers */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                      <Phone className="w-3.5 h-3.5 text-indigo-400" />
                      Teléfonos de Administradores
                    </h4>
                    <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                      {selectedRestaurant.adminNumbers.map((phone) => (
                        <div key={phone} className="flex items-center justify-between p-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300">
                          <span>{phone}</span>
                          <div className="flex gap-1.5 shrink-0">
                            {/* Copy button */}
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(phone);
                                toast.success("Copiado", { description: "Número de teléfono copiado." });
                              }}
                              className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                              title="Copiar número"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            {/* WhatsApp Direct link */}
                            <a
                              href={`https://wa.me/${phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-emerald-500 hover:text-emerald-400 transition-colors cursor-pointer"
                              title="Chatear por WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments / Considerations */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      Detalles a tener en cuenta / Comentarios
                    </h4>
                    <div className="text-xs text-zinc-200 bg-amber-500/5 p-3 rounded-lg border border-amber-500/25 leading-relaxed min-h-[90px] max-h-[150px] overflow-y-auto scrollbar-thin">
                      {selectedRestaurant.comments ? (
                        <p className="italic font-medium">"{selectedRestaurant.comments}"</p>
                      ) : (
                        <span className="text-zinc-500 italic">Sin comentarios adicionales cargados.</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Carta / Menú Base - Full Width Section */}
              <div className="mt-6 border-t border-zinc-800 pt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    Carta / Menú
                  </h4>

                  {selectedRestaurant.menu && !selectedRestaurant.menu.startsWith("[CARTA EN PDF ADJUNTADA]") && (
                    <button
                      onClick={() => {
                        if (selectedRestaurant.menu) {
                          navigator.clipboard.writeText(selectedRestaurant.menu);
                          toast.success("Carta copiada", { description: "El texto de la carta se copió al portapapeles." });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white uppercase font-bold tracking-wider border border-zinc-800 bg-zinc-950/40 px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Copiar Carta
                    </button>
                  )}
                </div>

                {selectedRestaurant.menu ? (
                  selectedRestaurant.menu.startsWith("[CARTA EN PDF ADJUNTADA]") ? (
                    /* PDF Mode */
                    (() => {
                      const lines = selectedRestaurant.menu.split("\n");
                      const nameLine = lines.find((l: string) => l.startsWith("Archivo:"));
                      const sizeLine = lines.find((l: string) => l.startsWith("Tamaño:"));
                      const pdfNameStr = nameLine ? nameLine.replace("Archivo: ", "") : "carta.pdf";
                      const pdfSizeStr = sizeLine ? sizeLine.replace("Tamaño: ", "") : "Desconocido";
                      
                      return (
                        <div className="border border-indigo-500/20 bg-indigo-600/5 rounded-xl p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
                              <FileText className="w-5 h-5 stroke-[1.8]" />
                            </div>
                            <div className="space-y-0.5 text-left">
                              <h5 className="text-xs font-bold text-zinc-200">
                                {pdfNameStr}
                              </h5>
                              <p className="text-[10px] text-zinc-400">
                                PDF Adjunto · Tamaño: {pdfSizeStr}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              toast.info("Descarga Iniciada (Simulada)", {
                                description: `Descargando archivo de carta: "${pdfNameStr}"`,
                              });
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-9 px-3.5 text-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Descargar
                          </Button>
                        </div>
                      );
                    })()
                  ) : (
                    /* Text Mode */
                    <pre className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg font-mono text-[11px] leading-relaxed text-zinc-300 max-h-[220px] overflow-y-auto whitespace-pre-wrap select-text scrollbar-thin">
                      {selectedRestaurant.menu}
                    </pre>
                  )
                ) : (
                  <div className="text-xs text-zinc-500 italic p-4 border border-dashed border-zinc-800 rounded-lg text-center">
                    No se cargó menú ni carta.
                  </div>
                )}
              </div>

              {/* Modal Actions Footer */}
              <div className="flex justify-between items-center gap-3 pt-5 border-t border-zinc-800 mt-6 shrink-0">
                <Button
                  onClick={() => handleExportJSON(selectedRestaurant)}
                  variant="secondary"
                  className="h-10 px-4 text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Exportar Ficha (.json)
                </Button>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDetailsOpen(false)}
                    className="text-zinc-400 hover:text-zinc-200 h-10 px-4 cursor-pointer text-xs font-bold"
                  >
                    Cerrar
                  </Button>
                  
                  <Button
                    onClick={() => {
                      handleToggleStatus(selectedRestaurant.id);
                      setSelectedRestaurant(prev => prev ? { ...prev, status: prev.status === "ACTIVO" ? "PAUSADO" : "ACTIVO" } : null);
                    }}
                    className={`font-bold h-10 px-4 text-xs flex items-center gap-1.5 cursor-pointer ${
                      selectedRestaurant.status === "ACTIVO"
                        ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
                    }`}
                  >
                    {selectedRestaurant.status === "ACTIVO" ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        Suspender Bot
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Activar Bot
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD NEW RESTAURANT MODAL (MANTENIDO) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-[500px] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden p-6 z-10"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 mb-6">
                <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                  Agregar nuevo restaurante
                </h3>
                <p className="text-xs text-zinc-400">
                  Registrá el local en el panel de multi-tenant de Opticore. Bruno se activará al instante.
                </p>
              </div>

              <form onSubmit={handleAddRestaurant} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="new_name">Nombre de fantasía *</Label>
                  <Input
                    id="new_name"
                    type="text"
                    required
                    placeholder="Ej: Moyo Resto & Bodegón"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }}
                    className="bg-zinc-950 border-zinc-800 text-sm h-11 text-zinc-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="new_slug">Slug identificador *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs select-none">
                      /
                    </span>
                    <Input
                      id="new_slug"
                      type="text"
                      required
                      placeholder="moyo-resto"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-sm h-11 pl-6 text-zinc-100 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="new_admins">Teléfonos de Administradores (separados por coma) *</Label>
                  <Input
                    id="new_admins"
                    type="text"
                    required
                    placeholder="Ej: 5493514567890, 5493517890123"
                    value={newAdmins}
                    onChange={(e) => setNewAdmins(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-sm h-11 text-zinc-100 font-mono"
                  />
                  <p className="text-[10px] text-zinc-400">
                    Solo dígitos, separados por coma si agregás más de uno.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label>Ambientes del local</Label>
                  <div className="flex gap-2">
                    {["Salón", "Exterior", "Patio"].map((env) => {
                      const isSelected = selectedEnvironments.includes(env);
                      return (
                        <button
                          key={env}
                          type="button"
                          onClick={() => toggleEnvironmentSelection(env)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                              : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {env}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-zinc-400 hover:text-zinc-200 h-11 px-4 cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-5 shadow-lg active:scale-98 cursor-pointer"
                  >
                    Activar Bruno
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
