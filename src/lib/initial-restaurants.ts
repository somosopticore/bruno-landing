export interface Restaurant {
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
  total_tables?: number;
}

export const INITIAL_RESTAURANTS: Restaurant[] = [
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
    total_tables: 30,
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
    total_tables: 20,
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
    total_tables: 45,
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
    total_tables: 15,
  },
];
