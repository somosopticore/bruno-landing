import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: ["400", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bruno · Tu maître digital · Asistente WhatsApp con IA para restaurantes argentinos",
  description: "Atendé reservas, dudas y reseñas las 24 horas con Bruno. Asistente WhatsApp con IA para restaurantes. Setup en 24hs. Sin contratos largos.",
  openGraph: {
    title: "Bruno · Tu maître digital · Asistente WhatsApp con IA",
    description: "Atendé reservas, dudas y reseñas las 24 horas con Bruno. Asistente WhatsApp con IA para restaurantes. Setup en 24hs.",
    type: "website",
    locale: "es_AR",
    url: "https://bruno.somosopticore.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org SoftwareApplication markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Bruno",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "140",
    },
    "description": "Asistente de WhatsApp con Inteligencia Artificial para restaurantes argentinos. Toma reservas, responde consultas frecuentes y monitorea reseñas en Google Maps.",
  };

  return (
    <html
      lang="es"
      className={`${playfairDisplay.variable} ${inter.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans text-text-primario bg-bg-primary">
        {children}
      </body>
    </html>
  );
}
