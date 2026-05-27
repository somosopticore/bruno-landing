"use client";

import React, { useState, useMemo } from "react";
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
  AlertTriangle
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Datos iniciales de los clientes del multi-tenant
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
  },
];

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"TODOS" | "ACTIVO" | "PAUSADO">("TODOS");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Estados para nuevo restaurante
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newAdmins, setNewAdmins] = useState("");
  const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>(["Salón"]);

  // Filtrado de restaurantes
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "TODOS" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [restaurants, searchQuery, statusFilter]);

  // KPIs calculados en tiempo real
  const activeCount = useMemo(() => {
    return restaurants.filter((r) => r.status === "ACTIVO").length;
  }, [restaurants]);

  const totalReservationsToday = useMemo(() => {
    return restaurants.reduce((sum, r) => sum + r.reservationsToday, 0);
  }, [restaurants]);

  const iaEfficiency = useMemo(() => {
    // Si no hay activos, retorna 0, de lo contrario un promedio dinámico premium
    const active = restaurants.filter((r) => r.status === "ACTIVO");
    if (active.length === 0) return "0.0%";
    const total = active.reduce((sum, r) => sum + (r.voiceCalls ? 99.6 : 99.2), 0);
    return `${(total / active.length).toFixed(1)}%`;
  }, [restaurants]);

  // Acciones rápidas
  const handleToggleStatus = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === "ACTIVO" ? "PAUSADO" : "ACTIVO";
          const nextReservations = nextStatus === "PAUSADO" ? 0 : Math.floor(Math.random() * 20) + 10;
          
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
      id: String(restaurants.length + 1),
      name: newName.trim(),
      slug: newSlug.trim().toLowerCase().replace(/\s+/g, "-"),
      environments: selectedEnvironments,
      status: "ACTIVO",
      reservationsToday: 0,
      adminNumbers: newAdmins.split(",").map((n) => n.trim()),
      audioTranscription: true,
      voiceCalls: false,
    };

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
    setRestaurants(restaurants.filter((r) => r.id !== id));
    toast.error("Cliente Eliminado", {
      description: `Se dio de baja a ${name} del sistema central.`,
    });
  };

  const toggleEnvironmentSelection = (env: string) => {
    if (selectedEnvironments.includes(env)) {
      setSelectedEnvironments(selectedEnvironments.filter((e) => e !== env));
    } else {
      setSelectedEnvironments([...selectedEnvironments, env]);
    }
  };

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

          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 h-9 px-3 gap-1.5">
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
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-5 shadow-[0_4px_15px_rgba(99,102,241,0.35)] active:scale-98"
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

          <div className="flex items-center gap-2">
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
          </div>
        </section>

        {/* CLIENTS GRID / LIST TABLE */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.18em] text-indigo-400 pl-1">
            Restaurantes Clientes Multi-Tenant ({filteredRestaurants.length})
          </h3>

          {/* Desktop Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRestaurants.map((client) => {
                const isActive = client.status === "ACTIVO";

                return (
                  <motion.div
                    key={client.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-full group p-6">
                      
                      {/* Top Header Card */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="font-serif text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                            {client.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                            <span>/{client.slug}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
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
                          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Reservas de hoy</span>
                          <span className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
                            {client.reservationsToday}
                            <span className="text-[10px] font-sans font-normal text-zinc-500">agendadas</span>
                          </span>
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
                          {/* Toggle bot status button */}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleToggleStatus(client.id)}
                            className="h-8 px-3 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:text-white"
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRestaurant(client.id, client.name)}
                            className="h-8 w-8 p-0 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg flex items-center justify-center cursor-pointer"
                            aria-label="Dar de baja restaurante"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
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
                Ningún restaurante coincide con el filtro de búsqueda.
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

      {/* ADD NEW RESTAURANT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal body */}
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
                {/* Business name */}
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
                      // Generar slug sugerido
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }}
                    className="bg-zinc-950 border-zinc-800 text-sm h-11 text-zinc-100"
                  />
                </div>

                {/* Slug */}
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

                {/* Admin Phone numbers */}
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

                {/* Environments Selector */}
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

                {/* Buttons footer */}
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
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-5 shadow-lg active:scale-98"
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
