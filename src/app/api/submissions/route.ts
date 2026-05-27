import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Configuración de persistencia real usando GitHub como base de datos serverless
const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = "somosopticore";
const REPO = "bruno-landing";
const FILE_PATH = "submissions.json";
const LOCAL_FILE = path.join(process.cwd(), "submissions.json");

// Identificar entorno
const isProduction = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

// Helpers para la API de contenidos de GitHub
async function getGithubData() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const res = await fetch(url, {
    headers: {
      "Authorization": `token ${TOKEN}`,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "OptiCore-Bruno-App",
    },
    next: { revalidate: 0 } // Desactivar caché de fetch en Next.js
  });

  if (res.status === 200) {
    const fileData = await res.json();
    const content = Buffer.from(fileData.content, "base64").toString("utf-8");
    return {
      sha: fileData.sha,
      data: JSON.parse(content),
    };
  } else if (res.status === 404) {
    // Si no existe, retornamos array vacío
    return { sha: null, data: [] };
  } else {
    throw new Error(`Failed to fetch from GitHub: ${res.status} ${await res.text()}`);
  }
}

async function writeGithubData(data: any, sha: string | null) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const contentBase64 = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
  
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `token ${TOKEN}`,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "OptiCore-Bruno-App",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "chore: update submissions database [skip ci]",
      content: contentBase64,
      sha: sha || undefined,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to write to GitHub: ${res.status} ${await res.text()}`);
  }
}

// Helpers para almacenamiento local (Fallback de desarrollo)
function readLocalData() {
  if (fs.existsSync(LOCAL_FILE)) {
    try {
      const content = fs.readFileSync(LOCAL_FILE, "utf-8");
      return JSON.parse(content);
    } catch (e) {
      console.error("Error leyendo archivo local:", e);
      return [];
    }
  }
  return [];
}

function writeLocalData(data: any) {
  try {
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error escribiendo archivo local:", e);
  }
}

// --- MÉTODOS HTTP ---

export async function GET() {
  try {
    // En producción o si poseemos el TOKEN, usamos la base de datos persistente en GitHub
    if (isProduction || TOKEN) {
      const { data } = await getGithubData();
      return NextResponse.json(data);
    } else {
      // Desarrollo local fallback a archivo
      const data = readLocalData();
      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error("Submissions GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newSubmission = await request.json();
    if (!newSubmission.id || !newSubmission.name) {
      return NextResponse.json({ error: "Datos del restaurante incompletos" }, { status: 400 });
    }

    if (isProduction || TOKEN) {
      const { data, sha } = await getGithubData();
      // Eliminar duplicado si existe
      const filtered = data.filter((item: any) => item.id !== newSubmission.id);
      const updated = [...filtered, newSubmission];
      
      await writeGithubData(updated, sha);
      return NextResponse.json({ success: true, data: newSubmission });
    } else {
      const data = readLocalData();
      const filtered = data.filter((item: any) => item.id !== newSubmission.id);
      const updated = [...filtered, newSubmission];
      
      writeLocalData(updated);
      return NextResponse.json({ success: true, data: newSubmission });
    }
  } catch (error: any) {
    console.error("Submissions POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, fields } = body;

    if (!id || !fields) {
      return NextResponse.json({ error: "Faltan id o fields en el body" }, { status: 400 });
    }

    if (isProduction || TOKEN) {
      const { data, sha } = await getGithubData();
      const updated = data.map((item: any) => {
        if (item.id === id) {
          return { ...item, ...fields };
        }
        return item;
      });

      await writeGithubData(updated, sha);
      return NextResponse.json({ success: true });
    } else {
      const data = readLocalData();
      const updated = data.map((item: any) => {
        if (item.id === id) {
          return { ...item, ...fields };
        }
        return item;
      });

      writeLocalData(updated);
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    console.error("Submissions PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Falta id de restaurante" }, { status: 400 });
    }

    if (isProduction || TOKEN) {
      const { data, sha } = await getGithubData();
      const filtered = data.filter((item: any) => item.id !== id);
      
      await writeGithubData(filtered, sha);
      return NextResponse.json({ success: true });
    } else {
      const data = readLocalData();
      const filtered = data.filter((item: any) => item.id !== id);
      
      writeLocalData(filtered);
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    console.error("Submissions DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
