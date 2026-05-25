import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "El cuerpo de la solicitud debe ser un JSON válido." },
        { status: 400 }
      );
    }

    const {
      nombre,
      restaurante,
      whatsapp,
      email,
      mensaje = "",
      reservas_semana = "",
      interes = "",
    } = body;

    // Server-side validation
    if (!nombre || !nombre.trim()) {
      return NextResponse.json({ error: "Tu nombre es requerido." }, { status: 400 });
    }
    if (!restaurante || !restaurante.trim()) {
      return NextResponse.json({ error: "El nombre del restaurante es requerido." }, { status: 400 });
    }
    if (!whatsapp || !whatsapp.trim()) {
      return NextResponse.json({ error: "El número de WhatsApp es requerido." }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ error: "El correo electrónico es requerido." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "El correo electrónico no es válido." }, { status: 400 });
    }

    const webhookUrl = process.env.WEBHOOK_BRUNO_CONTACTO_URL;
    if (!webhookUrl) {
      console.error("WEBHOOK_BRUNO_CONTACTO_URL no está configurada.");
      return NextResponse.json(
        { error: "Error de configuración en el servidor. Reintentá en unos minutos." },
        { status: 502 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nombre.trim(),
        restaurante: restaurante.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        mensaje: mensaje.trim(),
        reservas_semana: reservas_semana,
        interes: interes,
        submittedAt: new Date().toISOString(),
        referrer: request.headers.get("referer") || "direct",
      }),
    });

    if (!response.ok) {
      console.error(`Error de n8n webhook: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: "El servidor de recepción no respondió correctamente. Reintentá." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error procesando contacto:", error);
    return NextResponse.json(
      { error: "Hubo un problema interno en el servidor." },
      { status: 500 }
    );
  }
}
