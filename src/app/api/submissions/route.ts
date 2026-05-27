import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { INITIAL_RESTAURANTS } from "@/lib/initial-restaurants";

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
    if (isProduction || TOKEN) {
      const { data, sha } = await getGithubData();
      
      const now = new Date();
      let hasChanges = false;
      const pruned = data.filter((item: any) => {
        if (item.deleted && item.deletedAt) {
          const msDiff = now.getTime() - new Date(item.deletedAt).getTime();
          const daysDiff = msDiff / (1000 * 60 * 60 * 24);
          const isInitial = INITIAL_RESTAURANTS.some((r) => r.id === item.id);
          if (daysDiff > 30 && !isInitial) {
            hasChanges = true;
            return false;
          }
        }
        return true;
      });
      
      if (hasChanges) {
        await writeGithubData(pruned, sha);
      }
      
      return NextResponse.json(pruned);
    } else {
      const data = readLocalData();
      
      const now = new Date();
      let hasChanges = false;
      const pruned = data.filter((item: any) => {
        if (item.deleted && item.deletedAt) {
          const msDiff = now.getTime() - new Date(item.deletedAt).getTime();
          const daysDiff = msDiff / (1000 * 60 * 60 * 24);
          const isInitial = INITIAL_RESTAURANTS.some((r) => r.id === item.id);
          if (daysDiff > 30 && !isInitial) {
            hasChanges = true;
            return false;
          }
        }
        return true;
      });
      
      if (hasChanges) {
        writeLocalData(pruned);
      }
      
      return NextResponse.json(pruned);
    }
  } catch (error: any) {
    console.error("Submissions GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, ...newSubmission } = body;

    // Validación del token de invitación
    if (!token) {
      return NextResponse.json({ error: "Token de invitación requerido" }, { status: 403 });
    }

    if (token === "expired" || token === "used" || token === "expirado" || token === "invalid" || token === "invalido") {
      return NextResponse.json({ error: "El enlace de invitación ha expirado o ya fue utilizado." }, { status: 403 });
    }

    if (!newSubmission.id || !newSubmission.name) {
      return NextResponse.json({ error: "Datos del restaurante incompletos" }, { status: 400 });
    }

    // Incluir el token en el objeto a persistir para poder contar sus usos
    const submissionToSave = { ...newSubmission, token };

    if (isProduction || TOKEN) {
      const { data, sha } = await getGithubData();

      // Contar usos del token en la base de datos (ignorando locales eliminados)
      const tokenUsageCount = data.filter((item: any) => item.token === token && !item.deleted).length;
      if (tokenUsageCount >= 5) {
        return NextResponse.json({ error: "El enlace de invitación ha expirado o ya fue utilizado." }, { status: 403 });
      }

      // Eliminar duplicado si existe
      const filtered = data.filter((item: any) => item.id !== submissionToSave.id);
      const updated = [...filtered, submissionToSave];
      
      await writeGithubData(updated, sha);
      return NextResponse.json({ success: true, data: submissionToSave });
    } else {
      const data = readLocalData();

      // Contar usos del token en la base de datos local
      const tokenUsageCount = data.filter((item: any) => item.token === token && !item.deleted).length;
      if (tokenUsageCount >= 5) {
        return NextResponse.json({ error: "El enlace de invitación ha expirado o ya fue utilizado." }, { status: 403 });
      }

      const filtered = data.filter((item: any) => item.id !== submissionToSave.id);
      const updated = [...filtered, submissionToSave];
      
      writeLocalData(updated);
      return NextResponse.json({ success: true, data: submissionToSave });
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
      const exists = data.some((item: any) => item.id === id);
      const updated = exists
        ? data.map((item: any) => (item.id === id ? { ...item, ...fields } : item))
        : [...data, { id, ...fields }];

      await writeGithubData(updated, sha);
      return NextResponse.json({ success: true });
    } else {
      const data = readLocalData();
      const exists = data.some((item: any) => item.id === id);
      const updated = exists
        ? data.map((item: any) => (item.id === id ? { ...item, ...fields } : item))
        : [...data, { id, ...fields }];

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
    const force = searchParams.get("force") === "true";

    if (!id) {
      return NextResponse.json({ error: "Falta id de restaurante" }, { status: 400 });
    }

    if (isProduction || TOKEN) {
      const { data, sha } = await getGithubData();
      let updated;
      
      if (force) {
        updated = data.filter((item: any) => item.id !== id);
      } else {
        const exists = data.some((item: any) => item.id === id);
        updated = exists
          ? data.map((item: any) => (item.id === id ? { ...item, deleted: true, deletedAt: new Date().toISOString() } : item))
          : [...data, { id, deleted: true, deletedAt: new Date().toISOString() }];
      }
      
      await writeGithubData(updated, sha);
      return NextResponse.json({ success: true });
    } else {
      const data = readLocalData();
      let updated;
      
      if (force) {
        updated = data.filter((item: any) => item.id !== id);
      } else {
        const exists = data.some((item: any) => item.id === id);
        updated = exists
          ? data.map((item: any) => (item.id === id ? { ...item, deleted: true, deletedAt: new Date().toISOString() } : item))
          : [...data, { id, deleted: true, deletedAt: new Date().toISOString() }];
      }
      
      writeLocalData(updated);
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    console.error("Submissions DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
