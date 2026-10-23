import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const root = path.dirname(fileURLToPath(import.meta.url));
app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(root, "public"), { setHeaders(res, file) {
  if (file.endsWith(".html")) res.setHeader("Cache-Control", "no-store");
}}));

const attempts = new Map();
app.post("/api/session", async (req, res) => {
  const now = Date.now(), ip = req.ip || "unknown";
  let a = attempts.get(ip) || { start: now, count: 0 };
  if (now - a.start > 60000) a = { start: now, count: 0 };
  if (++a.count > 10) { attempts.set(ip, a); return res.status(429).json({error:"Demasiados intentos. Espera un minuto."}); }
  attempts.set(ip, a);

  const key = process.env.OPENAI_API_KEY;
  const code = process.env.DEMO_ACCESS_CODE;
  if (!key || !code) return res.status(503).json({error:"El administrador debe configurar OPENAI_API_KEY y DEMO_ACCESS_CODE."});
  if (String(req.body?.accessCode || "") !== code) return res.status(401).json({error:"Código de acceso incorrecto."});

  try {
    const r = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method:"POST",
      headers:{Authorization:`Bearer ${key}`, "Content-Type":"application/json"},
      body:JSON.stringify({session:{
        type:"realtime",
        model:process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2.1",
        instructions:"You are TLS AI Tutor, a friendly English teacher. Speak clearly in English by default, adapt to the learner's level, explain briefly in Spanish if they are confused, kindly correct important mistakes, ask one question at a time, encourage practice, and do not request sensitive personal information.",
        audio:{output:{voice:"marin"}}
      }})
    });
    const data = await r.json();
    if (!r.ok) {
      console.error("OpenAI session error:", r.status, data);
      return res.status(502).json({error:"No se pudo iniciar la sesión de voz. Revisa el modelo y el acceso de API."});
    }
    const clientSecret = data.value || data.client_secret?.value;
    if (!clientSecret) return res.status(502).json({error:"La API no devolvió una credencial temporal."});
    res.setHeader("Cache-Control", "no-store");
    res.json({clientSecret});
  } catch (e) {
    console.error(e);
    res.status(500).json({error:"Error al preparar la sesión de voz."});
  }
});
app.get("/health", (_req,res)=>res.json({ok:true}));
app.get("*path", (_req,res)=>res.sendFile(path.join(root,"public","index.html")));
app.listen(process.env.PORT || 3000, "0.0.0.0", ()=>console.log("TLS AI Tutor started"));
