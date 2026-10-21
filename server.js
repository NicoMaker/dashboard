const express = require("express");
const path = require("path");
const http = require("http");
const https = require("https");
const os = require("os");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

// ============ PERCORSI FILE ============
const SERVICES_FILE = path.join(__dirname, "services.json");

// ============ CARICA SERVIZI DA JSON (con cache) ============
let servicesCache = null;
let servicesMtime = 0;

function loadServices() {
  try {
    const stat = fs.statSync(SERVICES_FILE);
    // Se il file non è cambiato, usa la cache
    if (servicesCache && stat.mtimeMs === servicesMtime) {
      return servicesCache;
    }
    const raw = fs.readFileSync(SERVICES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("services.json deve contenere un array");
    }
    servicesCache = parsed;
    servicesMtime = stat.mtimeMs;
    console.log(`📥 services.json caricato (${parsed.length} servizi)`);
    return servicesCache;
  } catch (err) {
    console.error(`❌ Errore lettura services.json: ${err.message}`);
    return servicesCache || [];
  }
}

// Carica subito all'avvio (per validare)
loadServices();

// ============ MIDDLEWARE ============
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ============ API: lista servizi ============
app.get("/api/services", (req, res) => {
  const services = loadServices();
  res.json(
    services.map(({ id, name, url, icon, color, description }) => ({
      id,
      name,
      url,
      icon,
      color,
      description,
    })),
  );
});

// ============ FUNZIONE CHECK URL ============
function checkUrl(targetUrl, timeout = 3000) {
  return new Promise((resolve) => {
    try {
      const url = new URL(targetUrl);
      const client = url.protocol === "https:" ? https : http;
      const req = client.request(
        {
          hostname: url.hostname,
          port: url.port || (url.protocol === "https:" ? 443 : 80),
          path: url.pathname || "/",
          method: "GET",
          timeout,
        },
        (resp) => {
          resp.resume();
          resolve({
            online: resp.statusCode >= 200 && resp.statusCode < 500,
            status: resp.statusCode,
          });
        },
      );
      req.on("timeout", () => {
        req.destroy();
        resolve({ online: false, status: "timeout" });
      });
      req.on("error", () => {
        resolve({ online: false, status: "error" });
      });
      req.end();
    } catch (e) {
      resolve({ online: false, status: "invalid" });
    }
  });
}

// ============ API: check stato ============
app.get("/api/status", async (req, res) => {
  const services = loadServices();
  const results = await Promise.all(
    services.map(async (s) => {
      const r = await checkUrl(s.url);
      return { id: s.id, online: r.online, status: r.status };
    }),
  );
  res.json({
    timestamp: new Date().toISOString(),
    services: results,
  });
});

// ============ FUNZIONI IP ============
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

function getPublicIP() {
  return new Promise((resolve) => {
    const req = http.get("http://api.ipify.org", { timeout: 3000 }, (resp) => {
      let data = "";
      resp.on("data", (chunk) => (data += chunk));
      resp.on("end", () => resolve(data.trim() || "N/D"));
    });
    req.on("error", () => resolve("N/D"));
    req.on("timeout", () => {
      req.destroy();
      resolve("N/D");
    });
  });
}

// ============ FALLBACK SPA ============
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============ START SERVER ============
const server = app.listen(PORT, "0.0.0.0", async () => {
  const localIP = getLocalIP();
  const publicIP = await getPublicIP();
  const services = loadServices();

  console.log(`\n🚀 Server avviato con successo!`);
  console.log(`🌐 IP Pubblico: http://${publicIP}:${PORT}`);
  console.log(`🏠 IP Locale:   http://${localIP}:${PORT}`);
  console.log(`📍 Localhost:  http://localhost:${PORT}`);
  console.log(`\n--------------------------------------`);
  console.log(`📋 Servizi configurati (${services.length}):`);
  services.forEach((s) => {
    console.log(`   ${s.icon || "•"} ${s.name} → ${s.url}`);
  });
  console.log(`📄 Config: ${SERVICES_FILE}`);
  console.log(`🔥 Hot-reload attivo (modifica services.json senza riavviare)`);
  console.log(`--------------------------------------\n`);
});

// ============ GESTIONE ERRORI ============
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Porta ${PORT} già in uso!`);
    console.error(`💡 Cambia porta: PORT=8090 npm start\n`);
  } else {
    console.error("❌ Errore server:", err);
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("\n\n👋 Server in chiusura...");
  server.close(() => process.exit(0));
});

process.on("uncaughtException", (err) => {
  console.error("💥 Eccezione non gestita:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Promise non gestita:", err);
});
